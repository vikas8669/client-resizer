export interface IEducation {
  sno?: number;
  qualification: string;
  board: string;
  year: string;
  percentage: string;
  isPursuing?: boolean;
}

export interface IExperience {
  title: string;
  company?: string;
  duration: string;
  details: string;
}

export interface ICustomSection {
  id: string;
  title: string;
  content: string;
}

export interface IPersonalVisibility {
  showFatherName?: boolean;
  showDob?: boolean;
  showLanguages?: boolean;
  showGender?: boolean;
  showNationality?: boolean;
  showMaritalStatus?: boolean;
  showDeclaration?: boolean;
  showDatePlace?: boolean;
  showSignature?: boolean;
  showAddress?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showHeaderTitle?: boolean;
  showPersonalSection?: boolean;
  showObjective?: boolean;
  showEducation?: boolean;
  showExperience?: boolean;
  showSkills?: boolean;
}

export interface IPersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  fatherName: string;
  dob: string;
  languages: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  date: string;
  place: string;
}

export interface IResumeData {
  _id?: string;
  title: string;
  headerTitle?: string; // e.g. "RESUME", "CURRICULUM VITAE", "BIO-DATA", or ""
  jobTitle?: string; // Designation under name, e.g. "Senior Accountant"
  templateId: "traditional" | "modern" | "executive";
  personalInfo: IPersonalInfo;
  visibility: IPersonalVisibility;
  objective: string;
  education: IEducation[];
  experience: IExperience[];
  customSections: ICustomSection[];
  skills: string[];
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const PRESET_SKILLS = [
  "MS Excel",
  "Tally Prime",
  "MS Word",
  "Data Entry",
  "GST & Taxation",
  "Accounting",
  "Computer Typing",
  "Customer Support",
  "Computer Basics",
  "Communication",
  "Team Management",
  "Problem Solving",
];

export const INITIAL_RESUME_DATA: IResumeData = {
  title: "My Professional Resume",
  headerTitle: "RESUME",
  jobTitle: "",
  templateId: "traditional",
  personalInfo: {
    name: "bom~x",
    address: "JCT, Mill Thapar Colony PHAGWARA\nPhagwara, Punjab - 144401",
    phone: "1234567890",
    email: "bomx@gmail.com",
    fatherName: "bom",
    dob: "2002-09-29",
    languages: "English, Hindi, Punjabi",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Unmarried",
    date: new Date().toISOString().split("T")[0],
    place: "Punjab",
  },
  visibility: {
    showFatherName: true,
    showDob: true,
    showLanguages: true,
    showGender: true,
    showNationality: true,
    showMaritalStatus: true,
    showDeclaration: true,
    showDatePlace: true,
    showSignature: true,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showHeaderTitle: true,
    showPersonalSection: true,
    showObjective: true,
    showEducation: true,
    showExperience: true,
    showSkills: true,
  },
  objective:
    "To make contribution in the organization with best of my ability and also to Develop new skills during the interaction to achieve new heights.",
  education: [
    {
      sno: 1,
      qualification: "B.Tech computer science and engineering ",
      board: "Lyallpur khalsa college jalandhar",
      year: "2025",
      percentage: "70%",
    },
  ],
  experience: [
    {
      title: "Mern Stack Developer",
      company: "Single Mind Infotech",
      duration: "2 Years",
      details:
        "Monitored store premises and ensured the safety of customers, staff, and property.\nChecked entry and exit points and maintained security procedures.\nAssisted customers when required and reported any suspicious activities to management.\nMaintained discipline and a safe environment within the store.",
    },
  ],
  customSections: [],
  skills: ["NextJs", "ReactJs", "Nodejs", "ExpressJs", "Javascript", "Typescript", "Tailwind Css", "MongoDb"],
};
