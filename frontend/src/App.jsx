import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import MakerDashboard from './pages/MakerDashboard';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Outcome from './pages/Outcome';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans text-slate-900">
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/maker-dashboard" element={<MakerDashboard />} />
          <Route path="/join" element={<JoinQuiz />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/take/:code" element={<TakeQuiz />} />
          <Route path="/outcome/:id" element={<Outcome />} />
          <Route path="/leaderboard/:id" element={<Outcome />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
