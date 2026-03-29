import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { animate, onScroll } from "animejs";

import { Shield, Lock, Camera, ClipboardList, UserCheck, Siren, Microscope, Bot, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import TypewriterEffect from "@/components/aceternity/TypewriterEffect";
import Spotlight from "@/components/aceternity/Spotlight";
import Meteors from "@/components/aceternity/Meteors";
import CardHoverEffect from "@/components/aceternity/CardHoverEffect";
import CCTVAnimation from "@/components/CCTVAnimation";
import ContactSection from "@/components/ContactSection";
import { industryEntries } from "@/components/SvgIcons";

const services = [
  { icon: <Shield className="w-8 h-8" />, title: "Physical Security", description: "Elite-trained guards providing comprehensive on-site protection for your premises.", tag: "On-site Protection" },
  { icon: <Lock className="w-8 h-8" />, title: "Cybersecurity Solutions", description: "Advanced threat detection, penetration testing, and network defense.", tag: "Threat Intelligence" },
  { icon: <Camera className="w-8 h-8" />, title: "CCTV & Surveillance", description: "AI-powered surveillance systems with real-time monitoring and analytics.", tag: "24/7 Monitoring" },
  { icon: <ClipboardList className="w-8 h-8" />, title: "Security Consulting", description: "Risk assessments and security strategy tailored to your organization.", tag: "Strategic Advisory" },
  { icon: <UserCheck className="w-8 h-8" />, title: "Executive Protection", description: "Discrete close protection for executives and high-profile individuals.", tag: "Close Protection" },
  { icon: <Siren className="w-8 h-8" />, title: "Emergency Response", description: "Rapid deployment teams with guaranteed 15-minute response across Nairobi.", tag: "15-Min Response" },
  { icon: <Microscope className="w-8 h-8" />, title: "Forensics Services", description: "Digital and physical forensic investigation with court-admissible reporting.", tag: "Digital Forensics" },
  { icon: <Bot className="w-8 h-8" />, title: "Agentic Security", description: "Autonomous AI agents that detect, analyze, and respond to threats in real-time.", tag: "AI-Driven Autonomy" },
  { icon: <Globe className="w-8 h-8" />, title: "Networking & Network Services", description: "Enterprise network design, implementation, and security hardening.", tag: "Network Infrastructure" },
];

const reasons = [
  { num: "01", title: "Single Security Partner", desc: "Physical, digital, and consulting — all under one roof. No fragmented vendors." },
  { num: "02", title: "Certified & Vetted Personnel", desc: "PSRA-licensed, DCI-cleared professionals with ongoing training requirements." },
  { num: "03", title: "Technology-First Operations", desc: "AI analytics, real-time dashboards, and automated threat response systems." },
  { num: "04", title: "Proven 15-Minute Response SLA", desc: "Industry-leading response time backed by strategically positioned rapid units." },
  { num: "05", title: "Regulatory Compliance Built-In", desc: "Kenya Data Protection Act, PSRA, ISO 27001 — compliance is our baseline." },
  { num: "06", title: "Transparent Monthly Reporting", desc: "Detailed incident reports, KPI dashboards, and performance reviews." },
];

const stats = [
  { value: "500+", label: "Clients Protected" },
  { value: "15 MIN", label: "Avg Response Time" },
  { value: "24/7", label: "Monitoring & Support" },
  { value: "12", label: "Years of Excellence" },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero shapes scroll-driven parallax
    if (heroRef.current) {
      const shapes = heroRef.current.querySelectorAll(".hero-shape");
      if (shapes.length > 0) {
        animate(shapes, {
          translateY: (_el: Element, i: number) => [0, (i % 2 === 0 ? -80 : 80)],
          rotate: (_el: Element, i: number) => [0, (i % 2 === 0 ? 90 : -60)],
          duration: 1000,
          ease: "linear",
          autoplay: onScroll({
            target: heroRef.current,
            sync: true,
          }),
        });
      }
    }

  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section ref={heroRef} className="relative section-padding min-h-[90vh] flex items-center overflow-hidden" style={{ background: "#07122E" }}>
        <Spotlight className="top-0 left-1/4 opacity-40" />
        <Meteors number={12} />

        {/* Floating geometric shapes */}
        <svg className="hero-shape absolute top-20 left-[10%] opacity-20 will-change-transform" width="60" height="60" viewBox="0 0 60 60" style={{ color: "#00D4FF" }}>
          <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="hero-shape absolute top-32 right-[15%] opacity-15 will-change-transform" width="40" height="40" viewBox="0 0 40 40" style={{ color: "#008CBF" }}>
          <polygon points="20,2 38,11 38,31 20,40 2,31 2,11" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="hero-shape absolute bottom-32 left-[20%] opacity-10 will-change-transform" width="80" height="80" viewBox="0 0 80 80" style={{ color: "#00D4FF" }}>
          <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" />
        </svg>
        <svg className="hero-shape absolute top-1/2 right-[8%] opacity-15 will-change-transform" width="30" height="30" viewBox="0 0 30 30" style={{ color: "#00D4FF" }}>
          <rect x="2" y="2" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 15 15)" />
        </svg>
        <div className="hero-shape absolute bottom-20 right-[25%] w-2 h-2 rounded-full opacity-30 will-change-transform" style={{ background: "#00D4FF" }} />
        <div className="hero-shape absolute top-40 left-[40%] w-1 h-16 opacity-10 will-change-transform" style={{ background: "#008CBF" }} />

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <span className="badge-pill mx-auto mb-6 w-fit">KENYA'S INTEGRATED SECURITY LEADER</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black leading-[0.95] mb-6" style={{ color: "#FFFFFF" }}>
            <TypewriterEffect
              words={[
                { text: "PROTECT WHAT" },
                { text: "MATTERS MOST.", className: "text-cyan italic font-normal" },
              ]}
            />
          </h1>
          <div className="rule mx-auto" style={{ background: "#00D4FF" }} />
          <p className="text-sm md:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed" style={{ color: "#B0BED1" }}>
            Integrated physical + digital security for businesses and individuals across Kenya. One partner. Total protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/#contact">
              <Button size="lg" style={{ background: "#00D4FF", color: "#07122E", border: "1px solid #00D4FF" }}>
                Request Free Assessment
              </Button>
            </Link>

          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="stat-number">{s.value}</div>
                <div className="text-xs font-mono mt-2 tracking-wider uppercase" style={{ color: "#B0BED1", opacity: 0.6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section-padding" style={{ background: "#0D1B45" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal-item">
            <span className="badge-pill mb-4 inline-block">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight" style={{ color: "#FFFFFF" }}>
              Comprehensive<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Security Solutions</em>
            </h2>
          </div>
          <div className="reveal-item">
            <CardHoverEffect
              items={services.map((s) => ({
                icon: s.icon,
                title: s.title,
                description: s.description,
                tag: s.tag,
              }))}
            />
          </div>
        </div>
      </section>

      {/* CCTV Animation */}
      <section className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <span className="badge-pill mb-4 inline-block">LIVE MONITORING</span>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight" style={{ color: "#FFFFFF" }}>
              24/7<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Surveillance</em> Operations
            </h2>
            <div className="rule mx-auto" style={{ background: "#00D4FF" }} />
            <p className="mt-3 max-w-lg mx-auto text-sm font-light leading-relaxed" style={{ color: "#B0BED1" }}>
              Our AI-powered CCTV systems provide real-time threat detection and automated response protocols.
            </p>
          </div>
          <CCTVAnimation />
        </div>
      </section>

      {/* Why JSecurity */}
      <section id="why" className="section-padding" style={{ background: "#0D1B45" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16 reveal-item">
            <span className="badge-pill mb-4 inline-block">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight" style={{ color: "#FFFFFF" }}>
              Why<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>JSecurity</em>?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div key={r.num} className="glass-card p-6 reveal-item transition-all duration-300 hover:-translate-y-0.5" style={{ willChange: "transform" }}>
                <span className="text-3xl font-display font-black" style={{ color: "#00D4FF", opacity: 0.15 }}>{r.num}</span>
                <h3 className="text-base font-display font-bold mt-3 mb-2" style={{ color: "#FFFFFF" }}>{r.title}</h3>
                <p className="text-xs font-light leading-relaxed" style={{ color: "#B0BED1" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto text-center">
          <span className="badge-pill mb-4 inline-block reveal-item">INDUSTRIES WE SERVE</span>
          <h2 className="text-3xl md:text-4xl font-display font-black mb-12 reveal-item leading-tight" style={{ color: "#FFFFFF" }}>
            Securing<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Every Sector</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industryEntries.map((ind) => (
              <span key={ind.label} className="industry-chip reveal-item" style={{ willChange: "transform" }}>
                <ind.icon className="w-4 h-4" style={{ color: "#008CBF" }} />
                {ind.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>
  );
};

export default Index;
