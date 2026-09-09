"use client";

import React from "react";
import { IResumeData } from "../types";

interface ResumePreviewProps {
  data: IResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { templateId } = data;

  if (templateId === "modern") {
    return <ModernTemplate data={data} />;
  }

  if (templateId === "executive") {
    return <ExecutiveTemplate data={data} />;
  }

  // DEFAULT: TRADITIONAL TEMPLATE (Screenshot Match + Customizable Options)
  return <TraditionalTemplate data={data} />;
};

/* =========================================================
   TEMPLATE 1: TRADITIONAL (Screenshot Exact Match + Custom Options)
   ========================================================= */
const TraditionalTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const {
    headerTitle,
    jobTitle,
    personalInfo,
    visibility = {},
    objective,
    education,
    experience,
    customSections = [],
    skills = [],
  } = data;

  const showHeader = visibility.showHeaderTitle !== false && headerTitle && headerTitle.trim() !== "";

  // Check if any personal info key is visible
  const hasPersonalFields =
    (visibility.showFatherName !== false && personalInfo.fatherName) ||
    (visibility.showDob !== false && personalInfo.dob) ||
    (visibility.showLanguages !== false && personalInfo.languages) ||
    (visibility.showGender !== false && personalInfo.gender) ||
    (visibility.showNationality !== false && personalInfo.nationality) ||
    (visibility.showMaritalStatus !== false && personalInfo.maritalStatus);

  const showPersonalSection = visibility.showPersonalSection !== false && hasPersonalFields;

  return (
    <div
      id="resume-paper"
      className="w-full max-w-[794px] bg-white text-black font-sans p-6 sm:p-10 shadow-xl mx-auto rounded-sm select-text text-left"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        color: "#000000",
        backgroundColor: "#ffffff",
        letterSpacing: "normal",
        boxSizing: "border-box",
      }}
    >
      {/* OPTIONAL HEADER: RESUME / CURRICULUM VITAE */}
      {showHeader && (
        <h1 className="text-xl sm:text-2xl font-extrabold text-center tracking-normal mb-4 text-black uppercase">
          {headerTitle}
        </h1>
      )}

      {/* NAME & CONTACT DETAILS */}
      <div className="mb-5 space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-1.5">{personalInfo.name || "Your Name"}</h2>
        {jobTitle && (
          <div className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
            {jobTitle}
          </div>
        )}
        {visibility.showAddress !== false && personalInfo.address && (
          <div className="text-xs sm:text-sm text-black whitespace-pre-line leading-tight mb-2">
            {personalInfo.address}
          </div>
        )}
        <div className="text-xs sm:text-sm text-black space-y-0.5 pt-0.5">
          {visibility.showPhone !== false && personalInfo.phone && (
            <div>Mob No. : {personalInfo.phone}</div>
          )}
          {visibility.showEmail !== false && personalInfo.email && (
            <div>Email Id : {personalInfo.email}</div>
          )}
        </div>
      </div>

      {/* HORIZONTAL LINE */}
      <hr className="border-t-2 border-gray-800 mb-6" />

      {/* CAREER OBJECTIVE */}
      {visibility.showObjective !== false && objective && (
        <div className="mt-6 mb-6 clear-both">
          <div
            className="bg-[black] text-black font-bold text-xs sm:text-sm uppercase mb-3 w-full tracking-normal"
            style={{ height: "32px", padding: "0 12px", display: "flex", alignItems: "center", lineHeight: "1" }}
          >
            <span style={{ transform: "translateY(-3px)" }}>CAREER OBJECTIVE</span>
          </div>
          <div className="text-xs sm:text-sm text-black leading-relaxed px-1 font-sans">
            {objective}
          </div>
        </div>
      )}

      {/* ACADEMIC QUALIFICATION */}
      {visibility.showEducation !== false && education && education.length > 0 && (
        <div className="mt-6 mb-6 clear-both">
          <div
            className="bg-[black] text-black font-bold text-xs sm:text-sm uppercase mb-3 w-full tracking-normal"
            style={{ height: "32px", padding: "0 12px", display: "flex", alignItems: "center", lineHeight: "1" }}
          >
            <span style={{ transform: "translateY(-3px)" }}>ACADEMIC QUALIFICATION</span>
          </div>
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse border border-gray-400 text-xs sm:text-sm table-fixed">
              <thead>
                <tr className="bg-gray-100 text-black border-b border-gray-400">
                  <th className="border border-gray-400 px-2 py-2 font-bold text-center w-[8%] align-middle whitespace-nowrap">S.No.</th>
                  <th className="border border-gray-400 px-3 py-2 font-bold align-middle w-[32%] whitespace-nowrap">Qualification</th>
                  <th className="border border-gray-400 px-3 py-2 font-bold align-middle w-[42%] whitespace-nowrap">University / Board</th>
                  <th className="border border-gray-400 px-2 py-2 font-bold text-center align-middle w-[9%] whitespace-nowrap">Year</th>
                  <th className="border border-gray-400 px-2 py-2 font-bold text-center align-middle w-[9%] whitespace-nowrap">Per %</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, idx) => (
                  <tr key={idx} className="border-b border-gray-400">
                    <td className="border border-gray-400 px-2 py-2 text-center align-middle">{edu.sno || idx + 1}</td>
                    <td className="border border-gray-400 px-3 py-2 font-bold text-black align-middle break-words">{edu.qualification}</td>
                    <td className="border border-gray-400 px-3 py-2 align-middle break-words">{edu.board}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center align-middle">
                      {edu.isPursuing ? (edu.year ? `Pursuing (${edu.year})` : "Pursuing") : edu.year}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center align-middle">
                      {edu.isPursuing ? "Pursuing" : (edu.percentage ? (edu.percentage.endsWith("%") ? edu.percentage : `${edu.percentage}%`) : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {visibility.showExperience !== false && experience && experience.length > 0 && (
        <div className="mt-6 mb-6 clear-both">
          <div
            className="bg-[black] text-black font-bold text-xs sm:text-sm uppercase mb-3 w-full tracking-normal"
            style={{ height: "32px", padding: "0 12px", display: "flex", alignItems: "center", lineHeight: "1" }}
          >
            <span style={{ transform: "translateY(-3px)" }}>EXPERIENCE</span>
          </div>
          <div className="space-y-3 px-1">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs sm:text-sm">
                {exp.company && <div className="font-bold text-black text-sm uppercase tracking-wide">{exp.company}</div>}
                {exp.title && <div className="font-semibold text-gray-900 text-xs sm:text-sm">{exp.title}</div>}
                {exp.duration && <div className="text-black italic text-xs mb-1">Experience: {exp.duration}</div>}
                {exp.details && (
                  <p className="mt-1 text-black whitespace-pre-line leading-relaxed">
                    {exp.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS SECTION */}
      {visibility.showSkills !== false && skills && skills.length > 0 && (
        <div className="mt-6 mb-6 clear-both">
          <div
            style={{
              backgroundColor: "black",
              color: "#000000",
              padding: "0 12px",
              height: "32px",
              fontWeight: "bold",
              fontSize: "13px",
              textTransform: "uppercase",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              boxSizing: "border-box",
              lineHeight: "1",
              letterSpacing: "normal",
            }}
          >
            <span style={{ transform: "translateY(-3px)" }}>
              TECHNICAL & PROFESSIONAL SKILLS
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", paddingTop: "4px", paddingBottom: "6px" }}>
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="skill-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  lineHeight: "1",
                  border: "1px solid #4b5563",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "0 16px",
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  verticalAlign: "middle",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    lineHeight: "1",
                    // Arial's glyphs sit low inside their line box. Raise the whole
                    // icon-and-label group so it is visually centered in the pill.
                    transform: "translateY(-5px)",
                  }}
                >
                  <span style={{ lineHeight: "1" }}>{skill}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM SECTIONS */}
      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec) => (
            <div key={sec.id} className="mt-6 mb-6 clear-both">
              <div className="bg-[black] text-black px-3 py-1.5 font-bold text-xs sm:text-sm uppercase mb-3 block w-full tracking-normal">
                {sec.title || "ADDITIONAL INFORMATION"}
              </div>
              <div className="text-xs sm:text-sm text-black px-1 whitespace-pre-line leading-relaxed font-sans">
                {sec.content}
              </div>
            </div>
          ))}
        </>
      )}

      {/* PERSONAL INFORMATION (With optional field visibility) */}
      {showPersonalSection && (
        <div className="mt-6 mb-6 clear-both">
          <div
            className="bg-[black] text-black font-bold text-xs sm:text-sm uppercase mb-3 w-full tracking-normal"
            style={{ height: "32px", padding: "0 12px", display: "flex", alignItems: "center", lineHeight: "1" }}
          >
            <span style={{ transform: "translateY(-3px)" }}>PERSONAL INFORMATION</span>
          </div>
          <div className="text-xs sm:text-sm space-y-1.5 px-1 max-w-lg">
            {visibility.showFatherName !== false && personalInfo.fatherName && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Father&apos;s Name</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold text-black">{personalInfo.fatherName}</span>
              </div>
            )}
            {visibility.showDob !== false && personalInfo.dob && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Date of Birth</span>
                <span className="font-bold text-center">:</span>
                <span>{personalInfo.dob}</span>
              </div>
            )}
            {visibility.showLanguages !== false && personalInfo.languages && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Language Known</span>
                <span className="font-bold text-center">:</span>
                <span>{personalInfo.languages}</span>
              </div>
            )}
            {visibility.showGender !== false && personalInfo.gender && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Gender</span>
                <span className="font-bold text-center">:</span>
                <span>{personalInfo.gender}</span>
              </div>
            )}
            {visibility.showNationality !== false && personalInfo.nationality && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Nationality</span>
                <span className="font-bold text-center">:</span>
                <span>{personalInfo.nationality}</span>
              </div>
            )}
            {visibility.showMaritalStatus !== false && personalInfo.maritalStatus && (
              <div className="grid grid-cols-[150px_20px_1fr] items-center">
                <span className="font-semibold text-gray-900">Marital Status</span>
                <span className="font-bold text-center">:</span>
                <span>{personalInfo.maritalStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DECLARATION */}
      {visibility.showDeclaration !== false && (
        <div className="mt-6 mb-8 clear-both">
          <div
            className="bg-[black] text-black font-bold text-xs sm:text-sm uppercase mb-3 w-full tracking-normal"
            style={{ height: "32px", padding: "0 12px", display: "flex", alignItems: "center", lineHeight: "1" }}
          >
            <span style={{ transform: "translateY(-3px)" }}>DECLARATION</span>
          </div>
          <p className="text-xs sm:text-sm text-black px-1 leading-relaxed">
            I hereby declared that the above information given by me is true to best of my Knowledge.
          </p>
        </div>
      )}

      {/* FOOTER: DATE & PLACE (LEFT), SIGNATURE (RIGHT) */}
      {(visibility.showDatePlace !== false || visibility.showSignature !== false) && (
        <div className="flex items-end justify-between text-xs sm:text-sm font-bold pt-6 border-t border-transparent">
          <div>
            {visibility.showDatePlace !== false && (personalInfo.date || personalInfo.place) && (
              <div className="space-y-0.5">
                {personalInfo.date && <div>Date : {personalInfo.date}</div>}
                {personalInfo.place && <div>Place : {personalInfo.place}</div>}
              </div>
            )}
          </div>
          <div>
            {visibility.showSignature !== false && (
              <div className="text-right">
                <div>({personalInfo.name || "Signature"})</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   TEMPLATE 2: MODERN TWO-COLUMN
   ========================================================= */
const ModernTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const { personalInfo, visibility = {}, objective, education, experience, customSections = [], skills = [], jobTitle } = data;

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-zinc-800 font-sans p-0 shadow-xl mx-auto rounded-sm overflow-hidden flex flex-col md:flex-row text-left"
      style={{ minHeight: "1056px", backgroundColor: "#ffffff" }}
    >
      {/* SIDEBAR */}
      <div className="w-full md:w-1/3 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">{personalInfo.name}</h2>
            {jobTitle && <p className="text-xs text-indigo-300 font-semibold uppercase">{jobTitle}</p>}
          </div>

          <div className="space-y-3 text-xs text-slate-300 mb-6 border-t border-slate-700 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact</h3>
            {visibility.showEmail !== false && personalInfo.email && <div>📧 {personalInfo.email}</div>}
            {visibility.showPhone !== false && personalInfo.phone && <div>📱 {personalInfo.phone}</div>}
            {visibility.showAddress !== false && personalInfo.address && <div>📍 {personalInfo.address}</div>}
          </div>

          {visibility.showSkills !== false && skills && skills.length > 0 && (
            <div className="mb-6 border-t border-slate-700 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: "#1e293b",
                      color: "#e2e8f0",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      lineHeight: "1",
                      whiteSpace: "nowrap",
                      boxSizing: "border-box",
                    }}
                  >
                    <span style={{ display: "inline-block", lineHeight: "1", transform: "translateY(-3px)" }}>
                      {skill}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibility.showPersonalSection !== false && (
            <div className="border-t border-slate-700 pt-4 text-xs text-slate-300 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Personal</h3>
              {visibility.showFatherName !== false && personalInfo.fatherName && <div><span className="text-slate-400">Father:</span> {personalInfo.fatherName}</div>}
              {visibility.showDob !== false && personalInfo.dob && <div><span className="text-slate-400">DOB:</span> {personalInfo.dob}</div>}
              {visibility.showLanguages !== false && personalInfo.languages && <div><span className="text-slate-400">Languages:</span> {personalInfo.languages}</div>}
            </div>
          )}
        </div>

        {visibility.showDatePlace !== false && (
          <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800">
            Date: {personalInfo.date} | Place: {personalInfo.place}
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          {visibility.showObjective !== false && objective && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-2">
                Summary & Objective
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {objective}
              </p>
            </div>
          )}

          {visibility.showEducation !== false && education && education.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Education
              </h3>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{edu.qualification}</div>
                      <div className="text-slate-500 text-[11px]">{edu.board}</div>
                    </div>
                    <div className="text-right">
                      {edu.isPursuing ? (
                        <>
                          <div className="font-semibold text-amber-600">Pursuing</div>
                          {edu.year && <div className="text-slate-400 text-[10px]">Exp. {edu.year}</div>}
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-slate-700">{edu.percentage ? (edu.percentage.endsWith("%") ? edu.percentage : `${edu.percentage}%`) : ""}</div>
                          <div className="text-slate-400 text-[10px]">{edu.year}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibility.showExperience !== false && experience && experience.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Work Experience
              </h3>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-slate-200 pl-3">
                    {exp.company && <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{exp.company}</h4>}
                    {exp.title && <div className="text-xs font-semibold text-indigo-600">{exp.title}</div>}
                    {exp.duration && <div className="text-[11px] text-slate-500 font-medium">{exp.duration}</div>}
                    {exp.details && (
                      <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mt-0.5">
                        {exp.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id} className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-2">
                {sec.title}
              </h3>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {visibility.showSignature !== false && (
          <div className="pt-4 border-t border-slate-100 flex justify-end items-end text-xs text-slate-500">
            <div>({personalInfo.name})</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   TEMPLATE 3: EXECUTIVE MINIMAL
   ========================================================= */
const ExecutiveTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const { personalInfo, visibility = {}, objective, education, experience, customSections = [], skills = [], jobTitle } = data;

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-zinc-900 font-serif p-6 sm:p-10 shadow-xl mx-auto rounded-sm text-left"
      style={{ minHeight: "1056px", backgroundColor: "#ffffff" }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 className="text-2xl font-extrabold tracking-wide uppercase text-zinc-900 mb-1" style={{ fontSize: "24px", fontWeight: "800", textTransform: "uppercase", margin: "0 0 4px 0", color: "#18181b" }}>
          {personalInfo.name || "VIKAS KUMAR"}
        </h1>
        {jobTitle && <div style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", color: "#52525b", textTransform: "uppercase", marginBottom: "4px" }}>{jobTitle}</div>}
        <div style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#52525b", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px" }}>
          {visibility.showEmail !== false && personalInfo.email && <span>{personalInfo.email}</span>}
          {visibility.showPhone !== false && personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {visibility.showAddress !== false && (personalInfo.place || personalInfo.address) && (
            <span>• {personalInfo.place || personalInfo.address}</span>
          )}
        </div>
        <div style={{ width: "100%", borderBottom: "2px solid #18181b", marginTop: "14px" }} />
      </div>

      {/* PROFILE SUMMARY */}
      {visibility.showObjective !== false && objective && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", margin: 0, padding: 0, lineHeight: "1.2" }}>
            Profile Summary
          </h2>
          <div style={{ width: "100%", borderBottom: "1px solid black", marginTop: "13px", marginBottom: "10px" }} />
          <p style={{ fontSize: "12px", color: "#3f3f46", lineHeight: "1.6",  margin: 0 }}>
            {objective}
          </p>
        </div>
      )}

      {/* ACADEMIC BACKGROUND */}
      {visibility.showEducation !== false && education && education.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", margin: 0, padding: 0, lineHeight: "1.2" }}>
            Academic Background
          </h2>
          <div style={{ width: "100%", borderBottom: "1px solid black", marginTop: "13px", marginBottom: "10px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "sans-serif" }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                <div style={{ paddingRight: "12px" }}>
                  <span style={{ fontWeight: "bold", color: "#18181b" }}>{edu.qualification}</span> — <span style={{ color: "#3f3f46" }}>{edu.board}</span>
                </div>
                <div style={{ color: "#52525b", fontWeight: "500", fontSize: "11px", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {edu.isPursuing
                    ? `Pursuing${edu.year ? ` (Exp. ${edu.year})` : ""}`
                    : `Year: ${edu.year}${edu.percentage ? ` | ${edu.percentage.endsWith("%") ? edu.percentage : `${edu.percentage}%`}` : ""}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KEY EXPERIENCE */}
      {visibility.showExperience !== false && experience && experience.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", margin: 0, padding: 0, lineHeight: "1.2" }}>
            Key Experience
          </h2>
          <div style={{ width: "100%", borderBottom: "1px solid black", marginTop: "13px", marginBottom: "10px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                  <div>
                    {exp.company && <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#18181b", textTransform: "uppercase", margin: 0 }}>{exp.company}</h3>}
                    {exp.title && <div style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#3f3f46", fontWeight: "600" }}>{exp.title}</div>}
                  </div>
                  {exp.duration && <span style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#71717a", whiteSpace: "nowrap", flexShrink: 0 }}>{exp.duration}</span>}
                </div>
                {exp.details && (
                  <p style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#3f3f46", whiteSpace: "pre-line", lineHeight: "1.6", margin: "2px 0 0 0" }}>
                    {exp.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KEY SKILLS */}
      
{/* KEY SKILLS */}
{visibility.showSkills !== false && skills && skills.length > 0 && (
  <div style={{ marginBottom: "24px" }}>
    <h2
      style={{
        fontSize: "12px",
        fontFamily: "sans-serif",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#18181b",
        margin: 0,
        padding: 0,
        lineHeight: "1.2",
      }}
    >
      Key Skills
    </h2>

    {/* Horizontal line below header */}
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid black",
        marginTop: "13px",
        marginBottom: "14px",
      }}
    />

    {/* Skills */}
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px",
        fontFamily: "sans-serif",
        fontSize: "12px",
        width: "100%",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
      }}
    >
      {skills.map((s, i) => (
        <span
          key={i}
          className="skill-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f4f4f5",
            border: "1px solid #e4e4e7",
            color: "#18181b",
            fontFamily: "sans-serif",
            fontSize: "12px",
            fontWeight: "500",
            padding: "5px 12px",
            borderRadius: "4px",
            lineHeight: "1",
            textAlign: "center",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          <span
            style={{
              display: "inline-block",
              lineHeight: "1",
              transform: "translateY(-4px)",
            }}
          >
            {s}
          </span>
        </span>
      ))}
    </div>
  </div>
)}



      {/* CUSTOM SECTIONS */}
      {customSections.map((sec) => (
        <div key={sec.id} style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", margin: 0, padding: 0, lineHeight: "1.2" }}>
            {sec.title}
          </h2>
          <div style={{ width: "100%", borderBottom: "1px solid black", marginTop: "13px", marginBottom: "10px" }} />
          <p style={{ fontSize: "12px", fontFamily: "sans-serif", color: "#3f3f46", whiteSpace: "pre-line", lineHeight: "1.6", margin: 0 }}>
            {sec.content}
          </p>
        </div>
      ))}

      {/* FOOTER */}
      {(visibility.showDatePlace !== false || visibility.showSignature !== false) && (
        <div style={{ marginTop: "32px" }}>
          <div style={{ width: "100%", borderBottom: "1px solid black", marginBottom: "16px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontFamily: "sans-serif", color: "#52525b" }}>
            <div>
              {visibility.showDatePlace !== false && (personalInfo.date || personalInfo.place) && (
                <span>Date: {personalInfo.date}{personalInfo.date && personalInfo.place ? " | " : ""}Place: {personalInfo.place}</span>
              )}
            </div>
            <div>
              {visibility.showSignature !== false && (
                <div style={{ fontWeight: "bold", color: "#18181b" }}>({personalInfo.name})</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
