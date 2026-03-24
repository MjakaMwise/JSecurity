import { useEffect, useRef } from "react";

interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

const TracingBeam = ({ children, className = "" }: TracingBeamProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !beamRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, Math.min(1, (windowHeight - containerTop) / (containerHeight + windowHeight)));
      beamRef.current.style.height = `${scrolled * 100}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px" style={{ background: "rgba(0,212,255,0.1)" }}>
        <div
          ref={beamRef}
          className="absolute top-0 left-0 w-full"
          style={{ background: "#00D4FF", height: "0%" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: "#00D4FF" }} />
      </div>
      <div className="pl-12 md:pl-20">{children}</div>
    </div>
  );
};

export default TracingBeam;
