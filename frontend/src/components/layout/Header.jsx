import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Search,
  Menu,
  Sun,
  Moon,
  User,
  Settings as SettingsIcon,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import Avatar from "../shared/Avatar";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../App";
import { useUser } from "../context/UserContext";
import useLogout from "../../hooks/useLogout";
import { courses } from "../../data/mockData";

const Star = ({ className, size }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Header = ({ onMenuToggle, setActiveTab, setSelectedCourseId }) => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, setUser } = useUser();
  const logout = useLogout(setUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const dropdownRef = useRef();
  const avatarButtonRef = useRef();
  const searchInputRef = useRef();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Filtered course suggestions
  const filteredCourses = searchTerm
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setIsMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!showSuggestions || filteredCourses.length === 0) {
      setHighlightedIdx(-1);
      return;
    }
    const listener = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx((idx) =>
          Math.min(idx + 1, filteredCourses.length - 1),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx((idx) => Math.max(idx - 1, 0));
      } else if (e.key === "Enter" && highlightedIdx >= 0) {
        handleSelectCourse(filteredCourses[highlightedIdx]);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [showSuggestions, filteredCourses, highlightedIdx]);

  const handleSelectCourse = (course) => {
    setSearchTerm("");
    setShowSuggestions(false);
    setHighlightedIdx(-1);
    setIsMobileSearchOpen(false);

    if (setSelectedCourseId) setSelectedCourseId(course.id);
    if (setActiveTab) setActiveTab("learning");
  };

  useEffect(() => {
    const handleScroll = () => {
      controls.start({
        boxShadow:
          window.scrollY > 8
            ? "0 2px 12px 0 rgba(0,0,0,0.08)"
            : "0 0px 0px 0 rgba(0,0,0,0)",
        transition: { duration: 0.3 },
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  if (!user) {
    return (
      <header className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-xl font-black gradient-text">EduSmart</span>
          </div>
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-40 transition-colors duration-300"
      animate={controls}
      initial={{ boxShadow: "0 0px 0px 0 rgba(0,0,0,0)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-secondary hover:bg-muted transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </motion.button>

          {/* Desktop Search - NO LOGO */}
          <div className="hidden md:flex items-center relative">
            <div className="relative w-64 lg:w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground text-sm"
              />
              {showSuggestions && filteredCourses.length > 0 && (
                <ul className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredCourses.map((course, idx) => (
                    <li
                      key={course.id}
                      className={`cursor-pointer px-4 py-2.5 text-foreground hover:bg-muted transition ${
                        highlightedIdx === idx ? "bg-muted" : ""
                      }`}
                      onMouseDown={() => handleSelectCourse(course)}
                    >
                      <div className="font-medium text-sm">{course.title}</div>
                    </li>
                  ))}
                </ul>
              )}
              {showSuggestions &&
                searchTerm &&
                filteredCourses.length === 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl px-4 py-3 text-muted-foreground text-sm">
                    No courses found.
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Section - same as before */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden p-2 rounded-xl bg-secondary hover:bg-muted transition-all duration-300"
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              setShowSuggestions(true);
            }}
            aria-label="Search"
          >
            {isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* XP Badge */}
          <motion.div
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1.5 rounded-xl border border-primary/20 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Star className="text-accent" size={16} />
            <span className="font-bold text-foreground text-sm">
              {user?.totalXP ?? 0} XP
            </span>
          </motion.div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-secondary hover:bg-muted transition-all duration-300 hover:scale-105"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Menu */}
          <div className="relative flex items-center gap-2">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 rounded-xl hover:bg-secondary transition-all duration-300"
              onClick={() => setDropdownOpen((v) => !v)}
              ref={avatarButtonRef}
            >
              <Avatar
                user={user}
                size="sm"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border-2 border-primary/30 shadow-sm hover:border-primary transition-all duration-300"
              />
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="font-semibold text-foreground text-sm truncate">
                  {user?.name ?? "User"}
                </span>
                <span className="text-xs text-primary font-medium">
                  Level {user?.level ?? 0}
                </span>
              </div>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-bold text-foreground truncate">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    className="w-full px-4 py-2.5 text-left hover:bg-muted transition-colors flex items-center gap-3 text-foreground"
                    onClick={() => {
                      setDropdownOpen(false);
                      setActiveTab && setActiveTab("profile");
                    }}
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">Profile</span>
                  </button>
                  <button
                    className="w-full px-4 py-2.5 text-left hover:bg-muted transition-colors flex items-center gap-3 text-foreground"
                    onClick={() => {
                      setDropdownOpen(false);
                      setActiveTab && setActiveTab("settings");
                    }}
                  >
                    <SettingsIcon size={18} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>
                <div className="border-t border-border">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-destructive/10 transition-colors flex items-center gap-3 text-destructive font-semibold"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden px-4 pb-3 border-t border-border"
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground text-sm"
              autoFocus
            />
            {showSuggestions && filteredCourses.length > 0 && (
              <ul className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredCourses.map((course, idx) => (
                  <li
                    key={course.id}
                    className={`cursor-pointer px-4 py-2.5 text-foreground hover:bg-muted transition ${
                      highlightedIdx === idx ? "bg-muted" : ""
                    }`}
                    onMouseDown={() => handleSelectCourse(course)}
                  >
                    <div className="font-medium text-sm">{course.title}</div>
                  </li>
                ))}
              </ul>
            )}
            {showSuggestions && searchTerm && filteredCourses.length === 0 && (
              <div className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl px-4 py-3 text-muted-foreground text-sm">
                No courses found.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
