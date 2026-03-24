interface BackgroundBoxesProps {
  className?: string;
  rows?: number;
  cols?: number;
}

const BackgroundBoxes = ({ className = "", rows = 8, cols = 12 }: BackgroundBoxesProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "1px",
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(0,212,255,0.04)",
              background: Math.random() > 0.93 ? "rgba(0,212,255,0.03)" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundBoxes;
