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

  const sectionHeaderStyle: React.CSSProperties = {
    backgroundColor: "#e5e7eb",
    color: "#000000",
    minHeight: "30px",
    padding: "4px 12px",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "13px",
    textTransform: "uppercase",
    width: "100%",
    boxSizing: "border-box",
    lineHeight: "1.3",
    letterSpacing: "0.03em",
    wordSpacing: "0.2em",
    marginBottom: "12px",
    textAlign: "center"
  };

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
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: "10px",
            color: "#000000",
            // letterSpacing: "normal",
          }}
        >
          {headerTitle}
        </h1>
      )}

      {/* NAME & CONTACT DETAILS */}
      <div style={{ marginBottom: "20px", display: "block", width: "100%" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#000000",
            marginBottom: "4px",
            lineHeight: "1.2",
          }}
        >
          {personalInfo.name || "Your Name"}
        </h2>
        {jobTitle && (
          <div
            style={{
              fontSize: "13px",
              fontWeight: "800",
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}
          >
            {jobTitle}
          </div>
        )}
        {visibility.showAddress !== false && personalInfo.address && (
          <div
            style={{
              fontSize: "13px",
              color: "#000000",
              whiteSpace: "pre-line",
              lineHeight: "1.4",
              marginBottom: "8px",
            }}
          >
            {personalInfo.address}
          </div>
        )}
        <div style={{ fontSize: "13px", color: "#000000", lineHeight: "1.4" }}>
          {visibility.showPhone !== false && personalInfo.phone && (
            <div style={{ marginBottom: "2px" }}>Mob No. : {personalInfo.phone}</div>
          )}
          {visibility.showEmail !== false && personalInfo.email && (
            <div>Email Id : {personalInfo.email}</div>
          )}
        </div>
      </div>

      {/* HORIZONTAL LINE */}
      <div
        style={{
          width: "100%",
          borderTop: "2px solid #1f2937",
          marginBottom: "24px",
          display: "block",
        }}
      />

      {/* CAREER OBJECTIVE */}
      {visibility.showObjective !== false && objective && (
        <div style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em",  textAlign: "center", paddingBottom:"12px", }}>CAREER OBJECTIVE</span>
          </div>
          <div
            style={{
              // textAlign: "center",
              fontSize: "13px",
              color: "#000000",
              lineHeight: "1.6",
              paddingLeft: "4px",
              paddingBottom:"15px",
              paddingRight: "4px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {objective}
          </div>
        </div>
      )}

      {/* ACADEMIC QUALIFICATION */}
      {visibility.showEducation !== false && education && education.length > 0 && (
        <div style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em", textAlign: "center", paddingBottom:"12px", }}>ACADEMIC QUALIFICATION</span>
          </div>
          <div style={{ width: "100%", display: "block" }}>
            <table
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
                border: "1px solid #9ca3af",
                fontSize: "12px",
                fontFamily: "Arial, sans-serif",
                color: "#000000",
                boxSizing: "border-box",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6", color: "#000000", borderBottom: "1px solid #9ca3af" }}>
                  <th style={{ border: "1px solid #9ca3af", padding: "8px 6px", fontWeight: "bold", textAlign: "center", width: "8%", verticalAlign: "middle" }}>S.No.</th>
                  <th style={{ border: "1px solid #9ca3af", padding: "8px 10px", fontWeight: "bold", textAlign: "left", width: "30%", verticalAlign: "middle" }}>Qualification</th>
                  <th style={{ border: "1px solid #9ca3af", padding: "8px 10px", fontWeight: "bold", textAlign: "left", width: "42%", verticalAlign: "middle" }}>University / Board</th>
                  <th style={{ border: "1px solid #9ca3af", padding: "8px 6px", fontWeight: "bold", textAlign: "center", width: "10%", verticalAlign: "middle" }}>Year</th>
                  <th style={{ border: "1px solid #9ca3af", padding: "8px 6px", fontWeight: "bold", textAlign: "center", width: "10%", verticalAlign: "middle" }}>Per %</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #9ca3af" }}>
                    <td style={{ border: "1px solid #9ca3af", padding: "8px 6px", textAlign: "center", verticalAlign: "middle", color: "#000000" }}>
                      {edu.sno || idx + 1}
                    </td>
                    <td style={{ border: "1px solid #9ca3af", padding: "8px 10px", fontWeight: "bold", color: "#000000", verticalAlign: "middle", wordBreak: "break-word" }}>
                      {edu.qualification}
                    </td>
                    <td style={{ border: "1px solid #9ca3af", padding: "8px 10px", color: "#000000", verticalAlign: "middle", wordBreak: "break-word" }}>
                      {edu.board}
                    </td>
                    <td style={{ border: "1px solid #9ca3af", padding: "8px 6px", textAlign: "center", verticalAlign: "middle", color: "#000000" }}>
                      {edu.isPursuing ? (edu.year ? `Pursuing (${edu.year})` : "Pursuing") : edu.year}
                    </td>
                    <td style={{ border: "1px solid #9ca3af", padding: "8px 6px", textAlign: "center", verticalAlign: "middle", color: "#000000" }}>
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
        <div style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both", textAlign: "left" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em", textAlign: "center", paddingBottom:"12px", }}>EXPERIENCE</span>
          </div>
          <div style={{ paddingLeft: "0px", paddingRight: "0px", textAlign: "left", width: "100%" }}>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "16px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px", width: "100%" }}>
                  <div>
                    {exp.company && (
                      <div
                        style={{
                          fontWeight: "700",
                          color: "#000000",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          marginBottom: "2px",
                          textAlign: "left",
                        }}
                      >
                        {exp.company}
                      </div>
                    )}
                    {exp.title && (
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#000000",
                          fontSize: "13px",
                          marginBottom: "3px",
                          textAlign: "left",
                        }}
                      >
                        {exp.title}
                      </div>
                    )}
                  </div>
                  {exp.duration && (
                    <div
                      style={{
                        fontStyle: "italic",
                        fontWeight: "700",
                        color: "#000000",
                        fontSize: "12px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        marginLeft: "12px",
                        flexShrink: 0,
                      }}
                    >
                       {exp.duration}
                    </div>
                  )}
                </div>
                {exp.details && (
                  <p
                    style={{
                      marginTop: "4px",
                      color: "#000000",
                      whiteSpace: "pre-line",
                      lineHeight: "1.6",
                      fontSize: "13px",
                      margin: "4px 0 0 0",
                      textAlign: "left",
                    }}
                  >
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
        <div style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em", textAlign: "center", paddingBottom:"12px", }}>TECHNICAL &amp; PROFESSIONAL SKILLS</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              paddingTop: "2px",
              paddingBottom: "4px",
            }}
          >
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="skill-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "28px",
                  lineHeight: "1.2",
                  border: "1px solid #4b5563",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "4px 16px",
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  textAlign: "center",
                  
                }}
              >
                <span
            style={{
              display: "inline-block",
              lineHeight: "1",
              transform: "translateY(-4px)",
            }}
          >
                {skill}
            {/* {s} */}
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
            <div key={sec.id} style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both" }}>
              <div style={sectionHeaderStyle}>
                <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em", textAlign: "center", paddingBottom:"12px", }}>{sec.title || "ADDITIONAL INFORMATION"}</span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#000000",
                  lineHeight: "1.6",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  whiteSpace: "pre-line",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {sec.content}
              </div>
            </div>
          ))}
        </>
      )}

      {/* PERSONAL INFORMATION (With optional field visibility) */}
      {showPersonalSection && (
        <div style={{ width: "100%", marginBottom: "24px", display: "block", clear: "both" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em", textAlign: "center", paddingBottom:"12px", }}>PERSONAL INFORMATION</span>
          </div>
          <div style={{ fontSize: "13px", color: "#000000", paddingLeft: "4px", paddingRight: "4px", maxWidth: "520px" }}>
            {visibility.showFatherName !== false && personalInfo.fatherName && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Father&apos;s Name</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ fontWeight: "bold", color: "#000000" }}>{personalInfo.fatherName}</span>
              </div>
            )}
            {visibility.showDob !== false && personalInfo.dob && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Date of Birth</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ color: "#000000" }}>{personalInfo.dob}</span>
              </div>
            )}
            {visibility.showLanguages !== false && personalInfo.languages && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Language Known</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ color: "#000000" }}>{personalInfo.languages}</span>
              </div>
            )}
            {visibility.showGender !== false && personalInfo.gender && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Gender</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ color: "#000000" }}>{personalInfo.gender}</span>
              </div>
            )}
            {visibility.showNationality !== false && personalInfo.nationality && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Nationality</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ color: "#000000" }}>{personalInfo.nationality}</span>
              </div>
            )}
            {visibility.showMaritalStatus !== false && personalInfo.maritalStatus && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ width: "150px", fontWeight: "700", color: "#000000", flexShrink: 0 }}>Marital Status</span>
                <span style={{ width: "20px", fontWeight: "bold", textAlign: "center", color: "#000000", flexShrink: 0 }}>:</span>
                <span style={{ color: "#000000" }}>{personalInfo.maritalStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DECLARATION */}
      {visibility.showDeclaration !== false && (
        <div style={{ width: "100%", marginBottom: "32px", display: "block", clear: "both" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ letterSpacing: "0.03em", wordSpacing: "0.2em",textAlign: "center", paddingBottom:"12px", }}>DECLARATION</span>
          </div>
          <p style={{ fontSize: "13px", color: "#000000", lineHeight: "1.6", paddingLeft: "4px", paddingRight: "4px", margin: 0 }}>
            I hereby declared that the above information given by me is true to best of my Knowledge.
          </p>
        </div>
      )}

      {/* FOOTER: DATE & PLACE (LEFT), SIGNATURE (RIGHT) */}
      {(visibility.showDatePlace !== false || visibility.showSignature !== false) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            fontSize: "13px",
            fontWeight: "bold",
            color: "#000000",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <div>
            {visibility.showDatePlace !== false && (personalInfo.date || personalInfo.place) && (
              <div style={{ lineHeight: "1.4" }}>
                {personalInfo.date && <div>Date : {personalInfo.date}</div>}
                {personalInfo.place && <div>Place : {personalInfo.place}</div>}
              </div>
            )}
          </div>
          <div>
            {visibility.showSignature !== false && (
              <div style={{ textAlign: "right" }}>
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

  // Helper to format skill strings nicely (e.g. "ComputerBasics" -> "Computer Basics")
  const formatSkillName = (str: string) => {
    if (!str) return "";
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  return (
    <div
      id="resume-paper"
      className="w-full max-w-[794px] bg-white text-zinc-800 font-sans p-0 shadow-xl mx-auto rounded-sm overflow-hidden select-text text-left"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* SIDEBAR (32% width) */}
      <div
        style={{
          width: "32%",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          flexShrink: 0,
          minHeight: "1123px",
          alignSelf: "stretch",
        }}
      >
        <div>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "4px", lineHeight: "1.2", wordBreak: "break-word" }}>
              {personalInfo.name || "Your Name"}
            </h2>
            {jobTitle && (
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                {jobTitle}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "24px", borderTop: "1px solid #334155", paddingTop: "16px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "12px" }}>
              Contact
            </h3>
            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
              {visibility.showEmail !== false && personalInfo.email && <div style={{ marginBottom: "6px", wordBreak: "break-all" }}>📧 {personalInfo.email}</div>}
              {visibility.showPhone !== false && personalInfo.phone && <div style={{ marginBottom: "6px" }}>📱 {personalInfo.phone}</div>}
              {visibility.showAddress !== false && personalInfo.address && <div style={{ whiteSpace: "pre-line" }}>📍 {personalInfo.address}</div>}
            </div>
          </div>

          {visibility.showSkills !== false && skills && skills.length > 0 && (
            <div style={{ marginBottom: "24px", borderTop: "1px solid #334155", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "12px" }}>
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: "#1e293b",
                      color: "#f1f5f9",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      lineHeight: "1.3",
                      boxSizing: "border-box",
                      letterSpacing: "0.02em",
                      wordSpacing: "0.1em",
                    }}
                  >
                    {formatSkillName(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibility.showPersonalSection !== false && (
            <div style={{ borderTop: "1px solid #334155", paddingTop: "16px", fontSize: "12px", color: "#cbd5e1" }}>
              <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "12px" }}>
                Personal
              </h3>
              {visibility.showFatherName !== false && personalInfo.fatherName && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>Father:</span> {personalInfo.fatherName}</div>}
              {visibility.showDob !== false && personalInfo.dob && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>DOB:</span> {personalInfo.dob}</div>}
              {visibility.showLanguages !== false && personalInfo.languages && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>Languages:</span> {personalInfo.languages}</div>}
              {visibility.showGender !== false && personalInfo.gender && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>Gender:</span> {personalInfo.gender}</div>}
              {visibility.showNationality !== false && personalInfo.nationality && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>Nationality:</span> {personalInfo.nationality}</div>}
              {visibility.showMaritalStatus !== false && personalInfo.maritalStatus && <div style={{ marginBottom: "6px" }}><span style={{ color: "#94a3b8" }}>Marital:</span> {personalInfo.maritalStatus}</div>}
            </div>
          )}
        </div>

        {visibility.showDatePlace !== false && (personalInfo.date || personalInfo.place) && (
          <div style={{ fontSize: "10px", color: "#64748b", paddingTop: "16px", borderTop: "1px solid #1e293b", marginTop: "16px" }}>
            Date: {personalInfo.date} {personalInfo.date && personalInfo.place ? "|" : ""} Place: {personalInfo.place}
          </div>
        )}
      </div>

      {/* MAIN CONTENT (68% width) */}
      <div
        style={{
          width: "68%",
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          minHeight: "1123px",
          alignSelf: "stretch",
        }}
      >
        <div>
          {visibility.showObjective !== false && objective && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4f46e5", borderBottom: "2px solid #4f46e5", paddingBottom: "4px", marginBottom: "8px" }}>
                Summary &amp; Objective
              </h3>
              <p style={{ fontSize: "12px", color: "#334155", lineHeight: "1.6", margin: 0 }}>
                {objective}
              </p>
            </div>
          )}

          {visibility.showEducation !== false && education && education.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4f46e5", borderBottom: "2px solid #4f46e5", paddingBottom: "4px", marginBottom: "12px" }}>
                Education
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "800", color: "#0f172a" }}>{edu.qualification}</div>
                      <div style={{ color: "#64748b", fontSize: "11px" }}>{edu.board}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {edu.isPursuing ? (
                        <>
                          <div style={{ fontWeight: "700", color: "#d97706" }}>Pursuing</div>
                          {edu.year && <div style={{ color: "#94a3b8", fontSize: "10px" }}>Exp. {edu.year}</div>}
                        </>
                      ) : (
                        <>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{edu.percentage ? (edu.percentage.endsWith("%") ? edu.percentage : `${edu.percentage}%`) : ""}</div>
                          <div style={{ color: "#64748b", fontSize: "10px" }}>{edu.year}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibility.showExperience !== false && experience && experience.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4f46e5", borderBottom: "2px solid #4f46e5", paddingBottom: "4px", marginBottom: "12px" }}>
                Work Experience
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ borderLeft: "2px solid #cbd5e1", paddingLeft: "14px" }}>
                    {exp.company && <h4 style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 2px 0" }}>{exp.company}</h4>}
                    {exp.title && <div style={{ fontSize: "12px", fontWeight: "700", color: "#4f46e5", marginBottom: "2px" }}>{exp.title}</div>}
                    {exp.duration && <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>{exp.duration}</div>}
                    {exp.details && (
                      <p style={{ fontSize: "12px", color: "#334155", whiteSpace: "pre-line", lineHeight: "1.6", margin: "4px 0 0 0" }}>
                        {exp.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections.map((sec) => (
            <div key={sec.id} style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4f46e5", borderBottom: "2px solid #4f46e5", paddingBottom: "4px", marginBottom: "8px" }}>
                {sec.title}
              </h3>
              <p style={{ fontSize: "12px", color: "#334155", whiteSpace: "pre-line", lineHeight: "1.6", margin: 0 }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {visibility.showSignature !== false && (
          <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", fontSize: "12px", color: "#64748b" }}>
            <div style={{ fontWeight: "800", color: "#0f172a" }}>({personalInfo.name})</div>
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
