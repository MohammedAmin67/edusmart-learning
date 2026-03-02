import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Brain,
  MessageSquare,
  Download,
  Send,
  BarChart3,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StudentDetailsView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, quizzes, activity
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  // Mock student data
  const student = {
    id: studentId,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 234-567-8900',
    studentId: 'STU2024001',
    enrolledDate: '2024-01-15',
    department: 'Computer Science',
    semester: '4th',
    status: 'active',
    profileImage: null,
    
    // Statistics
    stats: {
      enrolledCourses: 3,
      completedCourses: 1,
      averageProgress: 85,
      averageScore: 88,
      totalQuizzes: 12,
      completedQuizzes: 10,
      totalXP: 2450,
      attentionScore: 92,
      streak: 15,
    },

    // Course Progress
    courses: [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        progress: 95,
        score: 92,
        lessonsCompleted: 19,
        totalLessons: 20,
        quizzesCompleted: 5,
        totalQuizzes: 5,
        status: 'active',
        lastAccessed: '2 hours ago',
      },
      {
        id: 2,
        title: 'React Development',
        progress: 75,
        score: 85,
        lessonsCompleted: 15,
        totalLessons: 20,
        quizzesCompleted: 4,
        totalQuizzes: 6,
        status: 'active',
        lastAccessed: '1 day ago',
      },
      {
        id: 3,
        title: 'Python Basics',
        progress: 100,
        score: 88,
        lessonsCompleted: 15,
        totalLessons: 15,
        quizzesCompleted: 5,
        totalQuizzes: 5,
        status: 'completed',
        lastAccessed: '3 days ago',
      },
    ],

    // Quiz History
    quizzes: [
      {
        id: 1,
        course: 'JavaScript Fundamentals',
        quizName: 'Variables & Data Types',
        score: 95,
        totalQuestions: 10,
        correctAnswers: 9,
        attempts: 1,
        completedAt: '2024-03-01',
      },
      {
        id: 2,
        course: 'JavaScript Fundamentals',
        quizName: 'Functions & Scope',
        score: 90,
        totalQuestions: 10,
        correctAnswers: 9,
        attempts: 1,
        completedAt: '2024-02-28',
      },
      {
        id: 3,
        course: 'React Development',
        quizName: 'React Hooks',
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        attempts: 2,
        completedAt: '2024-02-27',
      },
      {
        id: 4,
        course: 'Python Basics',
        quizName: 'Python Syntax',
        score: 88,
        totalQuestions: 10,
        correctAnswers: 9,
        attempts: 1,
        completedAt: '2024-02-25',
      },
    ],

    // Activity Timeline
    activities: [
      {
        id: 1,
        type: 'lesson',
        title: 'Completed lesson: Advanced JavaScript Concepts',
        course: 'JavaScript Fundamentals',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        type: 'quiz',
        title: 'Scored 95% on Variables & Data Types Quiz',
        course: 'JavaScript Fundamentals',
        timestamp: '1 day ago',
      },
      {
        id: 3,
        type: 'doubt',
        title: 'Raised doubt: How does closure work?',
        course: 'JavaScript Fundamentals',
        timestamp: '2 days ago',
      },
      {
        id: 4,
        type: 'achievement',
        title: 'Earned "Quick Learner" badge',
        course: null,
        timestamp: '3 days ago',
      },
    ],

    // Doubts Raised
    doubts: [
      {
        id: 1,
        course: 'JavaScript Fundamentals',
        question: 'How does closure work in JavaScript?',
        timestamp: '2 days ago',
        status: 'resolved',
        response: 'A closure is a function that has access to variables in its outer scope...',
      },
      {
        id: 2,
        course: 'React Development',
        question: 'What is the difference between useState and useReducer?',
        timestamp: '5 days ago',
        status: 'resolved',
        response: 'useState is for simple state, useReducer is for complex state logic...',
      },
    ],
  };

  // Progress Chart Data
  const progressChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Progress (%)',
        data: [45, 58, 65, 72, 80, 85],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Quiz Score Chart Data
  const quizScoreChartData = {
    labels: student.quizzes.map((q) => q.quizName.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Quiz Scores',
        data: student.quizzes.map((q) => q.score),
        backgroundColor: 'hsl(var(--accent))',
        borderColor: 'hsl(var(--accent))',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Mock send message functionality
      console.log('Message sent to student:', message);
      setMessage('');
      setShowMessageModal(false);
      // In production, this will call API
    }
  };

  const handleExportReport = () => {
    // Mock export functionality
    const reportData = {
      student: student.name,
      studentId: student.studentId,
      courses: student.courses,
      averageScore: student.stats.averageScore,
      exportedAt: new Date().toISOString(),
    };
    console.log('Exporting report:', reportData);
    // In production, generate PDF/CSV
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/faculty/students')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Students</span>
        </motion.button>

        {/* Student Header Card */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Student Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-black text-white">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
                  {student.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Enrolled: {student.enrolledDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                    {student.studentId}
                  </div>
                  <div className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-bold">
                    {student.department}
                  </div>
                  <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-xs font-bold border border-success/20">
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: 'Courses',
              value: `${student.stats.completedCourses}/${student.stats.enrolledCourses}`,
              icon: BookOpen,
              color: 'primary',
            },
            {
              label: 'Avg Progress',
              value: `${student.stats.averageProgress}%`,
              icon: Target,
              color: 'accent',
            },
            {
              label: 'Avg Score',
              value: `${student.stats.averageScore}%`,
              icon: Trophy,
              color: 'success',
            },
            {
              label: 'Quizzes',
              value: `${student.stats.completedQuizzes}/${student.stats.totalQuizzes}`,
              icon: CheckCircle2,
              color: 'warning',
            },
            {
              label: 'Total XP',
              value: student.stats.totalXP,
              icon: Award,
              color: 'primary',
            },
            {
              label: 'Attention',
              value: `${student.stats.attentionScore}%`,
              icon: Brain,
              color: 'accent',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-4 border border-border shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <h3 className="text-xl font-black text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Tab Headers */}
          <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'quizzes', label: 'Quiz History', icon: Trophy },
              { id: 'activity', label: 'Activity', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Progress Chart */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      Progress Over Time
                    </h3>
                    <div className="h-64">
                      <Line data={progressChartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Quiz Scores Chart */}
                  <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      Recent Quiz Scores
                    </h3>
                    <div className="h-64">
                      <Bar data={quizScoreChartData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                {/* Recent Doubts */}
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Recent Doubts
                  </h3>
                  <div className="space-y-3">
                    {student.doubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="bg-muted/30 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground mb-1">
                              {doubt.question}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doubt.course} • {doubt.timestamp}
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-xs font-bold">
                            Resolved
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-card rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-bold text-foreground">Response:</span>{' '}
                            {doubt.response}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                {student.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-muted/30 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Last accessed: {course.lastAccessed}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          course.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {course.status === 'completed' ? 'Completed' : 'In Progress'}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Score</p>
                        <p className="text-xl font-black text-foreground">
                          {course.score}%
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          Lessons: {course.lessonsCompleted}/{course.totalLessons}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          Quizzes: {course.quizzesCompleted}/{course.totalQuizzes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-4">
                {student.quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-muted/30 rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {quiz.quizName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {quiz.course}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">
                          Score: <span className="font-bold">{quiz.score}%</span>
                        </span>
                        <span className="text-muted-foreground">
                          {quiz.correctAnswers}/{quiz.totalQuestions} correct
                        </span>
                        <span className="text-muted-foreground">
                          Attempts: {quiz.attempts}
                        </span>
                        <span className="text-muted-foreground">
                          {quiz.completedAt}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-foreground">
                      {quiz.score}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {student.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'lesson'
                          ? 'bg-primary/10'
                          : activity.type === 'quiz'
                          ? 'bg-accent/10'
                          : activity.type === 'doubt'
                          ? 'bg-warning/10'
                          : 'bg-success/10'
                      }`}
                    >
                      {activity.type === 'lesson' && (
                        <BookOpen className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === 'quiz' && (
                        <Trophy className="w-5 h-5 text-accent" />
                      )}
                      {activity.type === 'doubt' && (
                        <MessageSquare className="w-5 h-5 text-warning" />
                      )}
                      {activity.type === 'achievement' && (
                        <Award className="w-5 h-5 text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground mb-1">
                        {activity.title}
                      </p>
                      {activity.course && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {activity.course}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-card rounded-2xl p-8 max-w-lg w-full border border-border shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-2xl font-black text-foreground mb-4">
              Send Message to {student.name}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-32 p-4 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsView;