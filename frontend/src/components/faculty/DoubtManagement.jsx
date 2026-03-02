import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  BookOpen,
  Eye,
  X,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";

const DoubtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, resolved
  const [filterPriority, setFilterPriority] = useState("all"); // all, high, medium, low
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState("");

  // Mock doubts data
  const doubts = [
    {
      id: 1,
      student: {
        name: "John Doe",
        email: "john.doe@example.com",
        studentId: "STU2024001",
      },
      course: "JavaScript Fundamentals",
      lesson: "Closures & Scope",
      question:
        "How does closure work in JavaScript? Can you explain with an example?",
      timestamp: "10 min ago",
      status: "pending",
      priority: "high",
      videoTimestamp: "05:30",
      responses: [],
    },
    {
      id: 2,
      student: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        studentId: "STU2024002",
      },
      course: "React Development",
      lesson: "React Hooks",
      question:
        "What is the difference between useState and useReducer? When should I use each?",
      timestamp: "1 hour ago",
      status: "pending",
      priority: "medium",
      videoTimestamp: "12:45",
      responses: [],
    },
    {
      id: 3,
      student: {
        name: "Mike Wilson",
        email: "mike.wilson@example.com",
        studentId: "STU2024003",
      },
      course: "Python Basics",
      lesson: "List Comprehension",
      question: "Can you explain list comprehension with multiple conditions?",
      timestamp: "3 hours ago",
      status: "resolved",
      priority: "low",
      videoTimestamp: "08:20",
      responses: [
        {
          id: 1,
          from: "Dr. John Smith",
          message:
            "List comprehension with multiple conditions works like this: [x for x in range(10) if x % 2 == 0 if x > 5]",
          timestamp: "2 hours ago",
        },
      ],
    },
    {
      id: 4,
      student: {
        name: "Sarah Connor",
        email: "sarah.connor@example.com",
        studentId: "STU2024004",
      },
      course: "JavaScript Fundamentals",
      lesson: "Async/Await",
      question:
        "How do I handle errors in async/await? Is try-catch the only way?",
      timestamp: "5 hours ago",
      status: "resolved",
      priority: "high",
      videoTimestamp: "15:10",
      responses: [
        {
          id: 1,
          from: "Dr. John Smith",
          message:
            "You can use try-catch blocks or .catch() method. Both work well depending on your use case.",
          timestamp: "4 hours ago",
        },
      ],
    },
    {
      id: 5,
      student: {
        name: "Tom Hardy",
        email: "tom.hardy@example.com",
        studentId: "STU2024005",
      },
      course: "React Development",
      lesson: "Component Lifecycle",
      question:
        "Why is componentWillMount deprecated? What should I use instead?",
      timestamp: "1 day ago",
      status: "pending",
      priority: "medium",
      videoTimestamp: "10:00",
      responses: [],
    },
  ];

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

    // Mock send response (replace with API call)
    toast.success("Response sent successfully! ✅");
    setResponse("");
    setShowResponseModal(false);
    setSelectedDoubt(null);
  };

  const handleMarkAsResolved = (doubtId) => {
    // Mock mark as resolved (replace with API call)
    toast.success("Marked as resolved! ✅");
  };

  // Summary stats
  const totalDoubts = doubts.length;
  const pendingDoubts = doubts.filter((d) => d.status === "pending").length;
  const resolvedDoubts = doubts.filter((d) => d.status === "resolved").length;
  const highPriorityDoubts = doubts.filter(
    (d) => d.priority === "high" && d.status === "pending",
  ).length;

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
                  {/* Priority Indicator */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                Try adjusting your search or filter criteria
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
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-foreground mb-2">
                    Student Doubt
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      {selectedDoubt.student.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedDoubt.course}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-primary font-semibold">
                      @ {selectedDoubt.videoTimestamp}
                    </span>
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
