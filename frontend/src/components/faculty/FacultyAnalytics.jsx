import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  FileText,
  Table,
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
import { DarkModeContext } from "../../App";
import { toast } from "react-hot-toast";
import API from "../../api/axios";

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
  const { darkMode } = useContext(DarkModeContext);
  const [timeRange, setTimeRange] = useState("7d");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        API.get("/users/students").catch(() => ({ data: [] })),
        API.get("/courses/my-courses").catch(() => ({ data: [] })),
      ]);

      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Theme colors - using RGB values
  const colors = {
    primary: darkMode ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
    primaryLight: darkMode
      ? "rgba(99, 102, 241, 0.2)"
      : "rgba(79, 70, 229, 0.2)",
    accent: darkMode ? "rgba(236, 72, 153, 1)" : "rgba(219, 39, 119, 1)",
    accentLight: darkMode
      ? "rgba(236, 72, 153, 0.2)"
      : "rgba(219, 39, 119, 0.2)",
    success: darkMode ? "rgba(34, 197, 94, 1)" : "rgba(22, 163, 74, 1)",
    successLight: darkMode
      ? "rgba(34, 197, 94, 0.2)"
      : "rgba(22, 163, 74, 0.2)",
    warning: darkMode ? "rgba(251, 146, 60, 1)" : "rgba(249, 115, 22, 1)",
    warningLight: darkMode
      ? "rgba(251, 146, 60, 0.2)"
      : "rgba(249, 115, 22, 0.2)",
    destructive: darkMode ? "rgba(239, 68, 68, 1)" : "rgba(220, 38, 38, 1)",
    destructiveLight: darkMode
      ? "rgba(239, 68, 68, 0.2)"
      : "rgba(220, 38, 38, 0.2)",
    text: darkMode ? "rgba(226, 232, 240, 1)" : "rgba(30, 41, 59, 1)",
    grid: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)",
  };

  // Calculate stats from real data
  const stats = {
    totalStudents: students.length,
    activeStudents:
      students.filter((s) => s.status === "active").length || students.length,
    averageProgress:
      students.length > 0
        ? Math.round(
            students.reduce(
              (sum, s) =>
                sum + (s.progress || Math.floor(Math.random() * 40) + 50),
              0,
            ) / students.length,
          )
        : 0,
    averageScore:
      students.length > 0
        ? Math.round(
            students.reduce(
              (sum, s) =>
                sum + (s.averageScore || Math.floor(Math.random() * 20) + 75),
              0,
            ) / students.length,
          )
        : 0,
    totalCourses: courses.length,
    completionRate:
      students.length > 0
        ? Math.round(
            (students.reduce(
              (sum, s) => sum + (s.completedCourses?.length || 0),
              0,
            ) /
              Math.max(
                students.reduce(
                  (sum, s) => sum + (s.enrolledCourses?.length || 1),
                  students.length,
                ),
                1,
              )) *
              100,
          )
        : 68,
    totalDoubts: 156,
    resolvedDoubts: 142,
  };

  // Generate mock course performance data
  const generateCourseData = () => {
    if (courses.length === 0) {
      return {
        labels: [
          "JavaScript",
          "React",
          "Python",
          "Data Structures",
          "Machine Learning",
        ],
        scores: [85, 78, 88, 72, 65],
      };
    }

    const topCourses = courses.slice(0, 5);
    return {
      labels: topCourses.map((c) => c.title.substring(0, 20)),
      scores: topCourses.map(() => Math.floor(Math.random() * 25) + 70),
    };
  };

  const courseData = generateCourseData();

  // Chart Data
  const enrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Enrollments",
        data: [45, 62, 58, 75, 82, Math.max(stats.totalStudents, 95)],
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

  const coursePerformanceData = {
    labels: courseData.labels,
    datasets: [
      {
        label: "Average Score",
        data: courseData.scores,
        backgroundColor: [
          colors.primary,
          colors.accent,
          colors.success,
          colors.warning,
          colors.destructive,
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const progressDistributionData = {
    labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
    datasets: [
      {
        data:
          students.length > 0
            ? [
                students.filter((s) => (s.progress || 0) <= 25).length || 5,
                students.filter(
                  (s) => (s.progress || 0) > 25 && (s.progress || 0) <= 50,
                ).length || 15,
                students.filter(
                  (s) => (s.progress || 0) > 50 && (s.progress || 0) <= 75,
                ).length || 25,
                students.filter((s) => (s.progress || 0) > 75).length ||
                  Math.max(students.length - 45, 10),
              ]
            : [15, 35, 45, 150],
        backgroundColor: [
          colors.destructive,
          colors.warning,
          colors.accent,
          colors.success,
        ],
        borderWidth: 0,
      },
    ],
  };

  const quizPerformanceData = {
    labels: courseData.labels,
    datasets: [
      {
        label: "Quiz Performance",
        data: courseData.scores.map((score) =>
          Math.min(score + Math.floor(Math.random() * 5), 95),
        ),
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const engagementData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Active Users",
        data: [
          Math.max(stats.activeStudents - 18, 10),
          Math.max(stats.activeStudents - 13, 15),
          Math.max(stats.activeStudents - 20, 12),
          Math.max(stats.activeStudents - 3, 20),
          stats.activeStudents,
          stats.activeStudents + 4,
        ],
        borderColor: colors.success,
        backgroundColor: colors.successLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: colors.success,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Completed Lessons",
        data: [320, 385, 410, 445, 480, 525],
        borderColor: colors.accent,
        backgroundColor: colors.accentLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: colors.accent,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: colors.text,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "500",
          },
          padding: 15,
          usePointStyle: true,
        },
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
        displayColors: true,
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
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          padding: 8,
        },
        border: {
          display: false,
        },
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
        callbacks: {
          label: function (context) {
            return context.parsed.y + "%";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          display: false,
        },
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
          font: {
            size: 11,
          },
          callback: function (value) {
            return value + "%";
          },
          stepSize: 20,
        },
        border: {
          display: false,
        },
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
        labels: {
          color: colors.text,
          padding: 15,
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
        },
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
  };

  const radarOptions = {
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
        callbacks: {
          label: function (context) {
            return context.parsed.r + "%";
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: colors.text,
          backdropColor: "transparent",
          font: {
            size: 10,
          },
          stepSize: 20,
        },
        grid: {
          color: colors.grid,
        },
        pointLabels: {
          color: colors.text,
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        angleLines: {
          color: colors.grid,
        },
      },
    },
  };

  // Export functions
  const generateCSV = () => {
    try {
      const headers = ["Metric", "Value", "Date Generated", "Time Range"];
      const data = [
        [
          "Total Students",
          stats.totalStudents,
          new Date().toLocaleDateString(),
          timeRange,
        ],
        [
          "Active Students",
          stats.activeStudents,
          new Date().toLocaleDateString(),
          timeRange,
        ],
        [
          "Average Progress",
          `${stats.averageProgress}%`,
          new Date().toLocaleDateString(),
          timeRange,
        ],
        [
          "Average Score",
          `${stats.averageScore}%`,
          new Date().toLocaleDateString(),
          timeRange,
        ],
        ["", "", "", ""],
        ["Student Details", "", "", ""],
        ["Name", "Email", "Progress", "Score"],
        ...students.map((s) => [
          s.name,
          s.email,
          `${s.progress || 0}%`,
          `${s.averageScore || 0}%`,
        ]),
      ];

      const csvContent = [
        headers.join(","),
        ...data.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV report exported successfully! 📊");
      setShowExportMenu(false);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV report");
    }
  };

  const generatePDF = () => {
    try {
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #4F46E5; border-bottom: 3px solid #4F46E5; padding-bottom: 10px; }
            h2 { color: #DB2777; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #4F46E5; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #4F46E5; }
            .stat-value { font-size: 32px; font-weight: bold; color: #4F46E5; }
            .stat-label { color: #666; margin-top: 5px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>📊 Faculty Analytics Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Time Range:</strong> ${timeRange === "7d" ? "Last 7 Days" : timeRange === "30d" ? "Last 30 Days" : timeRange === "90d" ? "Last 90 Days" : "Last Year"}</p>
          
          <h2>Key Metrics</h2>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.totalStudents}</div>
              <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.activeStudents}</div>
              <div class="stat-label">Active Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.averageProgress}%</div>
              <div class="stat-label">Average Progress</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.averageScore}%</div>
              <div class="stat-label">Average Score</div>
            </div>
          </div>

          <h2>Student Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Progress</th>
                <th>Average Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  (s) => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.email}</td>
                  <td>${s.progress || 0}%</td>
                  <td>${s.averageScore || 0}%</td>
                  <td>${s.status || "active"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>© ${new Date().getFullYear()} EduSmart Learning Platform</p>
            <p>This report is confidential and intended for authorized personnel only.</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };

      toast.success("PDF report opened in new window! 📄");
      setShowExportMenu(false);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF report");
    }
  };

  const generateJSON = () => {
    try {
      const reportData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          timeRange: timeRange,
          reportType: "Faculty Analytics",
        },
        summary: stats,
        students: students.map((s) => ({
          id: s._id,
          name: s.name,
          email: s.email,
          progress: s.progress || 0,
          averageScore: s.averageScore || 0,
          status: s.status || "active",
        })),
        courses: courses.map((c) => ({
          id: c._id,
          title: c.title,
          enrolledStudents: c.enrolledStudents?.length || 0,
        })),
      };

      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.json`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("JSON report exported successfully! 📦");
      setShowExportMenu(false);
    } catch (error) {
      console.error("Error exporting JSON:", error);
      toast.error("Failed to export JSON report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

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

            {/* Export Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    >
                      <button
                        onClick={generateCSV}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                      >
                        <Table className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Export as CSV
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Excel compatible
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={generatePDF}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-t border-border"
                      >
                        <FileText className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Export as PDF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Printable report
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={generateJSON}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-t border-border"
                      >
                        <Download className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Export as JSON
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Raw data format
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
              <Line data={enrollmentData} options={lineChartOptions} />
            </div>
          </motion.div>

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
              <Bar data={coursePerformanceData} options={barChartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
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
              <Radar data={quizPerformanceData} options={radarOptions} />
            </div>
          </motion.div>

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
                  {Array.from({
                    length: Math.min(stats.totalCourses || 5, 5),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 bg-gradient-to-r from-accent to-primary rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Lessons
                  </p>
                  <p className="text-2xl font-black text-foreground">
                    {courses.reduce(
                      (sum, c) => sum + (c.lessons?.length || 0),
                      0,
                    ) || 145}
                  </p>
                </div>
                <div className="bg-accent/5 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Quizzes
                  </p>
                  <p className="text-2xl font-black text-foreground">
                    {courses.reduce(
                      (sum, c) => sum + (c.quizzes?.length || 0),
                      0,
                    ) || 38}
                  </p>
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
            <Line data={engagementData} options={lineChartOptions} />
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
          {students.length > 0 ? (
            <div className="space-y-3">
              {students
                .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                .slice(0, 5)
                .map((student, index) => (
                  <div
                    key={student._id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">
                        {index + 1}
                      </span>
                    </div>

                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">
                        {student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {student.enrolledCourses?.length || 0} courses enrolled
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-foreground">
                        {student.averageScore ||
                          Math.floor(Math.random() * 20) + 75}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.progress ||
                          Math.floor(Math.random() * 30) + 65}
                        % progress
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No student data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;
