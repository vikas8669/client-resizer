"use client";

import React from "react";
import { IResumeData, ResumeSectionKey, DEFAULT_SECTION_ORDER } from "../types";

interface ResumePreviewProps {
  data: IResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { templateId } = data;

  switch (templateId) {
    case "classic_ats":
      return <ClassicAtsTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "tech_compact":
      return <TechCompactTemplate data={data} />;
    case "traditional":
    default:
      return <TraditionalTemplate data={data} />;
  }
};

/* =========================================================
   BULLET LIST & HELPERS (Explicit bullet marks for 100% PDF & CSS stability)
   ========================================================= */
export const getExperiencePoints = (exp: { points?: string[]; details?: string }): string[] => {
  if (exp.points && Array.isArray(exp.points) && exp.points.length > 0) {
    return exp.points.map((p) => p.trim()).filter(Boolean);
  }
  if (exp.details && typeof exp.details === "string") {
    return exp.details
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Safely strip bullet point markers (•, -, or standalone *)
 * without stripping leading bold asterisks (**text**)
 */
export const cleanBulletPrefix = (s: string): string => {
  if (!s) return "";
  return s.replace(/^(?:[•·-]\s*|\*(?!\*)\s*)/, "");
};

/**
 * Format inline text highlights:
 * - **bold** or <b>bold</b> for metrics & keyword emphasis (ATS-safe standard)
 * - ==highlight== or <mark>highlight</mark> for soft yellow marker highlighting
 * - __underline__ or <u>underline</u> for underlined text
 * - *italic* or <i>italic</i> for italic emphasis
 */
export const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return "";

  const regex = /(==.*?==|<mark>.*?<\/mark>|\*\*.*?\*\*|<b>.*?<\/b>|<strong>.*?<\/strong>|(?<!\*)\*(?!\*)[^*]+?(?<!\*)\*(?!\*)|<i>.*?<\/i>|<em>.*?<\/em>|__.*?__|<u>.*?<\/u>)/gi;
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    // 1. Yellow Highlight
    if (
      (part.startsWith("==") && part.endsWith("==") && part.length >= 4) ||
      (part.toLowerCase().startsWith("<mark>") && part.toLowerCase().endsWith("</mark>"))
    ) {
      const content = part.startsWith("==") ? part.slice(2, -2) : part.slice(6, -7);
      return (
        <mark
          key={index}
          style={{
            backgroundColor: "#fef08a",
            color: "#000000",
            padding: "0 3px",
            borderRadius: "2px",
            fontWeight: "inherit",
          }}
        >
          {content}
        </mark>
      );
    }

    // 2. Bold / Strong
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.toLowerCase().startsWith("<b>") && part.toLowerCase().endsWith("</b>")) ||
      (part.toLowerCase().startsWith("<strong>") && part.toLowerCase().endsWith("</strong>"))
    ) {
      let content = part;
      if (part.startsWith("**")) content = part.slice(2, -2);
      else if (part.toLowerCase().startsWith("<b>")) content = part.slice(3, -4);
      else if (part.toLowerCase().startsWith("<strong>")) content = part.slice(8, -9);

      return (
        <strong key={index} style={{ fontWeight: 700, color: "inherit" }}>
          {content}
        </strong>
      );
    }

    // 3. Underline
    if (
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4) ||
      (part.toLowerCase().startsWith("<u>") && part.toLowerCase().endsWith("</u>"))
    ) {
      const content = part.startsWith("__") ? part.slice(2, -2) : part.slice(3, -4);
      return (
        <u key={index} style={{ textDecoration: "underline" }}>
          {content}
        </u>
      );
    }

    // 4. Italic
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.toLowerCase().startsWith("<i>") && part.toLowerCase().endsWith("</i>")) ||
      (part.toLowerCase().startsWith("<em>") && part.toLowerCase().endsWith("</em>"))
    ) {
      let content = part;
      if (part.startsWith("*")) content = part.slice(1, -1);
      else if (part.toLowerCase().startsWith("<i>")) content = part.slice(3, -4);
      else if (part.toLowerCase().startsWith("<em>")) content = part.slice(4, -5);

      return (
        <em key={index} style={{ fontStyle: "italic" }}>
          {content}
        </em>
      );
    }

    return part;
  });
};

