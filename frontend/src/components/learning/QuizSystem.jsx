import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Trophy,
  Target,
  Brain,
  Sparkles,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";

// Mock quiz data
const mockQuizzes = {
  1: {
    // JavaScript Fundamentals
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics",
    timeLimit: 600, // 10 minutes in seconds
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: 1,
        question:
          "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "int x = 5;"],
        correctAnswer: 0,
        explanation:
          "In JavaScript, variables are declared using var, let, or const keywords.",
      },
      {
        id: 2,
        question: "Which of these is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Object"],
        correctAnswer: 2,
        explanation:
          'JavaScript uses "Number" for all numeric values, not separate Integer and Float types.',
      },
      {
        id: 3,
        question: 'What does "===" check in JavaScript?',
        options: [
          "Value only",
          "Type only",
          "Both value and type",
          "Reference only",
        ],
        correctAnswer: 2,
        explanation:
          'The "===" operator checks both value and type (strict equality).',
      },
      {
        id: 4,
        question:
          "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0,
        explanation: "push() adds elements to the end of an array.",
      },
      {
        id: 5,
        question: "What is a closure in JavaScript?",
        options: [
          "A way to close the browser",
          "A function with access to outer scope",
          "A loop terminator",
          "A syntax error",
        ],
        correctAnswer: 1,
        explanation:
          "A closure is a function that has access to variables in its outer scope.",
      },
    ],
  },
  2: {
    // React Development
    id: 2,
    title: "React Basics Quiz",
    description: "Test your React fundamentals",
    timeLimit: 900,
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        id: 1,
        question: "What is JSX?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JSON XML",
          "JavaScript Extension",
        ],
        correctAnswer: 0,
        explanation:
          "JSX stands for JavaScript XML and allows us to write HTML in React.",
      },
      {
        id: 2,
        question: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation:
          "useEffect is used for handling side effects in functional components.",
      },
      {
        id: 3,
        question: "What does useState return?",
        options: [
          "A single value",
          "An array with state and setter",
          "An object",
          "A function",
        ],
        correctAnswer: 1,
        explanation:
          "useState returns an array with the current state and a function to update it.",
      },
    ],
  },
};

const QuizSystem = ({ selectedCourseId, setActiveTab, onContinue }) => {
  const { user } = useUser();
  const [quizState, setQuizState] = useState("start"); // start, active, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const quiz = mockQuizzes[selectedCourseId];

  useEffect(() => {
    if (quizState === "active" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No Quiz Available
          </h3>
          <p className="text-muted-foreground">
            This course doesn't have a quiz yet.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setQuizState("active");
    setTimeRemaining(quiz.timeLimit);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowExplanation(false);
  };

  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(finalScore);
    setQuizState("results");

    if (finalScore >= quiz.passingScore) {
      toast.success(`Quiz passed! +${quiz.xpReward} XP`, { icon: "🎉" });
    } else {
      toast.error("Quiz failed. Try again!", { icon: "😔" });
    }
  };

  const handleRetakeQuiz = () => {
    setQuizState("start");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowExplanation(false);
  };

  // Start Screen
  if (quizState === "start") {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <motion.div
            className="bg-card rounded-2xl p-8 border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
                {quiz.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {quiz.description}
              </p>
            </div>

            {/* Quiz Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Questions</p>
                <p className="text-2xl font-black text-foreground">
                  {totalQuestions}
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Time Limit</p>
                <p className="text-2xl font-black text-foreground">
                  {formatTime(quiz.timeLimit)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">
                  Passing Score
                </p>
                <p className="text-2xl font-black text-foreground">
                  {quiz.passingScore}%
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">XP Reward</p>
                <p className="text-2xl font-black text-foreground">
                  +{quiz.xpReward}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Instructions
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Answer all {totalQuestions} questions before time runs out
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    You can navigate between questions and change your answers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Score {quiz.passingScore}% or higher to pass and earn{" "}
                    {quiz.xpReward} XP
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>The quiz will auto-submit when time expires</span>
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <motion.button
              onClick={handleStartQuiz}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-6 h-6" />
              Start Quiz
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active Quiz
  if (quizState === "active") {
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    const isCorrect =
      selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;

    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 space-y-6">
          {/* Header - Timer & Progress */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Question Progress
                </p>
                <p className="text-2xl font-black text-foreground">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Time Remaining
                </p>
                <div
                  className={`text-2xl font-black ${timeRemaining < 60 ? "text-destructive" : "text-foreground"}`}
                >
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              className="bg-card rounded-2xl p-8 border border-border shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">
                      {currentQuestionIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground flex-1">
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected =
                    selectedAnswers[currentQuestionIndex] === index;
                  const isCorrectOption =
                    index === currentQuestion.correctAnswer;
                  const showCorrect = showExplanation && isCorrectOption;
                  const showWrong = showExplanation && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() =>
                        !showExplanation && handleSelectAnswer(index)
                      }
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        showCorrect
                          ? "bg-success/10 border-success text-success"
                          : showWrong
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-muted/50 border-transparent hover:border-primary/30"
                      }`}
                      whileHover={!showExplanation ? { scale: 1.02 } : {}}
                      whileTap={!showExplanation ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showCorrect
                              ? "border-success bg-success"
                              : showWrong
                                ? "border-destructive bg-destructive"
                                : isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                          }`}
                        >
                          {showCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                          {showWrong && (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                          {isSelected && !showExplanation && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="font-semibold flex-1">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl mb-6 ${
                      isCorrect
                        ? "bg-success/10 border border-success/30"
                        : "bg-warning/10 border border-warning/30"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles
                        className={`w-5 h-5 mt-0.5 ${isCorrect ? "text-success" : "text-warning"}`}
                      />
                      <div>
                        <p className="font-bold text-foreground mb-1">
                          {isCorrect ? "Correct!" : "Incorrect"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showExplanation && (
                  <button
                    onClick={() => setShowExplanation(true)}
                    disabled={!isAnswered}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                )}
                {showExplanation &&
                  currentQuestionIndex < totalQuestions - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      Next Question
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                {showExplanation &&
                  currentQuestionIndex === totalQuestions - 1 && (
                    <button
                      onClick={handleSubmitQuiz}
                      className="flex-1 px-6 py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all flex items-center justify-center gap-2"
                    >
                      Submit Quiz
                      <Trophy className="w-5 h-5" />
                    </button>
                  )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleSubmitQuiz}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all"
            >
              Submit Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === "results") {
    const passed = score >= quiz.passingScore;
    const correctAnswers = Object.keys(selectedAnswers).filter(
      (key) => selectedAnswers[key] === quiz.questions[key].correctAnswer,
    ).length;

    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <motion.div
            className="bg-card rounded-2xl p-8 border border-border shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Result Icon */}
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                passed ? "bg-success/10" : "bg-warning/10"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-success" />
              ) : (
                <TrendingUp className="w-12 h-12 text-warning" />
              )}
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {passed
                ? `You passed the quiz and earned ${quiz.xpReward} XP!`
                : "You need more practice. Try again!"}
            </p>

            {/* Score */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {score}%
              </p>
              <p className="text-muted-foreground">
                {correctAnswers} / {totalQuestions} correct answers
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-muted/50 rounded-xl p-4">
                <Star className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                <p className="text-2xl font-black text-foreground">{score}%</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <Award className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">XP Earned</p>
                <p className="text-2xl font-black text-foreground">
                  {passed ? `+${quiz.xpReward}` : "0"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleRetakeQuiz}
                className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
              {passed && (
                <button
                  onClick={() => {
                    // Navigate back to courses
                    window.location.href = "/dashboard/courses";
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Continue Learning
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizSystem;
