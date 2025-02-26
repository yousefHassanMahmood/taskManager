import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [errors, setErrors] = useState({
    newTask: "",
    newDescription: "",
    dueDate: "",
    employeeName: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

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
      const task = await createTask({
        title: newTask,
        description: newDescription,
        status: "todo",
        dueDate: new Date(dueDate).toISOString(),
        employeeName,
      });

      setTasks([...tasks, task]);
      setNewTask("");
      setNewDescription("");
      setDueDate("");
      setEmployeeName("");
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
