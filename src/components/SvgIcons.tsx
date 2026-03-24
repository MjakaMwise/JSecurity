import {
  Shield, Lock, Camera, ClipboardList, UserCheck, Siren, Microscope, Bot, Globe,
  Landmark, HeartPulse, Building2, GraduationCap, Factory, Hotel,
  ShoppingBag, Zap, Earth, Briefcase, Home, Plane
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Service icons mapping
export const serviceIcons: Record<string, LucideIcon> = {
  "Physical Security": Shield,
  "Cybersecurity Solutions": Lock,
  "CCTV & Surveillance": Camera,
  "Security Consulting": ClipboardList,
  "Executive Protection": UserCheck,
  "Emergency Response": Siren,
  "Forensics Services": Microscope,
  "Agentic Security": Bot,
  "Networking & Network Services": Globe,
};

// Industry icons mapping
export const industryEntries: { icon: LucideIcon; label: string }[] = [
  { icon: Landmark, label: "Banking & Finance" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Building2, label: "Government & Public Sector" },
  { icon: GraduationCap, label: "Education & Schools" },
  { icon: Factory, label: "Manufacturing & Warehousing" },
  { icon: Hotel, label: "Hospitality & Tourism" },
  { icon: ShoppingBag, label: "Retail & Shopping Malls" },
  { icon: Zap, label: "Energy & Infrastructure" },
  { icon: Earth, label: "NGOs & International Organisations" },
  { icon: Briefcase, label: "Corporate Offices" },
  { icon: Home, label: "Residential Estates" },
  { icon: Plane, label: "Logistics & Aviation" },
];
