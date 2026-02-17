import React, { useState, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  User,
  Mail,
  Shield,
  Smartphone,
  Volume2,
  Eye,
  Trash2,
  Download,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { DarkModeContext } from "../../App";

const SettingsPanel = () => {
  const { user } = useUser();
  const darkModeContext = useContext(DarkModeContext);

  // Safely extract values with fallbacks
  const darkMode = darkModeContext?.darkMode ?? false;
  const toggleDarkMode = darkModeContext?.toggleDarkMode ?? (() => {});

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    achievementAlerts: true,
    courseUpdates: false,
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
    language: "en",
    autoPlayVideos: true,
    soundEffects: true,
    animations: true,
    twoFactorAuth: false,
  });

  // IMPORTANT: Use state that persists across re-renders
  const [activeSection, setActiveSection] = useState("notifications");

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSelect = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const sections = useMemo(
    () => [
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy", icon: Shield },
      { id: "preferences", label: "Preferences", icon: Globe },
      { id: "account", label: "Account", icon: User },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
            Settings <span className="gradient-text">& Preferences</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Customize your learning experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 border border-border shadow-lg space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-lg space-y-6">
              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">
                      Notification Settings
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <ToggleSetting
                      icon={Mail}
                      title="Email Notifications"
                      description="Receive updates via email"
                      value={settings.emailNotifications}
                      onChange={() => handleToggle("emailNotifications")}
                    />
                    <ToggleSetting
                      icon={Smartphone}
                      title="Push Notifications"
                      description="Get notified on your device"
                      value={settings.pushNotifications}
                      onChange={() => handleToggle("pushNotifications")}
                    />
                    <ToggleSetting
                      icon={Mail}
                      title="Weekly Progress Report"
                      description="Summary every Monday"
                      value={settings.weeklyReport}
                      onChange={() => handleToggle("weeklyReport")}
                    />
                    <ToggleSetting
                      icon={Bell}
                      title="Achievement Alerts"
                      description="Get notified of new badges"
                      value={settings.achievementAlerts}
                      onChange={() => handleToggle("achievementAlerts")}
                    />
                    <ToggleSetting
                      icon={Bell}
                      title="Course Updates"
                      description="New lessons and content"
                      value={settings.courseUpdates}
                      onChange={() => handleToggle("courseUpdates")}
                    />
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">
                      Privacy Settings
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Eye className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Profile Visibility
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Who can see your profile
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["public", "friends", "private"].map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              handleSelect("profileVisibility", option)
                            }
                            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                              settings.profileVisibility === option
                                ? "bg-accent text-accent-foreground"
                                : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ToggleSetting
                      icon={Eye}
                      title="Show Progress"
                      description="Display your learning progress"
                      value={settings.showProgress}
                      onChange={() => handleToggle("showProgress")}
                    />
                    <ToggleSetting
                      icon={Eye}
                      title="Show Achievements"
                      description="Display your badges"
                      value={settings.showAchievements}
                      onChange={() => handleToggle("showAchievements")}
                    />
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === "preferences" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-success" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">
                      Preferences
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        {darkMode ? (
                          <Moon className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Sun className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">
                            Dark Mode
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Toggle dark theme
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDarkMode();
                        }}
                        className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}
                      >
                        <motion.div
                          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                          animate={{ left: darkMode ? 32 : 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          {darkMode ? (
                            <Moon className="w-3 h-3 text-primary" />
                          ) : (
                            <Sun className="w-3 h-3 text-muted" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <ToggleSetting
                      icon={Smartphone}
                      title="Auto-play Videos"
                      description="Videos start automatically"
                      value={settings.autoPlayVideos}
                      onChange={() => handleToggle("autoPlayVideos")}
                    />
                    <ToggleSetting
                      icon={Volume2}
                      title="Sound Effects"
                      description="Enable audio feedback"
                      value={settings.soundEffects}
                      onChange={() => handleToggle("soundEffects")}
                    />
                    <ToggleSetting
                      icon={Smartphone}
                      title="Animations"
                      description="Enable UI animations"
                      value={settings.animations}
                      onChange={() => handleToggle("animations")}
                    />
                    <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Language
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Select your language
                          </p>
                        </div>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleSelect("language", e.target.value)
                        }
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none text-foreground"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Section */}
              {activeSection === "account" && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-warning" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">
                      Account Settings
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <ToggleSetting
                      icon={Lock}
                      title="Two-Factor Authentication"
                      description="Extra security for your account"
                      value={settings.twoFactorAuth}
                      onChange={() => handleToggle("twoFactorAuth")}
                    />
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Export Data
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Download your learning data
                          </p>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-left border border-destructive/30">
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="font-semibold text-destructive">
                            Delete Account
                          </p>
                          <p className="text-xs text-destructive/80">
                            Permanently delete your account
                          </p>
                        </div>
                      </div>
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all duration-300 flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Toggle Setting Component
const ToggleSetting = ({ icon: Icon, title, description, value, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ left: value ? 32 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
};

export default SettingsPanel;
