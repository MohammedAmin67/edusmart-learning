import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  FileText,
  Lightbulb,
  Trophy,
  Lock,
  Video,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { courses } from "../../data/mockData";

const LessonPlayer = ({ selectedCourseId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [completedLessonsState, setCompletedLessonsState] = useState(new Set());
  const [isCompleting, setIsCompleting] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const progressBarRef = useRef(null);

  // Get course data
  const course = courses.find((c) => c.id === selectedCourseId);

  if (!course || !course.lessons || course.lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No Lessons Available
          </h3>
          <p className="text-muted-foreground">
            This course doesn't have any lessons yet.
          </p>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter((l) => l.completed).length;

  // Mock key points
  const keyPoints = [
    "Understand the fundamentals of the topic",
    "Learn practical applications and use cases",
    "Practice with real-world examples",
    "Master advanced techniques and patterns",
  ];

  // Mock notes
  const notes = [
    { time: "2:30", text: "Important concept about variables" },
    { time: "5:45", text: "Remember the scope rules" },
    { time: "8:15", text: "Practice this example" },
  ];

  // Stock Video
  const videoUrl = "/coding.mp4";

  useEffect(() => {
    let lastUpdateTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const updateProgress = (timestamp) => {
      if (videoRef.current && isPlaying && !isDragging) {
        if (timestamp - lastUpdateTime >= interval) {
          const current = videoRef.current.currentTime;
          const total = videoRef.current.duration;

          if (total && !isNaN(total)) {
            setCurrentTime(current);
            setDuration(total);
            setProgress((current / total) * 100);
          }

          lastUpdateTime = timestamp;
        }

        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying && !isDragging) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  // REMOVED - This was causing all lessons to show as completed
  // useEffect(() => {
  //   if (currentLesson.completed) {
  //     setCompletedLessonsState((prev) => new Set(prev).add(currentLesson.id));
  //   }
  // }, [currentLesson.id, currentLesson.completed]);

  // Set duration when video metadata loads
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [currentLessonIndex]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Handle mouse movement to show/hide controls in fullscreen
  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    if (isFullscreen && isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    handlePlayPause();
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  // Handle progress bar seeking
  const handleProgressClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(
        0,
        Math.min(100, (clickX / rect.width) * 100),
      );
      const newTime = (percentage / 100) * videoRef.current.duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage);
    }
  };

  // Handle progress bar dragging
  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging && videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(
        0,
        Math.min(100, (clickX / rect.width) * 100),
      );
      const newTime = (percentage / 100) * videoRef.current.duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleProgressMouseMove);
      document.addEventListener("mouseup", handleProgressMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleProgressMouseMove);
        document.removeEventListener("mouseup", handleProgressMouseUp);
      };
    }
  }, [isDragging]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } else {
      toast("You've reached the last lesson!", { icon: "🎉" });
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleLessonSelect = (index) => {
    setCurrentLessonIndex(index);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleComplete = async () => {
    // Check if already completed
    if (completedLessonsState.has(currentLesson.id)) {
      toast("This lesson is already completed!", { icon: "ℹ️" });
      return;
    }

    // Check if video watched
    if (progress < 99) {
      toast.error("Please watch the entire lesson to complete it!", {
        icon: "⚠️",
      });
      return;
    }

    // Prevent spam clicking
    if (isCompleting) return;

    setIsCompleting(true);

    // Simulate API call (replace with actual backend call later)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mark as completed - Fixed to properly add to Set
    setCompletedLessonsState((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentLesson.id);
      return newSet;
    });

    toast.success("Lesson completed! +50 XP", { icon: "🎉" });

    setIsCompleting(false);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span>{course.title}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-semibold">
              Lesson {currentLessonIndex + 1}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
            {currentLesson.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentLesson.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-accent font-semibold">+50 XP</span>
            </div>
            {currentLesson.completed && (
              <div className="flex items-center gap-1 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div
              ref={containerRef}
              className={`bg-card rounded-2xl overflow-hidden border border-border shadow-lg ${
                isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() =>
                isFullscreen && isPlaying && setShowControls(false)
              }
            >
              {/* Video Container */}
              <div
                className={`relative ${isFullscreen ? "h-screen" : "aspect-video"} bg-black`}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  onClick={handleVideoClick}
                  onEnded={handleVideoEnded}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Play Overlay - Only show when paused */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                      onClick={handleVideoClick}
                    >
                      <motion.div
                        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="w-10 h-10 text-primary-foreground ml-1" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Fullscreen Controls Overlay */}
                {isFullscreen && (
                  <AnimatePresence>
                    {showControls && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"
                      >
                        {/* Top bar - Title only, no button */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pointer-events-auto">
                          <div className="text-white">
                            <h3 className="text-lg font-bold">
                              {currentLesson.title}
                            </h3>
                            <p className="text-sm text-white/80">
                              {course.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Controls - Show/hide based on fullscreen state */}
              <AnimatePresence>
                {(!isFullscreen || showControls) && (
                  <motion.div
                    initial={
                      isFullscreen ? { y: 100, opacity: 0 } : { opacity: 1 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className={`${isFullscreen ? "absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm" : ""} p-4 space-y-4`}
                  >
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div
                        ref={progressBarRef}
                        className="h-2 bg-muted/50 rounded-full overflow-hidden cursor-pointer group relative"
                        onMouseDown={handleProgressMouseDown}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent relative"
                          style={{ width: `${progress}%` }}
                        >
                          {/* Draggable progress indicator dot */}
                          <div
                            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-opacity ${
                              isDragging
                                ? "opacity-100 scale-125"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                            style={{ cursor: "grab" }}
                          />
                        </div>
                      </div>
                      <div
                        className={`flex justify-between text-xs ${isFullscreen ? "text-white/80" : "text-muted-foreground"}`}
                      >
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* LEFT SIDE - Previous, Play, Next, VOLUME (in fullscreen) */}
                        <button
                          onClick={handlePrevious}
                          disabled={currentLessonIndex === 0}
                          className={`w-10 h-10 rounded-xl ${
                            isFullscreen
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all`}
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={handlePlayPause}
                          className={`w-12 h-12 rounded-xl ${
                            isFullscreen
                              ? "bg-white/30 hover:bg-white/40"
                              : "bg-primary hover:bg-primary/90"
                          } flex items-center justify-center transition-all shadow-md`}
                        >
                          {isPlaying ? (
                            <Pause
                              className={`w-6 h-6 ${isFullscreen ? "text-white" : "text-primary-foreground"}`}
                            />
                          ) : (
                            <Play
                              className={`w-6 h-6 ${isFullscreen ? "text-white" : "text-primary-foreground"} ml-0.5`}
                            />
                          )}
                        </button>

                        <button
                          onClick={handleNext}
                          disabled={currentLessonIndex === totalLessons - 1}
                          className={`w-10 h-10 rounded-xl ${
                            isFullscreen
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all`}
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        {/* Volume controls in fullscreen */}
                        {isFullscreen && (
                          <>
                            <button
                              onClick={toggleMute}
                              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>

                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 rounded-lg appearance-none cursor-pointer accent-primary bg-white/30"
                            />
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* RIGHT SIDE - Volume (non-fullscreen), Fullscreen */}
                        {!isFullscreen && (
                          <>
                            <button
                              onClick={toggleMute}
                              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-all text-foreground"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>

                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 rounded-lg appearance-none cursor-pointer accent-primary hidden sm:block bg-muted"
                            />
                          </>
                        )}

                        <button
                          onClick={toggleFullscreen}
                          className={`w-10 h-10 rounded-xl ${
                            isFullscreen
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          } flex items-center justify-center transition-all`}
                        >
                          {isFullscreen ? (
                            <Minimize className="w-5 h-5" />
                          ) : (
                            <Maximize className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Tabs - Key Points & Notes */}
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Tab Headers */}
              <div className="flex gap-2 mb-6 border-b border-border">
                <button
                  onClick={() => setShowNotes(false)}
                  className={`px-4 py-2 font-semibold text-sm transition-all duration-300 border-b-2 ${
                    !showNotes
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Key Points
                  </div>
                </button>
                <button
                  onClick={() => setShowNotes(true)}
                  className={`px-4 py-2 font-semibold text-sm transition-all duration-300 border-b-2 ${
                    showNotes
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes ({notes.length})
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {!showNotes ? (
                  <motion.div
                    key="keypoints"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    {keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-foreground flex-1">
                          {point}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="px-2 py-1 rounded-lg bg-accent/10 flex-shrink-0">
                          <span className="text-xs font-bold text-accent">
                            {note.time}
                          </span>
                        </div>
                        <p className="text-sm text-foreground flex-1">
                          {note.text}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Complete Lesson Button */}
            <motion.button
              onClick={handleComplete}
              disabled={
                (progress < 99 &&
                  !completedLessonsState.has(currentLesson.id)) ||
                isCompleting
              }
              className={`w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                completedLessonsState.has(currentLesson.id)
                  ? "bg-success/20 text-success border-2 border-success cursor-default"
                  : progress >= 99
                    ? "bg-success text-white hover:bg-success/90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={
                progress >= 99 && !completedLessonsState.has(currentLesson.id)
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                progress >= 99 && !completedLessonsState.has(currentLesson.id)
                  ? { scale: 0.98 }
                  : {}
              }
            >
              {isCompleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Completing...
                </>
              ) : completedLessonsState.has(currentLesson.id) ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Lesson Completed
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Complete Lesson & Earn 50 XP
                </>
              )}
            </motion.button>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border shadow-lg sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-foreground mb-2">
                  Course Lessons
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedLessons}/{totalLessons} completed
                  </span>
                  <span className="text-primary font-bold">
                    {Math.round((completedLessons / totalLessons) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{
                      width: `${(completedLessons / totalLessons) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lesson List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {course.lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      index === currentLessonIndex
                        ? "bg-primary/10 border-2 border-primary/30"
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          lesson.completed
                            ? "bg-success text-white"
                            : index === currentLessonIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : index > currentLessonIndex ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration} min</span>
                          {lesson.completed && (
                            <>
                              <span>•</span>
                              <span className="text-success font-semibold">
                                Done
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
