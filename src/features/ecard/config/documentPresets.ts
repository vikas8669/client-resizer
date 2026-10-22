export interface DocumentPreset {
  id: string;
  name: string;
  shortName: string;
  category: 'id-1' | 'id-2' | 'id-3' | 'custom' | 'special';
  description: string;
  widthMm: number;
  heightMm: number;
  isCustomizable?: boolean;
  notes?: string;
}

export interface DocumentCategoryConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'CreditCard' | 'UserCheck' | 'FileText' | 'Crop';
  defaultPresetId: string;
  presets: DocumentPreset[];
}

export interface PaperSizeConfig {
  id: 'A4' | '4x6' | 'Letter';
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export const PAPER_SIZES: Record<'A4' | '4x6' | 'Letter', PaperSizeConfig> = {
  A4: {
    id: 'A4',
    name: 'A4 Paper',
    widthMm: 210,
    heightMm: 297,
    description: 'Standard 210 × 297 mm document paper',
  },
  '4x6': {
    id: '4x6',
    name: '4 × 6 inch Photo Paper',
    widthMm: 101.6,
    heightMm: 152.4,
    description: 'Standard photo print paper (101.6 × 152.4 mm)',
  },
  Letter: {
    id: 'Letter',
    name: 'US Letter',
    widthMm: 215.9,
    heightMm: 279.4,
    description: 'Standard US Letter (215.9 × 279.4 mm)',
  },
};

export const MM_TO_PT = 72 / 25.4; // 1 mm = ~2.8346 points
export const MM_TO_INCH = 1 / 25.4;
export const PRINT_DPI = 300; // Standard crisp print DPI
export const MM_TO_PX = (PRINT_DPI / 25.4); // Pixels per mm at 300 DPI

export const DOCUMENT_CATEGORIES: DocumentCategoryConfig[] = [
  {
    id: 'aadhaar',
    slug: 'aadhaar',
    title: 'Aadhaar Card Cutter',
    description: 'Crop and print e-Aadhaar card to exact official card dimensions',
    iconName: 'ShieldCheck',
    defaultPresetId: 'aadhaar-dual-fold',
    presets: [
      {
        id: 'aadhaar-dual-fold',
        name: 'Both Cards Side-by-Side (Front + Back)',
        shortName: 'Both Cards (171 × 54 mm)',
        category: 'special',
        description: 'Combined bottom card strip (171.20 × 53.98 mm) - excludes top waste text',
        widthMm: 171.20,
        heightMm: 53.98,
        notes: 'Crops the exact bottom card strip (front + back side-by-side) with no extra waste.',
      },
      {
        id: 'aadhaar-front',
        name: 'Front Card Only (Photo & Details)',
        shortName: 'Front Card (85.6 × 54 mm)',
        category: 'id-1',
        description: 'Standard PVC front card format (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Crop just the left card with photo, name, and Aadhaar number.',
      },
      {
        id: 'aadhaar-back',
        name: 'Back Card Only (Address & QR)',
        shortName: 'Back Card (85.6 × 54 mm)',
        category: 'id-1',
        description: 'Standard PVC back card format (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Crop just the right card with address and barcode.',
      },
      {
        id: 'aadhaar-custom',
        name: 'Freeform / Custom Aadhaar Size',
        shortName: 'Custom Size',
        category: 'custom',
        description: 'Freely set width and height in mm',
        widthMm: 171.20,
        heightMm: 53.98,
        isCustomizable: true,
        notes: 'Freely adjust width & height in mm to match your document.',
      },
    ],
  },
  {
    id: 'pan',
    slug: 'pan',
    title: 'PAN Card Cutter',
    description: 'Format e-PAN to official standard ID-1 card dimensions',
    iconName: 'CreditCard',
    defaultPresetId: 'pan-standard',
    presets: [
      {
        id: 'pan-standard',
        name: 'Standard PAN Card',
        shortName: 'Standard ID-1',
        category: 'id-1',
        description: 'ISO/IEC 7810 ID-1 standard format (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Standard NSDL / UTIITSL physical card size.',
      },
    ],
  },
  {
    id: 'driving-licence',
    slug: 'driving-licence',
    title: 'Driving Licence Cutter',
    description: 'Smart Card DL & state licence format presets',
    iconName: 'UserCheck',
    defaultPresetId: 'dl-smart-card',
    presets: [
      {
        id: 'dl-smart-card',
        name: 'Smart Card Driving Licence',
        shortName: 'Smart Card (ID-1)',
        category: 'id-1',
        description: 'National standard Smart Card format (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Standard chip / QR-enabled driving licence card.',
      },
      {
        id: 'dl-legacy-booklet',
        name: 'State Paper / Booklet Licence (A7)',
        shortName: 'A7 Booklet Page',
        category: 'id-2',
        description: 'Legacy state format (105.00 × 74.00 mm)',
        widthMm: 105.00,
        heightMm: 74.00,
        notes: 'For older paper-based or laminated state driving licences.',
      },
    ],
  },
  {
    id: 'voter-id',
    slug: 'voter-id',
    title: 'Voter ID Card Cutter',
    description: 'E-EPIC Voter Card format with standard sizing',
    iconName: 'FileText',
    defaultPresetId: 'voter-e-epic',
    presets: [
      {
        id: 'voter-e-epic',
        name: 'Modern e-EPIC Card',
        shortName: 'e-EPIC (ID-1)',
        category: 'id-1',
        description: 'Standard modern digital Voter ID (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Downloaded Election Commission e-EPIC card.',
      },
      {
        id: 'voter-legacy',
        name: 'Legacy Voter ID (50 × 80 mm)',
        shortName: 'Legacy Laminated',
        category: 'special',
        description: 'Older paper/black & white card format (50.00 × 80.00 mm)',
        widthMm: 50.00,
        heightMm: 80.00,
        notes: 'For older vertical election cards issued by state election officers.',
      },
    ],
  },
  {
    id: 'passport-id',
    slug: 'passport-id',
    title: 'Passport / ID Card Cutter',
    description: 'Standard ID-1, ID-2, and ID-3 passport card formats',
    iconName: 'UserCheck',
    defaultPresetId: 'id-standard-card',
    presets: [
      {
        id: 'id-standard-card',
        name: 'National ID / OCI Card (ID-1)',
        shortName: 'Standard ID-1',
        category: 'id-1',
        description: 'Standard ISO ID-1 format (85.60 × 53.98 mm)',
        widthMm: 85.60,
        heightMm: 53.98,
        notes: 'Used for OCI cards, national identity cards, health cards.',
      },
      {
        id: 'id-2-card',
        name: 'Intermediate ID Card (ID-2 / A7)',
        shortName: 'ID-2 (105 × 74 mm)',
        category: 'id-2',
        description: 'French/German ID & Visa format (105.00 × 74.00 mm)',
        widthMm: 105.00,
        heightMm: 74.00,
      },
      {
        id: 'id-3-passport',
        name: 'Passport Photo Page (ID-3 / B7)',
        shortName: 'Passport Page (ID-3)',
        category: 'id-3',
        description: 'Official Passport booklet page (125.00 × 88.00 mm)',
        widthMm: 125.00,
        heightMm: 88.00,
        notes: 'Standard passport data page format.',
      },
    ],
  },
  {
    id: 'other',
    slug: 'other',
    title: 'Other Document Cutter',
    description: 'Custom width & height in mm for any card, badge, or certificate',
    iconName: 'Crop',
    defaultPresetId: 'custom-card',
    presets: [
      {
        id: 'custom-card',
        name: 'Custom Dimension Card',
        shortName: 'Custom Size',
        category: 'custom',
        description: 'Set your own exact physical width and height in millimetres',
        widthMm: 85.60,
        heightMm: 53.98,
        isCustomizable: true,
      },
      {
        id: 'business-card',
        name: 'Visiting / Business Card',
        shortName: 'Business Card',
        category: 'special',
        description: 'Standard Business Card (89.00 × 51.00 mm)',
        widthMm: 89.00,
        heightMm: 51.00,
      },
      {
        id: 'badge-id',
        name: 'Conference / Employee Badge',
        shortName: 'Badge (100 × 70 mm)',
        category: 'special',
        description: 'Lanyard Badge size (100.00 × 70.00 mm)',
        widthMm: 100.00,
        heightMm: 70.00,
      },
      {
        id: 'certificate-half',
        name: 'A5 Certificate / Half A4',
        shortName: 'Half A4 (A5)',
        category: 'special',
        description: 'Half A4 paper format (148.00 × 210.00 mm)',
        widthMm: 148.00,
        heightMm: 210.00,
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): DocumentCategoryConfig => {
  const found = DOCUMENT_CATEGORIES.find((cat) => cat.slug === slug || cat.id === slug);
  return found || DOCUMENT_CATEGORIES[0];
};

export const findPresetById = (presetId: string): DocumentPreset | undefined => {
  for (const cat of DOCUMENT_CATEGORIES) {
    const match = cat.presets.find((p) => p.id === presetId);
    if (match) return match;
  }
  return undefined;
};
