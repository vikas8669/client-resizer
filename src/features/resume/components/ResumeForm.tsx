"use client";

import React, { useState } from "react";
import { IResumeData, IEducation, IExperience, ICustomSection, PRESET_SKILLS } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Layout,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Heading,
} from "lucide-react";

interface ResumeFormProps {
  data: IResumeData;
  onChange: (updated: IResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showVisibilityAccordion, setShowVisibilityAccordion] = useState(false);

  const visibility = data.visibility || {};

  const toggleVisibility = (field: keyof typeof visibility) => {
    onChange({
      ...data,
      visibility: {
        ...visibility,
        [field]: visibility[field] === undefined ? false : !visibility[field],
      },
    });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const updateHeaderTitle = (val: string) => {
    onChange({ ...data, headerTitle: val });
  };

  const updateJobTitle = (val: string) => {
    onChange({ ...data, jobTitle: val });
  };

  const updateObjective = (value: string) => {
    onChange({ ...data, objective: value });
  };

  const setTemplate = (templateId: "traditional" | "modern" | "executive") => {
    onChange({ ...data, templateId });
  };

  // Education Handlers
  const handleEducationChange = (index: number, field: keyof IEducation, value: any) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };

  const addEducation = () => {
    const newEdu = [
      ...data.education,
      {
        sno: data.education.length + 1,
        qualification: "",
        board: "",
        year: "",
        percentage: "",
      },
    ];
    onChange({ ...data, education: newEdu });
  };

