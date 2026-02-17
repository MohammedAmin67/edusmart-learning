import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  useCallback,
} from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import AnalyticsCharts from "./components/analytics/AnalyticsCharts";
import LessonPlayer from "./components/learning/LessonPlayer";
import QuizSystem from "./components/learning/QuizSystem";
import Profile from "./components/profile/Profile";
import AchievementGallery from "./components/profile/AchievementGallery";
import CourseGrid from "./components/courses/CourseGrid";
import HomePage from "./components/home/HomePage";
import SettingsPanel from "./components/settings/SettingsPanel";
import SignUpPage from "./components/Auth/SignUpPage";
import LoginPage from "./components/Auth/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "./components/context/UserContext";

// Dark mode context
export const DarkModeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

function AppRoutes({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  selectedCourseId,
  setSelectedCourseId,
}) {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const location = useLocation();

  const AnimatedMain = ({ children }) => (
    <div className="w-full max-w-7xl mx-auto animate-fadeInUp">{children}</div>
  );

  const handleLearningTabClick = () => {
    if (selectedCourseId) {
      setActiveTab("learning");
    } else {
      setActiveTab("courses");
      toast.error("Please select a course to continue");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedCourseId={setSelectedCourseId}
          />
        );
      case "learning":
        if (!selectedCourseId) {
          return (
            <AnimatedMain>
              <div className="text-center text-lg py-20 px-6">
                <p className="text-muted-foreground">
                  Please select a course from{" "}
                  <span
                    className="text-primary font-semibold underline cursor-pointer hover:text-primary-dark transition-colors"
                    onClick={() => setActiveTab("courses")}
                  >
                    My Courses
                  </span>{" "}
                  or use the search bar.
                </p>
              </div>
            </AnimatedMain>
          );
        }
        return (
          <AnimatedMain>
            <LessonPlayer selectedCourseId={selectedCourseId} />
            <QuizSystem selectedCourseId={selectedCourseId} />
            <div className="mt-8 flex justify-center pb-8">
              <button
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => setActiveTab("courses")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to My Courses
              </button>
            </div>
          </AnimatedMain>
        );
      case "courses":
        return (
          <AnimatedMain>
            <CourseGrid
              setActiveTab={setActiveTab}
              onSelectCourse={(id) => {
                setSelectedCourseId(id);
                setActiveTab("learning");
              }}
            />
          </AnimatedMain>
        );
      case "analytics":
        return (
          <AnimatedMain>
            <AnalyticsCharts />
          </AnimatedMain>
        );
      case "achievements":
        return (
          <AnimatedMain>
            <AchievementGallery />
          </AnimatedMain>
        );
      case "profile":
        return (
          <AnimatedMain>
            <Profile />
          </AnimatedMain>
        );
      case "settings":
        return (
          <AnimatedMain>
            <SettingsPanel />
          </AnimatedMain>
        );
      default:
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedCourseId={setSelectedCourseId}
          />
        );
    }
  };

  // ---- Auth Handlers (context driven) ----
  const handleLogin = (userObj) => {
    setUser(userObj);
    navigate("/dashboard");
  };

  const handleSignUp = (userObj) => {
    setUser(userObj);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signup"
        element={
          <SignUpPage
            isLoggedIn={!!user}
            onBack={() => navigate(-1)}
            onSignUp={handleSignUp}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            isLoggedIn={!!user}
            onBack={() => navigate(-1)}
            onLogin={handleLogin}
            onGoToSignUp={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          !!user ? (
            <div className="min-h-screen bg-background transition-colors duration-300">
              <div className="flex min-h-screen">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  onLearningTabClick={handleLearningTabClick}
                />
                <div className="flex-1 flex flex-col min-h-screen">
                  <Header
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    setActiveTab={setActiveTab}
                    setSelectedCourseId={setSelectedCourseId}
                  />
                  <main className="flex-1 w-full">{renderContent()}</main>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Central dark mode state (init from localStorage or system)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/profile"))
      setActiveTab("profile");
    else if (location.pathname.startsWith("/dashboard/analytics"))
      setActiveTab("analytics");
    else if (location.pathname.startsWith("/dashboard/courses"))
      setActiveTab("courses");
    else if (location.pathname.startsWith("/dashboard/learning"))
      setActiveTab("learning");
    else if (location.pathname.startsWith("/dashboard/achievements"))
      setActiveTab("achievements");
    else if (location.pathname.startsWith("/dashboard/settings"))
      setActiveTab("settings");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Use useCallback to memoize toggleDarkMode function
  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const darkModeContextValue = useMemo(
    () => ({ darkMode, setDarkMode, toggleDarkMode }),
    [darkMode, toggleDarkMode],
  );

  return (
    <DarkModeContext.Provider value={darkModeContextValue}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "rounded-xl shadow-xl",
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
            padding: "16px",
            fontSize: "0.95rem",
            fontWeight: "500",
            boxShadow: "var(--shadow-lg)",
          },
          success: {
            duration: 3000,
            style: {
              background: "hsl(var(--success))",
              color: "hsl(var(--success-foreground))",
              border: "none",
              boxShadow: "var(--shadow-success-glow)",
            },
            iconTheme: {
              primary: "hsl(var(--success-foreground))",
              secondary: "hsl(var(--success))",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
              border: "none",
              boxShadow: "0 0 25px hsl(var(--destructive) / 0.3)",
            },
            iconTheme: {
              primary: "hsl(var(--destructive-foreground))",
              secondary: "hsl(var(--destructive))",
            },
          },
          loading: {
            style: {
              background: "hsl(var(--info))",
              color: "hsl(var(--info-foreground))",
              border: "none",
            },
            iconTheme: {
              primary: "hsl(var(--info-foreground))",
              secondary: "hsl(var(--info))",
            },
          },
        }}
      />
      <UserProvider>
        <AppRoutes
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
        />
      </UserProvider>
    </DarkModeContext.Provider>
  );
}

export default App;
