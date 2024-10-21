import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
  view: {
    type: Boolean,
    default: false,
  },
  create: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  selectAll: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", tasksSchema);
export default Task;
