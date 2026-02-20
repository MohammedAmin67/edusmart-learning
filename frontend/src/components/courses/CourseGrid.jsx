import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Play,
  CheckCircle2,
  Users,
  Search,
  Zap,
  GraduationCap,
  Target,
  Trophy,
} from "lucide-react";
import { courses } from "../../data/mockData";

const CourseGrid = ({ setActiveTab, onSelectCourse }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Get all courses
  const allCourses = courses || [];
  const inProgressCourses = allCourses.filter(
    (c) => c.progress > 0 && c.progress < 100,
  );
  const completedCourses = allCourses.filter((c) => c.progress === 100);

  // Get unique categories
  const categories = ["all", ...new Set(allCourses.map((c) => c.category))];

  // Filter courses
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate total progress
  const calculateOverallProgress = () => {
    const totalProgress = allCourses.reduce((sum, c) => sum + c.progress, 0);
    return Math.round(totalProgress / allCourses.length);
  };

  // Get total study time
  const getTotalStudyTime = () => {
    return allCourses.reduce((sum, c) => sum + c.estimatedTime, 0);
  };

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
            My <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Continue your learning journey and explore new courses
          </p>
        </motion.div>

        {/* REDESIGNED Stats Overview Card */}
        <motion.div
          className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-2xl p-6 sm:p-8 border border-border shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">
                  Learning Overview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your course statistics at a glance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Courses */}
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Enrolled
                  </p>
                </div>
                <p className="text-3xl font-black text-foreground">
                  {allCourses.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total courses
                </p>
              </div>

              {/* In Progress */}
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-warning" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Active
                  </p>
                </div>
                <p className="text-3xl font-black text-foreground">
                  {inProgressCourses.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  In progress
                </p>
              </div>

              {/* Completed */}
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-success" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Completed
                  </p>
                </div>
                <p className="text-3xl font-black text-foreground">
                  {completedCourses.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Finished courses
                </p>
              </div>

              {/* Overall Progress */}
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-accent" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Progress
                  </p>
                </div>
                <p className="text-3xl font-black text-foreground">
                  {calculateOverallProgress()}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall completion
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-semibold">
                  Total Learning Progress
                </span>
                <span className="text-primary font-bold">
                  {calculateOverallProgress()}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateOverallProgress()}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{getTotalStudyTime()} hours of content</span>
                <span>
                  {completedCourses.length}/{allCourses.length} courses
                  completed
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "Beginner", "Intermediate", "Advanced"].map(
                    (difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          selectedDifficulty === difficulty
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredCourses.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {allCourses.length}
              </span>{" "}
              courses
            </div>
          </div>
        </motion.div>

        {/* Continue Learning Section */}
        {inProgressCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgressCourses.slice(0, 2).map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelectCourse={onSelectCourse}
                  index={index}
                  featured
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-black text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            All Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">
              No Courses Found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-md"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Course Card Component (same as before)
const CourseCard = ({ course, onSelectCourse, index, featured = false }) => {
  const difficultyConfig = {
    Beginner: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/30",
    },
    Intermediate: {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/30",
    },
    Advanced: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/30",
    },
  };

  const difficulty =
    difficultyConfig[course.difficulty] || difficultyConfig.Beginner;
  const isCompleted = course.progress === 100;
  const isInProgress = course.progress > 0 && course.progress < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={`bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer ${
        featured ? "ring-2 ring-primary/20" : ""
      }`}
      onClick={() => onSelectCourse(course.id)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-black text-foreground mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${difficulty.bg} ${difficulty.text}`}
          >
            {course.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            {course.category}
          </span>
          {featured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              In Progress
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{(course.studentsEnrolled / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(course.rating)
                    ? "text-warning fill-warning"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-foreground">
            {course.rating}
          </span>
        </div>

        {/* Progress Bar */}
        {course.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-semibold">
                Progress
              </span>
              <span className="font-bold text-foreground">
                {course.progress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  isCompleted
                    ? "bg-success"
                    : "bg-gradient-to-r from-primary to-accent"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isCompleted
              ? "bg-success text-white hover:bg-success/90"
              : isInProgress
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-foreground hover:bg-muted/80"
          } hover:scale-105 shadow-md`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Review Course
            </>
          ) : isInProgress ? (
            <>
              <Play className="w-5 h-5" />
              Continue Learning
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Course
            </>
          )}
        </button>

        {/* Instructor */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {course.instructor.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Instructor</p>
            <p className="text-sm font-semibold text-foreground">
              {course.instructor}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseGrid;
