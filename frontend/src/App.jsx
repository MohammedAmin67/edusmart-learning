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

export const DarkModeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function DashboardLayout({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  selectedCourseId,
  setSelectedCourseId,
}) {
  const navigate = useNavigate();

  const handleLearningTabClick = () => {
    if (selectedCourseId) {
      setActiveTab("learning");
      navigate("/dashboard/learning");
    } else {
      setActiveTab("courses");
      navigate("/dashboard/courses");
      toast.error("Please select a course to continue");
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ScrollToTop />
      <div className="flex min-h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            navigate(`/dashboard/${tab === "dashboard" ? "" : tab}`);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLearningTabClick={handleLearningTabClick}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              navigate(`/dashboard/${tab === "dashboard" ? "" : tab}`);
            }}
            setSelectedCourseId={setSelectedCourseId}
          />
          <main className="flex-1 w-full">
            <Routes>
              <Route
                index
                element={
                  <Dashboard
                    setActiveTab={(tab) => {
                      setActiveTab(tab);
                      navigate(`/dashboard/${tab === "dashboard" ? "" : tab}`);
                    }}
                    setSelectedCourseId={setSelectedCourseId}
                  />
                }
              />
              <Route
                path="learning"
                element={
                  selectedCourseId ? (
                    <div className="w-full max-w-7xl mx-auto animate-fadeInUp">
                      <LessonPlayer selectedCourseId={selectedCourseId} />
                      <div className="mt-4 lg:mt-4">
                        <QuizSystem
                          selectedCourseId={selectedCourseId}
                          setActiveTab={setActiveTab}
                          onContinue={() => {
                            setActiveTab("courses");
                            navigate("/dashboard/courses");
                          }}
                        />
                      </div>
                      <div className="mt-4 lg:mt-4 flex justify-center pb-8">
                        <button
                          className="btn-primary inline-flex items-center gap-2"
                          onClick={() => {
                            setActiveTab("courses");
                            navigate("/dashboard/courses");
                          }}
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
                    </div>
                  ) : (
                    <div className="w-full max-w-7xl mx-auto animate-fadeInUp">
                      <div className="text-center text-lg py-20 px-6">
                        <p className="text-muted-foreground">
                          Please select a course from{" "}
                          <span
                            className="text-primary font-semibold underline cursor-pointer hover:text-primary-dark transition-colors"
                            onClick={() => {
                              setActiveTab("courses");
                              navigate("/dashboard/courses");
                            }}
                          >
                            My Courses
                          </span>{" "}
                          or use the search bar.
                        </p>
                      </div>
                    </div>
                  )
                }
              />
              <Route
                path="courses"
                element={
                  <div className="w-full max-w-7xl mx-auto animate-fadeInUp">
                    <CourseGrid
                      setActiveTab={(tab) => {
                        setActiveTab(tab);
                        navigate(
                          `/dashboard/${tab === "dashboard" ? "" : tab}`,
                        );
                      }}
                      onSelectCourse={(id) => {
                        setSelectedCourseId(id);
                        setActiveTab("learning");
                        navigate("/dashboard/learning");
                      }}
                    />
                  </div>
                }
              />
              <Route
                path="analytics"
                element={
                  <div className="w-full max-w-7xl mx-auto animate-fadeInUp">
                    <AnalyticsCharts />
                  </div>
                }
              />
              <Route
                path="achievements"
                element={
                  <div className="w-full max-w-7xl mx-auto animate-fadeInUp">
                    <AchievementGallery />
                  </div>
                }
              />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<SettingsPanel />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

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

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") {
      setActiveTab("dashboard");
    } else if (path.startsWith("/dashboard/profile")) {
      setActiveTab("profile");
    } else if (path.startsWith("/dashboard/analytics")) {
      setActiveTab("analytics");
    } else if (path.startsWith("/dashboard/courses")) {
      setActiveTab("courses");
    } else if (path.startsWith("/dashboard/learning")) {
      setActiveTab("learning");
    } else if (path.startsWith("/dashboard/achievements")) {
      setActiveTab("achievements");
    } else if (path.startsWith("/dashboard/settings")) {
      setActiveTab("settings");
    }
  }, [location.pathname, setActiveTab]);

  // Auth Handlers
  const handleLogin = (userObj) => {
    setUser(userObj);
    navigate("/dashboard");
  };

  const handleSignUp = (userObj) => {
    setUser(userObj);
    navigate("/dashboard");
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
            <DashboardLayout
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Central dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

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
