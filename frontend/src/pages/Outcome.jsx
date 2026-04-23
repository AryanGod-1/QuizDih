import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Medal } from 'lucide-react';
import { API_URL } from '../config';

const Outcome = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (state?.outcomeType === 'leaderboard' || !state) {
      const fetchLeaderboard = async () => {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${API_URL}/api/quizzes/${id}/leaderboard`, config);
          setLeaderboard(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchLeaderboard();
    }
  }, [id, state]);

  if (state?.outcomeType === 'category') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-lg">
            ✨
          </div>
          <h2 className="text-slate-500 text-lg font-bold uppercase tracking-widest mb-2">You belong to</h2>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">{state.result?.categoryAssigned || 'Unknown Category'}</h1>
          <p className="text-xl text-slate-600 mb-8">You scored {state.result?.percentage}%!</p>
          <Link to="/join" className="text-indigo-600 font-bold hover:underline">Take another quiz &rarr;</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-4xl font-extrabold text-slate-900">Live Leaderboard</h2>
        {state?.result && (
          <p className="text-xl text-slate-600 mt-4 bg-indigo-50 inline-block px-6 py-2 rounded-full border border-indigo-100">
            You scored <strong className="text-indigo-700">{state.result.score}</strong> points!
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Taker</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center flex items-center justify-center gap-1"><Clock className="w-4 h-4"/> Time</div>
        </div>
        
        {leaderboard.map((entry, index) => (
          <div key={index} className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${index < 3 ? 'font-bold' : ''}`}>
            <div className="col-span-2 flex justify-center">
              {index === 0 ? <Medal className="text-amber-400 w-8 h-8" /> : 
               index === 1 ? <Medal className="text-slate-400 w-8 h-8" /> : 
               index === 2 ? <Medal className="text-amber-700 w-8 h-8" /> : 
               <span className="text-xl text-slate-400">#{index + 1}</span>}
            </div>
            <div className={`col-span-6 text-lg ${index < 3 ? 'text-slate-900' : 'text-slate-600'}`}>{entry.username}</div>
            <div className={`col-span-2 text-center text-lg ${index < 3 ? 'text-indigo-600' : 'text-slate-600'}`}>{entry.score} pts</div>
            <div className="col-span-2 text-center text-slate-500">{entry.timeTaken}s</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outcome;
