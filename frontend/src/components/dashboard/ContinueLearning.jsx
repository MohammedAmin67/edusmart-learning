import React from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Clock,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const ContinueLearning = ({ courses, onCourseClick, onViewAll }) => {
  const currentCourses = Array.isArray(courses)
    ? courses.filter((c) => c?.progress > 0 && c?.progress < 100).slice(0, 3)
    : [];

  if (currentCourses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-foreground">
            Continue Learning
          </h2>
        </div>
        <motion.div
          className="bg-card rounded-2xl p-12 border border-border text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            No courses in progress
          </h3>
          <p className="text-muted-foreground mb-6">
            Start a new course to begin your learning journey!
          </p>
          <button
            onClick={onViewAll}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-bold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            Browse Courses
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-3xl font-black text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Continue Learning
        </motion.h2>
        <motion.button
          onClick={onViewAll}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All Courses</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentCourses.map((course, index) => (
          <motion.div
            key={course.id}
            className="group bg-card rounded-2xl border border-border hover:border-primary/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => onCourseClick && onCourseClick(course.id)}
          >
            {/* Course Image */}
            <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/10 overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary/40" />
                </div>
              )}
              {/* Progress Badge */}
              <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                <span className="text-xs font-bold text-primary">
                  {Math.round(course.progress || 0)}% Complete
                </span>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <PlayCircle className="w-8 h-8 text-white fill-white" />
                </motion.div>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-5">
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
                Currently Learning
              </div>

              {/* Title */}
              <h3 className="text-lg font-black text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.duration || "2h 30m"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{course.lessons?.length || 12} lessons</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-primary">
                    {Math.round(course.progress || 0)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress || 0}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  />
                </div>
              </div>

              {/* Continue Button */}
              <button
                className="w-full mt-4 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onCourseClick && onCourseClick(course.id);
                }}
              >
                <PlayCircle size={16} />
                <span>Continue Learning</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
