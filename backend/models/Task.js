import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
  dueDate: { type: Date, default: null },
  file: [{ type: String }],
  employeeName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
