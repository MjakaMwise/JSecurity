import { useState, useEffect, useRef } from "react";
import { CheckCircle, ExternalLink, Star } from "lucide-react";
import { animate, stagger } from "animejs";
import { Button } from "@/components/ui/button";
import AnimatedTabs from "@/components/aceternity/AnimatedTabs";
import InfiniteMovingCards from "@/components/aceternity/InfiniteMovingCards";

const starBreakdown = [
  { stars: 5, pct: 89 },
  { stars: 4, pct: 8 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

const platforms = [
  { name: "Google", rating: 4.9, reviews: 189, desc: "Our highest-volume review platform" },
  { name: "Facebook", rating: 4.8, reviews: 34, desc: "Community reviews and recommendations" },
  { name: "Clutch", rating: 5.0, reviews: 12, desc: "Verified B2B security reviews" },
  { name: "Trustpilot", rating: 4.7, reviews: 12, desc: "Independent consumer trust ratings" },
];

const featured = [
  { quote: "JSecurity transformed our entire security posture. Their integrated approach — physical guards, cybersecurity, and CCTV — eliminated the chaos of managing multiple vendors. Our branches are safer, our data is protected, and we have a single point of accountability.", name: "Catherine Maina", title: "CEO, Heritage Trust Bank", rating: 5 },
  { quote: "Working across East Africa, we needed a security partner who understands both digital threats and on-ground realities. JSecurity's team secured our Nairobi office, hardened our networks, and their 24/7 monitoring gives our global team peace of mind.", name: "Dr. Erik Johansson", title: "IT Director, Nordic Aid Foundation", rating: 5 },
];

const filterCategories = [
  { title: "All", value: "All" },
  { title: "Physical Security", value: "Physical Security" },
  { title: "Cybersecurity", value: "Cybersecurity" },
  { title: "CCTV", value: "CCTV" },
  { title: "Executive Protection", value: "Executive Protection" },
];

const reviews = [
  { name: "John Kamau", role: "Operations Manager, KCB Branch", date: "Feb 2025", rating: 5, text: "Outstanding physical security services. Guards are professional, well-trained, and proactive. Incident response has been flawless.", service: "Physical Security", verified: true },
  { name: "Dr. Lucy Ndegwa", role: "Administrator, Aga Khan Hospital", date: "Jan 2025", rating: 5, text: "Their CCTV installation and monitoring transformed our hospital security. The AI-powered analytics catch things our old system missed entirely.", service: "CCTV", verified: true },
  { name: "Peter Macharia", role: "Principal, Brookhouse School", date: "Jan 2025", rating: 5, text: "Student safety is paramount. JSecurity's comprehensive campus security solution gives parents and staff complete confidence.", service: "Physical Security", verified: true },
  { name: "Angela Osei", role: "CTO, Safaricom Dealer Network", date: "Dec 2024", rating: 4, text: "Solid cybersecurity audit and implementation. They identified vulnerabilities we didn't know existed and fixed them methodically.", service: "Cybersecurity", verified: true },
  { name: "Hassan Ali", role: "Estate Manager, Runda Gardens", date: "Dec 2024", rating: 5, text: "Residential security done right. Patrols are consistent, access control is tight, and the monthly reports are incredibly detailed.", service: "Physical Security", verified: true },
  { name: "Jane Wanjiku", role: "Country Director, USAID Partner", date: "Nov 2024", rating: 5, text: "Executive protection for our visiting delegates was impeccable. Discreet, professional, and perfectly coordinated.", service: "Executive Protection", verified: true },
  { name: "Michael Otieno", role: "IT Manager, Equity Bank", date: "Nov 2024", rating: 5, text: "Their network security assessment revealed critical gaps. Post-implementation, we've had zero incidents in 8 months.", service: "Cybersecurity", verified: true },
  { name: "Rebecca Chebet", role: "Mall Manager, Garden City", date: "Oct 2024", rating: 5, text: "Managing security for a large mall is complex. JSecurity simplified everything with their integrated guard + CCTV approach.", service: "CCTV", verified: true },
  { name: "David Mwangi", role: "CFO, East African Breweries", date: "Oct 2024", rating: 5, text: "Executive protection during our regional conferences has been exceptional. Highly recommend for corporate events.", service: "Executive Protection", verified: true },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill={i < count ? "#FFD700" : "none"} stroke={i < count ? "#FFD700" : "#B0BED1"} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const Reviews = () => {
  const [active, setActive] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const filtered = active === "All" ? reviews : reviews.filter((r) => r.service === active);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".review-card");
      cards.forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        (el as HTMLElement).style.transform = "translateY(20px)";
      });
      animate(cards, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        delay: stagger(60),
        ease: "outQuart",
      });
    }
  }, [active]);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="section-padding text-center" style={{ background: "#07122E" }}>
        <div className="container mx-auto max-w-3xl">
          <span className="badge-pill mb-4 inline-block">CLIENT TESTIMONIALS</span>
          <h1 className="text-4xl md:text-5xl font-display font-black leading-[0.95] mb-4" style={{ color: "#FFFFFF" }}>
            Trusted By<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Kenya's Best.</em>
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "#B0BED1" }}>Real results. Real clients. Real protection.</p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="section-padding" style={{ background: "#0D1B45" }}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <div className="text-6xl font-display font-black" style={{ color: "#FFFFFF" }}>4.9</div>
              <div className="flex justify-center md:justify-start mt-2 mb-2">
                <Stars count={5} />
              </div>
              <p style={{ color: "#B0BED1" }}>Based on <span style={{ color: "#00D4FF" }} className="font-semibold">247+ reviews</span></p>
            </div>
            <div className="space-y-2">
              {starBreakdown.map((s) => (
                <div key={s.stars} className="flex items-center gap-3">
                  <span className="text-sm w-6" style={{ color: "#B0BED1" }}>{s.stars}<Star className="inline w-3 h-3 ml-0.5" style={{ color: "#FFD700" }} /></span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#0F2050" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: "#FFD700" }} />
                  </div>
                  <span className="text-sm w-10 text-right" style={{ color: "#B0BED1" }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((p) => (
              <div key={p.name} className="p-5 text-center rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#0D1B45", border: "1px solid rgba(0,212,255,0.12)", willChange: "transform" }}>
                <h3 className="font-display font-black text-lg mb-1" style={{ color: "#FFFFFF" }}>{p.name}</h3>
                <p className="text-xs mb-3" style={{ color: "#B0BED1" }}>{p.desc}</p>
                <div className="flex justify-center mb-1"><Stars count={Math.round(p.rating)} /></div>
                <div className="text-sm font-semibold" style={{ color: "#00D4FF" }}>{p.rating} <span className="font-normal" style={{ color: "#B0BED1" }}>({p.reviews})</span></div>
                <button className="mt-3 text-xs flex items-center gap-1 mx-auto hover:underline" style={{ color: "#00D4FF" }}>
                  Leave a Review <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Marquee */}
      <section className="py-12" style={{ background: "#0D1B45" }}>
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight" style={{ color: "#FFFFFF" }}>
            Featured<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Testimonials</em>
          </h2>
        </div>
        <InfiniteMovingCards items={featured} speed="slow" />
      </section>

      {/* Reviews Grid */}
      <section className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto">
          <AnimatedTabs tabs={filterCategories} activeTab={active} onTabChange={setActive} className="mb-8" />

          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => (
              <div key={`${r.name}-${i}`} className="review-card rounded-lg p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#0D1B45", border: "1px solid rgba(0,212,255,0.12)", willChange: "transform" }}>
                <div className="flex items-center justify-between mb-3">
                  <Stars count={r.rating} />
                  <span className="text-xs" style={{ color: "#008CBF" }}>{r.date}</span>
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "#B0BED1" }}>"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{r.name}</div>
                    <div className="text-xs" style={{ color: "#008CBF" }}>{r.role}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge-pill text-[9px]">{r.service}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "#48BB78" }}>
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review CTA */}
      <section className="section-padding text-center" style={{ background: "#0D1B45" }}>
        <div className="container mx-auto max-w-xl">
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight mb-3" style={{ color: "#FFFFFF" }}>
            Share Your<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Experience</em>
          </h2>
          <p className="mb-6 text-sm font-light" style={{ color: "#B0BED1" }}>Are you a JSecurity client? We'd love to hear your feedback.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Google", "Facebook", "Clutch"].map((p) => (
              <Button key={p} size="sm"
                style={{ background: "transparent", color: "#FFFFFF", border: "1px solid rgba(0,212,255,0.3)" }}>
                <ExternalLink className="w-3 h-3 mr-1" /> Review on {p}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
