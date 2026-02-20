// Mock Data for EduSmart

export const userData = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  level: 12,
  totalXP: 2850,
  xpToNextLevel: 300,
  currentStreak: 7,
  bestStreak: 14,
  coursesStarted: 6,
  coursesCompleted: 3,
  joinedDate: "2024-01-15",
  avatar: {
    level: 12,
    accessories: [
      "graduation_cap",
      "book",
      "star_badge",
      "wizard_hat",
      "magic_staff",
    ],
    unlocked: ["basic_outfit", "smart_glasses", "trophy", "gold_medal"],
    url: null, // Can be set to user's avatar URL
  },
  stats: {
    totalLessonsCompleted: 45,
    totalTimeSpent: 1250, // in minutes
    averageAccuracy: 87,
    coursesCompleted: 3,
    perfectScores: 8,
    currentLevel: 12,
    rank: "Pro",
  },
  preferences: {
    theme: "dark",
    notifications: true,
    emailUpdates: false,
    studyReminders: true,
  },
};

// =====================================================
// COURSES DATA - UPDATED FOR COURSEGRID
// =====================================================
export const courses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Master the basics of modern JavaScript programming with hands-on projects and real-world examples.",
    progress: 75,
    totalLessons: 20,
    completedLessons: 15,
    estimatedTime: 40, // hours
    duration: "40 hours",
    difficulty: "Beginner",
    category: "Programming",
    color: "bg-blue-500",
    thumbnail: null,
    instructor: "John Doe",
    rating: 4.8,
    studentsEnrolled: 12500,
    reviews: 2450,
    lastAccessed: "2025-02-10",
    startedDate: "2024-12-01",
    skills: [
      "Variables",
      "Functions",
      "ES6+",
      "Async/Await",
      "DOM Manipulation",
    ],
    lessons: [
      {
        id: 1,
        title: "Variables and Data Types",
        duration: 15,
        completed: true,
      },
      { id: 2, title: "Functions and Scope", duration: 20, completed: true },
      { id: 3, title: "Arrays and Objects", duration: 18, completed: true },
      { id: 4, title: "ES6 Features", duration: 22, completed: false },
      { id: 5, title: "Async Programming", duration: 25, completed: false },
    ],
  },
  {
    id: 2,
    title: "React Development",
    description:
      "Build beautiful, interactive web applications with React and modern JavaScript.",
    progress: 45,
    totalLessons: 25,
    completedLessons: 11,
    estimatedTime: 60,
    duration: "60 hours",
    difficulty: "Intermediate",
    category: "Web Development",
    color: "bg-purple-500",
    thumbnail: null,
    instructor: "Jane Smith",
    rating: 4.9,
    studentsEnrolled: 9800,
    reviews: 1875,
    lastAccessed: "2025-02-12",
    startedDate: "2025-01-05",
    skills: [
      "Components",
      "Hooks",
      "State Management",
      "React Router",
      "Context API",
    ],
    lessons: [
      { id: 1, title: "Intro to React", duration: 18, completed: true },
      { id: 2, title: "JSX and Props", duration: 20, completed: true },
      { id: 3, title: "State and Lifecycle", duration: 22, completed: false },
    ],
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description:
      "Learn efficient problem-solving techniques and ace coding interviews.",
    progress: 20,
    totalLessons: 30,
    completedLessons: 6,
    estimatedTime: 80,
    duration: "80 hours",
    difficulty: "Advanced",
    category: "Computer Science",
    color: "bg-green-500",
    thumbnail: null,
    instructor: "Dr. Alan Turing",
    rating: 4.7,
    studentsEnrolled: 7500,
    reviews: 1620,
    lastAccessed: "2025-02-08",
    startedDate: "2025-01-20",
    skills: ["Big O", "Arrays", "Trees", "Graphs", "Dynamic Programming"],
    lessons: [
      { id: 1, title: "Algorithm Basics", duration: 22, completed: true },
      { id: 2, title: "Arrays and Strings", duration: 25, completed: false },
    ],
  },
  {
    id: 4,
    title: "Python for Beginners",
    description:
      "Start your Python journey with practical exercises and real projects.",
    progress: 0,
    totalLessons: 15,
    completedLessons: 0,
    estimatedTime: 35,
    duration: "35 hours",
    difficulty: "Beginner",
    category: "Programming",
    color: "bg-yellow-500",
    thumbnail: null,
    instructor: "Sarah Connor",
    rating: 4.6,
    studentsEnrolled: 15000,
    reviews: 3200,
    lastAccessed: null,
    startedDate: null,
    skills: ["Syntax", "Data Types", "Functions", "OOP", "File I/O"],
    lessons: [],
  },
  {
    id: 5,
    title: "UI/UX Design Basics",
    description:
      "Fundamentals of user-centric design and prototyping with Figma.",
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    estimatedTime: 28,
    duration: "28 hours",
    difficulty: "Beginner",
    category: "Design",
    color: "bg-pink-500",
    thumbnail: null,
    instructor: "Emily Brown",
    rating: 4.8,
    studentsEnrolled: 8200,
    reviews: 1540,
    lastAccessed: null,
    startedDate: null,
    skills: [
      "Wireframing",
      "Prototyping",
      "Color Theory",
      "Typography",
      "User Research",
    ],
    lessons: [],
  },
  {
    id: 6,
    title: "Machine Learning 101",
    description:
      "Introduction to ML concepts, tools, and practical applications.",
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
    estimatedTime: 45,
    duration: "45 hours",
    difficulty: "Intermediate",
    category: "Data Science",
    color: "bg-indigo-500",
    thumbnail: null,
    instructor: "Dr. Andrew Ng",
    rating: 4.9,
    studentsEnrolled: 25000,
    reviews: 5800,
    lastAccessed: null,
    startedDate: null,
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "Neural Networks"],
    lessons: [],
  },
];

