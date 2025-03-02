const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createTask = async (taskData, isFileUpload = false) => {
  const response = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    body: isFileUpload ? taskData : JSON.stringify(taskData),
    headers: isFileUpload ? {} : { "Content-Type": "application/json" },
  });
  return response.json();
};


export const updateTask = async (id, updates) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
