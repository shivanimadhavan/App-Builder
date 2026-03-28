// Calculator script – implements core logic and UI interaction
// Assumes the DOM from index.html is already loaded.

// ====================
// Module scope variables
// ====================
const display = document.getElementById('calc-display');
let currentInput = '';
let previousValue = null; // stored as Number
let operator = null; // '+', '-', '*', '/'

// ====================
// Helper Functions
// ====================
/**
 * Updates the calculator display.
 * If `currentInput` is empty, shows 0. Otherwise formats the number for readability.
 */
function updateDisplay() {
  if (currentInput === '' && previousValue !== null) {
    // Show the previous value (e.g., after an operation before next input)
    display.textContent = Number(previousValue).toLocaleString();
    return;
  }
  // Show current input – keep it as typed (including leading zeros before decimal)
  display.textContent = currentInput || '0';
}

/**
 * Appends a digit or decimal point to the current input.
 * Prevents multiple decimals and handles leading zeros.
 * @param {string} digit – a single character ('0'‑'9' or '.')
 */
function appendDigit(digit) {
  if (digit === '.') {
    // Do not allow more than one decimal point
    if (currentInput.includes('.')) return;
    // If input is empty, start with "0."
    if (currentInput === '') {
      currentInput = '0.';
    } else {
      currentInput += '.';
    }
  } else {
    // Digit (0‑9)
    if (currentInput === '0' && digit === '0') {
      // Prevent multiple leading zeros
      return;
    }
    if (currentInput === '0' && digit !== '0' && !currentInput.includes('.')) {
      // Replace leading zero unless a decimal already exists
      currentInput = digit;
    } else {
      currentInput += digit;
    }
  }
  updateDisplay();
}

/**
 * Stores the current number as `previousValue`, records the operator,
 * and prepares for the next number entry.
 * Handles consecutive operator presses gracefully.
 * @param {string} op - one of '+', '-', '*', '/'
 */
function setOperator(op) {
  // If there's no current input but we already have a previous value,
  // just change the operator.
  if (currentInput === '' && previousValue !== null) {
    operator = op;
    return;
  }

  // If we already have a pending operation, compute it first.
  if (previousValue !== null && operator && currentInput !== '') {
    calculate(); // result ends up in currentInput
    previousValue = Number(currentInput);
    currentInput = '';
    operator = op;
    return;
  }

  // Normal case: store the number and operator.
  if (currentInput !== '') {
    previousValue = Number(currentInput);
    currentInput = '';
  }
  operator = op;
  updateDisplay();
}

/**
 * Executes the pending arithmetic operation.
 * Handles division by zero and resets state appropriately.
 */
function calculate() {
  if (operator === null || previousValue === null) {
    // Nothing to calculate.
    return;
  }
  const current = currentInput === '' ? previousValue : Number(currentInput);
  let result;
  switch (operator) {
    case '+':
      result = previousValue + current;
      break;
    case '-':
      result = previousValue - current;
      break;
    case '*':
      result = previousValue * current;
      break;
    case '/':
      if (current === 0) {
        result = 'Error';
      } else {
        result = previousValue / current;
      }
      break;
    default:
      return;
  }

  // Prepare for next input
  if (result === 'Error') {
    currentInput = '';
    previousValue = null;
    operator = null;
    display.textContent = 'Error';
  } else {
    // Limit precision to avoid floating‑point noise.
    const formatted = Number(result).toLocaleString(undefined, {
      maximumFractionDigits: 12,
    });
    // Store the raw numeric result for further calculations.
    currentInput = Number(result).toString();
    previousValue = null;
    operator = null;
    display.textContent = formatted;
  }
}

/**
 * Resets the calculator to its initial state.
 */
function clearAll() {
  currentInput = '';
  previousValue = null;
  operator = null;
  updateDisplay();
}

/**
 * Removes the last character from the current input.
 */
function backspace() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  }
}

// ====================
// UI Event Handling
// ====================
const keypad = document.querySelector('.keypad');
if (keypad) {
  // Delegated click handling
  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Determine action based on classes / data-value
    if (btn.classList.contains('digit')) {
      const val = btn.dataset.value; // e.g., "7"
      appendDigit(val);
    } else if (btn.classList.contains('decimal')) {
      appendDigit('.');
    } else if (btn.classList.contains('operator')) {
      const op = btn.dataset.value; // '+', '-', '*', '/'
      setOperator(op);
    } else if (btn.classList.contains('clear')) {
      clearAll();
    } else if (btn.classList.contains('backspace')) {
      backspace();
    } else if (btn.classList.contains('equals')) {
      calculate();
    }
  });

  // Visual feedback – add/remove .active on press/release
  const addActive = (e) => {
    const btn = e.target.closest('button');
    if (btn) btn.classList.add('active');
  };
  const removeActive = (e) => {
    const btn = e.target.closest('button');
    if (btn) btn.classList.remove('active');
  };

  // Mouse events
  keypad.addEventListener('mousedown', addActive);
  keypad.addEventListener('mouseup', removeActive);
  keypad.addEventListener('mouseleave', removeActive);
  // Touch events for mobile
  keypad.addEventListener('touchstart', addActive);
  keypad.addEventListener('touchend', removeActive);
  keypad.addEventListener('touchcancel', removeActive);
}

// Initial display state
updateDisplay();

// ====================
// Export for debugging (optional)
// ====================
window.calculator = {
  appendDigit,
  setOperator,
  calculate,
  clearAll,
  backspace,
  updateDisplay,
  // expose state for inspection
  getState: () => ({ currentInput, previousValue, operator }),
};
