
const mongoose = require("mongoose");


const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  points: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  assignmentUser: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'backlog',
  },
  createdBy: {
    type: String,
    default: 'admin',
  },


});

// const Task = mongoose.model("Task", taskSchema);
// module.exports = { Task, taskSchema };

const Tasks = mongoose.model("Tasks", taskSchema);
module.exports = Tasks;