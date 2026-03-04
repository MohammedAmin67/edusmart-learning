# 🎓 EduSmart Learning Platform

**EduSmart** is a next-generation AI-powered learning platform that transforms education through gamification, personalized learning paths, and dual-role functionality for both students and faculty. Experience seamless education with interactive lessons, real-time progress tracking, and intelligent analytics.

---

## 🌟 Key Highlights

### **For Students**

- 📚 **Interactive Multimedia Lessons** - Engage with video-rich content and hands-on projects
- 🎮 **Gamified Quizzes** - Master concepts through MCQs, fill-in-the-blank, and drag-and-drop challenges
- 🏆 **Achievement System** - Unlock badges, earn XP, and showcase your accomplishments
- 📊 **Real-time Analytics** - Track progress with daily stats, streaks, and personalized insights
- 🔥 **Learning Streaks** - Maintain momentum with visual streak tracking
- 👤 **Personalized Dashboard** - Monitor XP, levels, achievements, and activity in one place
- 💬 **Doubt Resolution** - Ask questions and get timely responses from faculty

### **For Faculty**

- 👥 **Student Monitoring** - Track individual and class-wide performance metrics
- 📝 **Course Management** - Create, edit, and publish courses with full CRUD operations
- 💬 **Doubt Management** - Respond to student queries with priority-based filtering
- 📈 **Advanced Analytics** - Visualize student engagement, completion rates, and quiz performance
- 🔔 **Smart Notifications** - Stay updated on student activities and milestones
- ⚙️ **Customizable Settings** - Manage preferences, notifications, and appearance

---

## 🛠️ Technology Stack

### **Frontend**

- **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) for lightning-fast development
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for modern, responsive design
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth transitions
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **UI Components:** Custom component library with dark mode support
- **Charts:** Chart.js + React-Chartjs-2 for analytics visualization

### **Backend**

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication:** JWT + bcrypt for secure auth
- **File Storage:** [Cloudinary](https://cloudinary.com/) for avatar uploads
- **API Architecture:** RESTful API with role-based access control

### **Key Features**

- 🌗 **Dark Mode** - Automatic theme switching with persistent preference
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- 🔒 **Secure Authentication** - JWT-based auth with HTTP-only cookies
- 🎨 **Modern UI/UX** - Clean, intuitive interface inspired by modern EdTech platforms
- ⚡ **Real-time Updates** - Instant feedback and live progress tracking

---

## 📂 Project Structure

```
edusmart-learning/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Auth/        # Login, SignUp, OTP verification
│   │   │   ├── dashboard/   # Student dashboard
│   │   │   ├── faculty/     # Faculty-specific components
│   │   │   ├── layout/      # Header, Sidebar, Footer
│   │   │   ├── learning/    # LessonPlayer, QuizSystem
│   │   │   ├── profile/     # Profile, AchievementGallery
│   │   │   └── courses/     # CourseGrid, CourseCard
│   │   ├── context/         # React Context for global state
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── data/            # Mock data (temporary)
│   │   └── api/             # Axios configuration
│   ├── public/              # Static assets
│   └── vite.config.js       # Vite configuration
│
├── backend/                 # Express.js backend
│   ├── config/              # Cloudinary & database config
│   ├── controllers/         # Request handlers
│   │   ├── authController.js    # Login, signup, logout
│   │   └── userController.js    # User profile, avatar upload
│   ├── models/              # Mongoose schemas
│   │   └── User.js          # User model
│   ├── routes/              # API routes
│   │   ├── auth.js          # /api/auth endpoints
│   │   └── users.js         # /api/users endpoints
│   ├── middleware/          # Auth middleware
│   ├── utils/               # Helper functions
│   └── server.js            # Express server entry point
│
└── package.json             # Root package config
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for avatar uploads)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohammedAmin67/edusmart-learning.git
   cd edusmart-learning
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=5002
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Run the application**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5002/api`

---

## 📱 Features Walkthrough

### **Student Experience**

1. **Sign Up / Login** with OTP verification
2. **Browse Courses** with filters (category, difficulty, rating)
3. **Enroll & Learn** - Watch video lessons and take interactive quizzes
4. **Track Progress** - View XP, levels, and completion rates in real-time
5. **Earn Achievements** - Unlock badges like "Quick Learner", "Perfect Score", "Streak Master"
6. **Ask Doubts** - Raise questions directly from video lessons
7. **Customize Profile** - Upload avatar, manage settings, view stats

### **Faculty Experience**

1. **Faculty Login** with separate role-based access
2. **Student Monitoring** - View detailed progress and performance metrics
3. **Course Management** - Create, edit, and delete courses
4. **Doubt Management** - Respond to student queries with priority filtering
5. **Analytics Dashboard** - Visualize enrollment trends, quiz scores, and engagement
6. **Profile & Settings** - Manage notifications, preferences, and security

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Mohammed Amin**

- GitHub: [@MohammedAmin67](https://github.com/MohammedAmin67)
- Email: mdamin67541@gmail.com

---

## 🙏 Acknowledgments

- Inspired by modern EdTech platforms like Coursera, edX, and Udemy
- UI/UX inspiration from leading e-learning platforms
- Built with love for learners and educators worldwide

---

## 📧 Contact

Questions, suggestions, or collaboration opportunities?  
Feel free to reach out via [GitHub Issues](https://github.com/MohammedAmin67/edusmart-learning/issues) or email!

---

<div align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
  <br />
  Made with ❤️ by Mohammed Amin
</div>
