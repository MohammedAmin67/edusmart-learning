import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Award,
  Clock,
  Filter,
  Search,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import notificationService from "../../services/notificationService";

const FacultyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, doubt, course_completion, etc.
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, filter, typeFilter, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by read/unread
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.read);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(query) ||
          n.userId?.name?.toLowerCase().includes(query) ||
          n.userId?.email?.toLowerCase().includes(query),
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationService.deleteNotification(notificationId);
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId),
        );
        toast.success("Notification deleted");
      } catch (error) {
        toast.error("Failed to delete notification");
      }
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return notifDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "doubt":
        return <MessageSquare className="w-5 h-5 text-warning" />;
      case "course_completion":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "student_progress":
        return <BookOpen className="w-5 h-5 text-primary" />;
      case "quiz_submission":
        return <Award className="w-5 h-5 text-accent" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "doubt":
        return "Doubt";
      case "course_completion":
        return "Course Completion";
      case "student_progress":
        return "Progress Update";
      case "quiz_submission":
        return "Quiz Submission";
      case "system":
        return "System";
      default:
        return type;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
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
            All Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up! 🎉"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {notifications.length}
            </h3>
            <p className="text-sm text-muted-foreground">Total</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-warning" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {unreadCount}
            </h3>
            <p className="text-sm text-muted-foreground">Unread</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {notifications.filter((n) => n.type === "doubt").length}
            </h3>
            <p className="text-sm text-muted-foreground">Doubts</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-1">
              {
                notifications.filter((n) => n.type === "course_completion")
                  .length
              }
            </h3>
            <p className="text-sm text-muted-foreground">Completions</p>
          </motion.div>
        </div>

        {/* Filters */}
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
                placeholder="Search notifications..."
                className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Read/Unread Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="doubt">Doubts</option>
              <option value="course_completion">Completions</option>
              <option value="student_progress">Progress</option>
              <option value="quiz_submission">Quizzes</option>
              <option value="system">System</option>
            </select>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark All Read
              </button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                No notifications found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery.trim()
                  ? "Try adjusting your search or filters"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  className={`p-6 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === "doubt"
                          ? "bg-warning/10"
                          : notification.type === "course_completion"
                            ? "bg-success/10"
                            : notification.type === "student_progress"
                              ? "bg-primary/10"
                              : notification.type === "quiz_submission"
                                ? "bg-accent/10"
                                : "bg-muted"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Student Avatar */}
                    {notification.userId?.avatar ? (
                      <img
                        src={notification.userId.avatar}
                        alt={notification.userId.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {notification.userId?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              {notification.userId?.name || "Unknown User"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.createdAt)}
                            </span>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold">
                              {getTypeLabel(notification.type)}
                            </span>
                            {!notification.read && (
                              <span className="px-2 py-0.5 bg-warning/10 text-warning rounded text-xs font-bold">
                                Unread
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="w-8 h-8 rounded-lg bg-success/10 hover:bg-success/20 flex items-center justify-center transition-all"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-success" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata */}
                      {notification.metadata &&
                        Object.keys(notification.metadata).length > 0 && (
                          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              {notification.metadata.lesson && (
                                <span>
                                  Lesson: {notification.metadata.lesson}
                                </span>
                              )}
                              {notification.metadata.score !== undefined && (
                                <span>
                                  {" "}
                                  • Score: {notification.metadata.score}%
                                </span>
                              )}
                              {notification.metadata.progress !== undefined && (
                                <span>
                                  {" "}
                                  • Progress: {notification.metadata.progress}%
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyNotifications;
