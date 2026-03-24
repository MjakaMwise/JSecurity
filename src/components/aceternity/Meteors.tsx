interface MeteorsProps {
  number?: number;
}

const Meteors = ({ number = 15 }: MeteorsProps) => {
  const meteors = Array.from({ length: number }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 2 + 2}s`,
  }));

  return (
    <>
      <style>{`
        @keyframes meteor {
          0% { transform: translateY(-100px) translateX(0) rotate(215deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(800px) translateX(-300px) rotate(215deg); opacity: 0; }
        }
      `}</style>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute pointer-events-none"
          style={{
            left: m.left,
            top: "-100px",
            width: "1px",
            height: "20px",
            background: "#00D4FF",
            opacity: 0.3,
            animation: `meteor ${m.duration} linear ${m.delay} infinite`,
          }}
        />
      ))}
    </>
  );
};

export default Meteors;
