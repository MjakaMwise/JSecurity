import { useRef, useEffect } from "react";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  as?: React.ElementType;
  borderClassName?: string;
  onClick?: () => void;
}

const MovingBorder = ({
  children,
  duration = 3000,
  className = "",
  containerClassName = "",
  borderClassName = "",
  as: Component = "button",
  ...props
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const circle = circleRef.current;
    if (!path || !circle) return;

    let progress = 0;
    let animId: number;
    const perimeter = 2 * (100 + 100); // rect perimeter in viewbox units

    const step = () => {
      progress = (progress + (1 / (duration / 16))) % 1;
      const dist = progress * perimeter;
      let x = 0, y = 0;
      if (dist < 100) { x = dist; y = 0; }
      else if (dist < 200) { x = 100; y = dist - 100; }
      else if (dist < 300) { x = 300 - dist; y = 100; }
      else { x = 0; y = 400 - dist; }
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [duration]);

  return (
    <Component className={`relative inline-flex ${containerClassName}`} {...props}>
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect ref={pathRef} x="0" y="0" width="100" height="100" fill="none" stroke="none" />
          <circle ref={circleRef} cx="0" cy="0" r="20" fill="#00D4FF" opacity="0.3" />
        </svg>
      </div>
      <div className={`relative z-10 border border-cyan/30 rounded-lg ${className}`}>
        {children}
      </div>
    </Component>
  );
};

export default MovingBorder;
