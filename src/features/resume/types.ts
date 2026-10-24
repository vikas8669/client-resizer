export interface ICustomLink {
  id: string;
  label: string;
  url: string;
}

export interface ISkillGroup {
  id: string;
  category: string;
  skills: string;
}

export interface IProject {
  id: string;
  title: string;
  techStack?: string;
  link?: string;
  duration?: string;
  points: string[];
}

export interface ICertification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
  link?: string;
}

export interface IAchievement {
  id: string;
  text: string;
}

export interface IVolunteer {
  id: string;
  role: string;
  organization?: string;
  duration?: string;
  details?: string;
}

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
  points?: string[];
  location?: string;
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
  showProjects?: boolean;
  showCertifications?: boolean;
  showAchievements?: boolean;
  showVolunteer?: boolean;
}

export interface IPersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  customLinks?: ICustomLink[];
  fatherName?: string;
  dob?: string;
  languages?: string;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  date?: string;
  place?: string;
}

export type ResumeTemplateId = 
  | "classic_ats" 
  | "traditional" 
  | "executive" 
  | "minimal" 
  | "tech_compact";

export type ResumeSectionKey =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "achievements"
  | "volunteer";

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "volunteer",
];

export const SECTION_METADATA: Record<
  ResumeSectionKey,
  { label: string; visibilityKey: keyof IPersonalVisibility }
> = {
  summary: { label: "Professional Summary", visibilityKey: "showObjective" },
  skills: { label: "Technical Skills", visibilityKey: "showSkills" },
  experience: { label: "Experience", visibilityKey: "showExperience" },
  projects: { label: "Projects", visibilityKey: "showProjects" },
  education: { label: "Education", visibilityKey: "showEducation" },
  certifications: { label: "Certifications", visibilityKey: "showCertifications" },
  achievements: { label: "Achievements", visibilityKey: "showAchievements" },
  volunteer: { label: "Leadership & Volunteer", visibilityKey: "showVolunteer" },
};

export interface IResumeData {
  _id?: string;
  title: string;
  headerTitle?: string;
  jobTitle?: string;
  templateId: ResumeTemplateId;
  personalInfo: IPersonalInfo;
  visibility: IPersonalVisibility;
  sectionOrder?: ResumeSectionKey[];
  objective: string;
  skillGroups: ISkillGroup[];
  skills: string[];
  experience: IExperience[];
  projects: IProject[];
  education: IEducation[];
  certifications: ICertification[];
  achievements: IAchievement[];
  volunteer: IVolunteer[];
  customSections: ICustomSection[];
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const PRESET_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "FastAPI",
  "SQL",
  "MongoDB",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "Git & GitHub",
  "MS Excel",
  "Tally Prime",
  "Data Entry",
  "Communication",
  "Problem Solving",
];

export const INITIAL_RESUME_DATA: IResumeData = {
  title: "Harsh Jindal Resume",
  headerTitle: "RESUME",
  jobTitle: "Software Engineer",
  templateId: "classic_ats",
  personalInfo: {
    name: "Harsh Jindal",
    address: "Uttar Pradesh, India",
    phone: "+91 7055964293",
    email: "edumate.contact@gmail.com",
    customLinks: [
      { id: "link-1", label: "GitHub", url: "https://github.com/" },
      { id: "link-2", label: "LinkedIn", url: "https://linkedin.com/" },
    ],
    fatherName: "",
    dob: "",
    languages: "English, Hindi",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Unmarried",
    date: new Date().toISOString().split("T")[0],
    place: "Uttar Pradesh, India",
  },
  visibility: {
    showFatherName: false,
    showDob: false,
    showLanguages: true,
    showGender: false,
    showNationality: false,
    showMaritalStatus: false,
    showDeclaration: false,
    showDatePlace: false,
    showSignature: false,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showHeaderTitle: false,
    showPersonalSection: false,
    showObjective: true,
    showEducation: true,
    showExperience: true,
    showSkills: true,
    showProjects: true,
    showCertifications: true,
    showAchievements: true,
    showVolunteer: false,
  },
  sectionOrder: DEFAULT_SECTION_ORDER,
  objective:
    "Dedicated Software Engineer with 2+ years of experience building AI-powered platforms and full-stack applications. Skilled in LLMs, cloud infrastructure, and translating complex requirements into scalable solutions.",
  skillGroups: [
    {
      id: "sg-1",
      category: "Languages & Databases",
      skills: "Python, C++, C, SQL, MongoDB",
    },
    {
      id: "sg-2",
      category: "Frameworks & AI",
      skills: "FastAPI, React.js, HTML, CSS, Tailwind CSS, Transformers, Hugging Face, LLMs (GPT, Claude), LangChain",
    },
    {
      id: "sg-3",
      category: "Cloud & DevOps",
      skills: "AWS (EC2, S3, SageMaker, Textract), GCP (Document AI), Azure OpenAI, Docker, Apache Kafka",
    },
    {
      id: "sg-4",
      category: "Developer Tools",
      skills: "Git, GitHub, Jupyter Notebook, VS Code, Linux, Jira",
    },
  ],
  skills: [
    "Excel",
    "MS Office",
    "Basic Computer",
    "Tally",
    "Python",
    "React.js",
    "FastAPI",
    "MongoDB",
    "SQL",
    "Tailwind CSS",
    "Docker",
    "AWS",
    "Git",
  ],
  experience: [
    {
      title: "Mern Stack Developer",
      company: "Single Mind Infotech",
      location: "Punjab, India",
      duration: "2 Years",
      details:
        "**Monitored store premises and ensured** the safety of customers, staff, and property.\nChecked entry and exit points and maintained security procedures.\nAssisted customers when required and reported any suspicious activities to management.\nMaintained discipline and a safe environment within the store.",
      points: [
        "**Monitored store premises and ensured** the safety of customers, staff, and property.",
        "Checked entry and exit points and maintained security procedures.",
        "Assisted customers when required and reported any suspicious activities to management.",
        "Maintained discipline and a safe environment within the store.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Intelligent Document Automation System",
      techStack: "FastAPI, React, LangChain, OpenAI, Docker",
      link: "https://github.com/project",
      duration: "2024",
      points: [
        "Architected an OCR & LLM parsing pipeline handling **10,000+ daily PDF extractions** with **99% accuracy**.",
        "Engineered background task processing queue with **Celery & Redis**, cutting user waiting time by **45%**.",
      ],
    },
    {
      id: "proj-2",
      title: "Real-time Collaborative Whiteboard",
      techStack: "Next.js, TypeScript, WebSockets, Canvas API",
      link: "https://github.com/project",
      duration: "2023",
      points: [
        "Developed full-stack real-time collaboration canvas supporting **multiplayer cursor presence** and undo/redo.",
        "Optimized canvas render loop to maintain **60 FPS** under complex multi-layer object trees.",
      ],
    },
  ],
  education: [
    {
      sno: 1,
      qualification: "B.Tech in Computer Science & Engineering",
      board: "APJ Abdul Kalam Technical University",
      year: "2023",
      percentage: "8.4 CGPA",
    },
    {
      sno: 2,
      qualification: "Senior Secondary (Class XII)",
      board: "CBSE Board",
      year: "2019",
      percentage: "88%",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2024",
    },
  ],
  achievements: [
    {
      id: "ach-1",
      text: "Global Rank top 3% in LeetCode Weekly Contest with 600+ problems solved.",
    },
    {
      id: "ach-2",
      text: "Winner of National Hackathon 2023 for AI Health Diagnostics solution.",
    },
  ],
  volunteer: [],
  customSections: [],
};
