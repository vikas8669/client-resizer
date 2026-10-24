"use client";

import React, { useState } from "react";
import {
  IResumeData,
  ICustomLink,
  ISkillGroup,
  IExperience,
  IProject,
  IEducation,
  ICertification,
  IAchievement,
  IVolunteer,
  ResumeSectionKey,
  DEFAULT_SECTION_ORDER,
  SECTION_METADATA,
} from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  X,
  User,
  FileText,
  Wrench,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Trophy,
  HeartHandshake,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export type ResumeSectionTab =
  | "header"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "achievements"
  | "volunteer";

interface ResumeFormProps {
  data: IResumeData;
  onChange: (updated: IResumeData) => void;
  activeTab?: ResumeSectionTab;
  onTabChange?: (tab: ResumeSectionTab) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  data,
  onChange,
  activeTab: externalTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<ResumeSectionTab>("header");
  const activeTab = externalTab || internalTab;

  const setActiveTab = (tab: ResumeSectionTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const sectionOrder: ResumeSectionKey[] =
    data.sectionOrder && data.sectionOrder.length > 0
      ? data.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const moveSection = (secKey: ResumeSectionKey, direction: "up" | "down") => {
    const idx = sectionOrder.indexOf(secKey);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;

    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);

    onChange({
      ...data,
      sectionOrder: newOrder,
    });
  };

  const toggleSectionVisibility = (secKey: ResumeSectionKey) => {
    const meta = SECTION_METADATA[secKey];
    if (!meta) return;
    const visKey = meta.visibilityKey;
    const current = data.visibility[visKey] !== false;
    onChange({
      ...data,
      visibility: {
        ...data.visibility,
        [visKey]: !current,
      },
    });
  };

