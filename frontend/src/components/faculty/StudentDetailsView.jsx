import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
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
  Brain,
  MessageSquare,
  Download,
  BarChart3,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";
import API from "../../api/axios";
import { toast } from "react-hot-toast";
import { DarkModeContext } from "../../App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const StudentDetailsView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme colors for charts
  const colors = {
    primary: darkMode ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
    primaryLight: darkMode
      ? "rgba(99, 102, 241, 0.2)"
      : "rgba(79, 70, 229, 0.2)",
    accent: darkMode ? "rgba(236, 72, 153, 1)" : "rgba(219, 39, 119, 1)",
    accentLight: darkMode
      ? "rgba(236, 72, 153, 0.2)"
      : "rgba(219, 39, 119, 0.2)",
    text: darkMode ? "rgba(226, 232, 240, 1)" : "rgba(30, 41, 59, 1)",
    grid: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)",
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/users/students`);
      const allStudents = response.data;
      const foundStudent = allStudents.find((s) => s._id === studentId);

      if (!foundStudent) {
        toast.error("Student not found");
        navigate("/faculty/students");
        return;
      }

      // Map student data
      setStudent({
        id: foundStudent._id,
        name: foundStudent.name,
        email: foundStudent.email,
        phone: foundStudent.phone || "N/A",
        studentId:
          foundStudent.studentId ||
          `STU${foundStudent._id.slice(-6).toUpperCase()}`,
        enrolledDate: new Date(foundStudent.createdAt).toLocaleDateString(),
        department: foundStudent.department || "Computer Science",
        semester: foundStudent.semester || "N/A",
        status: foundStudent.status || "active",
        profileImage: foundStudent.avatar,
        stats: {
          enrolledCourses: foundStudent.enrolledCourses?.length || 0,
          completedCourses: foundStudent.completedCourses?.length || 0,
          averageProgress: foundStudent.progress || 0,
          averageScore: foundStudent.averageScore || 0,
          totalQuizzes: foundStudent.totalQuizzes || 0,
          completedQuizzes: foundStudent.completedQuizzes || 0,
          totalXP: foundStudent.totalXP || 0,
          attentionScore: foundStudent.attentionScore || 0,
          streak: foundStudent.streak || 0,
        },
        courses: [],
        quizzes: [],
        activities: [],
        doubts: [],
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Failed to load student details");
      navigate("/faculty/students");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student details...</p>
        </div>
      </div>
    );
  }

  // Progress Chart Data - FIXED COLORS
  const progressChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Progress (%)",
        data: [45, 58, 65, 72, 80, student.stats.averageProgress],
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Quiz Score Chart Data - FIXED COLORS
  const quizScoreChartData = {
    labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4", "Quiz 5"],
    datasets: [
      {
        label: "Quiz Scores",
        data: [85, 90, 78, student.stats.averageScore, 88],
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        borderWidth: 0,
      },
    ],
  };

  // FIXED CHART OPTIONS
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.grid,
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: { size: 11 },
        },
        border: { display: false },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.grid,
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: colors.text,
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: { size: 11 },
          callback: (value) => value + "%",
        },
        border: { display: false },
      },
    },
  };

  const handleExportReport = () => {
    const reportData = {
      student: student.name,
      studentId: student.studentId,
      exportedAt: new Date().toISOString(),
    };
    console.log("Exporting report:", reportData);
    toast.success("Report exported successfully! 📊");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/faculty/students")}
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
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-black text-white">
                    {student.name.charAt(0)}
                  </span>
                </div>
              )}
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
                onClick={() =>
                  (window.location.href = `mailto:${student.email}`)
                }
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
              label: "Courses",
              value: `${student.stats.completedCourses}/${student.stats.enrolledCourses}`,
              icon: BookOpen,
              color: "primary",
            },
            {
              label: "Avg Progress",
              value: `${student.stats.averageProgress}%`,
              icon: Target,
              color: "accent",
            },
            {
              label: "Avg Score",
              value: `${student.stats.averageScore}%`,
              icon: Trophy,
              color: "success",
            },
            {
              label: "Quizzes",
              value: `${student.stats.completedQuizzes}/${student.stats.totalQuizzes}`,
              icon: CheckCircle2,
              color: "warning",
            },
            {
              label: "Total XP",
              value: student.stats.totalXP || 0,
              icon: Award,
              color: "primary",
            },
            {
              label: "Attention",
              value: `${student.stats.attentionScore}%`,
              icon: Brain,
              color: "accent",
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
                <div
                  className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-3`}
                >
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

        {/* Charts */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-black text-foreground mb-6">
              Performance Overview
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Chart - FIXED */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Progress Over Time
                </h3>
                <div className="h-64">
                  <Line data={progressChartData} options={lineChartOptions} />
                </div>
              </div>

              {/* Quiz Scores Chart - FIXED */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Recent Quiz Scores
                </h3>
                <div className="h-64">
                  <Bar data={quizScoreChartData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDetailsView;
