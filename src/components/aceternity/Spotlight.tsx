interface SpotlightProps {
  className?: string;
  fill?: string;
}

const Spotlight = ({ className = "", fill = "#00D4FF" }: SpotlightProps) => {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <svg
        width="600"
        height="800"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="300"
          cy="0"
          rx="250"
          ry="600"
          fill={fill}
          fillOpacity="0.04"
        />
      </svg>
    </div>
  );
};

export default Spotlight;
