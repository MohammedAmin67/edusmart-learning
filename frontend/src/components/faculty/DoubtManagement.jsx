import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  BookOpen,
  Eye,
  X,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";

const DoubtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch students and courses in parallel
      const [studentsRes, coursesRes] = await Promise.all([
        API.get("/users/students").catch(() => ({ data: [] })),
        API.get("/courses/my-courses").catch(() => ({ data: [] })),
      ]);

      const fetchedStudents = studentsRes.data || [];
      const fetchedCourses = coursesRes.data || [];

      setStudents(fetchedStudents);
      setCourses(fetchedCourses);

      // Generate mock doubts from actual students
      if (fetchedStudents.length > 0) {
        const mockDoubts = generateMockDoubts(fetchedStudents, fetchedCourses);
        setDoubts(mockDoubts);
      } else {
        setDoubts([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Generate mock doubts from real students and courses
  const generateMockDoubts = (studentsList, coursesList) => {
    const mockQuestions = [
      "How does closure work in JavaScript? Can you explain with an example?",
      "What is the difference between useState and useReducer? When should I use each?",
      "Can you explain list comprehension with multiple conditions?",
      "How do I handle errors in async/await? Is try-catch the only way?",
      "Why is componentWillMount deprecated? What should I use instead?",
      "What's the difference between null and undefined in JavaScript?",
      "How does React's virtual DOM work internally?",
      "Can you explain the concept of hoisting in JavaScript?",
      "What are the differences between let, const, and var?",
      "How do I optimize React component performance?",
    ];

    const mockLessons = [
      "Closures & Scope",
      "React Hooks",
      "List Comprehension",
      "Async/Await",
      "Component Lifecycle",
      "JavaScript Fundamentals",
      "Advanced React",
      "Python Basics",
      "ES6 Features",
      "Performance Optimization",
    ];

    const statuses = ["pending", "resolved"];
    const priorities = ["high", "medium", "low"];
    const timeStamps = [
      "10 min ago",
      "1 hour ago",
      "3 hours ago",
      "5 hours ago",
      "1 day ago",
      "2 days ago",
    ];
    const videoTimestamps = [
      "05:30",
      "12:45",
      "08:20",
      "15:10",
      "10:00",
      "18:30",
    ];

    // Generate doubts for each student (or up to 10 doubts)
    const generatedDoubts = [];
    const maxDoubts = Math.min(studentsList.length * 2, 10);

    for (let i = 0; i < maxDoubts; i++) {
      const student = studentsList[i % studentsList.length];
      const course =
        coursesList.length > 0
          ? coursesList[i % coursesList.length]
          : { title: "JavaScript Fundamentals" };

      const status =
        i < 3
          ? "pending"
          : statuses[Math.floor(Math.random() * statuses.length)];
      const priority =
        i < 2
          ? "high"
          : priorities[Math.floor(Math.random() * priorities.length)];

      const doubt = {
        id: i + 1,
        student: {
          name: student.name,
          email: student.email,
          studentId:
            student.studentId || `STU${String(i + 1).padStart(7, "0")}`,
          avatar: student.avatar,
        },
        course: course.title,
        lesson: mockLessons[i % mockLessons.length],
        question: mockQuestions[i % mockQuestions.length],
        timestamp: timeStamps[i % timeStamps.length],
        status: status,
        priority: priority,
        videoTimestamp: videoTimestamps[i % videoTimestamps.length],
        responses:
          status === "resolved"
            ? [
                {
                  id: 1,
                  from: "Faculty",
                  message: "Here's a detailed explanation of your query...",
                  timestamp: "2 hours ago",
                },
              ]
            : [],
      };

      generatedDoubts.push(doubt);
    }

    return generatedDoubts;
  };

  // Filter doubts
  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSearch =
      doubt.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.question.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || doubt.status === filterStatus;

    const matchesPriority =
      filterPriority === "all" || doubt.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "resolved":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleViewDoubt = (doubt) => {
    setSelectedDoubt(doubt);
    setShowResponseModal(true);
  };

  const handleSendResponse = () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    // Update doubt status to resolved
    setDoubts(
      doubts.map((d) =>
        d.id === selectedDoubt.id
          ? {
              ...d,
              status: "resolved",
              responses: [
                ...d.responses,
                {
                  id: Date.now(),
                  from: "Faculty",
                  message: response,
                  timestamp: "Just now",
                },
              ],
            }
          : d,
      ),
    );

    toast.success("Response sent successfully! ✅");
    setResponse("");
    setShowResponseModal(false);
    setSelectedDoubt(null);
  };

  const handleMarkAsResolved = (doubtId) => {
    setDoubts(
      doubts.map((d) => (d.id === doubtId ? { ...d, status: "resolved" } : d)),
    );
    toast.success("Marked as resolved! ✅");
  };

  // Summary stats
  const totalDoubts = doubts.length;
  const pendingDoubts = doubts.filter((d) => d.status === "pending").length;
  const resolvedDoubts = doubts.filter((d) => d.status === "resolved").length;
  const highPriorityDoubts = doubts.filter(
    (d) => d.priority === "high" && d.status === "pending",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading doubts...</p>
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
            Doubt Management
          </h1>
          <p className="text-muted-foreground">
            Respond to student queries and doubts
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {totalDoubts}
            </h3>
            <p className="text-sm text-muted-foreground">Total Doubts</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {pendingDoubts}
            </h3>
            <p className="text-sm text-muted-foreground">Pending</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {resolvedDoubts}
            </h3>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {highPriorityDoubts}
            </h3>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </motion.div>
        </div>

        {/* Search & Filters */}
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
                placeholder="Search by student, course, or question..."
                className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter by Status */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer pr-10"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Filter by Priority */}
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer pr-10"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Doubts List */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="divide-y divide-border">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt.id}
                className="p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Student Avatar */}
                  <div className="flex-shrink-0">
                    {doubt.student.avatar ? (
                      <img
                        src={doubt.student.avatar}
                        alt={doubt.student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {doubt.student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground">
                          {doubt.student.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {doubt.student.studentId}
                        </span>
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(
                            doubt.priority,
                          )}`}
                        >
                          {doubt.priority.toUpperCase()}
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(
                            doubt.status,
                          )}`}
                        >
                          {doubt.status === "pending" ? "Pending" : "Resolved"}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doubt.timestamp}
                      </span>
                    </div>

                    {/* Course & Lesson Info */}
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{doubt.course}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {doubt.lesson}
                      </span>
                      {doubt.videoTimestamp && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-primary font-semibold">
                            @ {doubt.videoTimestamp}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Question */}
                    <p className="text-sm text-foreground mb-4 leading-relaxed">
                      {doubt.question}
                    </p>

                    {/* Response Preview (if resolved) */}
                    {doubt.status === "resolved" &&
                      doubt.responses.length > 0 && (
                        <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border">
                          <p className="text-xs font-bold text-foreground mb-1">
                            Your Response:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doubt.responses[0].message}
                          </p>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDoubt(doubt)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {doubt.status === "pending"
                          ? "Respond"
                          : "View Details"}
                      </button>
                      {doubt.status === "pending" && (
                        <button
                          onClick={() => handleMarkAsResolved(doubt.id)}
                          className="px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-bold hover:bg-success/20 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${doubt.student.email}`)
                        }
                        className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDoubts.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                No doubts found
              </h3>
              <p className="text-sm text-muted-foreground">
                {students.length === 0
                  ? "No students enrolled yet"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedDoubt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-3xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 flex-1">
                  {selectedDoubt.student.avatar ? (
                    <img
                      src={selectedDoubt.student.avatar}
                      alt={selectedDoubt.student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">
                        {selectedDoubt.student.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-foreground mb-1">
                      {selectedDoubt.student.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="text-muted-foreground">
                        {selectedDoubt.student.email}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {selectedDoubt.course}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary font-semibold">
                        @ {selectedDoubt.videoTimestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Question */}
              <div className="bg-muted/50 rounded-xl p-6 mb-6">
                <p className="text-xs font-bold text-muted-foreground mb-2">
                  STUDENT QUESTION:
                </p>
                <p className="text-foreground leading-relaxed">
                  {selectedDoubt.question}
                </p>
              </div>

              {/* Previous Responses */}
              {selectedDoubt.responses.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-foreground mb-3">
                    Previous Responses:
                  </h4>
                  <div className="space-y-3">
                    {selectedDoubt.responses.map((res) => (
                      <div key={res.id} className="bg-primary/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary">
                            {res.from}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {res.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{res.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Input */}
              {selectedDoubt.status === "pending" && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response to help the student..."
                      className="w-full h-40 px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResponseModal(false)}
                      className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendResponse}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Response
                    </button>
                  </div>
                </>
              )}

              {/* Resolved Status */}
              {selectedDoubt.status === "resolved" && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-success">
                      This doubt has been resolved
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The student has been notified of your response
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoubtManagement;
