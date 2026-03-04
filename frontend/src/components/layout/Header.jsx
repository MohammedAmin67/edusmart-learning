import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Upload,
  Camera,
} from "lucide-react";
import { DarkModeContext } from "../../App";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = ({ onMenuToggle, setActiveTab, setSelectedCourseId }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "achievement",
      message: "You earned a new badge! 🏆",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "course",
      message: "New lesson available in React Development",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "system",
      message: "Your quiz results are ready",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock search - in production, this would search through courses
      toast.success(`Searching for: ${searchQuery}`);
      setActiveTab("courses");
      navigate("/dashboard/courses");
    }
  };

  const handleLogout = () => {
    // Mark as explicitly logged out
    sessionStorage.setItem("loggedOut", "true");

    // Clear user from context and localStorage
    setUser(null);
    localStorage.removeItem("user");

    // Clear remember me if it exists
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (!rememberedUser) {
      localStorage.removeItem(`lastLogin_${user?.email}`);
    }

    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;

        // Update user context
        const updatedUser = {
          ...user,
          avatar: base64String,
        };

        setUser(updatedUser);

        // Persist to localStorage
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
      <div className="flex items-center justify-between h-16 py-10 px-4 sm:px-6">
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
                placeholder="Search courses..."
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
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground">
                        Notifications
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        You have {unreadCount} unread notifications
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                            notif.unread ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notif.unread ? "bg-primary" : "bg-muted"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm text-foreground font-medium">
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border">
                      <button className="text-xs text-primary font-bold hover:underline w-full text-center">
                        View All Notifications
                      </button>
                    </div>
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
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "faculty" ? "Faculty" : "Student"}
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
                      {/* Upload Avatar */}
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
                          setActiveTab("profile");
                          navigate("/dashboard/profile");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveTab("settings");
                          navigate("/dashboard/settings");
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

export default Header;
