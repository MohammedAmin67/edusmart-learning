# 🎓 EduSmart Learning Platform

**EduSmart** is a next-generation AI-powered learning platform that transforms education through **gamification**, **personalized learning**, and **dual-role functionality** for both **students** and **faculty**.

---

## ✨ What’s New: Synapse (Personalized AI Assistant)

EduSmart includes **Synapse**, a built-in AI assistant that helps users:

- Navigate EduSmart features (“How do I enroll?”, “Where is analytics?”)
- Get study help for course-related topics (“Explain closures”, “Explain React props”)
- Use **preset questions** (do not count towards daily usage)
- Receive **structured answers** (title + steps + notes) for a clean UI
- See an in-chat **AI thinking/loading state**
- Enforce platform scope (Synapse refuses unrelated/off-platform questions)

### Usage limits (app-level)

- **10 prompts/day per user** (counted prompts)
- **Preset questions are free** (don’t count)
- Low-limit warning example: shown when **3 prompts left**

---

## 🌟 Key Highlights

### For Students

- 📚 **Interactive Multimedia Lessons** — Video-rich learning + projects
- 🎮 **Gamified Quizzes** — MCQ + interactive quiz types
- 🏆 **Achievement System** — Badges, XP, levels
- 📊 **Real-time Analytics** — Track progress, streaks, insights
- 🔥 **Learning Streaks** — Visual streak tracking
- 👤 **Personalized Dashboard** — XP, levels, achievements, activity
- 💬 **Doubt Resolution** — Ask doubts and get faculty responses
- 🤖 **Synapse AI** — Ask EduSmart usage + study questions

### For Faculty

- 👥 **Student Monitoring** — Individual/class metrics
- 📝 **Course Management** — Full CRUD, publish courses
- 💬 **Doubt Management** — Handle student queries
- 📈 **Advanced Analytics** — Engagement, completion, quiz performance
- 🔔 **Smart Notifications** — Activity + milestone alerts
- ⚙️ **Settings** — Preferences, notifications, appearance
- 🤖 **Synapse AI** — Faculty presets + study assistance

---

## 🛠️ Technology Stack

### Frontend

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** React Context API
- **Routing:** React Router v6
- **HTTP:** Axios
- **Charts:** Chart.js + react-chartjs-2

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **File Storage:** Cloudinary (avatars)
- **AI:** Google Gemini API (via Google AI Studio / Google Cloud)

---

## 📂 Project Structure

```
edusmart-learning/
├── frontend/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── api/
├── backend/                   # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (optional — avatars)
- **Gemini API key** (for Synapse AI)

---

## 📱 Features Walkthrough

### Student Experience

1. Sign up / login (OTP verification)
2. Browse courses
3. Enroll & learn
4. Track progress & analytics
5. Earn XP + achievements
6. Ask doubts
7. Use **Synapse AI** for help

### Faculty Experience

1. Faculty login (role-based)
2. Monitor students
3. Manage courses
4. Handle doubts
5. View analytics
6. Profile & settings
7. Use **Synapse AI** presets + study help

---

## 👤 Author

**Mohammed Amin**

- GitHub: @MohammedAmin67
- Email: mdamin67541@gmail.com

---

## 📧 Contact

Use GitHub Issues or email for suggestions/collaboration.
