const express = require("express");
const QuizModel = require("../models/quizModel");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, topic } = req.body;

  if (!title || !topic) {
    return res.status(400).send("Quiz title and topic is required");
  } else {
    const setNewQuiz = new QuizModel({
      title,
      topic,
    });

    try {
      const saveNewQuiz = await setNewQuiz.save();

      return res
        .status(200)
        .send(
          `New quiz has been created with id ${saveNewQuiz._id},${title} and ${topic}`
        );
    } catch (error) {
      res.status(500).send(`ERROR ${error}`);
    }
  }

  return res.status(200).send("quiz endpoint reached");
});

router.get("/quizDetails/:quizId", async (req, res) => {
  const { quizId } = req.params;

  if (quizId === undefined) {
    return res.status(400).send("A valid quiz ID is required");
  } else {
    try {
      const getQuizById = await QuizModel.findById(quizId);

      if (getQuizById === null) {
        return res.status(400).send("No quiz is found with this id");
      }
      return res.status(200).json(getQuizById);
    } catch (error) {
      res.status(500).send(`ERROR ${error}`);
    }
  }
});

router.delete("/delete/:quizId", async (req, res) => {
  const { quizId } = req.params;

  if (quizId === undefined) {
    return res.status(400).send("A valid quiz ID is required");
  } else {
    try {
      const getQuizById = await QuizModel.findById(quizId);

      if (getQuizById === null) {
        return res.status(400).send("No quiz is found with this id");
      }
      const deletedQuiz = await QuizModel.findByIdAndDelete(quizId);
      return res.status(200).send(`A quiz has been deleted with id ${quizId}`);
    } catch (error) {
      res.status(500).send(`ERROR ${error}`);
    }
  }
});

module.exports = router;
