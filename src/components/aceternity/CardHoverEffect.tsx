import { useRef, useState } from "react";

interface CardHoverEffectProps {
  items: {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag: string;
  }[];
  className?: string;
}

const CardHoverEffect = ({ items, className = "" }: CardHoverEffectProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Hover background */}
          <div
            className="absolute -inset-px rounded-lg transition-opacity duration-300"
            style={{
              background: "#00D4FF",
              opacity: hoveredIndex === idx ? 0.06 : 0,
            }}
          />
          <div
            className="absolute inset-0 rounded-lg border transition-all duration-300"
            style={{
              borderColor: hoveredIndex === idx ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.12)",
            }}
          />
          <div className="relative z-10 p-6 rounded-lg" style={{ background: "#0D1B45" }}>
            <div className="mb-4 text-cyan">{item.icon}</div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <span className="badge-pill text-[10px]">{item.tag}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardHoverEffect;
