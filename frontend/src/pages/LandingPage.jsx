import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-8 border border-indigo-100">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            The Modern Quiz Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
            Create, Share, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Analyze Quizzes</span> in Minutes.
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            A beautiful, intuitive platform for educators and creators. Build dynamic quizzes, enforce timers, and generate insightful leaderboards.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/join" className="group flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-50 active:scale-95">
              <PlayCircle className="w-6 h-6" />
              Join a Quiz
            </Link>
            <Link to="/create" className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-200 active:scale-95">
              <PlusCircle className="w-6 h-6" />
              Create a Quiz
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            { title: "Smart Leaderboards", desc: "Built-in sorting algorithms that rank by score and time taken." },
            { title: "Custom Categories", desc: "Map scores to unique outcomes instead of traditional grades." },
            { title: "Strict Timers", desc: "Global and per-question timers with auto-submission logic." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
