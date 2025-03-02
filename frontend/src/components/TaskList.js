import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api";
import "./TaskList.css";

const TaskList = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [errors, setErrors] = useState({
    newTask: "",
    newDescription: "",
    dueDate: "",
    employeeName: "",
  });

  useEffect(() => {
    fetchTasks();
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    let validationErrors = {
      newTask: newTask.trim() ? "" : "Task Title is required",
      newDescription: newDescription.trim()
        ? ""
        : "Task Description is required",
      dueDate: dueDate.trim() ? "" : "Due Date is required",
      employeeName: employeeName.trim() ? "" : "Employee Name is required",
    };

    setErrors(validationErrors);
    if (!Object.values(validationErrors).every((e) => e === "")) return;

    try {
      const formData = new FormData();
      formData.append("title", newTask);
      formData.append("description", newDescription);
      formData.append("status", "todo");
      formData.append("dueDate", new Date(dueDate).toISOString());
      formData.append("employeeName", employeeName);
      if (file) {
        formData.append("file", file);
      }

      const task = await createTask(formData, true); // Pass `true` to indicate file upload

      setTasks([...tasks, task]);
      setNewTask("");
      setNewDescription("");
      setDueDate("");
      setEmployeeName("");
      setFile(null);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const statuses = ["todo", "in-progress", "completed"];

  return (
    <div className="container">
      <h2>Task Manager</h2>
      <button
        className="theme-toggle"
        id="theme-toggle"
        title="Toggles light & dark"
        aria-label={theme}
        aria-live="polite"
        onClick={toggleTheme}
      >
        <svg
          className="sun-and-moon"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <mask className="moon" id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle cx="24" cy="10" r="6" fill="currentColor" />
          </mask>
          <circle
            className="sun"
            cx="12"
            cy="12"
            r="6"
            mask="url(#moon-mask)"
            fill="currentColor"
          />
          <g className="sun-beams" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>

      <div className="form-container">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="input"
        />
        {errors.newTask && (
          <span className="input-error">* {errors.newTask}</span>
        )}

        <textarea
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="textarea"
        />
        {errors.newDescription && (
          <span className="textarea-error">* {errors.newDescription}</span>
        )}

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
          min={today}
          required
        />
        {errors.dueDate && (
          <span className="date-error">* {errors.dueDate}</span>
        )}

        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="input"
        />
        {errors.employeeName && (
          <span className="employee-error">* {errors.employeeName}</span>
        )}

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          id="file-upload"
          className="file-input"
          aria-label="Upload File"
        />
        {/* Label with icon inside */}
        <label htmlFor="file-upload" className="file-upload-label">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Upload File
        </label>

        <button onClick={handleAddTask} className="add-task-btn">
          Add Task
        </button>
      </div>

      <div className="status-container">
        {statuses.map((status) => (
          <div key={status} className="status-column">
            <h3 className="status-header">
              {status.replace("-", " ").toUpperCase()}
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasks.filter((task) => task.status === status).length === 0 ? (
                <p style={{ textAlign: "center", color: "#888" }}>
                  {status === "todo"
                    ? "No tasks To-Do"
                    : status === "in-progress"
                    ? "No tasks in progress"
                    : "No completed tasks"}
                </p>
              ) : (
                tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <li key={task._id} className="task-item">
                      <strong className="task-title">{task.title}</strong>
                      <p className="task-description">{task.description}</p>
                      <span>Employee: {task.employeeName}</span>
                      <br />
                      <span>
                        Due Date:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-US")}
                      </span>
                      <br />
                      <span>
                        Created:{" "}
                        {new Date(task.createdAt).toLocaleDateString("en-US")}
                      </span>
                      <br />

                      {task.file && (
                        <p>
                          <a
                            href={`http://localhost:5000${task.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            <svg
                              width="16"
                              height="16"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 511.999 511.999"
                              fill="#000000"
                            >
                              <path
                                d="M453.356,43.986c-58.647-58.648-154.075-58.648-212.722,0L19.553,265.065c-6.527,6.527-6.527,17.109,0,23.636
          c6.526,6.527,17.109,6.527,23.636,0l221.08-221.08c45.614-45.616,119.836-45.613,165.452,0
          c45.614,45.615,45.614,119.836,0,165.451L208.64,454.154c-32.66,32.659-85.518,32.662-118.179,0
          c-32.66-32.66-32.662-85.518,0-118.179l221.08-221.08c19.593-19.594,51.31-19.598,70.907,0c19.594,19.593,19.598,51.31,0,70.907
          c-0.002,0.002-0.003,0.003-0.006,0.006L161.368,406.881c-6.531,6.531-17.102,6.533-23.636,0c-6.516-6.517-6.516-17.12,0-23.636
          l197.443-197.444c6.527-6.527,6.527-17.109,0-23.636c-6.526-6.527-17.109-6.527-23.636,0L114.097,359.61
          c-19.549,19.549-19.549,51.358,0,70.907c19.594,19.594,51.31,19.598,70.907,0l221.074-221.074
          c0.002-0.002,0.003-0.003,0.006-0.006c32.657-32.656,32.663-85.518,0-118.179c-32.657-32.659-85.519-32.663-118.179,0
          L66.825,312.337c-45.724,45.723-45.727,119.725,0,165.451c45.612,45.613,119.835,45.617,165.451,0l221.08-221.08
          C512.004,198.061,512.003,102.634,453.356,43.986z"
                              />
                            </svg>
                            View Attached File
                          </a>
                        </p>
                      )}

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="select-status"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </li>
                  ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
