import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#07122E" }}>
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-display font-black" style={{ color: "#FFFFFF" }}>404</h1>
        <p className="mb-4 text-sm font-mono tracking-wider uppercase" style={{ color: "#B0BED1" }}>Page not found</p>
        <a href="/" className="text-xs font-mono tracking-wider uppercase hover:underline" style={{ color: "#00D4FF" }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
