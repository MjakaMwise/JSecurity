import { useEffect, useRef, useState } from "react";
import { animate, createTimeline } from "animejs";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = createTimeline({
      defaults: { ease: "outExpo" },
      onComplete: () => {
        setTimeout(onComplete, 300);
      },
    });

    // Scanning line
    tl.add(".loading-scan-line", {
      translateY: ["-100%", "400%"],
      duration: 1500,
      loop: 2,
      ease: "linear",
    }, 0);

    // Logo J letter
    tl.add(".loading-logo-j", {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
    }, 200);

    // Logo SECURITY text
    tl.add(".loading-logo-text", {
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 800,
    }, 500);

    // Progress counter
    const progressObj = { value: 0 };
    tl.add(progressObj, {
      value: [0, 100],
      duration: 2500,
      ease: "inOutQuad",
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
    }, 200);

    // Status texts
    tl.add(".loading-status", {
      opacity: [0, 1, 0],
      duration: 800,
      delay: (_el: Element, i: number) => i * 600,
    }, 300);

    // Fade out entire screen
    tl.add(".loading-container", {
      opacity: [1, 0],
      duration: 500,
    }, 2800);

    return () => { tl.pause(); };
  }, [onComplete]);

  const statusTexts = [
    "INITIALIZING SECURE CONNECTION",
    "LOADING THREAT DATABASE",
    "ESTABLISHING ENCRYPTED TUNNEL",
    "SYSTEM READY",
  ];

  return (
    <div
      ref={containerRef}
      className="loading-container fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#07122E" }}
    >
      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="loading-scan-line absolute left-0 right-0 h-px"
          style={{ background: "#00D4FF", opacity: 0.6 }}
        />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <span
          className="loading-logo-j text-6xl font-black italic"
          style={{ color: "#00D4FF", opacity: 0, fontFamily: "Calibri, sans-serif" }}
        >
          J
        </span>
        <span
          className="loading-logo-text text-lg font-medium tracking-[0.4em]"
          style={{ color: "#FFFFFF", opacity: 0, fontFamily: "Calibri, sans-serif" }}
        >
          SECURITY
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-px mb-4" style={{ background: "rgba(0,212,255,0.2)" }}>
        <div
          className="h-full transition-all duration-100"
          style={{ background: "#00D4FF", width: `${progress}%` }}
        />
      </div>

      {/* Progress counter */}
      <div className="font-mono text-sm mb-6" style={{ color: "#00D4FF" }}>
        {String(progress).padStart(3, "0")}%
      </div>

      {/* Status texts */}
      <div className="h-5 relative">
        {statusTexts.map((text, i) => (
          <div
            key={i}
            className="loading-status absolute inset-0 flex items-center justify-center font-mono text-xs tracking-widest"
            style={{ color: "#008CBF", opacity: 0 }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
