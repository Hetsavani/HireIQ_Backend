// controllers/quiz.controller.js

const Quiz = require("../models/Quiz");
const crypto = require("crypto");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

exports.createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      topic,
      difficulty,
      numberOfQuestions,
      timeLimit,
      requiredPercentage,
    } = req.body;

    const quizId = crypto.randomBytes(3).toString("hex");

    // Step 1: Get Gemini API key from admin user
    const user = await User.findById(req.user.id);
    console.log("Admin User:", user);
    if (!user || !user.geminiKey) {
      return res
        .status(400)
        .json({ message: "Admin Gemini API key not found" });
    }

    const genAI = new GoogleGenerativeAI(user.geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    //     const prompt = `
    // You are a quiz generator bot. Create ${numberOfQuestions} ${difficulty} level multiple choice questions on the topic "${topic}".
    // Return the response as a JSON array like:
    // [
    //   {
    //     "type": "mcq",
    //     "questionText": "...",
    //     "options": ["A", "B", "C", "D"],
    //     "correctAnswer": "B",
    //     "topic": "${topic}",
    //     "difficulty": "${difficulty}"
    //   }
    // ]
    // Only return a valid JSON array. No text before or after.
    // Only return the JSON. Do not include explanations or code blocks.
    // `;
    const prompt = `
Generate ${numberOfQuestions} ${difficulty}-level multiple-choice questions on "${topic}".
Strictly return only a valid JSON array. Do not use code blocks or markdown.

Each object must look like this:
{
  "questionId": 1,
  "type": "mcq",
  "questionText": "What is polymorphism in OOP?",
  "options": ["A) Encapsulation", "B) Inheritance", "C) Polymorphism", "D) Abstraction"],
  "correctAnswer": "C) Polymorphism",
  "topic": "${topic}",
  "difficulty": "${difficulty}"
}

Output only the array, like:
[
  { ... },
  { ... }
]
Make sure all values are wrapped in double quotes (no single quotes).
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // console.log(text);

    let generatedQuestions;
    try {
      // const jsonLike = text.match(/\[.*\]/s)?.[0];
      // const cleaned = jsonLike.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
      generatedQuestions = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse Gemini response",
        error: err.message,
      });
    }
    console.log("Generated Questions:\n", generatedQuestions);
    // console.log("Gemini Response:\n", result.response.text());
    const validatedQuestions = generatedQuestions.map((q, index) => ({
      questionId: index + 1,
      type: q.type?.trim() || "mcq",
      questionText: q.questionText?.trim(),
      options: Array.isArray(q.options) ? q.options.map((o) => o.trim()) : [],
      correctAnswer: q.correctAnswer?.trim(),
      topic: q.topic?.trim() || "",
      difficulty: q.difficulty?.trim() || "medium",
    }));

    const newQuiz = new Quiz({
      title,
      description,
      quizId,
      createdBy: req.user.id,
      questions: generatedQuestions.map((q, index) => ({
        questionId: index + 1,
        type: q.type,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        topic: q.topic,
        difficulty: q.difficulty,
      })),
      timeLimit,
      requiredPercentage,
    });
    // const newQuiz = new Quiz({
    //   title,
    //   description,
    //   quizId,
    //   createdBy: req.user.userId,
    //   questions: validatedQuestions.map((q, index) => ({
    //     questionId: index + 1,
    //     ...q,
    //   })),
    //   timeLimit,
    //   requiredPercentage,
    // });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quizId,
      questionsCount: generatedQuestions.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.joinQuiz = async (req, res, next) => {
  try {
    console.log(req.params.quizId);
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ quiz });
  } catch (err) {
    next(err);
  }
};

exports.getQuizzesByAdmin = async (req, res) => {
  try {
    const { _id } = req.user;

    const quizzes = await Quiz.find({ createdBy: _id }).sort({ createdAt: -1 });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this admin." });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes by admin:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};