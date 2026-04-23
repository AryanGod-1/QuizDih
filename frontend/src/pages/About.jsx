import React from 'react';
import { CheckCircle2, ShieldCheck, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Quizdih</span></h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Developed specifically for organizational quiz facilitation. Quizdih is the premium solution for conducting seamless assessments, employee training, and interactive leaderboards.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">For Organizations</h3>
          <p className="text-slate-600 leading-relaxed">Designed to handle large groups of participants with ease. Perfect for corporate training, educational institutions, and large-scale assessments.</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Fail-proof Reliability</h3>
          <p className="text-slate-600 leading-relaxed">Built on a robust MERN stack architecture ensuring high availability, secure data handling, and zero downtime during critical quiz sessions.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Analytics</h3>
          <p className="text-slate-600 leading-relaxed">Go beyond simple scores. Our custom Timsort leaderboard algorithms and category assignment engines provide deep insights into participant performance.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
