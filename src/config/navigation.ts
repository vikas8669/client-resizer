import {
  FileText,
  CreditCard,
  Printer,
  BookOpen,
  Heart,
  Sparkles,
  Scissors,
  ShieldCheck,
  Crop,
  UserCheck,
  LucideIcon,
  ScanFace
} from "lucide-react";

export interface NavSubItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: LucideIcon;
  external?: boolean;
}

export interface NavChildItem {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  external?: boolean;
  subItems?: NavSubItem[];
}

export interface NavCategory {
  id: string;
  title: string;
  href?: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  items?: NavChildItem[];
}

export const NAVIGATION_CONFIG: NavCategory[] = [
  {
    id: "ecard-cutter",
    title: "E-Card Cutter",
    description: "Crop and print Aadhaar, PAN, DL, and Voter IDs to exact physical size",
    icon: Scissors,
    badge: "New",
    items: [
      {
        title: "Aadhaar Card Cutter",
        href: "/ecard-cutter/aadhaar",
        description: "Crop single or dual Aadhaar card to exact physical dimensions",
        icon: ShieldCheck,
      },
      {
        title: "PAN Card Cutter",
        href: "/ecard-cutter/pan",
        description: "Format e-PAN to official ID-1 card format (85.60 × 53.98 mm)",
        icon: CreditCard,
      },
      {
        title: "Driving Licence Cutter",
        href: "/ecard-cutter/driving-licence",
        description: "Smart card DL & state licence format presets",
        icon: UserCheck,
      },
      {
        title: "Voter ID Card Cutter",
        href: "/ecard-cutter/voter-id",
        description: "E-EPIC Voter Card format with standard sizing",
        icon: FileText,
      },
      {
        title: "Passport / ID Card Cutter",
        href: "/ecard-cutter/passport-id",
        description: "Standard ID-1, ID-2, and ID-3 passport card formats",
        icon: UserCheck,
      },
      {
        title: "Other Document Cutter",
        href: "/ecard-cutter/other",
        description: "Custom width & height in mm for any card or certificate",
        icon: Crop,
      },
    ],
  },
  {
    id: "resume-builder",
    title: "Resume",
    href: "/resume-builder",
    description: "Build ATS-friendly modern resumes with live preview and PDF export",
    icon: FileText,
    badge: "New",
  },
  {
    id: "print-download",
    title: "Print & Download",
    description: "Passport grid layouts and high-resolution PDF print sheets",
    icon: Printer,
    items: [
      {
        title: "Passport Photo Sheets",
        href: "/#editor",
        description: "Auto-tile 4, 8, 16, 32, or 52 copies on photo paper",
        icon: ScanFace,
      },
      {
        title: "Government Photo & Signature Resizer",
        href: "/#editor",
        description: "Resize photos and signatures according to government application requirements.",
        icon: Printer,
      },
      {
        title: "Print Workflow Guide",
        href: "/product",
        description: "Official printing instructions for 100% scale photo prints",
        icon: BookOpen,
      },
      {
        title: "Photo Crop / Resize",
        href: "/#editor",
        description: "Upload an Image and Resize It to the Required Dimensions",
        icon: Crop,
      },
    ],
  },
  {
    id: "solutions-company",
    title: "Solutions",
    description: "Community improvements, customer reviews, and pricing plans",
    icon: Sparkles,
    items: [
      {
        title: "Solutions & Updates",
        href: "/solutions",
        description: "Community-driven improvements and resolved user suggestions",
        icon: Sparkles,
      },
      {
        title: "Customer Wall of Love",
        href: "/customers",
        description: "Real reviews and ratings from our active community",
        icon: Heart,
      },
      {
        title: "Pricing Plans",
        href: "/pricing",
        description: "Transparent Free, Pro, and upcoming subscription tiers",
        icon: CreditCard,
      },
    ],
  },
];

export interface ProfileNavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  danger?: boolean;
}

export const PROFILE_NAV_ITEMS: ProfileNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Account Settings",
    href: "/dashboard/settings",
  },
  {
    title: "Change Password",
    href: "/change-password",
  },
  {
    title: "Forgot Password",
    href: "/forgot-password",
  },
];
