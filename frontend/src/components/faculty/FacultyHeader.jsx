import React, { useState, useRef, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Camera,
  X,
} from "lucide-react";
import { DarkModeContext } from "../../App";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import notificationService from "../../services/notificationService";

const FacultyHeader = ({ onMenuToggle, setActiveTab }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  // ✅ Real notifications from backend
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    if (user?.role === "faculty") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Don't show error toast to avoid annoying users
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await notificationService.markAsRead(notification._id);
        await fetchNotifications(); // Refresh
      }

      // Navigate based on type
      setShowNotifications(false);
      switch (notification.type) {
        case "doubt":
          setActiveTab("doubts");
          navigate("/faculty/doubts");
          break;
        case "course_completion":
        case "student_progress":
          setActiveTab("students");
          navigate("/faculty/students");
          break;
        case "quiz_submission":
          setActiveTab("analytics");
          navigate("/faculty/analytics");
          break;
        default:
          setActiveTab("dashboard");
          navigate("/faculty/dashboard");
      }
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
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
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      setActiveTab("students");
      navigate("/faculty/students");
    }
  };

  const handleLogout = () => {
    sessionStorage.setItem("loggedOut", "true");
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedUser = { ...user, avatar: base64String };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile picture updated! 🎉");
        setShowProfileMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-sm bg-card/95">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, courses..."
                className="w-64 lg:w-80 pl-11 pr-4 py-2 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <button
            onClick={() => setSearchQuery("")}
            className="sm:hidden w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    className="fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          Notifications
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {unreadCount > 0
                            ? `${unreadCount} unread`
                            : "All caught up!"}
                        </p>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="p-8 text-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Loading...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                              !notif.read ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Student Avatar */}
                              {notif.userId?.avatar ? (
                                <img
                                  src={notif.userId.avatar}
                                  alt={notif.userId.name}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm font-bold text-white">
                                    {notif.userId?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                              )}

                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground font-medium leading-tight mb-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTimestamp(notif.createdAt)}
                                </p>
                              </div>

                              {/* Unread Indicator */}
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            setActiveTab("notifications");
                            navigate("/faculty/notifications");
                          }}
                          className="text-xs text-primary font-bold hover:underline w-full text-center"
                        >
                          View All Activity
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0) || "F"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-foreground">
                  {user?.name || "Faculty"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.department || "Department"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Profile Menu Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <motion.div
                    className="fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-bold text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={triggerFileUpload}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                      >
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          Change Photo
                        </span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveTab("settings");
                          navigate("/faculty/settings");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          Settings
                        </span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FacultyHeader;
