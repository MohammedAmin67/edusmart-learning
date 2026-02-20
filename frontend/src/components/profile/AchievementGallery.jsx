import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Star,
  Lock,
  CheckCircle2,
  Zap,
  Target,
  Flame,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Crown,
  Sparkles,
} from "lucide-react";
import { achievements, userData } from "../../data/mockData";

const AchievementGallery = () => {
  const [filter, setFilter] = useState("all"); // all, unlocked, locked
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Get achievements data
  const allAchievements = achievements || [];
  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter((a) => !a.unlocked);

  // Filter achievements
  const filteredAchievements =
    filter === "unlocked"
      ? unlockedAchievements
      : filter === "locked"
        ? lockedAchievements
        : allAchievements;

  // Rarity colors
  const rarityColors = {
    Common: {
      bg: "bg-muted",
      border: "border-border",
      text: "text-muted-foreground",
      glow: "",
    },
    Rare: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      glow: "shadow-primary/20",
    },
    Epic: {
      bg: "bg-accent/10",
      border: "border-accent/30",
      text: "text-accent",
      glow: "shadow-accent/20",
    },
    Legendary: {
      bg: "bg-gradient-to-br from-warning/20 to-accent/20",
      border: "border-warning/50",
      text: "text-warning",
      glow: "shadow-warning/30",
    },
  };

  // Category icons
  const categoryIcons = {
    Milestone: Trophy,
    Excellence: Star,
    Consistency: Flame,
    Exploration: Target,
    Special: Sparkles,
    Speed: Zap,
  };

  // Stats
  const stats = [
    {
      label: "Total Achievements",
      value: allAchievements.length,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Unlocked",
      value: unlockedAchievements.length,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Locked",
      value: lockedAchievements.length,
      icon: Lock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    {
      label: "Total XP Earned",
      value: unlockedAchievements.reduce(
        (sum, a) => sum + (a.xpReward || 0),
        0,
      ),
      icon: Star,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  // Filter buttons
  const filters = [
    { id: "all", label: "All", count: allAchievements.length },
    { id: "unlocked", label: "Unlocked", count: unlockedAchievements.length },
    { id: "locked", label: "Locked", count: lockedAchievements.length },
  ];

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
            Achievement <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Unlock badges and earn rewards for your learning journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                filter === filterItem.id
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {filterItem.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === filterItem.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {filterItem.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => {
              const CategoryIcon =
                categoryIcons[achievement.category] || Trophy;
              const rarity =
                rarityColors[achievement.rarity] || rarityColors.Common;

              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAchievement(achievement)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    achievement.unlocked
                      ? `${rarity.bg} ${rarity.border} hover:shadow-xl ${rarity.glow}`
                      : "bg-muted/50 border-border grayscale hover:grayscale-0"
                  }`}
                >
                  {/* Unlocked Badge */}
                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-card shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Locked Badge */}
                  {!achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center border-2 border-card shadow-lg">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Achievement Content */}
                  <div className="text-center space-y-4">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                          achievement.unlocked ? rarity.bg : "bg-muted/70"
                        }`}
                      >
                        <CategoryIcon
                          className={`w-10 h-10 ${achievement.unlocked ? rarity.text : "text-muted-foreground"}`}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-foreground">
                      {achievement.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Rarity & Category */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          achievement.unlocked
                            ? `${rarity.bg} ${rarity.text}`
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {achievement.rarity}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                        {achievement.category}
                      </span>
                    </div>

                    {/* XP Reward */}
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                      <Star
                        className={`w-4 h-4 ${achievement.unlocked ? "text-accent" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`font-bold ${achievement.unlocked ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {achievement.xpReward} XP
                      </span>
                    </div>

                    {/* Progress Bar (if applicable) */}
                    {!achievement.unlocked &&
                      achievement.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      )}

                    {/* Unlock Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                        <Clock className="w-3 h-3" />
                        <span>Unlocked {achievement.unlockedAt}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">
              No Achievements Found
            </h3>
            <p className="text-muted-foreground">
              {filter === "unlocked"
                ? "Start learning to unlock your first achievement!"
                : "Keep exploring to discover more achievements!"}
            </p>
          </motion.div>
        )}

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                className="bg-card rounded-2xl p-8 max-w-md w-full border border-border shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div
                      className={`w-32 h-32 rounded-2xl flex items-center justify-center ${
                        selectedAchievement.unlocked
                          ? rarityColors[selectedAchievement.rarity].bg
                          : "bg-muted/70"
                      }`}
                    >
                      {React.createElement(
                        categoryIcons[selectedAchievement.category] || Trophy,
                        {
                          className: `w-16 h-16 ${
                            selectedAchievement.unlocked
                              ? rarityColors[selectedAchievement.rarity].text
                              : "text-muted-foreground"
                          }`,
                        },
                      )}
                    </div>
                  </div>

                  {/* Title & Status */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {selectedAchievement.unlocked ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                      <h2 className="text-2xl font-black text-foreground">
                        {selectedAchievement.name}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {selectedAchievement.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <span className="text-sm font-semibold text-foreground">
                        Rarity
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          rarityColors[selectedAchievement.rarity].bg
                        } ${rarityColors[selectedAchievement.rarity].text}`}
                      >
                        {selectedAchievement.rarity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <span className="text-sm font-semibold text-foreground">
                        Category
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {selectedAchievement.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10">
                      <span className="text-sm font-semibold text-foreground">
                        XP Reward
                      </span>
                      <span className="text-lg font-black text-accent flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        {selectedAchievement.xpReward} XP
                      </span>
                    </div>
                    {selectedAchievement.unlocked &&
                      selectedAchievement.unlockedAt && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-success/10">
                          <span className="text-sm font-semibold text-foreground">
                            Unlocked
                          </span>
                          <span className="text-sm font-bold text-success">
                            {selectedAchievement.unlockedAt}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AchievementGallery;
