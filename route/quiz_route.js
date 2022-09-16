const express = require("express");
const QuizModel = require("../models/quizModel");
const router = express.Router();

router.post("/", (req, res) => {
  const { title, topic } = req.body;

  if (!title || !topic) {
    return res.status(400).send("Quiz title and topic is required");
  } else {
    const setNewQuiz = new QuizModel({
      title,
      topic,
    });
  }

  return res.status(200).send("quiz endpoint reached");
});

module.exports = router;
