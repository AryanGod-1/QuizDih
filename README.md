<div align="center">
  <h1>Quizdih</h1>
  <p>A Premium MERN Stack Quiz Platform</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 📖 Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Algorithms](#-architecture--algorithms)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Developer Workflow](#-developer-workflow)

---

## 🚀 About The Project

**Quizdih** is a robust, full-stack web application built for creating, managing, and taking quizzes. It provides a seamless experience for both "Quiz Makers" and "Quiz Takers" with a beautiful UI featuring glassmorphism, dynamic micro-animations, and a responsive design.

---

## ✨ Key Features

- **Role-Based Workflows:** Separate experiences for Quiz Makers (dashboard, creation tools) and Takers.
- **Dynamic Quiz Taking:** "One-question-at-a-time" pagination with real-time state management.
- **Advanced Leaderboard:** Fast and accurate ranking system utilizing the **Timsort** algorithm.
- **Custom Outcomes:** Quiz makers can define category-based outcomes depending on the user's final score.
- **Secure Authentication:** JWT-based stateless authentication and bcrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** Fast, component-based SPA architecture.
- **Tailwind CSS:** Rapid, utility-first styling for a premium UI.
- **React Router DOM:** Client-side routing without page reloads.
- **Axios:** Promise-based HTTP client for API communication.

### Backend & Database
- **Node.js & Express.js:** Robust RESTful API architecture.
- **MongoDB & Mongoose:** Flexible NoSQL database with structured schemas for `Users`, `Quizzes`, and `Submissions`.
- **JWT & bcryptjs:** Secure user authentication and data protection.

---

## 🧠 Architecture & Algorithms

### The Timsort Algorithm (Leaderboard Sorting)
Our Leaderboard utilizes **Timsort** (via the V8 Engine's highly optimized `Array.prototype.sort()`) for rapid, stable sorting.
1. **Primary Sort:** Candidates are sorted by `score` in descending order.
2. **Tie-Breaker:** If scores match, candidates are sorted by `timeTaken` in ascending order.

### Score Calculation Engine
- **Iterative Traversal:** Calculates scores iteratively by comparing the user's `answers` array with the `quiz.questions` structure.
- **Lexicographical Sorting:** Ensures multiple-choice questions are graded accurately regardless of the option selection order by sorting and stringifying both arrays before comparison.
- **Linear Search (`Array.prototype.find()`):** Dynamically assigns a final outcome category based on score boundaries defined by the Quiz Maker.

---

## 📡 API Reference

Our REST API is split into structured routes:

### Authentication (`/api/auth`)
- `POST /register` - Registers a new Maker or Taker
- `POST /login` - Authenticates and returns a JWT

### Quizzes (`/api/quizzes`)
- `POST /` - Creates a new quiz
- `GET /my-quizzes` - Fetches quizzes created by the Maker
- `GET /:code` - Fetches quiz data for a Taker via join code
- `POST /:id/submit` - Submits answers and calculates score
- `GET /:id/leaderboard` - Retrieves sorted rankings

---

## 💻 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/quizdih.git
   cd quizdih
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT, MONGO_URI, and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Open your browser:** Navigate to `http://localhost:5173`

---

## 🤝 Developer Workflow
This project was autonomously built using a divided workflow strategy:
- **Frontend & UI/UX Architect:** Focused on visual language, React components, state management, and API integration.
- **Backend & Systems Engineer:** Focused on database schemas, REST APIs, core algorithms, and security middleware.
