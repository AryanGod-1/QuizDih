import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Maker)
export const createQuiz = async (req, res) => {
  try {
    const { title, description, quizCode, globalTimeLimit, outcomeType, questions, categories } = req.body;

    const quizExists = await Quiz.findOne({ quizCode });
    if (quizExists) {
      return res.status(400).json({ message: 'Quiz code already exists' });
    }

    const quiz = new Quiz({
      maker: req.user._id,
      title,
      description,
      quizCode,
      globalTimeLimit,
      outcomeType,
      questions,
      categories
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quizzes created by the logged in maker
// @route   GET /api/quizzes/my-quizzes
// @access  Private (Maker)
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ maker: req.user._id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quizzes attended by the user
// @route   GET /api/quizzes/attended
// @access  Private
export const getAttendedQuizzes = async (req, res) => {
  try {
    const submissions = await Submission.find({ taker: req.user._id })
      .populate('quiz', 'title quizCode description')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Maker only)
export const updateQuiz = async (req, res) => {
  try {
    const { title, description, quizCode, globalTimeLimit, outcomeType, questions, categories } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.maker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this quiz' });
    }

    quiz.title = title;
    quiz.description = description;
    quiz.quizCode = quizCode;
    quiz.globalTimeLimit = globalTimeLimit;
    quiz.outcomeType = outcomeType;
    quiz.questions = questions;
    quiz.categories = categories;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Maker only)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.maker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await Submission.deleteMany({ quiz: quiz._id });
    await quiz.deleteOne();
    
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz by code (for Taker to join)
// @route   GET /api/quizzes/:code
// @access  Private (Taker)
export const getQuizByCode = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizCode: req.params.code }).select('-questions.correctAnswers');
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private (Taker)
export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    let maxPossibleScore = 0;

    answers.forEach(takerAnswer => {
      const question = quiz.questions.id(takerAnswer.questionId);
      if (question) {
        maxPossibleScore += question.points;
        // Simple logic for exact match (could be improved for short answers)
        const isCorrect = JSON.stringify(takerAnswer.providedAnswers.sort()) === JSON.stringify(question.correctAnswers.sort());
        if (isCorrect) {
          score += question.points;
        }
      }
    });

    const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;
    
    // Result Logic Engine
    let categoryAssigned = null;
    if (quiz.outcomeType === 'category' && quiz.categories && quiz.categories.length > 0) {
      const category = quiz.categories.find(c => percentage >= c.minScore && percentage <= c.maxScore);
      if (category) {
        categoryAssigned = category.name;
      }
    }

    const submission = new Submission({
      quiz: quizId,
      taker: req.user._id,
      answers,
      score,
      timeTaken,
      categoryAssigned
    });

    await submission.save();

    res.status(201).json({
      score,
      percentage,
      categoryAssigned,
      submissionId: submission._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard for a quiz
// @route   GET /api/quizzes/:id/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const submissions = await Submission.find({ quiz: req.params.id }).populate('taker', 'username');
    
    // Leaderboard sorting algorithm: primary by score (desc), secondary by timeTaken (asc)
    submissions.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    });

    const leaderboard = submissions.map(sub => ({
      username: sub.taker.username,
      score: sub.score,
      timeTaken: sub.timeTaken
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
