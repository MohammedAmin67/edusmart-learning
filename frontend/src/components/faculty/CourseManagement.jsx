import React, { useState } from "react";
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
  Eye,
  MoreVertical,
  Upload,
  X,
  Save,
  Video,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, draft
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    level: "beginner",
    thumbnail: null,
  });

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming",
      category: "Programming",
      level: "Beginner",
      duration: "8 weeks",
      lessons: 20,
      quizzes: 5,
      enrolledStudents: 145,
      completionRate: 78,
      averageScore: 82,
      status: "active",
      createdAt: "2024-01-15",
      thumbnail: null,
    },
    {
      id: 2,
      title: "React Development",
      description: "Master React.js for modern web applications",
      category: "Web Development",
      level: "Intermediate",
      duration: "10 weeks",
      lessons: 25,
      quizzes: 6,
      enrolledStudents: 98,
      completionRate: 65,
      averageScore: 79,
      status: "active",
      createdAt: "2024-01-20",
      thumbnail: null,
    },
    {
      id: 3,
      title: "Python Basics",
      description: "Introduction to Python programming",
      category: "Programming",
      level: "Beginner",
      duration: "6 weeks",
      lessons: 15,
      quizzes: 4,
      enrolledStudents: 210,
      completionRate: 85,
      averageScore: 88,
      status: "active",
      createdAt: "2024-02-01",
      thumbnail: null,
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      description: "Advanced DSA concepts and problem solving",
      category: "Computer Science",
      level: "Advanced",
      duration: "12 weeks",
      lessons: 30,
      quizzes: 8,
      enrolledStudents: 67,
      completionRate: 45,
      averageScore: 72,
      status: "active",
      createdAt: "2024-02-10",
      thumbnail: null,
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      description: "Introduction to ML concepts and applications",
      category: "AI/ML",
      level: "Intermediate",
      duration: "0 weeks",
      lessons: 0,
      quizzes: 0,
      enrolledStudents: 0,
      completionRate: 0,
      averageScore: 0,
      status: "draft",
      createdAt: "2024-03-01",
      thumbnail: null,
    },
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || course.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Mock add course (replace with API call)
    toast.success("Course created successfully! 🎉");
    setShowAddCourseModal(false);
    setNewCourse({
      title: "",
      description: "",
      category: "",
      duration: "",
      level: "beginner",
      thumbnail: null,
    });
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      // Mock delete (replace with API call)
      toast.success("Course deleted successfully!");
    }
  };

  const handleSaveEdit = () => {
    // Mock save (replace with API call)
    toast.success("Course updated successfully! ✅");
    setShowEditModal(false);
    setSelectedCourse(null);
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
              {courses.filter((c) => c.status === "active").length}
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
              {courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
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
              {Math.round(
                courses.reduce((sum, c) => sum + c.averageScore, 0) /
                  courses.filter((c) => c.status === "active").length,
              )}
              %
            </h3>
            <p className="text-sm text-muted-foreground">Avg. Score</p>
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
              key={course.id}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
                <Video className="w-12 h-12 text-white opacity-50" />
                <div className="absolute top-3 right-3">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      course.status === "active"
                        ? "bg-success text-white"
                        : "bg-warning text-white"
                    }`}
                  >
                    {course.status === "active" ? "Active" : "Draft"}
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
                      course.level,
                    )}`}
                  >
                    {course.level}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.enrolledStudents}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-semibold">
                      {course.lessons} lessons
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
                      {course.averageScore}% avg
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {course.status === "active" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Completion Rate</span>
                      <span className="font-bold">
                        {course.completionRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-success to-accent"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}

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
                    onClick={() => handleDeleteCourse(course.id)}
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
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Mobile Development">
                        Mobile Development
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Level
                    </label>
                    <select
                      value={newCourse.level}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, level: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
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

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
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
                {/* Similar form fields as Add Course Modal */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedCourse.title}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue={selectedCourse.description}
                    className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
