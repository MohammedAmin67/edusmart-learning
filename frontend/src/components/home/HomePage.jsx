import React, { useContext, useRef, useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Moon,
  Sun,
  Users,
  Award,
  Clock,
  Target,
  Star,
  PlayCircle,
  ArrowRight,
  Briefcase,
  Globe,
  Brain,
  Lightbulb,
  Rocket,
  Code,
} from "lucide-react";
import Button from "../shared/Button";
import Card from "../shared/Card";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../App";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const useSimpleBackground = (containerRef, darkMode) => {
  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.offsetWidth || window.innerWidth;
    let height = containerRef.current.offsetHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const createSubtleParticles = () => {
      const particleCount = 30;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const baseColor = darkMode ? 0x6366f1 : 0x3b82f6;
        const particleColor = new THREE.Color(baseColor);
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * 2 + 0.5;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          void main() {
            vColor = color;
            vec3 pos = position;
            pos.y += sin(time * 0.1 + position.x * 0.02) * 1.0;
            pos.x += cos(time * 0.08 + position.z * 0.02) * 0.8;
            vAlpha = sin(time * 0.2 + position.x + position.y) * 0.2 + 0.6;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= vAlpha * 0.4;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      return { points: new THREE.Points(geometry, material), material };
    };

    const particleSystem = createSubtleParticles();
    scene.add(particleSystem.points);

    camera.position.z = 15;

    let running = true;
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      const elapsedTime = clock.getElapsedTime();
      particleSystem.material.uniforms.time.value = elapsedTime;
      camera.position.x = Math.sin(elapsedTime * 0.1) * 0.3;
      camera.position.y = Math.cos(elapsedTime * 0.08) * 0.2;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
      gsap.to(camera.position, {
        x: mouse.x * 0.5,
        y: mouse.y * 0.3,
        duration: 3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.offsetWidth;
      height = containerRef.current.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      particleSystem.points.geometry.dispose();
      particleSystem.material.dispose();
      renderer.dispose();
      if (
        containerRef.current &&
        containerRef.current.contains(renderer.domElement)
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, darkMode]);
};

const useEnhancedAnimations = (refs) => {
  const { heroRef, ctaRef, featuresRef, cardsRef, headerRef, pathsRef } = refs;

  useEffect(() => {
    const masterTimeline = gsap.timeline();

    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -100, opacity: 0 });
      masterTimeline.to(
        headerRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        0,
      );
    }

    if (heroRef.current) {
      const heroElements = heroRef.current.children;
      gsap.set(heroElements, { opacity: 0, y: 80, scale: 0.9 });
      masterTimeline
        .to(
          heroElements[0],
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          0.3,
        )
        .to(
          heroElements[1],
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
          0.6,
        )
        .to(
          heroElements[2],
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          1.0,
        )
        .to(
          heroElements[3],
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
          1.4,
        );
    }

    if (pathsRef.current && pathsRef.current.children.length > 0) {
      const pathCards = Array.from(pathsRef.current.children);
      gsap.set(pathCards, { opacity: 0, y: 60, scale: 0.95 });

      ScrollTrigger.create({
        trigger: pathsRef.current,
        start: "top 75%",
        end: "bottom top",
        onEnter: () => {
          gsap.to(pathCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.to(pathCards, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }

    if (featuresRef.current) {
      gsap.set(featuresRef.current, { opacity: 0, y: 60 });

      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 75%",
        end: "bottom top",
        onEnter: () => {
          gsap.to(featuresRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.to(featuresRef.current, {
            opacity: 0,
            y: 60,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }

    if (cardsRef.current && cardsRef.current.children.length > 0) {
      const featureCards = Array.from(cardsRef.current.children);
      gsap.set(featureCards, { opacity: 0, y: 60, scale: 0.95 });

      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: "top 75%",
        end: "bottom top",
        onEnter: () => {
          gsap.to(featureCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.to(featureCards, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }

    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, scale: 0.95 });

      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        end: "bottom top",
        onEnter: () => {
          gsap.to(ctaRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.to(ctaRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [refs]);
};

const FeatureCard = ({ icon, title, description, index }) => {
  const Icon = icon;
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;
    const card = cardRef.current;
    const icon = iconRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(icon, {
        scale: 1.1,
        duration: 0.5,
        ease: "back.out(1.4)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative text-center p-8 bg-card rounded-xl border border-border shadow-card cursor-pointer transition-all duration-300 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-60" />
          <div
            ref={iconRef}
            className="relative bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-4 inline-block shadow-md border border-primary/20"
          >
            <Icon className="text-primary" size={32} />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </div>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  );
};

const HomePage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoaded, setIsLoaded] = useState(false);

  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const cardsRef = useRef(null);
  const headerRef = useRef(null);
  const pathsRef = useRef(null);

  useSimpleBackground(bgRef, darkMode);
  useEnhancedAnimations({
    heroRef,
    ctaRef,
    featuresRef,
    cardsRef,
    headerRef,
    pathsRef,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const features = [
    {
      icon: Users,
      title: "Collaborative Learning",
      description:
        "Connect with peers, join study groups, and learn together in our vibrant community of ambitious learners.",
    },
    {
      icon: Target,
      title: "Goal-Oriented Tracking",
      description:
        "Set learning objectives, track milestones, and celebrate achievements with our comprehensive progress system.",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Tech Content",
      description:
        "Dive deep into coding, web, app development, computer science, and more—built for tomorrow's technologists.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Learn at your own pace with 24/7 access to courses, live sessions, and recorded lectures that fit your lifestyle.",
    },
    {
      icon: ShieldCheck,
      title: "Progress and Privacy",
      description:
        "Your learning progress is always private and secure, giving you peace of mind as you grow.",
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description:
        "New courses and features are added regularly to keep your skills sharp and up-to-date.",
    },
  ];

  const learningPaths = [
    {
      title: "Web Development",
      description:
        "Master front-end and back-end web technologies and frameworks.",
      icon: "🌐",
    },
    {
      title: "App Development",
      description:
        "Learn to build mobile and desktop applications using modern tools.",
      icon: "📱",
    },
    {
      title: "Programming Fundamentals",
      description:
        "Strengthen your logic and problem-solving with core programming skills.",
      icon: "💡",
    },
    {
      title: "Computer Science Basics",
      description:
        "Grasp the essentials: algorithms, data structures, and more.",
      icon: "🧠",
    },
  ];

  const highlights = [
    {
      icon: Lightbulb,
      title: "Learn by Doing",
      description: "Hands-on projects and real-world applications",
    },
    {
      icon: Rocket,
      title: "Career Ready",
      description: "Industry-relevant skills for modern tech roles",
    },
    {
      icon: Code,
      title: "Expert Curriculum",
      description: "Crafted by professionals from top tech companies",
    },
  ];

  return (
    <div
      className={`bg-background min-h-screen relative overflow-x-hidden transition-all duration-700 ${!isLoaded ? "opacity-0" : "opacity-100"}`}
    >
      {/* HEADER */}
      <header
        ref={headerRef}
        className="bg-card/95 shadow-sm sticky top-0 z-50 backdrop-blur-xl border-b border-border"
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="hidden md:block">
                <span className="text-3xl font-black gradient-text">
                  EduSmart
                </span>
                <p className="text-sm text-muted-foreground font-medium">
                  Transform Your Future
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted transition-all duration-300 hover:scale-105"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  Login to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden pt-8 pb-16"
        style={{ background: "var(--section-hero)" }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse-subtle" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl opacity-70 animate-pulse-subtle"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/8 dark:bg-primary/5 rounded-full blur-3xl opacity-50" />
        </div>

        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-[0.05] dark:opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-6 z-10 relative">
          <div
            ref={heroRef}
            className="flex flex-col items-center text-center space-y-5"
          >
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-foreground leading-tight">
              Master Your <span className="gradient-text">Future</span>
              <br />
              <span className="text-primary">Today</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed font-medium">
              From learners to leaders—reshaping how the world gains tech
              skills. Code, create, and launch projects that matter in today's
              tech landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link to="/signup">
                <button className="text-xl px-9 py-5 bg-card text-foreground border-2 border-border rounded-2xl font-bold hover:border-primary hover:bg-card/80 transition-all duration-300 inline-flex items-center gap-3">
                  Start Learning Free
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/login">
                <button className="text-xl px-12 py-5 bg-card text-foreground border-2 border-border rounded-2xl font-bold hover:border-primary hover:bg-card/80 transition-all duration-300 inline-flex items-center gap-3">
                  Explore Courses
                  <BookOpen size={20} />
                </button>
              </Link>
            </div>
            <button
              onClick={scrollToFeatures}
              className="hover:scale-110 transition-all duration-300 mt-4"
              aria-label="Scroll to features"
            >
              <ChevronDown className="text-primary w-12 h-12 drop-shadow-sm animate-bounce" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-[2] hidden lg:flex gap-6 opacity-95">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-[200px] px-6 py-4 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <highlight.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                {highlight.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section
        className="w-full py-20"
        style={{ background: "var(--section-alternate)" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Choose Your{" "}
              <span className="gradient-text-primary">Learning Path</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore focused technology tracks designed for modern developers
              and aspiring tech professionals.
            </p>
          </div>
          <div
            ref={pathsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {learningPaths.map((path, index) => (
              <div
                key={index}
                className="group p-6 bg-card rounded-2xl border border-border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {path.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {path.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {path.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBTLE GLOW SEPARATOR - Only visible in dark mode */}
      <div className="section-glow-divider dark:block hidden" />

      {/* FEATURES */}
      <section
        id="features-section"
        className="w-full py-24 bg-background relative overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div ref={featuresRef} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8">
              Why <span className="gradient-text-primary">EduSmart</span> Leads
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience the future of education with cutting-edge technology,
              personalized learning, and a global community of ambitious
              learners
            </p>
          </div>
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL CTA */}
      <section
        className="w-full py-24 relative overflow-hidden"
        style={{ background: "var(--gradient-cta)" }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--cta-text)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--cta-text)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          ref={ctaRef}
          className="w-full max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight"
            style={{ color: "hsl(var(--cta-text))" }}
          >
            Ready to{" "}
            <span style={{ color: "hsl(var(--cta-highlight))" }}>
              Transform
            </span>{" "}
            Your Career?
          </h2>
          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90"
            style={{ color: "hsl(var(--cta-text))" }}
          >
            Join thousands of learners building their tech careers with
            EduSmart.
          </p>
          <Link to="/signup">
            <button className="text-xl px-12 py-5 bg-white text-gray-900 hover:bg-gray-50 dark:bg-card dark:text-foreground dark:hover:bg-card/90 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 border-2 border-transparent dark:border-primary/30">
              Create Your Free Account
              <ArrowRight size={20} className="text-primary" />
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-card/98 text-foreground py-12 border-t border-border">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="font-black text-2xl gradient-text-primary">
              EduSmart
            </span>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Transforming classrooms into adventure zones
          </p>
          <p className="text-muted-foreground text-base">
            &copy; {new Date().getFullYear()} EduSmart. Transforming education,
            one learner at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
