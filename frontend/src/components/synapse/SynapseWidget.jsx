import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, BotMessageSquare } from "lucide-react";
import synapseService from "../../services/synapseService";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";

const STUDENT_PRESETS = [
  "Where can I see my achievements?",
  "How do I enroll in a course?",
  "How do I continue learning a course I started?",
  "How do quizzes work in EduSmart?",
  "How do I change settings (theme, notifications)?",
  "Explain React props with an example.",
];

const FACULTY_PRESETS = [
  "How do I create a course?",
  "How do I upload lessons/videos to a course?",
  "How do I monitor a student's progress?",
  "How do I respond to student doubts?",
  "Where can I see faculty analytics?",
  "Explain closures in JavaScript with an example.",
];

function AssistantMessage({ content }) {
  // content may be a string OR an object (answerJson)
  if (content && typeof content === "object") {
    const title = content.title || "Synapse";
    const answer = content.answer || "";
    const steps = Array.isArray(content.steps) ? content.steps : [];
    const notes = Array.isArray(content.notes) ? content.notes : [];

    return (
      <div className="space-y-2 text-left">
        <div className="font-black">{title}</div>

        {answer ? <div className="whitespace-pre-wrap">{answer}</div> : null}

        {steps.length > 0 ? (
          <ol className="list-decimal pl-5 space-y-1">
            {steps.map((s, i) => (
              <li key={i} className="whitespace-pre-wrap">
                {s}
              </li>
            ))}
          </ol>
        ) : null}

        {notes.length > 0 ? (
          <div className="pt-1">
            <div className="font-bold text-xs uppercase tracking-wide opacity-80">
              Notes
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {notes.map((n, i) => (
                <li key={i} className="whitespace-pre-wrap">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{String(content || "")}</div>;
}

function ThinkingBubble() {
  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center gap-2">
        <span className="font-black">Synapse</span>
        <span className="text-xs text-muted-foreground">is thinking</span>
        <span className="inline-flex gap-1">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.12 }}
          />
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.24 }}
          />
        </span>
      </div>

      {/* shimmer bar */}
      <div className="space-y-2">
        <div className="relative h-2 w-52 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
            animate={{ x: [-80, 260] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="relative h-2 w-40 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
            animate={{ x: [-70, 220] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "linear",
              delay: 0.08,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const SynapseWidget = () => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m Synapse. Ask me about EduSmart features or your study topics in the platform.",
    },
  ]);
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(null);

  const { user } = useUser();
  const PRESET_QUESTIONS =
    user?.role === "faculty" ? FACULTY_PRESETS : STUDENT_PRESETS;

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending],
  );

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const ask = async (text, { isPreset = false } = {}) => {
    // Add a temporary assistant "thinking" message we can remove later
    const thinkingId = `thinking-${Date.now()}`;

    try {
      setSending(true);
      addMessage("user", text);

      setMessages((prev) => [
        ...prev,
        { id: thinkingId, role: "assistant", content: { __thinking: true } },
      ]);

      const data = await synapseService.ask(text, { isPreset });

      // Remove thinking bubble
      setMessages((prev) => prev.filter((m) => m.id !== thinkingId));

      // Prefer structured response
      const assistantPayload =
        data?.answerJson ?? data?.answer ?? "No response";
      addMessage("assistant", assistantPayload);

      if (data?.remaining !== null && data?.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      if (data?.counted) {
        const r = data?.remaining;

        // Only notify when low (example: on the 7th prompt => 3 left)
        if (typeof r === "number" && r === 3) {
          toast(`Synapse: ${r} prompts left today`, {
            icon: "⚠️",
          });
        }

        // Optional: also warn at 1 left (recommended)
        if (typeof r === "number" && r === 1) {
          toast(`Synapse: ${r} prompt left today`, {
            icon: "⚠️",
          });
        }
      }
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== thinkingId));

      if (e?.response?.status === 429) {
        toast.error("Daily Synapse limit reached (10 prompts/day).");
        addMessage("assistant", {
          type: "explain",
          title: "Limit reached",
          answer:
            "You reached today’s Synapse limit (10 prompts). Please try again tomorrow.",
          steps: [],
          notes: [],
        });
      } else {
        toast.error("Synapse error. Try again.");
        addMessage("assistant", {
          type: "explain",
          title: "Synapse error",
          answer: "Something went wrong. Please try again.",
          steps: [],
          notes: [],
        });
      }
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await ask(text, { isPreset: false });
  };

  return (
    <>
      {/* Floating Button (expands LEFT, minimal empty space) */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <motion.button
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onClick={() => setOpen(true)}
          className="relative h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-xl overflow-hidden origin-right"
          style={{ transformOrigin: "right center" }}
          animate={{ width: hover && !open ? 56 + 140 : 56 }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Ask Synapse"
        >
          <div className="h-full w-full flex items-center justify-end pr-4">
            <motion.div
              className="overflow-hidden"
              animate={{
                width: hover && !open ? 140 : 0,
                opacity: hover && !open ? 1 : 0,
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="pr-3 text-white font-black text-sm whitespace-nowrap">
                Ask Synapse
              </div>
            </motion.div>

            <BotMessageSquare className="w-7 h-7 text-white shrink-0" />
          </div>
        </motion.button>
      </div>

      {/* Chat Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed bottom-6 right-6 w-[92vw] max-w-md h-[72vh] bg-card border border-border rounded-2xl shadow-2xl z-[80] flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-base font-black text-foreground">
                    Synapse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {remaining === null
                      ? "10 prompts/day (preset questions are free)"
                      : `${remaining} prompts left today`}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Presets */}
              <div className="p-3 border-b border-border overflow-x-auto">
                <div className="flex gap-2">
                  {PRESET_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      disabled={sending}
                      onClick={() => ask(q, { isPreset: true })}
                      className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground whitespace-nowrap disabled:opacity-60"
                      title="Preset question (does not count)"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m, idx) => {
                  const isThinking =
                    m?.role === "assistant" &&
                    m?.content &&
                    typeof m.content === "object" &&
                    m.content.__thinking === true;

                  return (
                    <div
                      key={m.id ?? idx}
                      className={`max-w-[88%] ${
                        m.role === "user" ? "ml-auto text-right" : "mr-auto"
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl text-sm ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {m.role === "assistant" ? (
                          isThinking ? (
                            <ThinkingBubble />
                          ) : (
                            <AssistantMessage content={m.content} />
                          )
                        ) : (
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSend();
                    }}
                    placeholder="Ask about EduSmart or your study topics..."
                    className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    disabled={sending}
                  />
                  <button
                    onClick={onSend}
                    disabled={!canSend}
                    className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Synapse refuses unrelated/off-platform questions.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SynapseWidget;
