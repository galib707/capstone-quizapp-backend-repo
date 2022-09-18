const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questionModel");
const QuizModel = require("../models/quizModel");

router.post("/setQuestion", async (req, res) => {
  const { question, topic, type, choices, correctAnswer } = req.body;

  if (!question || choices.length === 0 || !correctAnswer || !type) {
    return res
      .status(400)
      .send("Question title, choices, and correct answer are required");
  }
  if (
    type === "trueFalse" &&
    choices.length !== 2 &&
    type === "multiple" &&
    choices.length !== 4
  ) {
    return res
      .status(400)
      .send("Question format is not valid,need all the options for choices");
  } else {
    try {
      let newQuestion = new QuestionModel({
        question,
        topic,
        type,
        choices,
        correctAnswer,
      });

      let saveNewQuestion = await newQuestion.save();

      return res
        .status(200)
        .json(`New question has been added to the quiz ${saveNewQuestion._id}`);
    } catch (error) {
      return res.status(500).send(`ERROR: ${error}`);
    }
  }
});

router.get("/getQuestion/:quesId", async (req, res) => {
  const { quesId } = req.params;
  //   console.log(req.params.quesId);
  if (quesId === undefined) {
    return res.status(400).send("A question id is required");
  }
  try {
    let getQuestionById = await QuestionModel.findById(quesId);
    return res.status(200).json(getQuestionById);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error}`);
  }
});

router.delete("/deleteQuestion/:quesId", async (req, res) => {
  const { quesId } = req.params;
  console.log("delete point reached");
  if (quesId === undefined) {
    return res.status(400).send("A question id is required");
  }
  try {
    let getQuestionById = await QuestionModel.findByIdAndDelete(quesId);
    console.log(getQuestionById);
    return res.status(200).json(getQuestionById);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error}`);
  }
});

router.post("/editQuestion/:quesId", async (req, res) => {
  console.log("edit Question endpoint reached");
  const { quesId } = req.params;
  console.log("req.body", req.body);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("An edit field is required");
  }
  if (quesId === undefined) {
    return res.status(400).send("A question id is required");
  }
  try {
    let getQuestionById = await QuestionModel.findOneAndUpdate(
      { _id: quesId },
      req.body.quesInfo
    );
    console.log(getQuestionById);
    return res.status(200).json(getQuestionById);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error}`);
  }
});

module.exports = router;
