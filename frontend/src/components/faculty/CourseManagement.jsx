import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Clock,
  Award,
  X,
  Save,
  Video,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import courseService from "../../services/courseService";

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    difficulty: "Beginner",
    thumbnail: null,
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && course.isPublished) ||
      (filterStatus === "draft" && !course.isPublished);

    return matchesSearch && matchesStatus;
  });

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        difficulty: newCourse.difficulty,
        duration: newCourse.duration || "Self-paced",
      };

      await courseService.createCourse(courseData);
      toast.success("Course created successfully! 🎉");

      setShowAddCourseModal(false);
      setNewCourse({
        title: "",
        description: "",
        category: "",
        duration: "",
        difficulty: "Beginner",
        thumbnail: null,
      });

      // Refresh courses list
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.msg || "Failed to create course");
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.deleteCourse(courseId);
        toast.success("Course deleted successfully!");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error(error.msg || "Failed to delete course");
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedCourse) return;

    try {
      const updates = {
        title: selectedCourse.title,
        description: selectedCourse.description,
        category: selectedCourse.category,
        difficulty: selectedCourse.difficulty,
        duration: selectedCourse.duration,
      };

      await courseService.updateCourse(selectedCourse._id, updates);
      toast.success("Course updated successfully! ✅");

      setShowEditModal(false);
      setSelectedCourse(null);

      // Refresh courses list
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.msg || "Failed to update course");
    }
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-success/10 text-success border-success/20";
      case "intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
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
              Course Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage your courses
            </p>
          </div>
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {courses.length}
            </h3>
            <p className="text-sm text-muted-foreground">Total Courses</p>
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
              {courses.filter((c) => c.isPublished).length}
            </h3>
            <p className="text-sm text-muted-foreground">Active Courses</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {courses.reduce(
                (sum, c) => sum + (c.enrolledStudents?.length || 0),
                0,
              )}
            </h3>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
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
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Lessons</p>
          </motion.div>
        </div>

        {/* Search & Filter */}
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
                placeholder="Search courses..."
                className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-11 pr-8 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video className="w-12 h-12 text-white opacity-50" />
                )}
                <div className="absolute top-3 right-3">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      course.isPublished
                        ? "bg-success text-white"
                        : "bg-warning text-white"
                    }`}
                  >
                    {course.isPublished ? "Active" : "Draft"}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-foreground mb-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">
                    {course.category}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold border ${getLevelColor(
                      course.difficulty,
                    )}`}
                  >
                    {course.difficulty}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.lessons?.length || 0} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.quizzes?.length || 0} quizzes
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-bold hover:bg-destructive/20 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddCourseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-2xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-foreground">
                  Add New Course
                </h3>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Course Title */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    placeholder="e.g., JavaScript Fundamentals"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the course..."
                    className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Category & Level */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      value={newCourse.category}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">
                        Mobile Development
                      </option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Level
                    </label>
                    <select
                      value={newCourse.difficulty}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, duration: e.target.value })
                    }
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddCourseModal(false)}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCourse}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Create Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {showEditModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-2xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-foreground">
                  Edit Course
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedCourse.description}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        description: e.target.value,
                      })
                    }
                    className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCourse.category}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">
                        Mobile Development
                      </option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Level
                    </label>
                    <select
                      value={selectedCourse.difficulty}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.duration}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseManagement;
