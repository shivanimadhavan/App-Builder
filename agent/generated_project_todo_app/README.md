# ColorfulTodo

**A vibrant, feature‑rich web‑based todo list application** that lets you manage tasks with style. Built with plain HTML, CSS, and JavaScript, it runs entirely in the browser and persists data using `localStorage`.

---

## 📋 Features
- **Add tasks** with custom titles.
- **Edit** existing tasks inline.
- **Delete** tasks you no longer need.
- **Mark as complete** (checkbox) with a smooth strike‑through animation.
- **Filter** view by All / Active / Completed.
- **Drag‑and‑drop** reordering of tasks.
- **Persistent storage** – your list survives page reloads via `localStorage`.
- **Colorful UI** – each task gets a random pastel background for a playful look.
- **Responsive design** – works on desktop and mobile browsers.

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Markup | **HTML5** |
| Styling | **CSS3** (Flexbox, CSS variables) |
| Logic | **Vanilla JavaScript (ES6+)** |
| Persistence | **Web Storage API (`localStorage`)** |

---

## 🚀 Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/ColorfulTodo.git
   cd ColorfulTodo
   ```
2. **Open the app** – No build step required. Simply open `index.html` in any modern browser:
   - Double‑click `index.html`, **or**
   - Run a local server (optional) e.g., `python -m http.server` and navigate to `http://localhost:8000`.

That's it! The app loads instantly and stores data locally.

---

## 📖 Usage Guide
| Action | How to do it |
|--------|--------------|
| **Add a task** | Type a title in the input field at the top and press **Enter** or click the **Add** button. |
| **Edit a task** | Click the pencil icon (✏️) on a task, modify the text, then press **Enter** or click outside to save. |
| **Delete a task** | Click the trash can icon (🗑️) on the task you want to remove. |
| **Complete a task** | Check the checkbox next to the task; it will be struck through and moved to the *Completed* filter. |
| **Filter tasks** | Use the **All**, **Active**, and **Completed** buttons at the bottom to switch views. |
| **Reorder tasks** | Click and hold a task row, then drag it to a new position. Release to drop. |
| **Data persistence** | All changes are automatically saved to `localStorage`. Closing or refreshing the page retains your list. |

---

## 🛠️ Development Notes
- **`index.html`** – Contains the markup and links to `styles.css` and `script.js`.
- **`styles.css`** – Handles layout, colors, and responsive behavior. Uses CSS variables for easy theming.
- **`script.js`** – Core application logic: task CRUD operations, drag‑and‑drop handling, filtering, and `localStorage` integration.

### Extending the Project
- **Backend sync** – Replace or augment the `localStorage` layer with API calls (e.g., REST/GraphQL) to store tasks on a server.
- **Authentication** – Add a login flow and associate tasks with user accounts.
- **Advanced UI** – Integrate a component library or framework (React, Vue) while keeping the same CSS foundation.
- **Testing** – Introduce unit tests with Jest or Cypress for end‑to‑end coverage.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Make your changes, ensuring the app still works locally.
4. Commit with clear messages and push to your fork.
5. Open a Pull Request describing the improvement.

Please follow the existing code style and keep the UI consistent.

---

## 📸 Screenshots
> *Replace the placeholders with actual screenshots when available.*

![App Overview](./screenshots/overview.png)
![Add/Edit Task](./screenshots/add-edit.png)
![Drag‑and‑Drop](./screenshots/drag-drop.png)

---

## 🔗 Live Demo
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen)](https://your‑username.github.io/ColorfulTodo/)

---

## 📄 License
This project is licensed under the MIT License – see the `LICENSE` file for details.
