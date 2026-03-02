import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const FacultyAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d, 1y

  // Mock analytics data
  const stats = {
    totalStudents: 245,
    activeStudents: 198,
    averageProgress: 72,
    averageScore: 82,
    totalCourses: 5,
    completionRate: 68,
    totalDoubts: 156,
    resolvedDoubts: 142,
  };

  // Student Enrollment Trend
  const enrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Enrollments",
        data: [45, 62, 58, 75, 82, 95],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Course Performance
  const coursePerformanceData = {
    labels: [
      "JavaScript",
      "React",
      "Python",
      "Data Structures",
      "Machine Learning",
    ],
    datasets: [
      {
        label: "Average Score",
        data: [85, 78, 88, 72, 65],
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--success))",
          "hsl(var(--warning))",
          "hsl(var(--destructive))",
        ],
      },
    ],
  };

  // Student Progress Distribution
  const progressDistributionData = {
    labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
    datasets: [
      {
        data: [15, 35, 45, 150],
        backgroundColor: [
          "hsl(var(--destructive))",
          "hsl(var(--warning))",
          "hsl(var(--accent))",
          "hsl(var(--success))",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Quiz Performance Radar
  const quizPerformanceData = {
    labels: [
      "JavaScript",
      "React",
      "Python",
      "Data Structures",
      "Machine Learning",
    ],
    datasets: [
      {
        label: "Quiz Performance",
        data: [88, 82, 90, 75, 68],
        backgroundColor: "hsl(var(--primary) / 0.2)",
        borderColor: "hsl(var(--primary))",
        borderWidth: 2,
      },
    ],
  };

  // Engagement Over Time
  const engagementData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Active Users",
        data: [180, 185, 178, 195, 198, 202],
        borderColor: "hsl(var(--success))",
        backgroundColor: "hsl(var(--success) / 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Completed Lessons",
        data: [320, 385, 410, 445, 480, 525],
        borderColor: "hsl(var(--accent))",
        backgroundColor: "hsl(var(--accent) / 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const handleExportReport = () => {
    // Mock export functionality
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      stats,
    };
    console.log("Exporting analytics report:", reportData);
    // In production, generate PDF/CSV
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into student performance
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={handleExportReport}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-success text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {stats.totalStudents}
            </h3>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-success text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {stats.activeStudents}
            </h3>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-success text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +5%
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {stats.averageProgress}%
            </h3>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-warning" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-success text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +3%
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {stats.averageScore}%
            </h3>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                Student Enrollment Trend
              </h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-64">
              <Line data={enrollmentData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Course Performance */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                Course Performance
              </h3>
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-64">
              <Bar data={coursePerformanceData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Distribution */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                Progress Distribution
              </h3>
              <PieChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-64">
              <Doughnut
                data={progressDistributionData}
                options={doughnutOptions}
              />
            </div>
          </motion.div>

          {/* Quiz Performance Radar */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                Quiz Performance
              </h3>
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-64">
              <Radar data={quizPerformanceData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Completion Stats */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                Key Metrics
              </h3>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {stats.completionRate}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success to-accent"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Doubt Resolution Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Doubt Resolution
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {Math.round(
                      (stats.resolvedDoubts / stats.totalDoubts) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{
                      width: `${(stats.resolvedDoubts / stats.totalDoubts) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Active Course Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Active Courses
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {stats.totalCourses}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: stats.totalCourses }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 bg-gradient-to-r from-accent to-primary rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Lessons
                  </p>
                  <p className="text-2xl font-black text-foreground">145</p>
                </div>
                <div className="bg-accent/5 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Quizzes
                  </p>
                  <p className="text-2xl font-black text-foreground">38</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Engagement Over Time */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-foreground">
              Student Engagement Over Time
            </h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-80">
            <Line data={engagementData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h3 className="text-lg font-black text-foreground mb-6">
            Top Performing Students
          </h3>
          <div className="space-y-3">
            {[
              {
                name: "Alice Johnson",
                score: 95,
                course: "JavaScript",
                xp: 2450,
              },
              { name: "Bob Smith", score: 92, course: "React", xp: 2280 },
              { name: "Charlie Brown", score: 90, course: "Python", xp: 2150 },
              {
                name: "Diana Prince",
                score: 88,
                course: "Data Structures",
                xp: 2080,
              },
              {
                name: "Ethan Hunt",
                score: 85,
                course: "Machine Learning",
                xp: 1950,
              },
            ].map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {student.course}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-foreground">
                    {student.score}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.xp} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;
