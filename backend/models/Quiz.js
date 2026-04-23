import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'single', 'short'], required: true },
  options: [{ type: String }],
  correctAnswers: [{ type: String }], // Array for mcq, single element for single/short
  points: { type: Number, default: 1 },
  timeLimit: { type: Number, default: 0 } // 0 means no individual time limit
});

const categorySchema = mongoose.Schema({
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }
});

const quizSchema = mongoose.Schema({
  maker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  quizCode: { type: String, required: true, unique: true },
  globalTimeLimit: { type: Number, default: 0 }, // 0 means no global time limit
  outcomeType: { type: String, enum: ['leaderboard', 'category'], default: 'leaderboard' },
  questions: [questionSchema],
  categories: [categorySchema] // Only used if outcomeType is 'category'
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
