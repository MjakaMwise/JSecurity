import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#07122E", borderTop: "1px solid rgba(0,212,255,0.1)" }} className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-3xl font-black italic" style={{ color: "#00D4FF", fontFamily: "Calibri, sans-serif" }}>J</span>
            <span className="text-xs font-medium tracking-[0.3em]" style={{ color: "#FFFFFF", fontFamily: "Calibri, sans-serif" }}>SECURITY</span>
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ color: "#B0BED1" }}>
            <a href="#" className="hover:text-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan transition-colors">Terms</a>
            <a href="mailto:info@jsecurity.co.ke" className="hover:text-cyan transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs" style={{ color: "#B0BED1" }}>
          &copy; { new Date().getFullYear() } JSecurity Ltd. All rights reserved. PSRA Licensed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
