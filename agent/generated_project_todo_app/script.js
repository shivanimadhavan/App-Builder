// ColorfulTodo - main script
// This script implements task management, persistence, rendering, CRUD operations,
// filtering, and drag‑and‑drop reordering.

// -------------------------------
// Data Model & Persistence
// -------------------------------
class Task {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
}

/** @type {Task[]} */
let tasks = [];
let currentFilter = 'all';
let draggedTaskId = null;

/** Save the current tasks array to localStorage */
function saveTasks() {
    try {
        const data = JSON.stringify(tasks);
        localStorage.setItem('colorfulTodoTasks', data);
    } catch (e) {
        console.error('Failed to save tasks', e);
    }
}
/** Load tasks from localStorage and populate the tasks array */
function loadTasks() {
    const raw = localStorage.getItem('colorfulTodoTasks');
    if (!raw) return;
    try {
        const arr = JSON.parse(raw);
        // Re‑create Task instances
        tasks = arr.map(item => new Task(item.id, item.text, item.completed));
    } catch (e) {
        console.error('Failed to load tasks', e);
    }
}
// Export for potential external use
window.saveTasks = saveTasks;
window.loadTasks = loadTasks;

// -------------------------------
// DOM Rendering Helpers
// -------------------------------
/**
 * Create a DOM element for a single task based on the template.
 * @param {Task} task
 * @returns {HTMLElement}
 */
function createTaskElement(task) {
    const template = document.getElementById('task-item-template');
    const clone = /** @type {HTMLLIElement} */ (template.content.firstElementChild.cloneNode(true));

    // Set data-id for later reference
    clone.dataset.id = task.id;
    clone.setAttribute('draggable', 'true');

    // Populate label text
    const label = clone.querySelector('.task-label');
    if (label) label.textContent = task.text;

    // Set completed state
    const checkbox = clone.querySelector('.task-checkbox');
    if (checkbox) {
        checkbox.checked = task.completed;
    }
    if (task.completed) {
        clone.classList.add('completed');
    }

    // ---------- Event Listeners for this task ----------
    // Checkbox toggle
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            // Update visual class
            if (task.completed) {
                clone.classList.add('completed');
            } else {
                clone.classList.remove('completed');
            }
            saveTasks();
            renderTasks(currentFilter);
        });
    }

    // Delete button
    const deleteBtn = clone.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const index = tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(currentFilter);
            }
        });
    }

    // Edit button – toggle edit mode
    const editBtn = clone.querySelector('.edit-btn');
    const editInput = clone.querySelector('.edit-input');
    if (editBtn && editInput && label) {
        const enterEditMode = () => {
            label.hidden = true;
            editInput.hidden = false;
            editInput.value = task.text;
            editInput.focus();
        };
        const exitEditMode = (save) => {
            if (save) {
                const newText = editInput.value.trim();
                if (newText) {
                    task.text = newText;
                    label.textContent = newText;
                }
            }
            editInput.hidden = true;
            label.hidden = false;
            saveTasks();
            renderTasks(currentFilter);
        };
        editBtn.addEventListener('click', () => {
            // If already editing, just exit
            if (!editInput.hidden) {
                exitEditMode(true);
            } else {
                enterEditMode();
            }
        });
        editInput.addEventListener('blur', () => exitEditMode(true));
        editInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                exitEditMode(true);
            } else if (e.key === 'Escape') {
                // Cancel edit
                exitEditMode(false);
            }
        });
    }

    // ---------- Drag‑and‑Drop Handlers ----------
    clone.addEventListener('dragstart', e => {
        draggedTaskId = task.id;
        e.dataTransfer.setData('text/plain', task.id);
        // For Firefox compatibility
        e.dataTransfer.effectAllowed = 'move';
        clone.classList.add('dragging');
    });
    clone.addEventListener('dragend', () => {
        draggedTaskId = null;
        clone.classList.remove('dragging');
        // Clean any visual hints
        const items = document.querySelectorAll('.task-item.drag-over');
        items.forEach(i => i.classList.remove('drag-over'));
    });

    return clone;
}

/** Render the task list according to the current filter */
function renderTasks(filter = 'all') {
    const list = document.getElementById('task-list');
    if (!list) return;
    // Clear existing items
    list.innerHTML = '';
    // Filter tasks
    const filtered = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // all
    });
    // Append elements
    filtered.forEach(task => {
        const el = createTaskElement(task);
        list.appendChild(el);
    });
}

// -------------------------------
// Event Listeners – Global UI
// -------------------------------
function setupGlobalListeners() {
    const addBtn = document.getElementById('add-task-btn');
    const input = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');

    // Add task via button
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;
            const newTask = new Task(crypto.randomUUID(), text);
            tasks.push(newTask);
            input.value = '';
            saveTasks();
            renderTasks(currentFilter);
        });
    }
    // Add task via Enter key
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBtn?.click();
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newFilter = btn.dataset.filter;
            if (!newFilter) return;
            currentFilter = newFilter;
            // Update active class
            filterButtons.forEach(b => b.classList.toggle('active', b === btn));
            renderTasks(currentFilter);
        });
    });

    // Drag‑over handling on the list container
    if (taskList) {
        taskList.addEventListener('dragover', e => {
            e.preventDefault(); // Necessary to allow drop
            const afterElement = getDragAfterElement(taskList, e.clientY);
            // Visual hint – we add a temporary class to the element after which we would insert
            // First clear previous hints
            taskList.querySelectorAll('.task-item.drag-over').forEach(el => el.classList.remove('drag-over'));
            if (afterElement) {
                afterElement.classList.add('drag-over');
            }
        });
        taskList.addEventListener('drop', e => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            if (!draggedId) return;
            const draggedIdx = tasks.findIndex(t => t.id === draggedId);
            if (draggedIdx === -1) return;
            const afterElement = getDragAfterElement(taskList, e.clientY);
            let newIdx;
            if (afterElement) {
                const afterId = afterElement.dataset.id;
                newIdx = tasks.findIndex(t => t.id === afterId);
                // Insert before the afterElement
            } else {
                // Drop at the end
                newIdx = tasks.length;
            }
            // Remove the dragged task from its original position
            const [movedTask] = tasks.splice(draggedIdx, 1);
            // Adjust index if needed (when moving forward in the list the removal shifts indices)
            if (newIdx > draggedIdx) newIdx--;
            tasks.splice(newIdx, 0, movedTask);
            saveTasks();
            renderTasks(currentFilter);
        });
    }
}

/** Helper to find the element after which the dragged item should be inserted */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

// -------------------------------
// Initialization
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    currentFilter = 'all';
    setupGlobalListeners();
    renderTasks(currentFilter);
    // Set initial active filter button
    const activeBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (activeBtn) activeBtn.classList.add('active');
});
