import React, { useState } from "react";
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
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentMonitoring = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive, at-risk
  const [sortBy, setSortBy] = useState("name"); // name, progress, lastActive

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      studentId: "STU2024001",
      enrolledCourses: 3,
      completedCourses: 1,
      averageProgress: 85,
      averageScore: 88,
      totalQuizzes: 12,
      completedQuizzes: 10,
      lastActive: "2 hours ago",
      status: "active",
      trend: "up",
      attentionScore: 92,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      studentId: "STU2024002",
      enrolledCourses: 4,
      completedCourses: 2,
      averageProgress: 62,
      averageScore: 65,
      totalQuizzes: 15,
      completedQuizzes: 9,
      lastActive: "5 hours ago",
      status: "active",
      trend: "stable",
      attentionScore: 75,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      studentId: "STU2024003",
      enrolledCourses: 2,
      completedCourses: 0,
      averageProgress: 35,
      averageScore: 42,
      totalQuizzes: 8,
      completedQuizzes: 3,
      lastActive: "2 days ago",
      status: "at-risk",
      trend: "down",
      attentionScore: 48,
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.prince@example.com",
      studentId: "STU2024004",
      enrolledCourses: 5,
      completedCourses: 3,
      averageProgress: 92,
      averageScore: 95,
      totalQuizzes: 20,
      completedQuizzes: 19,
      lastActive: "30 min ago",
      status: "active",
      trend: "up",
      attentionScore: 98,
    },
    {
      id: 5,
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      studentId: "STU2024005",
      enrolledCourses: 3,
      completedCourses: 1,
      averageProgress: 58,
      averageScore: 61,
      totalQuizzes: 12,
      completedQuizzes: 7,
      lastActive: "1 day ago",
      status: "inactive",
      trend: "down",
      attentionScore: 55,
    },
    {
      id: 6,
      name: "Fiona Clark",
      email: "fiona.clark@example.com",
      studentId: "STU2024006",
      enrolledCourses: 2,
      completedCourses: 2,
      averageProgress: 100,
      averageScore: 97,
      totalQuizzes: 10,
      completedQuizzes: 10,
      lastActive: "1 hour ago",
      status: "active",
      trend: "up",
      attentionScore: 96,
    },
  ];

  // Filter students
  const filteredStudents = students
    .filter((student) => {
      // Filter by search query
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === "all" || student.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected criteria
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

  const handleExportData = () => {
    // Mock export functionality
    const csvContent = [
      ["Name", "Email", "Student ID", "Progress", "Score", "Status"].join(","),
      ...filteredStudents.map((s) =>
        [
          s.name,
          s.email,
          s.studentId,
          `${s.averageProgress}%`,
          `${s.averageScore}%`,
          s.status,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const atRiskStudents = students.filter((s) => s.status === "at-risk").length;
  const averageProgress =
    students.reduce((sum, s) => sum + s.averageProgress, 0) / students.length;

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
          <div className="flex flex-col sm:flex-row gap-4">
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
                className="pl-11 pr-8 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
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
                className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="lastActive">Sort by Activity</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportData}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Attention
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-foreground">
                        {student.studentId}
                      </p>
                    </td>

                    {/* Courses */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {student.completedCourses}/{student.enrolledCourses}
                        </span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${student.averageProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {student.averageProgress}%
                        </span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {student.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : student.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        ) : null}
                        <span className="text-sm font-bold text-foreground">
                          {student.averageScore}%
                        </span>
                      </div>
                    </td>

                    {/* Attention Score */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                          student.attentionScore >= 80
                            ? "bg-success/10 text-success"
                            : student.attentionScore >= 60
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {student.attentionScore}%
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-lg border text-xs font-bold ${getStatusColor(
                          student.status,
                        )}`}
                      >
                        {getStatusLabel(student.status)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(student.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                No students found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentMonitoring;
