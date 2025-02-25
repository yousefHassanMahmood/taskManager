import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // New state for due date
  const [employeeName, setEmployeeName] = useState(""); // New state for employee name
  const [errors, setErrors] = useState({
    newTask: "",
    newDescription: "",
    dueDate: "",
    employeeName: ""
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
    let isValid = true;
    let validationErrors = {
      newTask: "",
      newDescription: "",
      dueDate: "",
      employeeName: ""
    };

    // Validate the fields
    if (!newTask.trim()) {
      validationErrors.newTask = "Task Title is required";
      isValid = false;
    }
    if (!newDescription.trim()) {
      validationErrors.newDescription = "Task Description is required";
      isValid = false;
    }
    if (!dueDate.trim()) {
      validationErrors.dueDate = "Due Date is required";
      isValid = false;
    }
    if (!employeeName.trim()) {
      validationErrors.employeeName = "Employee Name is required";
      isValid = false;
    }

    setErrors(validationErrors);

    if (!isValid) return; // Stop if validation fails

    try {
      const task = await createTask({
        title: newTask,
        description: newDescription,
        status: "todo",
        dueDate: new Date(dueDate).toISOString(), // Convert date to ISO format
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

  // Get today's date to disable past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <h2>Task Manager</h2>

      {/* Task Input */}
      <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "8px", width: "300px" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        {errors.newTask && <span style={{ color: "red", fontSize: "12px" }}>{"* " + errors.newTask}</span>}

        <textarea
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows="3"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        {errors.newDescription && <span style={{ color: "red", fontSize: "12px" }}>{"* " + errors.newDescription}</span>}

        {/* Date Input */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          min={today} // Disable past dates
          required
        />
        {errors.dueDate && <span style={{ color: "red", fontSize: "12px" }}>{"* " + errors.dueDate}</span>}

        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        {errors.employeeName && <span style={{ color: "red", fontSize: "12px" }}>{"* " + errors.employeeName}</span>}

        <button onClick={handleAddTask} style={{ padding: "8px 12px", borderRadius: "5px", background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0, width: "300px", textAlign: "left" }}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id} style={{ background: "#f4f4f4", padding: "10px", marginBottom: "8px", borderRadius: "5px", display: "flex", flexDirection: "column" }}>
              <strong>{task.title}</strong>
              <p style={{ fontSize: "14px", color: "#555" }}>{task.description}</p>
              <span>Employee: {task.employeeName}</span>
              <span>Due Date: {new Date(task.dueDate).toLocaleDateString("en-US")}</span>
              <span>Created: {new Date(task.createdAt).toLocaleDateString("en-US")}</span>

              {/* Status Dropdown */}
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                style={{ padding: "5px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button onClick={() => handleDeleteTask(task._id)} style={{ marginTop: "5px", padding: "5px", background: "red", color: "#fff", border: "none", cursor: "pointer", borderRadius: "3px" }}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
