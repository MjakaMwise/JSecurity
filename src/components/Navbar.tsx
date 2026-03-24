import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { animate } from "animejs";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Why JSecurity", href: "/#why" },
  { label: "Industries", href: "/#industries" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current === 3) navigate("/login");
      clickCountRef.current = 0;
    }, 400);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (mobileOpen && navRef.current) {
      const links = navRef.current.querySelectorAll(".mobile-link");
      animate(links, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 400,
        delay: (_el: Element, i: number) => i * 60,
        ease: "outQuart",
      });
    }
  }, [mobileOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "#07122E" : "rgba(7,18,46,0.8)",
        borderBottom: scrolled ? "1px solid rgba(0,212,255,0.1)" : "1px solid transparent",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-1" onClick={handleLogoClick}>
          <span className="text-3xl font-black italic" style={{ color: "#00D4FF", fontFamily: "Calibri, sans-serif" }}>J</span>
          <span className="text-xs font-medium tracking-[0.3em]" style={{ color: "#FFFFFF", fontFamily: "Calibri, sans-serif" }}>SECURITY</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-xs font-mono tracking-wider transition-colors duration-200 hover:text-cyan"
              style={{ color: "#B0BED1" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link to="/#contact" onClick={() => handleNavClick("/#contact")}>
            <Button
              variant="cta"
              size="sm"
              style={{ background: "#00D4FF", color: "#07122E" }}
            >
              Get a Free Assessment
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          style={{ color: "#FFFFFF" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: "#07122E", borderTop: "1px solid rgba(0,212,255,0.1)" }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="mobile-link block py-3 text-sm transition-colors hover:text-cyan"
              style={{ color: "#B0BED1", opacity: 0 }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/#contact" onClick={() => handleNavClick("/#contact")} className="block mt-2">
            <Button
              variant="cta"
              size="sm"
              className="w-full mobile-link"
              style={{ background: "#00D4FF", color: "#07122E", opacity: 0 }}
            >
              Get a Free Assessment
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
