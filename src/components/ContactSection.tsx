import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, User, Building, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", company: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputStyle = "w-full h-11 px-4 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1";

  return (
    <section id="contact" className="section-padding" style={{ background: "#0D1B45" }}>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="badge-pill mb-4 inline-block">GET IN TOUCH</span>
          <h2 className="text-3xl md:text-4xl font-display font-black leading-tight" style={{ color: "#FFFFFF" }}>
            Ready to Secure<br /><em className="font-normal italic" style={{ color: "#00D4FF" }}>Your World</em>?
          </h2>
          <p className="mt-3 max-w-lg mx-auto" style={{ color: "#B0BED1" }}>
            Get a free, no-obligation security site assessment. Our team responds within 2 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              {[
                { icon: Mail, label: "Email", value: "info@jsecurity.co.ke", href: "mailto:info@jsecurity.co.ke" },
                { icon: Phone, label: "Phone", value: "+254 700 000 000", href: "tel:+254700000000" },
                { icon: MapPin, label: "Location", value: "Nairobi, Kenya", href: undefined },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.15)" }}>
                    <item.icon className="w-5 h-5" style={{ color: "#00D4FF" }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-0.5" style={{ color: "#008CBF" }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm hover:text-cyan transition-colors" style={{ color: "#FFFFFF" }}>
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm" style={{ color: "#FFFFFF" }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <div className="text-sm font-display font-semibold mb-2" style={{ color: "#FFFFFF" }}>Response SLA</div>
              <div className="text-xs" style={{ color: "#B0BED1" }}>
                Assessment requests receive a response within <span style={{ color: "#00D4FF" }}>2 hours</span> during business hours.
                Emergency requests are handled <span style={{ color: "#00D4FF" }}>24/7</span>.
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            {submitted && (
              <div className="p-3 rounded-lg text-sm text-center" style={{ background: "rgba(72,187,120,0.1)", border: "1px solid rgba(72,187,120,0.3)", color: "#48BB78" }}>
                Message sent successfully! We'll respond within 2 hours.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#008CBF" }} />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={inputStyle}
                    style={{ background: "#0F2050", border: `1px solid ${errors.name ? "#f87171" : "rgba(0,212,255,0.15)"}`, paddingLeft: "2.5rem", color: "#FFFFFF" }}
                  />
                </div>
                {errors.name && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.name}</p>}
              </div>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#008CBF" }} />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputStyle}
                    style={{ background: "#0F2050", border: `1px solid ${errors.email ? "#f87171" : "rgba(0,212,255,0.15)"}`, paddingLeft: "2.5rem", color: "#FFFFFF" }}
                  />
                </div>
                {errors.email && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.email}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#008CBF" }} />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputStyle}
                  style={{ background: "#0F2050", border: "1px solid rgba(0,212,255,0.15)", paddingLeft: "2.5rem", color: "#FFFFFF" }}
                />
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#008CBF" }} />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={inputStyle}
                  style={{ background: "#0F2050", border: "1px solid rgba(0,212,255,0.15)", paddingLeft: "2.5rem", color: "#FFFFFF" }}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4" style={{ color: "#008CBF" }} />
                <textarea
                  placeholder="Describe your security needs *"
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full px-4 pt-3 pb-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 resize-none"
                  style={{ background: "#0F2050", border: `1px solid ${errors.message ? "#f87171" : "rgba(0,212,255,0.15)"}`, paddingLeft: "2.5rem", color: "#FFFFFF" }}
                />
              </div>
              {errors.message && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              style={{ background: "#00D4FF", color: "#07122E" }}
            >
              <Send className="w-4 h-4" />
              Request Free Assessment
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
