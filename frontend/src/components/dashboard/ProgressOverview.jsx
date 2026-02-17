import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  Target,
  Flame,
  BookOpen,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Avatar from "../shared/Avatar";
import { useUser } from "../context/UserContext";

// XP Bar uses SAME formula as Profile.jsx for consistency
const getProgressPercent = (user) =>
  Math.min(
    100,
    Math.round(
      ((user?.totalXP ?? 0) /
        ((user?.totalXP ?? 0) + (user?.xpToNextLevel ?? 1))) *
        100,
    ),
  );

const ProgressOverview = ({ onViewProfile }) => {
  const { user } = useUser();

  if (!user) return null;

  // Use the same calculation as Profile.jsx
  const progressPercent = getProgressPercent(user);

  const stats = [
    { icon: BookOpen, label: "Lessons", value: "45", color: "text-primary" },
    { icon: Award, label: "Courses", value: "3", color: "text-accent" },
    { icon: Target, label: "Accuracy", value: "87%", color: "text-success" },
    { icon: Flame, label: "Streak", value: "7d", color: "text-accent" },
  ];

  const quickStats = [
    { icon: Clock, label: "1250 min total", value: "Study Time" },
    { icon: Award, label: "4 achievements unlocked", value: "Achievements" },
    { icon: BookOpen, label: "3 courses completed", value: "Courses" },
    { icon: Flame, label: "Best streak: 7 days", value: "Streak" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-3xl font-black text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Progress Overview
        </motion.h2>
        <motion.button
          onClick={onViewProfile}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View Profile</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* Main Card */}
      <motion.div
        className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-2xl p-5 sm:p-6 border border-border shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-4">
          {/* User Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  user={user}
                  size="lg"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-primary/30 shadow-lg"
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-4 border-card"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground font-semibold">
                  Level {user.level}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-2xl font-black text-foreground">
                  {user.totalXP}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                XP: {user.totalXP}
              </span>
              <span className="text-xs text-primary font-semibold">
                Rank: Pro
              </span>
            </div>
          </div>

          {/* XP Progress Bar - SAME CALCULATION AS PROFILE */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-semibold">
                {user.totalXP} XP
              </span>
              <span className="text-primary font-bold">
                {user.xpToNextLevel} XP to next level
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center justify-center p-4 bg-card rounded-xl border border-border shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                <p className="text-2xl font-black text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Today's Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Today Card */}
            <motion.div
              className="bg-primary/10 rounded-xl p-5 border border-primary/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    Today
                  </h4>
                  <p className="text-sm text-muted-foreground">2 lessons</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">35 XP</p>
                  <p className="text-xs text-muted-foreground">25 min</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-accent font-bold">Streak: 7 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground font-semibold">
                    Weekly Goal: 180/300 XP
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Next Achievement Card */}
            <motion.div
              className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-5 border border-accent/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-accent mb-1">
                    Next Achievement
                  </h4>
                  <p className="text-lg font-black text-foreground mb-2">
                    Streaker
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Maintain a 7-day learning streak.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">
                        5/7 (71%) to unlock
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accent/70 w-[71%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;