// =====================================================
// ANALYTICS DATA - UPDATED WITH PROPER CALCULATIONS
// =====================================================
export const analyticsData = {
  // Weekly data (last 7 days)
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    xpData: [120, 180, 150, 220, 190, 280, 160],
    lessonsData: [3, 5, 4, 6, 5, 8, 4],
    timeData: [45, 68, 52, 85, 71, 120, 60], // minutes
    accuracyData: [85, 88, 82, 90, 87, 92, 85],
    totalXP: 1300,
    totalTime: 501, // minutes (8.35 hours)
    totalLessons: 35,
    avgAccuracy: 87,
    bestDay: "Saturday",
    bestXP: 280,
    improvement: 15, // percentage
  },

  // Monthly data (last 4 weeks) - FIXED CALCULATIONS
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    xpData: [850, 920, 1050, 980],
    lessonsData: [18, 22, 25, 21],
    timeData: [320, 385, 425, 380], // minutes
    accuracyData: [84, 86, 89, 85],
    totalXP: 3800, // Sum of xpData
    totalTime: 1510, // Sum of timeData (25.17 hours)
    totalLessons: 86, // Sum of lessonsData
    avgAccuracy: 86, // Average of accuracyData
    bestDay: "Week 3",
    bestXP: 1050,
    improvement: 22,
  },

  // Yearly data (last 12 months) - FIXED CALCULATIONS
  year: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    xpData: [
      2800, 3200, 3500, 3800, 4200, 4500, 4800, 5100, 5400, 5200, 4900, 5300,
    ],
    lessonsData: [65, 75, 82, 88, 95, 102, 108, 115, 120, 118, 110, 125],
    timeData: [
      980, 1120, 1240, 1350, 1480, 1600, 1720, 1850, 1950, 1880, 1780, 1920,
    ], // minutes
    accuracyData: [82, 84, 85, 87, 88, 89, 90, 91, 92, 90, 88, 89],
    totalXP: 52700, // Sum of xpData
    totalTime: 17870, // Sum of timeData (297.83 hours)
    totalLessons: 1203, // Sum of lessonsData
    avgAccuracy: 88, // Average of accuracyData
    bestDay: "September",
    bestXP: 5400,
    improvement: 38,
  },

  // Course-specific performance
  coursePerformance: [
    {
      name: "JavaScript",
      progress: 85,
      timeSpent: 450,
      accuracy: 89,
      color: "hsl(var(--primary))",
    },
    {
      name: "React",
      progress: 65,
      timeSpent: 380,
      accuracy: 85,
      color: "hsl(var(--accent))",
    },
    {
      name: "Node.js",
      progress: 45,
      timeSpent: 220,
      accuracy: 82,
      color: "hsl(var(--success))",
    },
    {
      name: "TypeScript",
      progress: 30,
      timeSpent: 150,
      accuracy: 78,
      color: "hsl(var(--warning))",
    },
  ],

  // Skills radar data
  skillsData: [
    { subject: "Frontend", value: 85, fullMark: 100 },
    { subject: "Backend", value: 70, fullMark: 100 },
    { subject: "Database", value: 60, fullMark: 100 },
    { subject: "DevOps", value: 45, fullMark: 100 },
    { subject: "Testing", value: 75, fullMark: 100 },
    { subject: "Design", value: 55, fullMark: 100 },
  ],

  // Activity heatmap (for future use)
  activityHeatmap: [
    { date: "2025-02-01", value: 3 },
    { date: "2025-02-02", value: 5 },
    { date: "2025-02-03", value: 2 },
    // ... more dates
  ],
};

