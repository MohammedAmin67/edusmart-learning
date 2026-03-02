import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Target,
  Brain,
  Trophy,
} from "lucide-react";

const FacultyDashboard = () => {
  // Mock data
  const stats = [
    {
      id: 1,
      label: "Total Students",
      value: "245",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "primary",
    },
    {
      id: 2,
      label: "Active Courses",
      value: "8",
      change: "+2",
      trend: "up",
      icon: BookOpen,
      color: "accent",
    },
    {
      id: 3,
      label: "Pending Doubts",
      value: "15",
      change: "-5",
      trend: "down",
      icon: MessageSquare,
      color: "warning",
    },
    {
      id: 4,
      label: "Avg. Performance",
      value: "78%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "success",
    },
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      course: "JavaScript Fundamentals",
      progress: 85,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Bob Smith",
      course: "React Development",
      progress: 62,
      lastActive: "5 hours ago",
      status: "active",
    },
    {
      id: 3,
      name: "Charlie Brown",
      course: "Python Basics",
      progress: 45,
      lastActive: "1 day ago",
      status: "inactive",
    },
    {
      id: 4,
      name: "Diana Prince",
      course: "Data Structures",
      progress: 92,
      lastActive: "30 min ago",
      status: "active",
    },
  ];

  const recentDoubts = [
    {
      id: 1,
      student: "John Doe",
      course: "JavaScript",
      question: "How does closure work in JavaScript?",
      time: "10 min ago",
      priority: "high",
    },
    {
      id: 2,
      student: "Jane Smith",
      course: "React",
      question: "What is the difference between useState and useReducer?",
      time: "1 hour ago",
      priority: "medium",
    },
    {
      id: 3,
      student: "Mike Wilson",
      course: "Python",
      question: "Explain list comprehension with examples",
      time: "3 hours ago",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor student progress and manage your courses
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      stat.trend === "up"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <motion.div
            className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground">
                Recent Students
              </h2>
              <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">
                      {student.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {student.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {student.lastActive}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-black text-foreground mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-between">
                <span>Add New Course</span>
                <BookOpen className="w-5 h-5" />
              </button>
              <button className="w-full px-4 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center justify-between">
                <span>View Analytics</span>
                <TrendingUp className="w-5 h-5" />
              </button>
              <button className="w-full px-4 py-3 bg-warning text-white rounded-xl font-bold hover:bg-warning/90 transition-all flex items-center justify-between">
                <span>Pending Doubts</span>
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Doubts */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">
              Recent Doubts
            </h2>
            <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentDoubts.map((doubt) => (
              <div
                key={doubt.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doubt.priority === "high"
                      ? "bg-destructive/10"
                      : doubt.priority === "medium"
                        ? "bg-warning/10"
                        : "bg-success/10"
                  }`}
                >
                  <MessageSquare
                    className={`w-5 h-5 ${
                      doubt.priority === "high"
                        ? "text-destructive"
                        : doubt.priority === "medium"
                          ? "text-warning"
                          : "text-success"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">
                      {doubt.student}
                    </h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                      {doubt.course}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {doubt.question}
                  </p>
                  <p className="text-xs text-muted-foreground">{doubt.time}</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                  Respond
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
