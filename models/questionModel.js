const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    choices: {
      type: Array,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("question", questionSchema);
