import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  Trophy,
  Zap,
  Mail,
  User as UserIcon,
  GraduationCap,
  Target,
  Camera,
  Flame,
  BookOpen,
  Clock,
  CheckCircle2,
  Send,
  Calendar,
  MapPin,
  Briefcase,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { userData, achievements, courses } from "../../data/mockData";

const Profile = () => {
  const { user, updateAvatar } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(
    "Passionate learner exploring the world of web development and data science.",
  );
  const [tempBio, setTempBio] = useState(bio);
  const fileInputRef = React.useRef(null);

  // Calculate XP progress
  const getProgressPercent = (user) =>
    Math.min(
      100,
      Math.round(
        ((user?.totalXP ?? 0) /
          ((user?.totalXP ?? 0) + (user?.xpToNextLevel ?? 1))) *
          100,
      ),
    );

  const progressPercent = getProgressPercent(user);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await updateAvatar(file);
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Failed to update profile photo");
    }
    setIsUploading(false);
  };

  const handleSubmitFeedback = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    setFeedbackSent(true);
    toast.success("Thank you for your feedback!");
    setTimeout(() => {
      setFeedbackSent(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  // Bio edit handlers
  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    setBio(tempBio);
    setIsEditingBio(false);
    toast.success("Bio updated!");
  };

  const handleCancelBio = () => {
    setTempBio(bio);
    setIsEditingBio(false);
  };

  const milestones = [
    {
      id: 1,
      name: "Avatar Accessories",
      icon: "🎯",
      level: 5,
      unlocked: (user?.level || 0) >= 5,
    },
    {
      id: 2,
      name: "Study Themes",
      icon: "💻",
      level: 10,
      unlocked: (user?.level || 0) >= 10,
    },
    {
      id: 3,
      name: "Advanced Analytics",
      icon: "📊",
      level: 15,
      unlocked: (user?.level || 0) >= 15,
    },
    {
      id: 4,
      name: "Mentor Badge",
      icon: "💡",
      level: 20,
      unlocked: (user?.level || 0) >= 20,
    },
    {
      id: 5,
      name: "Custom Avatar",
      icon: "👑",
      level: 25,
      unlocked: (user?.level || 0) >= 25,
    },
    {
      id: 6,
      name: "Certificate Creator",
      icon: "📜",
      level: 30,
      unlocked: (user?.level || 0) >= 30,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      activity: "JavaScript Arrays Lesson",
      xp: 50,
      date: "2 hours ago",
      icon: BookOpen,
      color: "text-primary",
    },
    {
      id: 2,
      activity: "Variables Quiz Perfect",
      xp: 25,
      date: "3 hours ago",
      icon: Award,
      color: "text-accent",
    },
    {
      id: 3,
      activity: "Daily Login Bonus",
      xp: 10,
      date: "1 day ago",
      icon: Zap,
      color: "text-success",
    },
    {
      id: 4,
      activity: "Week Streak Bonus",
      xp: 100,
      date: "2 days ago",
      icon: Flame,
      color: "text-warning",
    },
    {
      id: 5,
      activity: "Course Completed",
      xp: 200,
      date: "3 days ago",
      icon: Trophy,
      color: "text-primary",
    },
  ];

  const profileInfo = [
    { label: "Member Since", value: "January 2024", icon: Calendar },
    { label: "Location", value: "Learning Worldwide", icon: MapPin },
    { label: "Role", value: "Pro Learner", icon: Briefcase },
  ];

  const learningStats = [
    {
      label: "Study Time",
      value: "1,250 min",
      subtext: "Total learning hours",
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Achievements",
      value: "4/10",
      subtext: "Badges unlocked",
      icon: Trophy,
      color: "text-accent",
    },
    {
      label: "Best Streak",
      value: "14 days",
      subtext: "Longest streak",
      icon: Flame,
      color: "text-warning",
    },
    {
      label: "Accuracy",
      value: "87%",
      subtext: "Average score",
      icon: Target,
      color: "text-success",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

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
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Manage your account and track your journey
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-2xl p-6 sm:p-8 border border-border shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Avatar & Basic Info */}
              <div className="flex flex-col items-center gap-6 lg:w-64 flex-shrink-0">
                {/* Avatar */}
                <div className="relative group w-full flex justify-center">
                  <div
                    className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer overflow-hidden border-4 border-primary/30 shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-16 h-16 lg:w-24 lg:h-24 text-white" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 lg:right-8 bg-gradient-to-r from-accent to-accent/70 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-card">
                    LV {user?.level || 0}
                  </div>
                </div>

                {/* Profile Info Items - REMOVED EXTRA SPACE */}
                <div className="space-y-3 w-full">
                  {profileInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border"
                    >
                      <info.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {info.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: User Details & Progress */}
              <div className="flex-1 space-y-6">
                {/* Name & Email */}
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email || ""}
                  </p>
                </div>

                {/* Bio Section - FIXED FUNCTIONALITY */}
                <div className="p-4 rounded-xl bg-card/50 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">About</h4>
                    {!isEditingBio ? (
                      <button
                        onClick={handleEditBio}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveBio}
                          className="text-xs text-success hover:text-success/80 flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelBio}
                          className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditingBio ? (
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-border text-sm text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{bio}</p>
                  )}
                </div>

                {/* XP Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experience Points
                        </p>
                        <p className="text-2xl font-black text-foreground">
                          {user?.totalXP || 0} XP
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary font-bold">
                        {user?.xpToNextLevel || 0} XP
                      </p>
                      <p className="text-xs text-muted-foreground">
                        to level {(user?.level || 0) + 1}
                      </p>
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {progressPercent}% complete
                  </p>
                </div>

                {/* Learning Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {learningStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <p className="text-sm font-semibold text-foreground">
                          {stat.label}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtext}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestones & Recent Activity Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Level Milestones */}
          <motion.div
            className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                Level Milestones
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((milestone) => (
                <motion.div
                  key={milestone.id}
                  className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    milestone.unlocked
                      ? "bg-primary/10 border-primary/30 hover:border-primary/50"
                      : "bg-muted/50 border-border hover:border-border/60 grayscale hover:grayscale-0"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {milestone.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-card">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl mb-2">{milestone.icon}</div>
                    <p className="text-xs font-bold text-foreground mb-1">
                      {milestone.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Level {milestone.level}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div
                    className={`w-10 h-10 ${activity.color.replace("text", "bg")}/10 rounded-xl flex items-center justify-center`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">
                      {activity.activity}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-success">
                      +{activity.xp}
                    </p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feedback Form */}
        <motion.div
          className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground">
              Send Feedback
            </h3>
          </div>
          <div className="w-full space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground placeholder:text-muted-foreground"
            />
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground placeholder:text-muted-foreground resize-none"
            />
            {feedbackSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-3 bg-success text-white rounded-xl font-bold text-center flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Thank you for your feedback!
              </motion.div>
            ) : (
              <button
                onClick={handleSubmitFeedback}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
