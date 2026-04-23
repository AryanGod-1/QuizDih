import express from 'express';
import { createQuiz, getMyQuizzes, getAttendedQuizzes, getQuizByCode, submitQuiz, getLeaderboard, updateQuiz, deleteQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createQuiz);
router.get('/my-quizzes', protect, getMyQuizzes);
router.get('/attended', protect, getAttendedQuizzes);
router.get('/:code', protect, getQuizByCode);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/leaderboard', protect, getLeaderboard);

export default router;
