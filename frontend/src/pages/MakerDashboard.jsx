import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, ExternalLink, Activity, Edit3, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const MakerDashboard = () => {
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attendedQuizzes, setAttendedQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('maker'); // 'maker' or 'taker'
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        if (activeTab === 'maker') {
          const { data } = await axios.get(`${API_URL}/api/quizzes/my-quizzes`, config);
          setCreatedQuizzes(data);
        } else {
          const { data } = await axios.get(`${API_URL}/api/quizzes/attended`, config);
          setAttendedQuizzes(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, activeTab, userInfo?.token]);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/quizzes/${id}`, config);
        setCreatedQuizzes(createdQuizzes.filter(q => q._id !== id));
        toast.success('Quiz deleted successfully');
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Quiz code copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Your Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage quizzes you've created or taken</p>
        </div>
        <Link to="/create" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <PlusCircle className="w-5 h-5" />
          Create New Quiz
        </Link>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('maker')}
          className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'maker' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Manage Your Quizzes
        </button>
        <button 
          onClick={() => setActiveTab('taker')}
          className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'taker' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Quizzes You Attended
        </button>
      </div>

      {activeTab === 'maker' ? (
        createdQuizzes.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No quizzes yet</h3>
            <p className="text-slate-500 mt-2 mb-6">Create your first quiz to get started</p>
            <Link to="/create" className="text-indigo-600 font-bold hover:underline">Create a Quiz &rarr;</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdQuizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{quiz.title}</h3>
                  <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
                    <span className="text-xs font-bold">Code: {quiz.quizCode}</span>
                    <button onClick={() => handleCopy(quiz.quizCode)} className="p-1 hover:bg-indigo-100 rounded transition-colors" title="Copy code">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 mb-6 line-clamp-2 min-h-[3rem]">{quiz.description}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <Link to={`/leaderboard/${quiz._id}`} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                    View Results <ExternalLink className="w-4 h-4" />
                  </Link>
                  <div className="flex gap-2">
                    <Link to="/create" state={{ editQuiz: quiz }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(quiz._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        attendedQuizzes.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Haven't taken any quizzes</h3>
            <p className="text-slate-500 mt-2 mb-6">Join a quiz using a code to see your history.</p>
            <Link to="/join" className="text-indigo-600 font-bold hover:underline">Join a Quiz &rarr;</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendedQuizzes.map((sub) => (
              <div key={sub._id} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{sub.quiz ? sub.quiz.title : 'Deleted Quiz'}</h3>
                  <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-md">Score: {sub.score}</span>
                </div>
                <p className="text-slate-500 mb-6">Time Taken: {sub.timeTaken}s</p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  {sub.quiz && (
                    <Link to={`/leaderboard/${sub.quiz._id}`} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                      Leaderboard <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MakerDashboard;
