import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const TakeQuiz = () => {
  const { state } = useLocation();
  const { code } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(state?.quiz || null);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [globalTimeLeft, setGlobalTimeLeft] = useState(null);
  
  // Pagination State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!quiz) {
      const fetchQuiz = async () => {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${API_URL}/api/quizzes/${code}`, config);
          setQuiz(data);
        } catch (error) {
          navigate('/join');
        }
      };
      fetchQuiz();
    }
  }, [quiz, code, navigate]);

  useEffect(() => {
    if (quiz && quiz.globalTimeLimit > 0) {
      setGlobalTimeLeft(quiz.globalTimeLimit * 60);
    }
  }, [quiz]);

  useEffect(() => {
    let timer;
    if (globalTimeLeft !== null && globalTimeLeft > 0) {
      timer = setInterval(() => setGlobalTimeLeft(prev => prev - 1), 1000);
    } else if (globalTimeLeft === 0) {
      handleSubmit(); // Auto submit
    }
    return () => clearInterval(timer);
  }, [globalTimeLeft]);

  const handleSelect = (qId, type, option) => {
    const current = answers[qId] || [];
    let updated;
    if (type === 'single') {
      updated = [option];
    } else if (type === 'mcq') {
      if (current.includes(option)) {
        updated = current.filter(item => item !== option);
      } else {
        updated = [...current, option];
      }
    } else {
      updated = [option]; 
    }
    setAnswers({ ...answers, [qId]: updated });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      providedAnswers: answers[qId]
    }));

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`${API_URL}/api/quizzes/${quiz._id}/submit`, {
        answers: formattedAnswers,
        timeTaken
      }, config);
      
      toast.success('Quiz submitted successfully!');
      navigate(`/outcome/${quiz._id}`, { state: { result: data, outcomeType: quiz.outcomeType } });
    } catch (error) {
      toast.error('Error submitting quiz');
    }
  };

  if (!quiz) return <div className="text-center p-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const progressPercentage = Math.round((Object.keys(answers).length / quiz.questions.length) * 100);
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Sticky Header with Progress Bar */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 sticky top-20 z-40 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{quiz.title}</h2>
            <p className="text-slate-500">{quiz.description}</p>
          </div>
          {globalTimeLeft !== null && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold tracking-widest border border-red-100 animate-pulse">
              <Clock className="w-5 h-5" />
              {Math.floor(globalTimeLeft / 60)}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        
        {/* Progress Bar UI */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="text-right text-xs font-bold text-slate-400">{progressPercentage}% Completed</div>
      </div>

      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
            <span className="text-indigo-400 mr-3 text-lg font-extrabold bg-indigo-50 px-3 py-1 rounded-lg">
              Q{currentQuestionIndex + 1} of {quiz.questions.length}
            </span> 
            {currentQuestion.text}
          </h3>
          
          {currentQuestion.type === 'short' ? (
            <input 
              type="text" 
              value={(answers[currentQuestion._id] || [])[0] || ''}
              onChange={(e) => handleSelect(currentQuestion._id, 'short', e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none text-lg transition-all"
              placeholder="Type your answer here..."
            />
          ) : (
            <div className="space-y-4">
              {currentQuestion.options.map((opt, i) => {
                const isChecked = (answers[currentQuestion._id] || []).includes(opt);
                return (
                  <label key={i} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 ${isChecked ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-300 bg-white'}`}>
                    <input 
                      type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'} 
                      name={currentQuestion._id}
                      checked={isChecked}
                      onChange={() => handleSelect(currentQuestion._id, currentQuestion.type, opt)}
                      className={`w-6 h-6 ${currentQuestion.type==='single'? 'accent-indigo-600': 'text-indigo-600 rounded-md focus:ring-indigo-600'}`}
                    />
                    <span className={`text-xl font-medium ${isChecked ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className={`flex-1 py-5 rounded-2xl font-bold text-xl flex justify-center items-center gap-3 transition-all ${currentQuestionIndex === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 active:scale-95 shadow-sm'}`}
        >
          <ArrowLeft className="w-6 h-6" /> Previous
        </button>
        
        {isLastQuestion ? (
          <button 
            onClick={handleSubmit} 
            className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 flex justify-center items-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            Submit Quiz <Send className="w-6 h-6" />
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 flex justify-center items-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            Next <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