export const BulletList: React.FC<{
  items: string[];
  bulletColor?: string;
  textColor?: string;
  fontSize?: string;
  lineHeight?: string;
}> = ({
  items,
  bulletColor = "#000000",
  textColor = "#111827",
  fontSize = "11.5px",
  lineHeight = "1.45",
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5px", marginTop: "3px", paddingLeft: "4px" }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "7px",
            fontSize,
            lineHeight,
            color: textColor,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "14px",
              lineHeight: "1",
              color: bulletColor,
              userSelect: "none",
              marginTop: "1px",
              flexShrink: 0,
            }}
          >
            •
          </span>
          <span style={{ flex: 1 }}>{renderFormattedText(cleanBulletPrefix(item))}</span>
        </div>
      ))}
    </div>
  );
};

export const AtsSectionHeader: React.FC<{ title: string; marginBottom?: string }> = ({
  title,
  marginBottom = "10px",
}) => (
  <div style={{ marginBottom, width: "100%", display: "block" }}>
    <div
      style={{
        fontSize: "13px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#000000",
        lineHeight: "1.3",
        paddingBottom: "5px",
      }}
    >
      {title}
    </div>
    <div
      style={{
        width: "100%",
        height: "1px",
        backgroundColor: "#000000",
        border: "none",
        margin: "0",
      }}
    />
  </div>
);

/* =========================================================
   TEMPLATE 1: CLASSIC ATS / LATEX SCHOLAR (Screenshot Exact Match!)
   ========================================================= */
