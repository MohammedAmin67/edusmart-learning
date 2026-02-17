import React from "react";
import {
  Home,
  BookOpen,
  BarChart3,
  Trophy,
  User,
  Settings,
  PlayCircle,
  X,
  GraduationCap,
  Flame,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuVariants = {
  hidden: {
    x: -320,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.05,
    },
  },
  exit: {
    x: -320,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const StreakWidget = () => (
  <motion.div
    className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 relative overflow-hidden"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute inset-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-accent/40 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
        />
      ))}
    </div>

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-6 h-6 text-accent" />
        </motion.div>
        <motion.div
          className="text-2xl font-bold text-foreground"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          7
        </motion.div>
      </div>
      <div className="text-foreground font-bold text-sm mb-1">Day Streak!</div>
      <div className="text-muted-foreground text-xs">
        Keep the momentum going!
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "85%" }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </div>
  </motion.div>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, badge: null },
    { id: "learning", label: "Learning", icon: PlayCircle, badge: "3" },
    { id: "courses", label: "My Courses", icon: BookOpen, badge: null },
    { id: "analytics", label: "Analytics", icon: BarChart3, badge: "New" },
    { id: "achievements", label: "Achievements", icon: Trophy, badge: "2" },
    { id: "profile", label: "Profile", icon: User, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const showSidebar =
    typeof window === "undefined" || window.innerWidth >= 1024 ? true : isOpen;

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
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-72 sm:w-80 z-50 bg-card border-r border-border flex flex-col lg:sticky lg:top-0 lg:h-screen lg:z-auto"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button for mobile */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-secondary transition-colors lg:hidden z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>

            {/* Logo Section */}
            <div className="px-6 py-[18px] border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black gradient-text">EduSmart</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Learning Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu - With better spacing */}
            <nav className="flex-1 py-8 overflow-y-auto min-h-0">
              <div className="space-y-2 px-4">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      custom={i}
                      variants={itemVariants}
                      onClick={() => handleItemClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                        font-semibold text-sm transition-all duration-300 group
                        relative overflow-hidden
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                      `}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full"
                          layoutId="activeIndicator"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      <div className="flex items-center gap-3 relative z-10">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <span>{item.label}</span>
                      </div>

                      {/* Badges */}
                      {item.badge && (
                        <motion.div
                          className={`
                            px-2 py-0.5 rounded-full text-xs font-bold
                            ${
                              item.badge === "New"
                                ? "bg-success text-success-foreground"
                                : "bg-accent text-accent-foreground"
                            }
                          `}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.2 + i * 0.05,
                            type: "spring",
                            stiffness: 500,
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.badge}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Bottom Section */}
            <div className="flex-shrink-0 mt-auto">
              {/* Streak Widget */}
              <StreakWidget />

              {/* Bottom decoration */}
              <motion.div
                className="px-4 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
