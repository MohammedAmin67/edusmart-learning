import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import { useUser } from "../context/UserContext";

const AnalyticsCharts = () => {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

  // Mock data for charts
  const weeklyData = [
    { name: "Mon", xp: 120, lessons: 3, time: 45 },
    { name: "Tue", xp: 180, lessons: 5, time: 68 },
    { name: "Wed", xp: 150, lessons: 4, time: 52 },
    { name: "Thu", xp: 220, lessons: 6, time: 85 },
    { name: "Fri", xp: 190, lessons: 5, time: 71 },
    { name: "Sat", xp: 280, lessons: 8, time: 120 },
    { name: "Sun", xp: 160, lessons: 4, time: 60 },
  ];

  const courseProgress = [
    { name: "JavaScript", value: 85, color: "hsl(var(--primary))" },
    { name: "React", value: 65, color: "hsl(var(--accent))" },
    { name: "Node.js", value: 45, color: "hsl(var(--success))" },
    { name: "TypeScript", value: 30, color: "hsl(var(--warning))" },
  ];

  const skillsData = [
    { subject: "Frontend", A: 85, fullMark: 100 },
    { subject: "Backend", A: 70, fullMark: 100 },
    { subject: "Database", A: 60, fullMark: 100 },
    { subject: "DevOps", A: 45, fullMark: 100 },
    { subject: "Testing", A: 75, fullMark: 100 },
    { subject: "Design", A: 55, fullMark: 100 },
  ];

  const stats = [
    {
      icon: TrendingUp,
      label: "Total XP",
      value: user?.totalXP || 2850,
      change: "+12%",
      changePositive: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "Study Time",
      value: "42.5h",
      change: "+8%",
      changePositive: true,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: "87%",
      change: "+3%",
      changePositive: true,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Award,
      label: "Completed",
      value: "24",
      change: "+5",
      changePositive: true,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const timeRanges = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
            Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Track your learning progress and performance
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                timeRange === range.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {range.label}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.changePositive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* XP Progress Chart */}
          <motion.div
            className="bg-card rounded-2xl p-5 sm:p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  XP Progress
                </h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Study Time Chart */}
          <motion.div
            className="bg-card rounded-2xl p-5 sm:p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Study Time
                </h3>
                <p className="text-xs text-muted-foreground">Minutes per day</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="time"
                  fill="hsl(var(--accent))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Course Distribution */}
          <motion.div
            className="bg-card rounded-2xl p-5 sm:p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Course Progress
                </h3>
                <p className="text-xs text-muted-foreground">Completion rate</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseProgress}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skills Radar */}
          <motion.div
            className="bg-card rounded-2xl p-5 sm:p-6 lg:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Skills Overview
                </h3>
                <p className="text-xs text-muted-foreground">
                  Proficiency levels
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <PolarRadiusAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "10px" }}
                />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights Card */}
        <motion.div
          className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-6 sm:p-8 border border-border relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3">
                  📊 Weekly Insights
                </h3>
                <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <p>
                    ✨ You've earned{" "}
                    <span className="font-bold text-primary">280 XP</span> this
                    week - your best yet!
                  </p>
                  <p>
                    🔥 Your{" "}
                    <span className="font-bold text-accent">7-day streak</span>{" "}
                    is keeping you in the top 10%
                  </p>
                  <p>
                    📈 Study time increased by{" "}
                    <span className="font-bold text-success">15%</span> compared
                    to last week
                  </p>
                  <p>
                    🎯 You're on track to complete{" "}
                    <span className="font-bold text-warning">3 courses</span>{" "}
                    this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