export const ClassicAtsTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const {
    personalInfo,
    visibility = {},
    objective,
    skillGroups = [],
    skills = [],
    experience = [],
    projects = [],
    education = [],
    certifications = [],
    achievements = [],
    volunteer = [],
  } = data;

  const links = personalInfo.customLinks || [];
  const sectionOrder = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  const renderSection = (secKey: ResumeSectionKey) => {
    switch (secKey) {
      case "summary":
        return visibility.showObjective !== false && objective ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Professional Summary" marginBottom="10px" />
            <p
              style={{
                margin: 0,
                fontSize: "11.5px",
                lineHeight: "1.45",
                color: "#111827",
                textAlign: "left",
              }}
            >
              {renderFormattedText(objective)}
            </p>
          </div>
        ) : null;

      case "skills":
        return visibility.showSkills !== false && (skillGroups.length > 0 || skills.length > 0) ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Technical Skills" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skillGroups.length > 0 ? (
                skillGroups.map((sg) => (
                  <div
                    key={sg.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "170px 1fr",
                      fontSize: "11.5px",
                      lineHeight: "1.4",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#000000" }}>
                      {sg.category}:
                    </span>
                    <span style={{ color: "#111827" }}>{sg.skills}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "11.5px", color: "#111827" }}>
                  <span style={{ fontWeight: "bold" }}>Skills: </span>
                  {skills.join(", ")}
                </div>
              )}
            </div>
          </div>
        ) : null;

      case "experience":
        return visibility.showExperience !== false && experience.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Professional Experience" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {experience.map((exp, idx) => {
                const points = getExperiencePoints(exp);

                return (
                  <div key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", color: "#000000" }}>
                        {exp.company || "Company Name"}
                      </span>
                      <span style={{ fontStyle: "italic", fontSize: "11.5px", color: "#111827" }}>
                        {exp.duration}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontStyle: "italic",
                        color: "#1f2937",
                        marginBottom: "3px",
                      }}
                    >
                      {exp.title}
                      {exp.location ? ` – ${exp.location}` : ""}
                    </div>

                    {points.length > 0 && (
                      <BulletList
                        items={points}
                        bulletColor="#000000"
                        textColor="#111827"
                        fontSize="11.5px"
                        lineHeight="1.45"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "projects":
        return visibility.showProjects !== false && projects.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Projects" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold", color: "#000000" }}>
                        {renderFormattedText(proj.title)}
                      </span>
                      {proj.techStack && (
                        <span style={{ fontStyle: "italic", color: "#374151", marginLeft: "6px" }}>
                          | {renderFormattedText(proj.techStack)}
                        </span>
                      )}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#000000",
                            textDecoration: "none",
                            marginLeft: "6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          [Link]
                        </a>
                      )}
                    </div>
                    {proj.duration && (
                      <span style={{ fontStyle: "italic", fontSize: "11.5px", color: "#111827" }}>
                        {proj.duration}
                      </span>
                    )}
                  </div>

                  {proj.points && proj.points.length > 0 && (
                    <BulletList
                      items={proj.points}
                      bulletColor="#000000"
                      textColor="#111827"
                      fontSize="11.5px"
                      lineHeight="1.45"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return visibility.showEducation !== false && education.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Education" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#000000" }}>
                      {edu.qualification}
                    </span>
                    <span style={{ fontStyle: "italic", fontSize: "11.5px", color: "#111827" }}>
                      {edu.year}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11.5px",
                      fontStyle: "italic",
                      color: "#374151",
                    }}
                  >
                    <span>{edu.board}</span>
                    {edu.percentage && <span>Grade / CGPA: {edu.percentage}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return visibility.showCertifications !== false && certifications.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Certifications" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px", paddingLeft: "4px" }}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "7px",
                    fontSize: "11.5px",
                    lineHeight: "1.45",
                    color: "#111827",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "14px",
                      lineHeight: "1",
                      color: "#000000",
                      userSelect: "none",
                      marginTop: "1px",
                      flexShrink: 0,
                    }}
                  >
                    •
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: "bold" }}>{cert.name}</span>
                    {cert.issuer && ` – ${cert.issuer}`}
                    {cert.date && ` (${cert.date})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "achievements":
        return visibility.showAchievements !== false && achievements.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Achievements & Honors" marginBottom="10px" />
            <BulletList
              items={achievements.map((ach) => ach.text)}
              bulletColor="#000000"
              textColor="#111827"
              fontSize="11.5px"
              lineHeight="1.45"
            />
          </div>
        ) : null;

      case "volunteer":
        return visibility.showVolunteer !== false && volunteer.length > 0 ? (
          <div style={{ marginBottom: "16px" }}>
            <AtsSectionHeader title="Leadership & Volunteer" marginBottom="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px", paddingLeft: "4px" }}>
              {volunteer.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "7px",
                    fontSize: "11.5px",
                    lineHeight: "1.45",
                    color: "#111827",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "14px",
                      lineHeight: "1",
                      color: "#000000",
                      userSelect: "none",
                      marginTop: "1px",
                      flexShrink: 0,
                    }}
                  >
                    •
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: "bold" }}>{v.role}</span>
                    {v.organization && ` – ${v.organization}`}
                    {v.duration && ` (${v.duration})`}
                    {v.details && <span style={{ display: "block", color: "#374151" }}>{v.details}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-black shadow-xl mx-auto rounded-xs select-text text-left print:shadow-none print:m-0"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: "36px 44px",
        boxSizing: "border-box",
        fontSize: "12.5px",
        lineHeight: "1.45",
      }}
    >
      {/* ── HEADER: CENTERED NAME & CONTACT ── */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{
            fontSize: "27px",
            fontWeight: "bold",
            letterSpacing: "0.02em",
            margin: "0 0 5px 0",
            color: "#000000",
            fontFamily: "'Times New Roman', Times, Georgia, serif",
          }}
        >
          {personalInfo.name || "Your Full Name"}
        </h1>

        <div
          style={{
            fontSize: "11.5px",
            color: "#000000",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            rowGap: "3px",
            columnGap: "8px",
            lineHeight: "1.3",
          }}
        >
          {(() => {
            const items: React.ReactNode[] = [];
            if (visibility.showAddress !== false && personalInfo.address) {
              items.push(<span key="addr">{personalInfo.address}</span>);
            }
            if (visibility.showPhone !== false && personalInfo.phone) {
              items.push(<span key="phone">{personalInfo.phone}</span>);
            }
            if (visibility.showEmail !== false && personalInfo.email) {
              items.push(
                <a
                  key="email"
                  href={`mailto:${personalInfo.email}`}
                  style={{ color: "#000000", textDecoration: "none", cursor: "pointer" }}
                >
                  {personalInfo.email}
                </a>
              );
            }
            links.forEach((link) => {
              items.push(
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#000000", textDecoration: "none", cursor: "pointer" }}
                >
                  {link.label || link.url}
                </a>
              );
            });
            return items.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span style={{ color: "#4b5563", margin: "0 2px" }}>|</span>}
                {item}
              </React.Fragment>
            ));
          })()}
        </div>
      </div>

      {/* ── DYNAMIC REORDERABLE SECTIONS ── */}
      {sectionOrder.map((secKey) => (
        <React.Fragment key={secKey}>
          {renderSection(secKey)}
        </React.Fragment>
      ))}
    </div>
  );
};

/* =========================================================
   TEMPLATE 2: TRADITIONAL (Existing Indian/International Standard)
   ========================================================= */
export const TraditionalTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const {
    headerTitle,
    jobTitle,
    personalInfo,
    visibility = {},
    objective,
    education = [],
    experience = [],
    projects = [],
    customSections = [],
    skills = [],
    skillGroups = [],
  } = data;

  const showHeader = visibility.showHeaderTitle !== false && headerTitle && headerTitle.trim() !== "";

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
    minHeight: "28px",
    padding: "5px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // textAlign: "center",
    fontWeight: "bold",
    fontSize: "12.5px",
    textTransform: "uppercase",
    width: "100%",
    boxSizing: "border-box",
    lineHeight: "1.3",
    letterSpacing: "0.03em",
    marginBottom: "12px",
  };

  // Traditional template: use customizable data.skills directly if present,
  // otherwise fallback to flattened skillGroups.
  let traditionalSkills: string[] = [];
  if (skills && skills.length > 0) {
    traditionalSkills = skills;
  } else if (skillGroups && skillGroups.length > 0) {
    skillGroups.forEach((sg) => {
      if (sg.skills) {
        sg.skills
          .split(/[,;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => {
            if (!traditionalSkills.some((ex) => ex.toLowerCase() === s.toLowerCase())) {
              traditionalSkills.push(s);
            }
          });
      }
    });
  }

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-black font-sans p-6 sm:p-10 shadow-xl mx-auto rounded-xs select-text text-left print:shadow-none print:m-0"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        color: "#000000",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      {showHeader && (
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: "10px",
            color: "#000000",
          }}
        >
          {headerTitle}
        </h1>
      )}

      <div style={{ marginBottom: "18px", display: "block", width: "100%" }}>
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
              fontWeight: "bold",
              color: "#374151",
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
              fontSize: "12px",
              color: "#000000",
              whiteSpace: "pre-line",
              lineHeight: "1.4",
              marginBottom: "8px",
            }}
          >
            {personalInfo.address}
          </div>
        )}
        <div style={{ fontSize: "12px", color: "#000000", lineHeight: "1.4" }}>
          {visibility.showPhone !== false && personalInfo.phone && (
            <div style={{ marginBottom: "2px" }}>Mob No. : {personalInfo.phone}</div>
          )}
          {visibility.showEmail !== false && personalInfo.email && (
            <div>Email Id : {personalInfo.email}</div>
          )}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          borderTop: "2px solid #1f2937",
          marginBottom: "24px",
        }}
      />

      {visibility.showObjective !== false && objective && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%",  display: "block", paddingBottom:"12px" }}>CAREER OBJECTIVE</span>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#000000",
              lineHeight: "1.6",
              paddingLeft: "4px",
            }}
          >
            {renderFormattedText(objective)}
          </div>
        </div>
      )}

      {visibility.showEducation !== false && education.length > 0 && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", display: "block", paddingBottom:"12px" }}>ACADEMIC QUALIFICATION</span>
          </div>
          <table
            style={{
              width: "100%",
              textAlign: "left",
              borderCollapse: "collapse",
              border: "1px solid #9ca3af",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ border: "1px solid #9ca3af", padding: "6px" }}>S.No</th>
                <th style={{ border: "1px solid #9ca3af", padding: "6px" }}>Qualification</th>
                <th style={{ border: "1px solid #9ca3af", padding: "6px" }}>Board / University</th>
                <th style={{ border: "1px solid #9ca3af", padding: "6px" }}>Year</th>
                <th style={{ border: "1px solid #9ca3af", padding: "6px" }}>% / CGPA</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #9ca3af", padding: "6px" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #9ca3af", padding: "6px" }}>{edu.qualification}</td>
                  <td style={{ border: "1px solid #9ca3af", padding: "6px" }}>{edu.board}</td>
                  <td style={{ border: "1px solid #9ca3af", padding: "6px" }}>{edu.year}</td>
                  <td style={{ border: "1px solid #9ca3af", padding: "6px" }}>{edu.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visibility.showExperience !== false && experience.length > 0 && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", display: "block", paddingBottom:"12px"  }}>WORK EXPERIENCE</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "4px" }}>
            {experience.map((exp, idx) => {
              const points = getExperiencePoints(exp);
              return (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      fontSize: "12.5px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#000000" }}>
                      {exp.company || exp.title}
                    </span>
                    {exp.duration && (
                      <span
                        style={{
                          fontSize: "12px",
                          fontStyle: "italic",
                          color: "#111827",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {exp.company && (
                    <div
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#374151",
                        marginBottom: "3px",
                      }}
                    >
                      {exp.title}
                      {exp.location ? ` – ${exp.location}` : ""}
                    </div>
                  )}
                  {points.length > 0 ? (
                    <BulletList
                      items={points}
                      bulletColor="#374151"
                      textColor="#374151"
                      fontSize="12px"
                    />
                  ) : exp.details ? (
                    <div style={{ fontSize: "12px", color: "#374151", whiteSpace: "pre-line", marginTop: "2px" }}>
                      {renderFormattedText(exp.details)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {visibility.showProjects !== false && projects.length > 0 && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", paddingBottom:"12px", display: "block" }}>PROJECTS</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "4px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontSize: "12.5px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold", color: "#000000" }}>
                      {renderFormattedText(proj.title)}
                    </span>
                    {proj.techStack && (
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "#4b5563",
                          fontWeight: "normal",
                          marginLeft: "6px",
                          fontSize: "12px",
                        }}
                      >
                        ({renderFormattedText(proj.techStack)})
                      </span>
                    )}
                  </div>
                  {proj.duration && (
                    <span
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#111827",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {proj.duration}
                    </span>
                  )}
                </div>
                {proj.points && proj.points.length > 0 && (
                  <BulletList
                    items={proj.points}
                    bulletColor="#374151"
                    textColor="#374151"
                    fontSize="12px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {visibility.showSkills !== false && traditionalSkills.length > 0 && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", paddingBottom:"12px", display: "block" }}>KEY SKILLS</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingLeft: "2px" }}>
            {traditionalSkills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                  lineHeight: "1.4",
                  paddingBottom:"12px", 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {showPersonalSection && (
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", display: "block", paddingBottom:"12px",  }}>PERSONAL DETAILS</span>
          </div>
          <table style={{ width: "100%", fontSize: "12px", lineHeight: "1.6", borderCollapse: "collapse" }}>
            <tbody>
              {visibility.showFatherName !== false && personalInfo.fatherName && (
                <tr>
                  <td style={{ width: "160px", fontWeight: "bold" }}>Father&apos;s Name</td>
                  <td>: {personalInfo.fatherName}</td>
                </tr>
              )}
              {visibility.showDob !== false && personalInfo.dob && (
                <tr>
                  <td style={{ fontWeight: "bold" }}>Date of Birth</td>
                  <td>: {personalInfo.dob}</td>
                </tr>
              )}
              {visibility.showGender !== false && personalInfo.gender && (
                <tr>
                  <td style={{ fontWeight: "bold" }}>Gender</td>
                  <td>: {personalInfo.gender}</td>
                </tr>
              )}
              {visibility.showNationality !== false && personalInfo.nationality && (
                <tr>
                  <td style={{ fontWeight: "bold" }}>Nationality</td>
                  <td>: {personalInfo.nationality}</td>
                </tr>
              )}
              {visibility.showLanguages !== false && personalInfo.languages && (
                <tr>
                  <td style={{ fontWeight: "bold" }}>Languages Known</td>
                  <td>: {personalInfo.languages}</td>
                </tr>
              )}
              {visibility.showMaritalStatus !== false && personalInfo.maritalStatus && (
                <tr>
                  <td style={{ fontWeight: "bold" }}>Marital Status</td>
                  <td>: {personalInfo.maritalStatus}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {visibility.showDeclaration !== false && (
        <div style={{ width: "100%", marginBottom: "30px" }}>
          <div style={sectionHeaderStyle}>
            <span style={{ width: "100%", display: "block", paddingBottom:"12px" }}>DECLARATION</span>
          </div>
          <p style={{ fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
            I hereby declare that all the information given above is true and correct to the best of my knowledge and belief.
          </p>
        </div>
      )}

      {visibility.showDatePlace !== false && (
        <div style={{ display: "flex", marginTop: "30px", fontSize: "12px" }}>
          <div>
            <div>Date: {personalInfo.date || new Date().toISOString().split("T")[0]}</div>
            <div>Place: {personalInfo.place || "India"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "30px" }} />
            <div style={{ fontWeight: "bold" }}>({personalInfo.name || "Signature"})</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExecutiveSectionHeader: React.FC<{ title: string; marginBottom?: string }> = ({
  title,
  marginBottom = "10px",
}) => (
  <div style={{ marginBottom, width: "100%", display: "block" }}>
    <div
      style={{
        fontSize: "12px",
        fontFamily: "sans-serif",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#18181b",
        lineHeight: "1.3",
        paddingBottom: "5px",
      }}
    >
      {title}
    </div>
    <div style={{ width: "100%", height: "1px", backgroundColor: "#18181b", border: "none", margin: 0 }} />
  </div>
);

/* =========================================================
   TEMPLATE 3: EXECUTIVE (Corporate Minimalist)
   ========================================================= */
export const ExecutiveTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const { personalInfo, visibility = {}, objective, education = [], experience = [], projects = [], skills = [], jobTitle } = data;

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-black font-serif p-6 sm:p-10 shadow-xl mx-auto rounded-xs text-left print:shadow-none print:m-0"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        color: "#18181b",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            textTransform: "uppercase",
            margin: "0 0 4px 0",
            color: "#18181b",
          }}
        >
          {personalInfo.name || "Executive Candidate"}
        </h1>
        {jobTitle && (
          <div
            style={{
              fontSize: "12px",
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "#52525b",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            {jobTitle}
          </div>
        )}
        <div
          style={{
            fontSize: "12px",
            fontFamily: "sans-serif",
            color: "#52525b",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {visibility.showEmail !== false && personalInfo.email && <span>{personalInfo.email}</span>}
          {visibility.showPhone !== false && personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {visibility.showAddress !== false && (personalInfo.place || personalInfo.address) && (
            <span>• {personalInfo.place || personalInfo.address}</span>
          )}
        </div>
        <div style={{ width: "100%", height: "2px", backgroundColor: "#18181b", marginTop: "14px" }} />
      </div>

      {visibility.showObjective !== false && objective && (
        <div style={{ marginBottom: "20px" }}>
          <ExecutiveSectionHeader title="Profile Summary" marginBottom="8px" />
          <p style={{ fontSize: "12px", color: "#3f3f46", lineHeight: "1.6", margin: 0 }}>
            {renderFormattedText(objective)}
          </p>
        </div>
      )}

      {visibility.showEducation !== false && education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <ExecutiveSectionHeader title="Academic Background" marginBottom="8px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "sans-serif" }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>
                  <strong>{edu.qualification}</strong> – {edu.board}
                </span>
                <span style={{ color: "#71717a" }}>
                  {edu.year} {edu.percentage ? `(${edu.percentage})` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibility.showExperience !== false && experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <ExecutiveSectionHeader title="Key Experience" marginBottom="8px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {experience.map((exp, idx) => {
              const points = getExperiencePoints(exp);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: "bold", fontSize: "12.5px" }}>{exp.company}</span>
                    <span style={{ fontSize: "11px", color: "#71717a" }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#4b5563", fontStyle: "italic", marginBottom: "3px" }}>
                    {exp.title}
                  </div>
                  {points.length > 0 ? (
                    <BulletList
                      items={points}
                      bulletColor="#4b5563"
                      textColor="#374151"
                      fontSize="12px"
                    />
                  ) : exp.details ? (
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.5" }}>
                      {renderFormattedText(exp.details)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {visibility.showProjects !== false && projects.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <ExecutiveSectionHeader title="Key Projects" marginBottom="8px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: "bold", fontSize: "12.5px" }}>
                    {renderFormattedText(proj.title)}
                  </span>
                  <span style={{ fontSize: "11px", color: "#71717a" }}>{proj.duration}</span>
                </div>
                {proj.techStack && (
                  <div style={{ fontSize: "11.5px", color: "#4b5563", fontStyle: "italic", marginBottom: "3px" }}>
                    {renderFormattedText(proj.techStack)}
                  </div>
                )}
                {proj.points && proj.points.length > 0 && (
                  <BulletList
                    items={proj.points}
                    bulletColor="#4b5563"
                    textColor="#374151"
                    fontSize="12px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {visibility.showSkills !== false && skills.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <ExecutiveSectionHeader title="Core Competencies" marginBottom="8px" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  backgroundColor: "#f4f4f5",
                  borderRadius: "4px",
                  border: "1px solid #e4e4e7",
                  paddingBottom:"12px"
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MinimalSectionHeader: React.FC<{
  title: string;
  marginBottom?: string;
}> = ({ title, marginBottom = "10px" }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "8px",
      width: "100%",
      marginBottom,
    }}
  >
    {/* <span
      aria-hidden="true"
      style={{
        display: "block",
        flex: "0 0 3px",
        width: "3px",
        minWidth: "3px",
        height: "13px",
        minHeight: "13px",
        maxHeight: "13px",
        boxSizing: "border-box",
        backgroundColor: "#4f46e5",
        borderRadius: "1px",
        alignSelf: "center",
      }}
    /> */}


    <span
  aria-hidden="true"
  style={{
    color: "#4f46e5",
    fontWeight: "bold",
    lineHeight: 1,
  }}
>
  |
</span>

    <span
      style={{
        display: "block",
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#0f172a",
        lineHeight: "13px",
        margin: 0,
        padding: 0,
      }}
    >
      {title}
    </span>
  </div>
);

/* =========================================================
   TEMPLATE 4: MINIMAL CLEAN (Swiss Contemporary Style)
   ========================================================= */
export const MinimalTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const {
    personalInfo,
    visibility = {},
    objective,
    skillGroups = [],
    skills = [],
    experience = [],
    projects = [],
    education = [],
  } = data;

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-black font-sans shadow-xl mx-auto rounded-xs text-left print:shadow-none print:m-0"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        color: "#18181b",
        backgroundColor: "#ffffff",
        padding: "40px 48px",
        boxSizing: "border-box",
        fontSize: "12px",
        lineHeight: "1.5",
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            color: "#0f172a",
            margin: "0 0 4px 0",
          }}
        >
          {personalInfo.name}
        </h1>
        {data.jobTitle && (
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#4f46e5",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {data.jobTitle}
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            color: "#64748b",
            fontSize: "11.5px",
          }}
        >
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.address && <span>⚲ {personalInfo.address}</span>}
          {personalInfo.customLinks?.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#4f46e5", textDecoration: "none" }}
            >
              ↗ {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── ABOUT ME ── */}
      {visibility.showObjective !== false && objective && (
        <div style={{ marginBottom: "20px" }}>
          <MinimalSectionHeader title="Overview" marginBottom="12px" />
          <p style={{ margin: 0, color: "#334155", lineHeight: "1.6" }}>{objective}</p>
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {visibility.showExperience !== false && experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <MinimalSectionHeader title="Experience" marginBottom="12px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {experience.map((exp, idx) => {
              const points = getExperiencePoints(exp);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold", color: "#0f172a" }}>{exp.title}</span>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>{exp.duration}</span>
                  </div>
                  <div style={{ color: "#4f46e5", fontSize: "11.5px", fontWeight: "500", marginBottom: "4px" }}>
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  {points.length > 0 ? (
                    <BulletList
                      items={points}
                      bulletColor="#4f46e5"
                      textColor="#475569"
                      fontSize="12px"
                    />
                  ) : exp.details ? (
                    <p style={{ margin: 0, color: "#475569", lineHeight: "1.5" }}>{renderFormattedText(exp.details)}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {visibility.showProjects !== false && projects.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <MinimalSectionHeader title="Projects" marginBottom="12px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold", color: "#0f172a" }}>
                    {renderFormattedText(proj.title)}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>{proj.duration}</span>
                </div>
                {proj.techStack && (
                  <div style={{ color: "#4f46e5", fontSize: "11.5px", fontWeight: "500", marginBottom: "4px" }}>
                    {renderFormattedText(proj.techStack)}
                  </div>
                )}
                {proj.points && proj.points.length > 0 && (
                  <BulletList
                    items={proj.points}
                    bulletColor="#4f46e5"
                    textColor="#475569"
                    fontSize="12px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {visibility.showSkills !== false && (skillGroups.length > 0 || skills.length > 0) && (
        <div style={{ marginBottom: "20px" }}>
          <MinimalSectionHeader title="Skills & Capabilities" marginBottom="12px" />
          {skillGroups.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {skillGroups.map((sg) => (
                <div key={sg.id} style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontWeight: "bold", minWidth: "150px" }}>{sg.category}:</span>
                  <span style={{ color: "#334155" }}>{sg.skills}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#f1f5f9",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    color: "#1e293b",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── EDUCATION ── */}
      {visibility.showEducation !== false && education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <MinimalSectionHeader title="Education" marginBottom="8px" />
          {education.map((edu, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>
                <strong>{edu.qualification}</strong> – {edu.board}
              </span>
              <span style={{ color: "#64748b" }}>{edu.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   TEMPLATE 5: TECH COMPACT (Developer High-Density Layout)
   ========================================================= */
export const TechCompactTemplate: React.FC<{ data: IResumeData }> = ({ data }) => {
  const {
    personalInfo,
    visibility = {},
    objective,
    skillGroups = [],
    experience = [],
    projects = [],
    education = [],
  } = data;

  return (
    <div
      id="resume-paper"
      className="w-full bg-white text-black font-sans shadow-xl mx-auto rounded-xs text-left print:shadow-none print:m-0"
      style={{
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        color: "#09090b",
        backgroundColor: "#ffffff",
        padding: "34px 40px",
        boxSizing: "border-box",
        fontSize: "11.5px",
        lineHeight: "1.4",
      }}
    >
      {/* ── TOP HEADER ── */}
      <div
        style={{
          borderBottom: "2px solid #0284c7",
          paddingBottom: "10px",
          marginBottom: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {personalInfo.name}
          </h1>
          {data.jobTitle && (
            <p style={{ margin: "2px 0 0 0", color: "#0284c7", fontWeight: "bold", fontSize: "12px" }}>
              {data.jobTitle}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b" }}>
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.address && <div>{personalInfo.address}</div>}
        </div>
      </div>

      {/* ── OBJECTIVE ── */}
      {visibility.showObjective !== false && objective && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: 0, color: "#334155", fontStyle: "italic", lineHeight: "1.45" }}>
            {renderFormattedText(objective)}
          </p>
        </div>
      )}

      {/* ── SKILLS TABLE ── */}
      {visibility.showSkills !== false && skillGroups.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#0284c7",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
              marginBottom: "10px",
            }}
          >
            Technical Stack
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {skillGroups.map((sg) => (
              <div key={sg.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr" }}>
                <span style={{ fontWeight: "bold", color: "#1e293b" }}>{sg.category}</span>
                <span style={{ color: "#475569" }}>{sg.skills}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {visibility.showExperience !== false && experience.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#0284c7",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
              marginBottom: "10px",
            }}
          >
            Work Experience
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {experience.map((exp, idx) => {
              const points = getExperiencePoints(exp);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold" }}>
                      {exp.title} · <span style={{ color: "#0284c7" }}>{exp.company}</span>
                    </span>
                    <span style={{ color: "#64748b" }}>{exp.duration}</span>
                  </div>
                  {points.length > 0 ? (
                    <BulletList
                      items={points}
                      bulletColor="#0284c7"
                      textColor="#334155"
                      fontSize="11.5px"
                      lineHeight="1.45"
                    />
                  ) : exp.details ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", lineHeight: "1.45" }}>
                      {renderFormattedText(exp.details)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {visibility.showProjects !== false && projects.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#0284c7",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
              marginBottom: "10px",
            }}
          >
            Key Projects
          </div>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{renderFormattedText(proj.title)}</span>
                <span style={{ color: "#64748b" }}>{proj.duration}</span>
              </div>
              {proj.techStack && (
                <div style={{ fontSize: "10.5px", color: "#0284c7", marginBottom: "2px" }}>
                  {renderFormattedText(proj.techStack)}
                </div>
              )}
              {proj.points && proj.points.length > 0 && (
                <BulletList
                  items={proj.points}
                  bulletColor="#0284c7"
                  textColor="#334155"
                  fontSize="11px"
                  lineHeight="1.4"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EDUCATION ── */}
      {visibility.showEducation !== false && education.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#0284c7",
              borderBottom: "1px solid #e2e8f0",
             paddingBottom: "6px",
              marginBottom: "10px",
            }}
          >
            Education
          </div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <strong>{edu.qualification}</strong> – {edu.board}
              </span>
              <span style={{ color: "#64748b" }}>{edu.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
