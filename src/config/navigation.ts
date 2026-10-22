import {
  Scaling,
  Crop,
  Sparkles,
  Sliders,
  FileText,
  UserCheck,
  PenTool,
  Grid,
  Printer,
  BookOpen,
  Heart,
  CreditCard,
  Layers,
  LucideIcon,
  ShieldCheck,
  Camera,
  Train,
  Scissors,
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
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  items: NavChildItem[];
}

export const NAVIGATION_CONFIG: NavCategory[] = [
  {
    id: "photo-tools",
    title: "Photo Tools",
    description: "Resize, crop, optimize, and enhance images",
    icon: Scaling,
    items: [
      {
        title: "Resize Photo (PDF Resizer / Sharp)",
        href: "/product",
        description: "Scale dimensions and adjust file sizes (KB/MB) with sharpness",
        icon: Scaling,
      },
      {
        title: "Crop & Framing",
        href: "/#editor",
        description: "Freeform & ratio cropping, centering, and rotation alignment",
        icon: Crop,
      },
      {
        title: "Background Removal",
        href: "/#editor",
        description: "One-click AI cutout for crisp transparent or white backgrounds",
        icon: Sparkles,
      },
      {
        title: "Smart Compression",
        href: "/#editor",
        description: "Reduce file sizes up to 80% while preserving visual clarity",
        icon: Sliders,
      },
    ],
  },
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
    id: "document-id-tools",
    title: "Document & ID Tools",
    description: "Passport photos, govt exam presets, signatures, and resumes",
    icon: Layers,
    items: [
      {
        title: "Resume Maker",
        href: "/resume-builder",
        description: "Build ATS-friendly modern resumes with live preview and PDF export",
        icon: FileText,
        badge: "New",
      },
      {
        title: "Govt Exam & ID Presets",
        href: "/#editor",
        description: "Pre-configured dimensions and file size targets for official forms",
        icon: UserCheck,
        subItems: [
          {
            title: "Standard Passport / Aadhaar",
            href: "/#editor",
            description: "3.5 x 4.5 cm (413x531 px) · Target ~100 KB",
            icon: ShieldCheck,
          },
          {
            title: "SSC & UPSC Photo",
            href: "/#editor",
            description: "200 x 230 px · Target ~50 KB for Central Exams",
            icon: Camera,
          },
          {
            title: "BPSC Photo",
            href: "/#editor",
            description: "200 x 290 px · Target ~20 KB for State PSC",
            icon: UserCheck,
          },
          {
            title: "IBPS Banking Photo",
            href: "/#editor",
            description: "300 x 300 px · Target ~50 KB Square Photo",
            icon: UserCheck,
          },
          {
            title: "US Visa / Digital ID",
            href: "/#editor",
            description: "2 x 2 inch (600x600 px) · Target ~200 KB",
            icon: UserCheck,
          },
        ],
      },
      {
        title: "Signature & Thumb Tools",
        href: "/#editor",
        description: "Official dimensions for digital signatures and thumb impressions",
        icon: PenTool,
        subItems: [
          {
            title: "SSC Signature",
            href: "/#editor",
            description: "140 x 60 px · Target ~20 KB small horizontal",
            icon: PenTool,
          },
          {
            title: "IBPS Signature",
            href: "/#editor",
            description: "300 x 80 px · Target ~20 KB wide signature",
            icon: PenTool,
          },
          {
            title: "Thumb Impression",
            href: "/#editor",
            description: "140 x 60 px · Target ~50 KB left/right thumb",
            icon: PenTool,
          },
          {
            title: "Railway RRB Photo & Sign",
            href: "/#editor",
            description: "240 x 320 px photo & 140x60 px black ink sign",
            icon: Train,
          },
        ],
      },
    ],
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
        icon: Grid,
      },
      {
        title: "A4 PDF Printing",
        href: "/#editor",
        description: "Print-ready A4 PDF composites with calibrated 2mm spacing",
        icon: Printer,
      },
      {
        title: "Print Workflow Guide",
        href: "/product",
        description: "Official printing instructions for 100% scale photo prints",
        icon: BookOpen,
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