  const removeEducation = (index: number) => {
    const newEdu = data.education
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, sno: idx + 1 }));
    onChange({ ...data, education: newEdu });
  };

  // Experience Handlers
  const handleExperienceChange = (index: number, field: keyof IExperience, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };

  const addExperience = () => {
    const newExp = [
      ...data.experience,
      { title: "", company: "", duration: "", details: "" },
    ];
    onChange({ ...data, experience: newExp });
  };

  const removeExperience = (index: number) => {
    const newExp = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: newExp });
  };

  // Skills Handlers
  const toggleSkill = (skill: string) => {
    const current = data.skills || [];
    const exists = current.includes(skill);
    let updated: string[];
    if (exists) {
      updated = current.filter((s) => s !== skill);
    } else {
      updated = [...current, skill];
    }
    onChange({ ...data, skills: updated });
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
    setCustomSkillInput("");
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  // Custom Sections Handlers
  const addCustomSection = () => {
    const newSections = [
      ...(data.customSections || []),
      {
        id: `sec_${Date.now()}`,
        title: "PROJECTS / CERTIFICATIONS",
        content: "Details about your projects, certifications or achievements...",
      },
    ];
    onChange({ ...data, customSections: newSections });
  };

  const updateCustomSection = (id: string, field: keyof ICustomSection, val: string) => {
    const newSections = (data.customSections || []).map((sec) =>
      sec.id === id ? { ...sec, [field]: val } : sec
    );
    onChange({ ...data, customSections: newSections });
  };

  const removeCustomSection = (id: string) => {
    const newSections = (data.customSections || []).filter((sec) => sec.id !== id);
    onChange({ ...data, customSections: newSections });
  };

  return (
    <div className="space-y-5 text-left">
      {/* TEMPLATE SELECTION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Choose Template Layout</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "traditional", label: "Traditional", desc: "Screenshot Match" },
            { id: "modern", label: "Modern", desc: "2-Column Tech" },
            { id: "executive", label: "Executive", desc: "Clean Single Col" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTemplate(item.id as any)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                data.templateId === item.id
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                  : "border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* HEADER & SUBHEADER OPTIONS */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heading className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Header & Sub-header Title</h3>
          </div>
          <button
            type="button"
            onClick={() => toggleVisibility("showHeaderTitle")}
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
          >
            {visibility.showHeaderTitle !== false ? (
              <>
                <Eye className="w-3.5 h-3.5" /> Header Visible
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> Header Hidden
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Header Title (Optional)</Label>
            <Input
              value={data.headerTitle !== undefined ? data.headerTitle : "RESUME"}
              onChange={(e) => updateHeaderTitle(e.target.value)}
              placeholder="e.g. RESUME, CURRICULUM VITAE, BIO-DATA"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Designation / Job Subheader</Label>
            <Input
              value={data.jobTitle || ""}
              onChange={(e) => updateJobTitle(e.target.value)}
              placeholder="e.g. Senior Accountant / Data Entry Operator"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* PERSONAL DETAILS & VISIBILITY TOGGLES */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Personal Details</h3>
          </div>

          <button
            type="button"
            onClick={() => setShowVisibilityAccordion(!showVisibilityAccordion)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900"
          >
            <Eye className="w-3.5 h-3.5" /> Hide/Show Fields
          </button>
        </div>

        {/* FIELD VISIBILITY TOGGLES */}
        {showVisibilityAccordion && (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              👁️ Toggle Visibility of Specific Personal Details:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: "showFatherName", label: "Father's Name" },
                { key: "showDob", label: "Date of Birth" },
                { key: "showLanguages", label: "Languages" },
                { key: "showGender", label: "Gender" },
                { key: "showNationality", label: "Nationality" },
                { key: "showMaritalStatus", label: "Marital Status" },
                { key: "showDeclaration", label: "Declaration" },
                { key: "showDatePlace", label: "Date & Place" },
                { key: "showSignature", label: "Signature Name" },
                { key: "showAddress", label: "Address" },
              ].map((item) => {
                const isShown = visibility[item.key as keyof typeof visibility] !== false;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleVisibility(item.key as any)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isShown
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold"
                        : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-400 line-through"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isShown ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-zinc-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Full Name *</Label>
            <Input
              value={data.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
              placeholder="e.g. bom~x"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Mobile No.</Label>
            <Input
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="1234567890"
              className="text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Email Address</Label>
          <Input
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            placeholder="bomx@gmail.com"
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Full Address</Label>
          <textarea
            value={data.personalInfo.address}
            onChange={(e) => updatePersonalInfo("address", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-white/10 dark:text-white"
            placeholder="Address..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-white/5">
          {visibility.showFatherName !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Father&apos;s Name</Label>
              <Input
                value={data.personalInfo.fatherName}
                onChange={(e) => updatePersonalInfo("fatherName", e.target.value)}
                placeholder="bom"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showDob !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Date of Birth</Label>
              <Input
                value={data.personalInfo.dob}
                onChange={(e) => updatePersonalInfo("dob", e.target.value)}
                placeholder="2002-08-15"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showLanguages !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Languages Known</Label>
              <Input
                value={data.personalInfo.languages}
                onChange={(e) => updatePersonalInfo("languages", e.target.value)}
                placeholder="English, Hindi, Punjabi"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showGender !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Gender</Label>
              <Input
                value={data.personalInfo.gender}
                onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                placeholder="Male"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showNationality !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Nationality</Label>
              <Input
                value={data.personalInfo.nationality}
                onChange={(e) => updatePersonalInfo("nationality", e.target.value)}
                placeholder="Indian"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showMaritalStatus !== false && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Marital Status</Label>
              <Input
                value={data.personalInfo.maritalStatus}
                onChange={(e) => updatePersonalInfo("maritalStatus", e.target.value)}
                placeholder="Unmarried"
                className="text-xs"
              />
            </div>
          )}
          {visibility.showDatePlace !== false && (
            <>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Date</Label>
                <Input
                  value={data.personalInfo.date}
                  onChange={(e) => updatePersonalInfo("date", e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Place</Label>
                <Input
                  value={data.personalInfo.place}
                  onChange={(e) => updatePersonalInfo("place", e.target.value)}
                  placeholder="Punjab"
                  className="text-xs"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* SKILLS SECTION WITH PRESET CHIPS (Excel, Tally, etc.) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Technical & Professional Skills</h3>
          </div>
          <button
            type="button"
            onClick={() => toggleVisibility("showSkills")}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold"
          >
            {visibility.showSkills !== false ? "Visible" : "Hidden"}
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Click quick options to instantly add or remove skills:
        </p>

        {/* PRESET SKILL PILLS */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SKILLS.map((skill) => {
            const isSelected = (data.skills || []).includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:border-blue-400"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {skill}
              </button>
            );
          })}
        </div>

        {/* CUSTOM SKILL INPUT */}
        <div className="flex gap-2 pt-2">
          <Input
            value={customSkillInput}
            onChange={(e) => setCustomSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
            placeholder="Add custom skill (e.g. Python, Graphic Design)"
            className="text-xs"
          />
          <Button type="button" size="sm" onClick={addCustomSkill} className="text-xs shrink-0">
            Add
          </Button>
        </div>

        {/* SELECTED SKILLS DISPLAY */}
        {data.skills && data.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-white/5">
            {data.skills.map((s) => (
              <span
                key={s}
                className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-blue-200 dark:border-blue-800 font-semibold"
              >
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="text-red-500 hover:text-red-700 ml-1">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CAREER OBJECTIVE */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Career Objective</h3>
          </div>
          <button
            type="button"
            onClick={() => toggleVisibility("showObjective")}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold"
          >
            {visibility.showObjective !== false ? "Visible" : "Hidden"}
          </button>
        </div>
        <textarea
          value={data.objective}
          onChange={(e) => updateObjective(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-white/10 dark:text-white"
          placeholder="To make contribution in the organization..."
        />
      </div>

      {/* ACADEMIC QUALIFICATION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Academic Qualifications</h3>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addEducation} className="h-7 text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Row
          </Button>
        </div>

        <div className="space-y-2">
          {data.education.map((edu, idx) => (
            <div key={idx} className="p-2.5 border border-zinc-200 dark:border-white/10 rounded-xl space-y-2 bg-zinc-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Row #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEducationChange(idx, "isPursuing", !edu.isPursuing)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold border transition-all ${
                      edu.isPursuing
                        ? "bg-amber-500/15 text-amber-700 border-amber-400 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700 font-bold shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    }`}
                  >
                    {edu.isPursuing ? "⏳ Pursuing" : "✓ Completed"}
                  </button>
                  {data.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Input
                  placeholder="Qualification (10th/12th/BCA)"
                  value={edu.qualification}
                  onChange={(e) => handleEducationChange(idx, "qualification", e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="Board / University"
                  value={edu.board}
                  onChange={(e) => handleEducationChange(idx, "board", e.target.value)}
                  className="text-xs"
                />
                {edu.isPursuing ? (
                  <>
                    <Input
                      placeholder="Expected Year (Optional)"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(idx, "year", e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex items-center justify-center text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md px-2 py-1 select-none">
                      Pursuing
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Year (e.g. 2025)"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(idx, "year", e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Per % (e.g. 70%)"
                      value={edu.percentage}
                      onChange={(e) => handleEducationChange(idx, "percentage", e.target.value)}
                      className="text-xs"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WORK EXPERIENCE */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Work Experience</h3>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addExperience} className="h-7 text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </Button>
        </div>

        <div className="space-y-2">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="p-2.5 border border-zinc-200 dark:border-white/10 rounded-xl space-y-2 bg-zinc-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Experience #{idx + 1}</span>
                {data.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Company / Organization Name (Top)"
                  value={exp.company || ""}
                  onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                  className="text-xs font-semibold"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Job Role / Designation (Just below Company)"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(idx, "title", e.target.value)}
                    className="text-xs"
                  />
                  <Input
                    placeholder="Duration (e.g. 2 Months / 2 Years)"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(idx, "duration", e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Details & Responsibilities..."
                value={exp.details}
                onChange={(e) => handleExperienceChange(idx, "details", e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-white/10 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM SECTIONS BUILDER */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Custom Sections</h3>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addCustomSection} className="h-7 text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Custom Section
          </Button>
        </div>

        {(data.customSections || []).length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            Add custom sections like Projects, Certifications, Achievements, or Hobbies.
          </p>
        ) : (
          <div className="space-y-3">
            {data.customSections.map((sec) => (
              <div key={sec.id} className="p-3 border border-zinc-200 dark:border-white/10 rounded-xl space-y-2 bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="flex items-center justify-between">
                  <Input
                    value={sec.title}
                    onChange={(e) => updateCustomSection(sec.id, "title", e.target.value)}
                    placeholder="Section Title (e.g. CERTIFICATIONS)"
                    className="text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomSection(sec.id)}
                    className="text-red-500 hover:text-red-700 p-1 ml-2 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={sec.content}
                  onChange={(e) => updateCustomSection(sec.id, "content", e.target.value)}
                  placeholder="Content details..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-white/10 dark:text-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
