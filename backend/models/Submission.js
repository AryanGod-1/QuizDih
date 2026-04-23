import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  taker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    providedAnswers: [{ type: String }]
  }],
  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  categoryAssigned: { type: String } // Populated if outcomeType was 'category'
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
