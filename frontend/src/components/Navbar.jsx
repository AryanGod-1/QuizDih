import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // We check local storage to see if user is logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">Quizdih</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">About</Link>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              {userInfo ? (
                <>
                  <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 mr-2 shadow-sm font-bold text-sm">
                    <UserCircle className="w-5 h-5" />
                    {userInfo.username}
                  </div>
                  <Link to="/maker-dashboard" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Log in</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none p-2 bg-slate-50 rounded-xl"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl pb-4 px-4 pt-2 flex flex-col gap-4">
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl">About</Link>
          
          {userInfo ? (
            <>
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 font-bold text-base rounded-xl mx-2 shadow-sm border border-indigo-100">
                <UserCircle className="w-5 h-5" />
                {userInfo.username}
              </div>
              <Link to="/maker-dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 text-base font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                <LogOut className="w-5 h-5" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl">Log in</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-base font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
