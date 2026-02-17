import React from "react";
import { motion } from "framer-motion";
import ProgressOverview from "./ProgressOverview";
import ContinueLearning from "./ContinueLearning";
import { useUser } from "../context/UserContext";
import { courses } from "../../data/mockData";

const Dashboard = ({ setActiveTab, setSelectedCourseId }) => {
  const { user } = useUser();

  const handleViewProfile = () => {
    if (setActiveTab) {
      setActiveTab("profile");
    }
  };

  const handleCourseClick = (courseId) => {
    if (setSelectedCourseId) {
      setSelectedCourseId(courseId);
    }
    if (setActiveTab) {
      setActiveTab("learning");
    }
  };

  const handleViewAllCourses = () => {
    if (setActiveTab) {
      setActiveTab("courses");
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-18 pb-8 space-y-5 sm:space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-foreground">
            Welcome back,{" "}
            <span className="gradient-text">
              {user?.name?.split(" ")[0] || "Learner"}
            </span>
            !
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Let's continue your learning journey today
          </p>
        </motion.div>

        {/* Progress Overview */}
        <ProgressOverview onViewProfile={handleViewProfile} />

        {/* Continue Learning */}
        <ContinueLearning
          courses={courses}
          onCourseClick={handleCourseClick}
          onViewAll={handleViewAllCourses}
        />

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Explore Courses */}
          <motion.button
            onClick={handleViewAllCourses}
            className="group bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/30 transition-all duration-300 text-left hover:shadow-lg"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
              Explore Courses
            </h3>
            <p className="text-sm text-muted-foreground">
              Browse our catalog of tech courses
            </p>
          </motion.button>

          {/* View Achievements */}
          <motion.button
            onClick={() => setActiveTab && setActiveTab("achievements")}
            className="group bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-accent/30 transition-all duration-300 text-left hover:shadow-lg"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-accent/20 transition-colors">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground mb-1.5 sm:mb-2 group-hover:text-accent transition-colors">
              View Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Check your earned badges and rewards
            </p>
          </motion.button>

          {/* Analytics */}
          <motion.button
            onClick={() => setActiveTab && setActiveTab("analytics")}
            className="group bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-success/30 transition-all duration-300 text-left hover:shadow-lg sm:col-span-2 lg:col-span-1"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-success/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-success/20 transition-colors">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground mb-1.5 sm:mb-2 group-hover:text-success transition-colors">
              View Analytics
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your learning progress and stats
            </p>
          </motion.button>
        </motion.div>

        {/* Learning Tips */}
        <motion.div
          className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-5 sm:p-6 lg:p-8 border border-border relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-black text-foreground mb-2">
                  💡 Learning Tip of the Day
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Consistency is key! Try to maintain your daily streak by
                  completing at least one lesson per day. Even 15 minutes of
                  focused learning can make a significant difference over time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
