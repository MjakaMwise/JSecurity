import { useEffect, useRef, useState } from "react";

interface InfiniteMovingCardsProps {
  items: {
    quote: string;
    name: string;
    title: string;
    rating: number;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}

const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  className = "",
}: InfiniteMovingCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current || !containerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const cloned = item.cloneNode(true);
      scrollerRef.current?.appendChild(cloned);
    });
    setStart(true);
  }, []);

  const speedMap = { fast: "20s", normal: "40s", slow: "80s" };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <ul
        ref={scrollerRef}
        className="flex gap-4 w-max"
        style={{
          animation: start ? `scroll ${speedMap[speed]} linear infinite` : "none",
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex-shrink-0 w-[350px] p-6 rounded-lg"
            style={{ background: "#0D1B45", border: "1px solid rgba(0,212,255,0.12)" }}
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill={i < item.rating ? "#FFD700" : "none"} stroke={i < item.rating ? "#FFD700" : "#B0BED1"} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-brand-gray mb-4 leading-relaxed">"{item.quote}"</p>
            <div>
              <div className="text-sm font-semibold text-foreground">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.title}</div>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default InfiniteMovingCards;