  const renderSectionControl = (secKey: ResumeSectionKey) => {
    const meta = SECTION_METADATA[secKey];
    if (!meta) return null;
    const isVisible = data.visibility[meta.visibilityKey] !== false;
    const orderIndex = sectionOrder.indexOf(secKey);
    const posNum = orderIndex !== -1 ? orderIndex + 1 : 1;
    const totalSecs = sectionOrder.length;
    const isFirst = orderIndex === 0;
    const isLast = orderIndex === totalSecs - 1;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              isVisible
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
            }`}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 flex-wrap">
              <span>{meta.label}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isVisible
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {isVisible ? "Visible on Resume" : "Hidden from Resume"}
              </span>
              <span className="text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                Position #{posNum} of {totalSecs}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {isVisible
                ? "This section appears in live preview, PDF download, and .tex export."
                : "This section is excluded from the resume."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Position Order Up/Down */}
          <div className="flex items-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => moveSection(secKey, "up")}
              title="Move position up"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isFirst
                  ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Up</span>
            </button>
            <div className="w-[1px] h-3.5 bg-zinc-200 dark:bg-zinc-700" />
            <button
              type="button"
              disabled={isLast}
              onClick={() => moveSection(secKey, "down")}
              title="Move position down"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isLast
                  ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Down</span>
            </button>
          </div>

          {/* Visibility Toggle */}
          <button
  type="button"
  onClick={() => toggleSectionVisibility(secKey)}
  className={`inline-flex h-8 min-w-[120px] items-center justify-center whitespace-nowrap rounded-xl px-6 text-xs leading-none font-semibold transition-colors cursor-pointer ${
    isVisible
      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
  }`}
>
  {isVisible ? "Hide Section" : "Show Section"}
</button>
        </div>
      </div>
    );
  };

  const updatePersonalInfo = (field: string, value: any) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  // Custom Links
  const addCustomLink = () => {
    const current = data.personalInfo.customLinks || [];
    const newLink: ICustomLink = {
      id: `link-${Date.now()}`,
      label: "Portfolio",
      url: "https://",
    };
    updatePersonalInfo("customLinks", [...current, newLink]);
  };

  const updateCustomLink = (id: string, field: "label" | "url", val: string) => {
    const current = data.personalInfo.customLinks || [];
    const updated = current.map((l) => (l.id === id ? { ...l, [field]: val } : l));
    updatePersonalInfo("customLinks", updated);
  };

  const removeCustomLink = (id: string) => {
    const current = data.personalInfo.customLinks || [];
    updatePersonalInfo(
      "customLinks",
      current.filter((l) => l.id !== id)
    );
  };

  // Skill Groups
  const addSkillGroup = () => {
    const newGroup: ISkillGroup = {
      id: `sg-${Date.now()}`,
      category: "Developer Tools",
      skills: "Git, VS Code, Linux",
    };
    onChange({
      ...data,
      skillGroups: [...(data.skillGroups || []), newGroup],
    });
  };

  const updateSkillGroup = (id: string, field: "category" | "skills", val: string) => {
    const updated = (data.skillGroups || []).map((sg) =>
      sg.id === id ? { ...sg, [field]: val } : sg
    );
    onChange({ ...data, skillGroups: updated });
  };

  const removeSkillGroup = (id: string) => {
    onChange({
      ...data,
      skillGroups: (data.skillGroups || []).filter((sg) => sg.id !== id),
    });
  };

  // Individual Skills (Customizable tags/badges for Traditional & Minimal templates)
  const [newSkillInput, setNewSkillInput] = useState("");

  const addSkill = (skillName?: string) => {
    const toAdd = (skillName !== undefined ? skillName : newSkillInput).trim();
    if (!toAdd) return;
    const current = data.skills || [];
    if (!current.some((s) => s.toLowerCase() === toAdd.toLowerCase())) {
      onChange({
        ...data,
        skills: [...current, toAdd],
      });
    }
    if (skillName === undefined) setNewSkillInput("");
  };

  const removeSkill = (index: number) => {
    const current = [...(data.skills || [])];
    current.splice(index, 1);
    onChange({
      ...data,
      skills: current,
    });
  };

  // Experience
  const addExperience = () => {
    const newExp: IExperience = {
      title: "Software Engineer",
      company: "Company Name",
      duration: "2023 - Present",
      location: "City, Country",
      details: "Developed key system features with high performance.",
      points: [
        "Led core module development resulting in 40% performance gain.",
        "Collaborated with cross-functional teams to deploy cloud microservices.",
      ],
    };
    onChange({
      ...data,
      experience: [...(data.experience || []), newExp],
    });
  };

  const updateExperience = (index: number, field: string, val: any) => {
    const updated = [...(data.experience || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, experience: updated });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: (data.experience || []).filter((_, i) => i !== index),
    });
  };

  const getExpPoints = (exp: IExperience): string[] => {
    if (exp.points && Array.isArray(exp.points) && exp.points.length > 0) {
      return [...exp.points];
    }
    if (exp.details && typeof exp.details === "string") {
      return exp.details.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    }
    return [];
  };

  const addExpPoint = (expIdx: number) => {
    const exp = data.experience[expIdx];
    const points = getExpPoints(exp);
    const updatedPoints = [...points, "Implemented new automated workflow"];
    const updated = [...(data.experience || [])];
    updated[expIdx] = {
      ...updated[expIdx],
      points: updatedPoints,
      details: updatedPoints.join("\n"),
    };
    onChange({ ...data, experience: updated });
  };

  const updateExpPoint = (expIdx: number, pIdx: number, val: string) => {
    const exp = data.experience[expIdx];
    const points = getExpPoints(exp);
    points[pIdx] = val;
    const updated = [...(data.experience || [])];
    updated[expIdx] = {
      ...updated[expIdx],
      points,
      details: points.join("\n"),
    };
    onChange({ ...data, experience: updated });
  };

  const removeExpPoint = (expIdx: number, pIdx: number) => {
    const exp = data.experience[expIdx];
    const points = getExpPoints(exp).filter((_, i) => i !== pIdx);
    const updated = [...(data.experience || [])];
    updated[expIdx] = {
      ...updated[expIdx],
      points,
      details: points.join("\n"),
    };
    onChange({ ...data, experience: updated });
  };

  // Projects
  const addProject = () => {
    const newProj: IProject = {
      id: `proj-${Date.now()}`,
      title: "Full-Stack Web App",
      techStack: "React, Node.js, MongoDB",
      duration: "2024",
      points: [
        "Built responsive UI and real-time state synchronization with **React & Redux**.",
        "Designed REST APIs with **99.9% uptime** and unit test coverage.",
      ],
    };
    onChange({
      ...data,
      projects: [...(data.projects || []), newProj],
    });
  };

  const updateProject = (id: string, field: string, val: any) => {
    const updated = (data.projects || []).map((p) =>
      p.id === id ? { ...p, [field]: val } : p
    );
    onChange({ ...data, projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: (data.projects || []).filter((p) => p.id !== id),
    });
  };

  const addProjPoint = (projId: string) => {
    const proj = (data.projects || []).find((p) => p.id === projId);
    if (!proj) return;
    const points = [...(proj.points || []), "Integrated automated CI/CD deployment pipeline."];
    updateProject(projId, "points", points);
  };

  const updateProjPoint = (projId: string, pIdx: number, val: string) => {
    const proj = (data.projects || []).find((p) => p.id === projId);
    if (!proj) return;
    const points = [...(proj.points || [])];
    points[pIdx] = val;
    updateProject(projId, "points", points);
  };

  const removeProjPoint = (projId: string, pIdx: number) => {
    const proj = (data.projects || []).find((p) => p.id === projId);
    if (!proj) return;
    const points = (proj.points || []).filter((_, i) => i !== pIdx);
    updateProject(projId, "points", points);
  };

  // Education
  const addEducation = () => {
    const newEdu: IEducation = {
      sno: (data.education?.length || 0) + 1,
      qualification: "Bachelor of Technology",
      board: "State Technical University",
      year: "2024",
      percentage: "8.5 CGPA",
    };
    onChange({
      ...data,
      education: [...(data.education || []), newEdu],
    });
  };

  const updateEducation = (index: number, field: string, val: any) => {
    const updated = [...(data.education || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: (data.education || []).filter((_, i) => i !== index),
    });
  };

  // Certifications
  const addCertification = () => {
    const newCert: ICertification = {
      id: `cert-${Date.now()}`,
      name: "Cloud Certified Practitioner",
      issuer: "AWS / Google Cloud",
      date: "2024",
    };
    onChange({
      ...data,
      certifications: [...(data.certifications || []), newCert],
    });
  };

  const updateCertification = (id: string, field: string, val: string) => {
    const updated = (data.certifications || []).map((c) =>
      c.id === id ? { ...c, [field]: val } : c
    );
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).filter((c) => c.id !== id),
    });
  };

  // Achievements
  const addAchievement = () => {
    const newAch: IAchievement = {
      id: `ach-${Date.now()}`,
      text: "Secured 1st place in Regional Hackathon amongst 200+ teams.",
    };
    onChange({
      ...data,
      achievements: [...(data.achievements || []), newAch],
    });
  };

  const updateAchievement = (id: string, text: string) => {
    const updated = (data.achievements || []).map((a) =>
      a.id === id ? { ...a, text } : a
    );
    onChange({ ...data, achievements: updated });
  };

  const removeAchievement = (id: string) => {
    onChange({
      ...data,
      achievements: (data.achievements || []).filter((a) => a.id !== id),
    });
  };

  // Volunteer
  const addVolunteer = () => {
    const newVol: IVolunteer = {
      id: `vol-${Date.now()}`,
      role: "Lead Coordinator",
      organization: "Community Open Source Initiative",
      duration: "2023 - Present",
      details: "Mentored 50+ students in web development and open source contributions.",
    };
    onChange({
      ...data,
      volunteer: [...(data.volunteer || []), newVol],
    });
  };

  const updateVolunteer = (id: string, field: string, val: string) => {
    const updated = (data.volunteer || []).map((v) =>
      v.id === id ? { ...v, [field]: val } : v
    );
    onChange({ ...data, volunteer: updated });
  };

  const removeVolunteer = (id: string) => {
    onChange({
      ...data,
      volunteer: (data.volunteer || []).filter((v) => v.id !== id),
    });
  };

  const TABS: { id: ResumeSectionTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "header", label: "Header", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "volunteer", label: "Volunteer", icon: HeartHandshake },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* ── SECTION NAVIGATION TABS (MATCHING SCREENSHOT) ── */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center min-w-max px-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FORM CONTENT PANELS ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* 1. HEADER SECTION */}
        {activeTab === "header" && (
          <div className="space-y-4 max-w-xl animate-in fade-in-50 duration-200">
            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Full Name
              </Label>
              <Input
                value={data.personalInfo.name}
                onChange={(e) => updatePersonalInfo("name", e.target.value)}
                placeholder="e.g. Harsh Jindal"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Professional Title
              </Label>
              <Input
                value={data.jobTitle || ""}
                onChange={(e) => onChange({ ...data, jobTitle: e.target.value })}
                placeholder="e.g. Software Engineer"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Location
              </Label>
              <Input
                value={data.personalInfo.address}
                onChange={(e) => updatePersonalInfo("address", e.target.value)}
                placeholder="e.g. Uttar Pradesh, India"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Phone
              </Label>
              <Input
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="e.g. +91 7055964293"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Email
              </Label>
              <Input
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="e.g. edumate.contact@gmail.com"
                type="email"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>

            {/* Custom Links (Screenshot Match!) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Custom Links
                </Label>
                <button
                  type="button"
                  onClick={addCustomLink}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                GitHub, LinkedIn, Portfolio, LeetCode, CodeChef — any label you want.
              </p>

              <div className="space-y-2.5">
                {(data.personalInfo.customLinks || []).map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => updateCustomLink(link.id, "label", e.target.value)}
                      placeholder="Label (e.g. GitHub)"
                      className="w-1/3 h-10 rounded-xl text-xs border-zinc-200 dark:border-zinc-800"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateCustomLink(link.id, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-10 rounded-xl text-xs border-zinc-200 dark:border-zinc-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomLink(link.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SUMMARY SECTION */}
        {activeTab === "summary" && (
          <div className="space-y-4 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("summary")}

            <div>
              <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Professional Summary / Career Objective
              </Label>
              <textarea
                value={data.objective}
                onChange={(e) => onChange({ ...data, objective: e.target.value })}
                rows={6}
                placeholder="Dedicated Software Engineer with 2+ years of experience building scalable systems..."
                className={`w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 ${
                  data.visibility.showObjective === false ? "opacity-60" : ""
                }`}
              />
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-500 dark:text-zinc-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg mt-2">
                <span className="font-semibold text-amber-700 dark:text-amber-400">💡 How to highlight:</span>
                <span>Wrap text in <code className="bg-white dark:bg-zinc-800 font-bold px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">**bold**</code> for metric emphasis, or <code className="bg-yellow-100 text-yellow-900 px-1 py-0.5 rounded font-mono">==highlight==</code> for marker highlight.</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. SKILLS SECTION */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("skills")}

            {/* Flat Skills (Traditional / Horizontal Badges - Fully Customizable!) */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Key Skills (Customizable Badges)
                  </Label>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Used in Traditional & badge templates. Click ✕ on any skill to remove it.
                  </p>
                </div>
              </div>

              {/* Badges with ✕ delete button */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(data.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="text-zinc-400 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill Input */}
              <div className="flex gap-2 pt-2">
                <Input
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. Excel, Tally, Python)"
                  className="h-9 text-xs rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                />
                <Button
                  type="button"
                  onClick={() => addSkill()}
                  size="sm"
                  className="rounded-lg text-xs gap-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>

              {/* Quick suggestions / One-click add */}
              <div className="pt-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Quick Add Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Excel", "MS Office", "Basic Computer", "Tally", "Communication", "Problem Solving"].map((suggestion) => {
                    const alreadyHas = (data.skills || []).some(
                      (s) => s.toLowerCase() === suggestion.toLowerCase()
                    );
                    if (alreadyHas) return null;
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addSkill(suggestion)}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-zinc-500 cursor-pointer transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" /> {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Categorized Technical Skills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Categorized Technical Skills (Classic ATS / Developer)
                  </Label>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Structured skill groups match ATS and developer standard layouts.
                  </p>
                </div>
                <Button
                  onClick={addSkillGroup}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </Button>
              </div>

              <div className="space-y-3 mt-3">
                {(data.skillGroups || []).map((sg) => (
                  <div
                    key={sg.id}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={sg.category}
                        onChange={(e) => updateSkillGroup(sg.id, "category", e.target.value)}
                        placeholder="Category (e.g. Languages & Databases)"
                        className="h-9 font-semibold text-xs rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(sg.id)}
                        className="text-zinc-400 hover:text-red-500 p-1.5 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      value={sg.skills}
                      onChange={(e) => updateSkillGroup(sg.id, "skills", e.target.value)}
                      placeholder="Skills (e.g. Python, C++, SQL, MongoDB)"
                      className="h-9 text-xs rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. EXPERIENCE SECTION */}
        {activeTab === "experience" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("experience")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Work Experience
                </Label>
                <p className="text-xs text-zinc-400">Add past roles, internships, or current positions.</p>
              </div>
              <Button
                onClick={addExperience}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {(data.experience || []).map((exp, idx) => {
                const points = getExpPoints(exp);

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3 relative group"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        Experience #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-zinc-400 block mb-1">Company</Label>
                        <Input
                          value={exp.company || ""}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                          placeholder="e.g. ABC Tech Solutions Pvt. Ltd."
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 block mb-1">Job Title</Label>
                        <Input
                          value={exp.title || ""}
                          onChange={(e) => updateExperience(idx, "title", e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 block mb-1">Location</Label>
                        <Input
                          value={exp.location || ""}
                          onChange={(e) => updateExperience(idx, "location", e.target.value)}
                          placeholder="e.g. Bangalore, Karnataka"
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 block mb-1">Duration</Label>
                        <Input
                          value={exp.duration || ""}
                          onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                          placeholder="e.g. June 2023 - Present"
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <Label className="text-[10px] font-bold text-zinc-500 uppercase">
                          Key Achievements / Responsibilities
                        </Label>
                        <button
                          type="button"
                          onClick={() => addExpPoint(idx)}
                          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet Point
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 dark:text-zinc-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md mb-2">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">💡 Highlight:</span>
                        <span>Use <code className="bg-white dark:bg-zinc-800 font-bold px-1 rounded text-zinc-800 dark:text-zinc-200">**bold words**</code> or <code className="bg-yellow-100 text-yellow-900 px-1 rounded font-mono">==marker==</code></span>
                      </div>

                      <div className="space-y-1.5">
                        {points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <span className="text-zinc-400 text-xs">•</span>
                            <Input
                              value={pt}
                              onChange={(e) => updateExpPoint(idx, pIdx, e.target.value)}
                              placeholder="Achievement detail..."
                              className="h-8 text-xs rounded-lg flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeExpPoint(idx, pIdx)}
                              className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. PROJECTS SECTION */}
        {activeTab === "projects" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("projects")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Technical Projects
                </Label>
                <p className="text-xs text-zinc-400">Showcase personal, academic, or client projects.</p>
              </div>
              <Button
                onClick={addProject}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </Button>
            </div>

            <div className="space-y-4">
              {(data.projects || []).map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Project Name</Label>
                      <Input
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                        placeholder="e.g. Document AI Pipeline"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Tech Stack</Label>
                      <Input
                        value={proj.techStack || ""}
                        onChange={(e) => updateProject(proj.id, "techStack", e.target.value)}
                        placeholder="e.g. FastAPI, React, Docker"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Link (Optional)</Label>
                      <Input
                        value={proj.link || ""}
                        onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                        placeholder="https://github.com/..."
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Duration / Year</Label>
                      <Input
                        value={proj.duration || ""}
                        onChange={(e) => updateProject(proj.id, "duration", e.target.value)}
                        placeholder="e.g. 2024"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[10px] font-bold text-zinc-500 uppercase">
                        Highlights & Achievements
                      </Label>
                      <button
                        type="button"
                        onClick={() => addProjPoint(proj.id)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 dark:text-zinc-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md mb-2">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">💡 Highlight:</span>
                      <span>Use <code className="bg-white dark:bg-zinc-800 font-bold px-1 rounded text-zinc-800 dark:text-zinc-200">**bold words**</code> or <code className="bg-yellow-100 text-yellow-900 px-1 rounded font-mono">==marker==</code></span>
                    </div>

                    <div className="space-y-1.5">
                      {(proj.points || []).map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <span className="text-zinc-400 text-xs">•</span>
                          <Input
                            value={pt}
                            onChange={(e) => updateProjPoint(proj.id, pIdx, e.target.value)}
                            placeholder="What did you build or improve..."
                            className="h-8 text-xs rounded-lg flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjPoint(proj.id, pIdx)}
                            className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. EDUCATION SECTION */}
        {activeTab === "education" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("education")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Education & Qualifications
                </Label>
                <p className="text-xs text-zinc-400">Degrees, colleges, and schools attended.</p>
              </div>
              <Button
                onClick={addEducation}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </Button>
            </div>

            <div className="space-y-3">
              {(data.education || []).map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Degree / Qualification #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Qualification / Degree</Label>
                      <Input
                        value={edu.qualification}
                        onChange={(e) => updateEducation(idx, "qualification", e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Board / University</Label>
                      <Input
                        value={edu.board}
                        onChange={(e) => updateEducation(idx, "board", e.target.value)}
                        placeholder="e.g. State Technical University"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Year of Passing</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(idx, "year", e.target.value)}
                        placeholder="e.g. 2024"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-zinc-400 block mb-1">Percentage / CGPA</Label>
                      <Input
                        value={edu.percentage}
                        onChange={(e) => updateEducation(idx, "percentage", e.target.value)}
                        placeholder="e.g. 8.4 CGPA or 82%"
                        className="h-9 text-xs rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CERTIFICATIONS SECTION */}
        {activeTab === "certifications" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("certifications")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Licenses & Certifications
                </Label>
                <p className="text-xs text-zinc-400">Professional credentials, online courses, and badges.</p>
              </div>
              <Button
                onClick={addCertification}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certificate
              </Button>
            </div>

            <div className="space-y-3">
              {(data.certifications || []).map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="Certificate Name (e.g. AWS Certified Solutions Architect)"
                      className="h-9 text-xs font-semibold rounded-lg flex-1 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeCertification(cert.id)}
                      className="text-zinc-400 hover:text-red-500 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={cert.issuer || ""}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Issuing Org (e.g. Amazon Web Services)"
                      className="h-8 text-xs rounded-lg"
                    />
                    <Input
                      value={cert.date || ""}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      placeholder="Date (e.g. 2024)"
                      className="h-8 text-xs rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ACHIEVEMENTS SECTION */}
        {activeTab === "achievements" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("achievements")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Achievements & Honors
                </Label>
                <p className="text-xs text-zinc-400">Awards, contest rankings, hackathons, and recognitions.</p>
              </div>
              <Button
                onClick={addAchievement}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Achievement
              </Button>
            </div>

            <div className="space-y-2.5">
              {(data.achievements || []).map((ach) => (
                <div key={ach.id} className="flex items-center gap-2">
                  <span className="text-amber-500 text-xs">★</span>
                  <Input
                    value={ach.text}
                    onChange={(e) => updateAchievement(ach.id, e.target.value)}
                    placeholder="e.g. Top 3% in LeetCode Weekly Contest..."
                    className="h-10 text-xs rounded-xl flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(ach.id)}
                    className="text-zinc-400 hover:text-red-500 p-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. VOLUNTEER SECTION */}
        {activeTab === "volunteer" && (
          <div className="space-y-6 max-w-xl animate-in fade-in-50 duration-200">
            {renderSectionControl("volunteer")}

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Leadership & Volunteer Experience
                </Label>
                <p className="text-xs text-zinc-400">Community service, student clubs, and mentoring.</p>
              </div>
              <Button
                onClick={addVolunteer}
                size="sm"
                className="rounded-xl text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Volunteer
              </Button>
            </div>

            <div className="space-y-3">
              {(data.volunteer || []).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      value={v.role}
                      onChange={(e) => updateVolunteer(v.id, "role", e.target.value)}
                      placeholder="Role (e.g. Lead Coordinator)"
                      className="h-9 text-xs font-semibold rounded-lg flex-1 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeVolunteer(v.id)}
                      className="text-zinc-400 hover:text-red-500 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={v.organization || ""}
                      onChange={(e) => updateVolunteer(v.id, "organization", e.target.value)}
                      placeholder="Organization (e.g. Red Cross)"
                      className="h-8 text-xs rounded-lg"
                    />
                    <Input
                      value={v.duration || ""}
                      onChange={(e) => updateVolunteer(v.id, "duration", e.target.value)}
                      placeholder="Duration (e.g. 2023 - Present)"
                      className="h-8 text-xs rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
