import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  GraduationCap,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";

const FacultySidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Stats",
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
      description: "Monitor Progress",
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      description: "Manage Courses",
    },
    {
      id: "doubts",
      label: "Doubts",
      icon: MessageSquare,
      description: "Student Queries",
      badge: 5,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Reports & Insights",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "My Information",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Preferences",
    },
  ];

  const handleLogout = () => {
    sessionStorage.setItem("loggedOut", "true");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully! 👋");
    navigate("/");
  };

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-card border-r border-border z-50 lg:z-auto flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: "280px" }}
        initial={false}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Header - Aligned with main header height */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Faculty</h2>
              <p className="text-xs text-muted-foreground">Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${isActive ? "text-white" : ""}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs truncate ${isActive ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.badge && (
                    <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-border">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default FacultySidebar;
