import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Award,
  BookOpen,
  Users,
  MessageSquare,
  Camera,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";

const FacultyProfile = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "Dr. John Smith",
    email: user?.email || "john.smith@university.edu",
    phone: "+1 234-567-8900",
    department: user?.department || "ECE",
    employeeId: "FAC2024001",
    qualification: "Ph.D. in Electronics",
    specialization: "Digital Signal Processing, VLSI Design",
    experience: "12 years",
    joinedDate: "2012-08-15",
    bio: "Passionate educator with 12+ years of experience in Electronics and Communication Engineering. Published 25+ research papers in international journals.",
  });

  // Stats
  const stats = {
    totalCourses: 8,
    activeStudents: 245,
    doubtsResolved: 156,
    averageRating: 4.8,
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Update user context
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      department: profileData.department,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Profile updated successfully! ✅");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setProfileData({
      name: user?.name || "Dr. John Smith",
      email: user?.email || "john.smith@university.edu",
      phone: "+1 234-567-8900",
      department: user?.department || "ECE",
      employeeId: "FAC2024001",
      qualification: "Ph.D. in Electronics",
      specialization: "Digital Signal Processing, VLSI Design",
      experience: "12 years",
      joinedDate: "2012-08-15",
      bio: "Passionate educator with 12+ years of experience in Electronics and Communication Engineering. Published 25+ research papers in international journals.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-card shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-card shadow-xl">
                    <span className="text-5xl font-black text-white">
                      {profileData.name.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Name & Role */}
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-1">
                  {profileData.name}
                </h2>
                <p className="text-muted-foreground mb-3">
                  {profileData.qualification} • {profileData.department}
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                    {profileData.employeeId}
                  </div>
                  <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-bold">
                    Faculty
                  </div>
                  <div className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm font-bold">
                    {profileData.experience} Experience
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-destructive/10 text-destructive rounded-xl font-bold hover:bg-destructive/20 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-muted-foreground mb-2">
                BIO
              </h3>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              ) : (
                <p className="text-foreground leading-relaxed">
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">
                      {stats.totalCourses}
                    </p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>

              <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">
                      {stats.activeStudents}
                    </p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-success/5 rounded-xl p-4 border border-success/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">
                      {stats.doubtsResolved}
                    </p>
                    <p className="text-xs text-muted-foreground">Doubts</p>
                  </div>
                </div>
              </div>

              <div className="bg-warning/5 rounded-xl p-4 border border-warning/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">
                      {stats.averageRating}
                    </p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-black text-foreground mb-6">
            Personal Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{profileData.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Email Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{profileData.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{profileData.phone}</span>
                </div>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Department
              </label>
              {isEditing ? (
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        department: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ECE">Electronics and Communication</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="EE">Electrical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {profileData.department === "ECE"
                      ? "Electronics and Communication"
                      : profileData.department}
                  </span>
                </div>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Employee ID
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                <span className="text-foreground font-semibold">
                  {profileData.employeeId}
                </span>
              </div>
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Qualification
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.qualification}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      qualification: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <span className="text-foreground">
                    {profileData.qualification}
                  </span>
                </div>
              )}
            </div>

            {/* Specialization */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Specialization
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                  <span className="text-foreground">
                    {profileData.specialization}
                  </span>
                </div>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Experience
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                <span className="text-foreground">
                  {profileData.experience}
                </span>
              </div>
            </div>

            {/* Joined Date */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Joined Date
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">
                  {new Date(profileData.joinedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyProfile;
