import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, stagger, onScroll } from "animejs";
import { Button } from "@/components/ui/button";
import AnimatedTabs from "@/components/aceternity/AnimatedTabs";
import ThreeDCard from "@/components/aceternity/ThreeDCard";
import TracingBeam from "@/components/aceternity/TracingBeam";
import BackgroundBoxes from "@/components/aceternity/BackgroundBoxes";
import { blogPosts } from "@/lib/blogData";

const categories = [
  { title: "All", value: "All" },
  { title: "Cybersecurity", value: "Cybersecurity" },
  { title: "Physical Security", value: "Physical Security" },
  { title: "Agentic AI", value: "Agentic AI" },
  { title: "Forensics", value: "Forensics" },
  { title: "Consulting", value: "Consulting" },
];

const Blog = () => {
  const [active, setActive] = useState("All");
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const filtered = active === "All" ? blogPosts : blogPosts.filter((p) => p.category === active);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".blog-card");
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
      <section className="relative section-padding text-center overflow-hidden" style={{ background: "#07122E" }}>
        <BackgroundBoxes />
        <div className="container mx-auto max-w-3xl relative z-10">
          <span className="badge-pill mb-4 inline-block">SECURITY INTELLIGENCE</span>
          <h1 className="text-4xl md:text-5xl font-display font-black leading-[0.95] mb-4" style={{ color: "#FFFFFF" }}>
            Insights. Analysis.<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Threat Intel.</em>
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "#B0BED1" }}>The JSecurity security intelligence hub — stay informed, stay protected.</p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding" style={{ background: "#0D1B45" }}>
        <div className="container mx-auto">
          <AnimatedTabs tabs={categories} activeTab={active} onTabChange={setActive} className="mb-10" />

          {/* Featured */}
          {featured && (
            <div className="mb-8 cursor-pointer" onClick={() => navigate(`/blog/${featured.id}`)}>
              <ThreeDCard className="w-full">
                <div className="p-6 md:p-8 rounded-lg transition-all duration-300 hover:shadow-lg" style={{ background: "#0F2050", border: "1px solid rgba(0,212,255,0.15)" }}>
                  <span className="badge-pill text-[10px] mb-4 inline-block">{featured.category}</span>
                  <h2 className="text-2xl md:text-3xl font-display font-black leading-tight mb-3 hover:text-cyan-400 transition-colors" style={{ color: "#FFFFFF" }}>{featured.title}</h2>
                  <p className="mb-4 max-w-2xl text-sm font-light leading-relaxed" style={{ color: "#B0BED1" }}>{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "#008CBF" }}>
                    <span>{featured.author}</span>
                    <span style={{ color: "rgba(0,212,255,0.3)" }}>|</span>
                    <span>{featured.date}</span>
                    <span style={{ color: "rgba(0,212,255,0.3)" }}>|</span>
                    <span>{featured.readTime} read</span>
                  </div>
                </div>
              </ThreeDCard>
            </div>
          )}

          {/* Grid with Tracing Beam */}
          <TracingBeam>
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <div 
                  key={post.id} 
                  className="blog-card rounded-lg p-6 flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  style={{ background: "#0F2050", border: "1px solid rgba(0,212,255,0.12)", willChange: "transform" }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge-pill text-[10px]">{post.category}</span>
                    <span className="text-xs" style={{ color: "#008CBF" }}>{post.readTime} read</span>
                  </div>
                  <h3 className="text-base font-display font-bold mb-2 leading-tight hover:text-cyan-400 transition-colors" style={{ color: "#FFFFFF" }}>{post.title}</h3>
                  <p className="text-sm mb-4 flex-1" style={{ color: "#B0BED1" }}>{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(0,212,255,0.06)", color: "#008CBF" }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: "#008CBF" }}>
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding" style={{ background: "#07122E" }}>
        <div className="container mx-auto text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight mb-3" style={{ color: "#FFFFFF" }}>
            Stay Ahead of<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Threats</em>
          </h2>
          <p className="mb-6 text-sm font-light" style={{ color: "#B0BED1" }}>Get weekly security intelligence delivered to your inbox.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 rounded-lg px-4 text-sm focus:outline-none focus:ring-1"
              style={{ background: "#0F2050", border: "1px solid rgba(0,212,255,0.15)", color: "#FFFFFF" }}
            />
            <Button style={{ background: "#00D4FF", color: "#07122E" }}>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
