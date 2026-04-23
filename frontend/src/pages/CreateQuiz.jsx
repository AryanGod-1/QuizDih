import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Trash2, Save, Settings } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const CreateQuiz = () => {
  const { state } = useLocation();
  const editQuiz = state?.editQuiz;

  const [title, setTitle] = useState(editQuiz ? editQuiz.title : '');
  const [description, setDescription] = useState(editQuiz ? editQuiz.description : '');
  const [quizCode, setQuizCode] = useState(editQuiz ? editQuiz.quizCode : '');
  const [globalTimeLimit, setGlobalTimeLimit] = useState(editQuiz ? editQuiz.globalTimeLimit : 0);
  const [outcomeType, setOutcomeType] = useState(editQuiz ? editQuiz.outcomeType : 'leaderboard');
  const [questions, setQuestions] = useState(editQuiz ? editQuiz.questions : []);
  const [categories, setCategories] = useState(editQuiz ? editQuiz.categories : []);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', type: 'mcq', options: ['', ''], correctAnswers: [], points: 1, timeLimit: 0 }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleKeyDown = (e, qIndex, oIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption(qIndex);
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      { name: '', minScore: 0, maxScore: 100 }
    ]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = { title, description, quizCode, globalTimeLimit, outcomeType, questions, categories };

      if (editQuiz) {
        await axios.put(`${API_URL}/api/quizzes/${editQuiz._id}`, payload, config);
        toast.success('Quiz updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/quizzes`, payload, config);
        toast.success('Quiz created successfully!');
      }
      navigate('/maker-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
          <Settings className="text-indigo-600" /> {editQuiz ? 'Edit Quiz' : 'Quiz Settings'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="E.g., Javascript Basics" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" rows="2" placeholder="What is this quiz about?"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Unique Quiz Code</label>
            <input type="text" value={quizCode} onChange={e => setQuizCode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none uppercase font-bold tracking-widest" placeholder="XYZ123" maxLength={6} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Outcome Type</label>
            <select value={outcomeType} onChange={e => setOutcomeType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none">
              <option value="leaderboard">Leaderboard (Rank by Score & Time)</option>
              <option value="category">Category Reveal (Custom Outcome)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 relative group transition-all">
            <button onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white rounded-lg p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Question {qIndex + 1}</label>
              <input type="text" value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-lg font-medium" placeholder="Enter question..." />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                <select value={q.type} onChange={e => handleQuestionChange(qIndex, 'type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-600 outline-none">
                  <option value="mcq">Multiple Choice (Checkbox)</option>
                  <option value="single">Single Choice (Radio)</option>
                  <option value="short">Short Answer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points</label>
                <input type="number" value={q.points} onChange={e => handleQuestionChange(qIndex, 'points', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-600 outline-none" />
              </div>
            </div>

            {q.type !== 'short' && (
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  Options 
                  <span className="text-[10px] font-normal text-slate-400 normal-case bg-white px-2 py-0.5 rounded border border-slate-200">Press Enter to add</span>
                </label>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex gap-2">
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} 
                      onKeyDown={e => handleKeyDown(e, qIndex, oIndex)}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none" 
                      placeholder={`Option ${oIndex + 1}`} 
                    />
                  </div>
                ))}
                <button onClick={() => addOption(qIndex)} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline mt-2">
                  <PlusCircle className="w-4 h-4" /> Add Option
                </button>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correct Answer(s) (Comma separated exact matches)</label>
                <input type="text" value={q.correctAnswers?.join(', ')} onChange={e => handleQuestionChange(qIndex, 'correctAnswers', e.target.value.split(',').map(s=>s.trim()))} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none" placeholder="E.g. Option 1, Option 3" />
            </div>
          </div>
        ))}
      </div>

      {outcomeType === 'category' && (
        <div className="mt-8 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Manage Categories</h3>
          <p className="text-slate-500 mb-6 text-sm">Define outcomes based on the user's final percentage score (0-100).</p>
          
          <div className="space-y-4 mb-6">
            {categories.map((cat, cIndex) => (
              <div key={cIndex} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
                  <input type="text" value={cat.name} onChange={e => handleCategoryChange(cIndex, 'name', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none" placeholder="E.g., Expert, Beginner..." />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min %</label>
                  <input type="number" value={cat.minScore} onChange={e => handleCategoryChange(cIndex, 'minScore', Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none" min="0" max="100" />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max %</label>
                  <input type="number" value={cat.maxScore} onChange={e => handleCategoryChange(cIndex, 'maxScore', Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none" min="0" max="100" />
                </div>
                <button onClick={() => removeCategory(cIndex)} className="mt-6 p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button onClick={addCategory} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
            <PlusCircle className="w-4 h-4" /> Add Category
          </button>
        </div>
      )}

      <div className="mt-8 flex gap-4 sticky bottom-8">
        <button onClick={addQuestion} className="flex-1 bg-white/90 backdrop-blur border-2 border-dashed border-indigo-200 text-indigo-600 py-4 rounded-2xl font-bold text-lg hover:border-indigo-600 flex items-center justify-center gap-2 transition-all shadow-sm">
          <PlusCircle /> Add Question
        </button>
        <button onClick={saveQuiz} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95">
          <Save /> {editQuiz ? 'Update Quiz' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