// =====================================================
// DAILY ACTIVITY
// =====================================================
export const dailyActivity = {
  todayXP: 35,
  todayLessons: 2,
  todayMinutes: 25,
  streak: 7,
  weeklyGoal: 300,
  weeklyProgress: 180,
  todayGoal: 50,
  todayGoalProgress: 35,
};

// =====================================================
// ACHIEVEMENTS - UPDATED WITH PROPER FIELDS
// =====================================================
export const achievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Completed your first lesson!",
    icon: "🎉",
    xpReward: 20,
    rarity: "Common",
    unlocked: true,
    unlockedAt: "Jan 22, 2025",
    category: "Milestone",
  },
  {
    id: 2,
    name: "Quiz Master",
    description: "Scored 100% on a quiz.",
    icon: "🏆",
    xpReward: 50,
    rarity: "Rare",
    unlocked: true,
    unlockedAt: "Jan 23, 2025",
    category: "Excellence",
  },
  {
    id: 3,
    name: "Streaker",
    description: "Maintain a 7-day learning streak.",
    icon: "🔥",
    xpReward: 70,
    rarity: "Epic",
    unlocked: true,
    unlockedAt: "Feb 10, 2025",
    progress: 100,
    category: "Consistency",
  },
  {
    id: 4,
    name: "Perfectionist",
    description: "Achieve 90%+ accuracy in 10 lessons.",
    icon: "🌟",
    xpReward: 100,
    rarity: "Legendary",
    unlocked: false,
    progress: 60,
    category: "Excellence",
  },
  {
    id: 5,
    name: "Explorer",
    description: "Start 5 different courses.",
    icon: "🗺️",
    xpReward: 60,
    rarity: "Epic",
    unlocked: true,
    unlockedAt: "Feb 5, 2025",
    category: "Exploration",
  },
  {
    id: 6,
    name: "Night Owl",
    description: "Study after midnight 3 days in a row.",
    icon: "🦉",
    xpReward: 40,
    rarity: "Rare",
    unlocked: false,
    progress: 67,
    category: "Special",
  },
  {
    id: 7,
    name: "Speed Learner",
    description: "Finish a lesson in under 10 minutes.",
    icon: "⚡",
    xpReward: 25,
    rarity: "Common",
    unlocked: true,
    unlockedAt: "Jan 24, 2025",
    category: "Speed",
  },
  {
    id: 8,
    name: "Social Butterfly",
    description: "Invite 3 friends to join EduSmart.",
    icon: "🦋",
    xpReward: 30,
    rarity: "Rare",
    unlocked: false,
    progress: 33,
    category: "Special",
  },
  {
    id: 9,
    name: "Century Club",
    description: "Complete 100 lessons.",
    icon: "💯",
    xpReward: 150,
    rarity: "Legendary",
    unlocked: false,
    progress: 45,
    category: "Milestone",
  },
  {
    id: 10,
    name: "Master Coder",
    description: "Complete all JavaScript courses.",
    icon: "👨‍💻",
    xpReward: 200,
    rarity: "Legendary",
    unlocked: false,
    progress: 33,
    category: "Exploration",
  },
];

