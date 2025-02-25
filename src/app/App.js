import { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

const App = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
      <TaskList />
    </div>
  );
};

export default App;
