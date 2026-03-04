import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Save,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { DarkModeContext } from "../../App";

const FacultySettings = () => {
  const { user } = useUser();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState("security");

  // Security State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    doubtAlerts: true,
    studentProgress: true,
    courseUpdates: false,
    weeklyReports: true,
    systemUpdates: false,
    newEnrollments: true,
    quizSubmissions: true,
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    weekStart: "monday",
  });

  const tabs = [
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Password & authentication",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email & push alerts",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Globe,
      description: "Language & timezone",
    },
  ];

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Mock password change (replace with API call)
    toast.success("Password changed successfully! 🔒");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationUpdate = () => {
    // Mock update (replace with API call)
    toast.success("Notification preferences updated! 🔔");
  };

  const handlePreferencesUpdate = () => {
    // Mock update (replace with API call)
    toast.success("Preferences updated! ⚙️");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account security and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            className="lg:col-span-3 space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-primary text-white shadow-lg"
                      : "bg-card border border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isActive ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold mb-0.5 ${
                        isActive ? "text-white" : "text-foreground"
                      }`}
                    >
                      {tab.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="lg:col-span-9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Change Password Card */}
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground">
                          Change Password
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Update your password to keep your account secure
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                            className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                            className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Must be at least 6 characters
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                            className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-6"
                      >
                        <Shield className="w-5 h-5" />
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-foreground mb-1">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          Disabled
                        </span>
                        <button className="w-12 h-6 rounded-full bg-muted relative">
                          <div className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 left-0.5 transition-transform"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-foreground">
                          Active Sessions
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your active login sessions
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Current Session
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Windows • Chrome • 192.168.1.1
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-xs font-bold">
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-foreground">
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose what notifications you want to receive
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">
                          Email Notifications
                        </h3>
                      </div>
                      <div className="space-y-3 pl-8">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email Notifications",
                            desc: "Receive notifications via email",
                          },
                          {
                            key: "weeklyReports",
                            label: "Weekly Reports",
                            desc: "Get weekly analytics and summary",
                          },
                          {
                            key: "systemUpdates",
                            label: "System Updates",
                            desc: "Updates about platform features",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: !notifications[item.key],
                                })
                              }
                              className={`w-12 h-6 rounded-full transition-all relative ${
                                notifications[item.key]
                                  ? "bg-success"
                                  : "bg-muted"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                                  notifications[item.key]
                                    ? "translate-x-6"
                                    : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Student Activity */}
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-5 h-5 text-accent" />
                        <h3 className="font-bold text-foreground">
                          Student Activity
                        </h3>
                      </div>
                      <div className="space-y-3 pl-8">
                        {[
                          {
                            key: "doubtAlerts",
                            label: "Doubt Alerts",
                            desc: "When students raise doubts",
                          },
                          {
                            key: "studentProgress",
                            label: "Progress Updates",
                            desc: "Track student progress milestones",
                          },
                          {
                            key: "newEnrollments",
                            label: "New Enrollments",
                            desc: "Students enrolling in your courses",
                          },
                          {
                            key: "quizSubmissions",
                            label: "Quiz Submissions",
                            desc: "When students complete quizzes",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: !notifications[item.key],
                                })
                              }
                              className={`w-12 h-6 rounded-full transition-all relative ${
                                notifications[item.key]
                                  ? "bg-success"
                                  : "bg-muted"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                                  notifications[item.key]
                                    ? "translate-x-6"
                                    : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleNotificationUpdate}
                      className="w-full px-6 py-3 bg-warning text-white rounded-xl font-bold hover:bg-warning/90 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Appearance */}
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sun className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground">
                          Appearance
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Customize how EduSmart looks for you
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Dark Mode */}
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          {darkMode ? (
                            <Moon className="w-5 h-5 text-primary" />
                          ) : (
                            <Sun className="w-5 h-5 text-warning" />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Dark Mode
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Switch between light and dark theme
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            darkMode ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform flex items-center justify-center ${
                              darkMode ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          >
                            {darkMode ? (
                              <Moon className="w-3 h-3 text-primary" />
                            ) : (
                              <Sun className="w-3 h-3 text-warning" />
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Regional Settings */}
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground">
                          Regional Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Language, timezone, and date formats
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Language */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="hi">Hindi</option>
                        </select>
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Timezone
                        </label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              timezone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC-6">Central Time (UTC-6)</option>
                          <option value="UTC-7">Mountain Time (UTC-7)</option>
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC+5:30">
                            India Standard Time (UTC+5:30)
                          </option>
                        </select>
                      </div>

                      {/* Date Format */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Date Format
                        </label>
                        <select
                          value={preferences.dateFormat}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              dateFormat: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      {/* Week Start */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Week Starts On
                        </label>
                        <select
                          value={preferences.weekStart}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              weekStart: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="sunday">Sunday</option>
                          <option value="monday">Monday</option>
                        </select>
                      </div>

                      <button
                        onClick={handlePreferencesUpdate}
                        className="w-full px-6 py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all flex items-center justify-center gap-2 mt-6"
                      >
                        <Save className="w-5 h-5" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FacultySettings;