// =====================================================
// LESSONS DATA (Organized by Course)
// =====================================================
export const lessonsByCourse = {
  1: [
    {
      id: 1,
      courseId: 1,
      title: "Variables and Data Types",
      description:
        "Understanding how to store and manipulate data in JavaScript.",
      type: "video",
      duration: 15,
      content: {
        videoUrl: "js-variables.mp4",
        transcript: "Welcome to JavaScript variables and data types...",
        keyPoints: [
          "Variables store data values",
          "JavaScript has dynamic typing",
          "Common data types: string, number, boolean, object",
          "Use let/const for modern JS",
        ],
      },
      completed: true,
      xpReward: 50,
    },
  ],
  // ... other courses
};

// =====================================================
// LEADERBOARD DATA (for future use)
// =====================================================
export const leaderboardData = [
  { rank: 1, name: "Sarah J.", xp: 15420, avatar: null, streak: 45 },
  { rank: 2, name: "Mike T.", xp: 14980, avatar: null, streak: 38 },
  { rank: 3, name: "Emily R.", xp: 13850, avatar: null, streak: 32 },
  {
    rank: 4,
    name: "Alex Johnson",
    xp: 2850,
    avatar: null,
    streak: 7,
    isCurrentUser: true,
  },
  { rank: 5, name: "John D.", xp: 2640, avatar: null, streak: 12 },
];

// =====================================================
// NOTIFICATIONS DATA (for future use)
// =====================================================
export const notifications = [
  {
    id: 1,
    type: "achievement",
    title: "New Achievement Unlocked!",
    message: 'You earned the "Streaker" badge for maintaining a 7-day streak!',
    timestamp: "2025-02-14T10:30:00Z",
    read: false,
    icon: "🔥",
  },
  {
    id: 2,
    type: "course",
    title: "Course Update",
    message: 'New lessons added to "JavaScript Fundamentals"',
    timestamp: "2025-02-13T15:20:00Z",
    read: false,
    icon: "📚",
  },
  {
    id: 3,
    type: "reminder",
    title: "Daily Goal",
    message: "You're 15 XP away from reaching your daily goal!",
    timestamp: "2025-02-14T08:00:00Z",
    read: true,
    icon: "🎯",
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get courses in progress
export const getCoursesInProgress = () => {
  return courses.filter(
    (course) => course.progress > 0 && course.progress < 100,
  );
};

// Get completed courses
export const getCompletedCourses = () => {
  return courses.filter((course) => course.progress === 100);
};

// Get not started courses
export const getNotStartedCourses = () => {
  return courses.filter((course) => course.progress === 0);
};

// Get course by ID
export const getCourseById = (id) => {
  return courses.find((course) => course.id === id);
};

// Get unlocked achievements
export const getUnlockedAchievements = () => {
  return achievements.filter((achievement) => achievement.unlocked);
};

// Get locked achievements
export const getLockedAchievements = () => {
  return achievements.filter((achievement) => !achievement.unlocked);
};

// Calculate level progress
export const getLevelProgress = () => {
  return Math.round(((userData.totalXP % 300) / 300) * 100);
};

export default {
  userData,
  courses,
  analyticsData,
  dailyActivity,
  achievements,
  lessonsByCourse,
  leaderboardData,
  notifications,
  // Helper functions
  getCoursesInProgress,
  getCompletedCourses,
  getNotStartedCourses,
  getCourseById,
  getUnlockedAchievements,
  getLockedAchievements,
  getLevelProgress,
};
