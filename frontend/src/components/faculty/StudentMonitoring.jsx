import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  BookOpen,
  Target,
  Award,
  User,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../../api/axios";

const StudentMonitoring = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch all users with role 'student'
      const response = await API.get("/users/students");

      // If endpoint doesn't exist, fetch all users and filter
      if (!response.data) {
        throw new Error("No data received");
      }

      // Map API data to component format
      const studentsData = response.data.map((student) => ({
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone || "N/A",
        studentId:
          student.studentId || `STU${student._id.slice(-6).toUpperCase()}`,
        department: student.department || "Computer Science",
        semester: student.semester || "N/A",
        enrolledCourses: student.enrolledCourses?.length || 0,
        completedCourses: student.completedCourses?.length || 0,
        averageProgress: student.progress || 0,
        averageScore: student.averageScore || 0,
        totalQuizzes: student.totalQuizzes || 0,
        completedQuizzes: student.completedQuizzes || 0,
        lastActive: student.lastActive || "Unknown",
        status: student.status || "active",
        trend: student.trend || "stable",
        attentionScore: student.attentionScore || 0,
        enrolledDate: student.createdAt || new Date().toISOString(),
        avatar: student.avatar || null,
      }));

      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);

      // Don't show error toast, just use empty array
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || student.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "progress") {
        return b.averageProgress - a.averageProgress;
      } else if (sortBy === "lastActive") {
        return a.lastActive.localeCompare(b.lastActive);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "inactive":
        return "bg-warning/10 text-warning border-warning/20";
      case "at-risk":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "at-risk":
        return "At Risk";
      default:
        return "Unknown";
    }
  };

  const handleViewDetails = (studentId) => {
    navigate(`/faculty/students/${studentId}`);
  };

  const handleSendEmail = (student) => {
    window.location.href = `mailto:${student.email}`;
  };

  const handleSendMessage = (student) => {
    toast.success(`Opening message to ${student.name}`);
    navigate(`/faculty/doubts?student=${student.id}`);
  };

  const handleExportData = () => {
    try {
      const csvContent = [
        [
          "Name",
          "Email",
          "Student ID",
          "Department",
          "Progress",
          "Score",
          "Status",
          "Last Active",
        ].join(","),
        ...filteredStudents.map((s) =>
          [
            s.name,
            s.email,
            s.studentId,
            s.department,
            `${s.averageProgress}%`,
            `${s.averageScore}%`,
            s.status,
            s.lastActive,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_report_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("Report exported successfully! 📊");
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const atRiskStudents = students.filter((s) => s.status === "at-risk").length;
  const averageProgress =
    students.length > 0
      ? students.reduce((sum, s) => sum + s.averageProgress, 0) /
        students.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Student Monitoring
          </h1>
          <p className="text-muted-foreground">
            Track and monitor all student progress and performance
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {totalStudents}
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
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {activeStudents}
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
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {atRiskStudents}
            </h3>
            <p className="text-sm text-muted-foreground">At Risk</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {averageProgress.toFixed(0)}%
            </h3>
            <p className="text-sm text-muted-foreground">Avg. Progress</p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter by Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-11 pr-8 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="lastActive">Sort by Activity</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                title="Export CSV"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Students Grid View */}
        {filteredStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                {/* Student Header */}
                <div className="bg-gradient-to-r from-primary to-accent p-6 relative">
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1 rounded-lg border text-xs font-bold ${getStatusColor(
                        student.status,
                      )}`}
                    >
                      {getStatusLabel(student.status)}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-2xl font-black text-white">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-white mb-1 truncate">
                        {student.name}
                      </h3>
                      <p className="text-xs text-white/80 mb-1">
                        {student.studentId}
                      </p>
                      <p className="text-xs text-white/60">
                        {student.department}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Content */}
                <div className="p-6">
                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground truncate">
                        {student.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Active {student.lastActive}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Overall Progress
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {student.averageProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${student.averageProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Courses
                        </span>
                      </div>
                      <p className="text-lg font-black text-foreground">
                        {student.completedCourses}/{student.enrolledCourses}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-xs text-muted-foreground">
                          Score
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {student.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : student.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        ) : null}
                        <p className="text-lg font-black text-foreground">
                          {student.averageScore}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(student.id)}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleSendEmail(student)}
                      className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendMessage(student)}
                      className="px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-bold hover:bg-success/20 transition-all"
                      title="Send Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12 bg-card rounded-2xl border border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No students found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No students have enrolled yet"}
            </p>
            {!searchQuery && students.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Students will appear here once they sign up
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentMonitoring;
