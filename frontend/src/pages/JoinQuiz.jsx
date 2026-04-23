import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const JoinQuiz = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API_URL}/api/quizzes/${code}`, config);
      if (data) {
        navigate(`/take/${data.quizCode}`, { state: { quiz: data } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Quiz not found. Check the code.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Join a Quiz</h2>
        <p className="text-xl text-slate-500 mb-8">Enter the 6-digit quirky code provided by your maker.</p>
        
        <form onSubmit={handleJoin} className="relative">
          <input 
            type="text" 
            required 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-3xl font-bold tracking-widest px-6 py-6 rounded-3xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all uppercase"
            placeholder="ABC123"
            maxLength={6}
          />
          {error && <p className="text-red-500 font-medium mt-4">{error}</p>}
          <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 flex justify-center items-center gap-2 active:scale-95 transition-transform">
            <PlayCircle className="w-6 h-6" /> Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinQuiz;
