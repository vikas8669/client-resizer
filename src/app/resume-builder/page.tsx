"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  ResumeForm,
  ResumeSectionTab,
} from "@/features/resume/components/ResumeForm";
import { ResumePreview } from "@/features/resume/components/ResumePreview";
import {
  INITIAL_RESUME_DATA,
  IResumeData,
  ResumeTemplateId,
  ResumeSectionKey,
  DEFAULT_SECTION_ORDER,
  SECTION_METADATA,
} from "@/features/resume/types";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";
import { useResumePayment } from "@/features/resume/hooks/useResumePayment";
import { ResumePaymentModal } from "@/features/resume/components/ResumePaymentModal";
import { ResumeAuthModal } from "@/features/resume/components/ResumeAuthModal";

import {
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  FileText,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  ChevronDown,
  Layers,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<IResumeData>(INITIAL_RESUME_DATA);
  const [activeTab, setActiveTab] = useState<ResumeSectionTab>("header");
  const [previewFormat, setPreviewFormat] = useState<"html" | "pdf" | "tex">("pdf");
  const [zoomLevel, setZoomLevel] = useState<number>(86);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isSectionsMenuOpen, setIsSectionsMenuOpen] = useState(false);

  const {
    credits,
    isLoggedIn,
    isAdmin,
    isFreeAdmin,
    plans,
    isPaying,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    purchasePack,
    requestDownloadWithCredit,
  } = useResumePayment(resumeData._id);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("printpix_resume_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object" && parsed.personalInfo) {
          setResumeData(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to restore resume draft", e);
    }
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    try {
      localStorage.setItem("printpix_resume_draft", JSON.stringify(resumeData));
    } catch (e) {
      // ignore quota errors
    }
  }, [resumeData]);

  // Reset to default sample data
  const handleReset = () => {
    if (confirm("Reset resume to sample data? Any unsaved edits will be replaced.")) {
      setResumeData(INITIAL_RESUME_DATA);
      localStorage.removeItem("printpix_resume_draft");
      toast.success("Resume reset to sample data!");
    }
  };

  // Change template
  const handleTemplateSelect = (templateId: ResumeTemplateId) => {
    setResumeData((prev) => ({ ...prev, templateId }));
    setIsTemplateMenuOpen(false);
    toast.success(`Template changed to ${templateId.replace("_", " ").toUpperCase()}`);
  };

  // Reorder sections
  const handleMoveSection = (secKey: ResumeSectionKey, direction: "up" | "down") => {
    const currentOrder =
      resumeData.sectionOrder && resumeData.sectionOrder.length > 0
        ? resumeData.sectionOrder
        : DEFAULT_SECTION_ORDER;
    const idx = currentOrder.indexOf(secKey);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);

    setResumeData({
      ...resumeData,
      sectionOrder: newOrder,
    });
  };

  // Toggle section visibility
  const handleToggleVisibility = (secKey: ResumeSectionKey) => {
    const meta = SECTION_METADATA[secKey];
    if (!meta) return;
    const visKey = meta.visibilityKey;
    const current = resumeData.visibility[visKey] !== false;
    setResumeData({
      ...resumeData,
      visibility: {
        ...resumeData.visibility,
        [visKey]: !current,
      },
    });
    toast.success(`${meta.label} ${!current ? "visible" : "hidden"}`);
  };

  // 100% Client-Side PDF Generation (No backend API, no Cloudinary!)
  const handleDownloadPdf = async () => {
    const paperElem = document.getElementById("resume-paper");
    if (!paperElem) {
      toast.error("Resume preview element not found");
      return;
    }

    let sandbox: HTMLDivElement | null = null;
    try {
      setIsDownloading(true);
      toast.info("Generating high-resolution PDF...");

      // Create an isolated offscreen sandbox container at exact A4 desktop width (794px = 210mm at 96dpi)
      // This completely isolates the resume from parent split-pane flex/grid bounds and zoom scale transforms.
      sandbox = document.createElement("div");
      sandbox.style.position = "fixed";
      sandbox.style.left = "-9999px";
      sandbox.style.top = "0";
      sandbox.style.width = "794px";
      sandbox.style.minWidth = "794px";
      sandbox.style.maxWidth = "794px";
      sandbox.style.backgroundColor = "#ffffff";
      sandbox.style.zIndex = "-9999";
      sandbox.style.margin = "0";
      sandbox.style.padding = "0";

      const clone = paperElem.cloneNode(true) as HTMLElement;
      clone.style.width = "794px";
      clone.style.minWidth = "794px";
      clone.style.maxWidth = "794px";
      clone.style.transform = "none";
      clone.style.margin = "0";
      clone.style.boxShadow = "none";
      clone.style.setProperty("-webkit-font-smoothing", "antialiased");
      clone.style.setProperty("text-rendering", "geometricPrecision");

      sandbox.appendChild(clone);
      document.body.appendChild(sandbox);

      // Brief wait to ensure clone styles and fonts are applied
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Extract all interactive links (GitHub, LinkedIn, projects, email) with their exact bounds
      const cloneRect = clone.getBoundingClientRect();
      const pxToMm = 210 / (clone.offsetWidth || 794);
      const linkElements = Array.from(clone.querySelectorAll("a"));
      const linksData = linkElements
        .map((a) => {
          const rawHref = a.getAttribute("href") || "";
          if (!rawHref || rawHref === "#") return null;

          let url = rawHref.trim();
          if (
            !url.startsWith("http://") &&
            !url.startsWith("https://") &&
            !url.startsWith("mailto:") &&
            !url.startsWith("tel:")
          ) {
            url = `https://${url}`;
          }

          const r = a.getBoundingClientRect();
          return {
            url,
            x: (r.left - cloneRect.left) * pxToMm,
            y: (r.top - cloneRect.top) * pxToMm,
            w: r.width * pxToMm,
            h: r.height * pxToMm,
          };
        })
        .filter(Boolean) as Array<{ url: string; x: number; y: number; w: number; h: number }>;

      // Function to sanitize modern color functions (lab(), oklch(), color()) unsupported by html2canvas
      const sanitizeColors = (root: HTMLElement | Document) => {
        const allEls = root.querySelectorAll("*");
        allEls.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (!htmlEl.style) return;
          try {
            const computed = window.getComputedStyle(htmlEl);
            if (computed.color && (computed.color.includes("lab(") || computed.color.includes("oklch("))) {
              htmlEl.style.color = "#18181b";
            }
            if (
              computed.backgroundColor &&
              (computed.backgroundColor.includes("lab(") || computed.backgroundColor.includes("oklch("))
            ) {
              htmlEl.style.backgroundColor = "#ffffff";
            }
            if (
              computed.borderColor &&
              (computed.borderColor.includes("lab(") || computed.borderColor.includes("oklch("))
            ) {
              htmlEl.style.borderColor = "#e4e4e7";
            }
          } catch {
            // ignore
          }
        });
      };

      sanitizeColors(clone);

      // High-resolution 2.8x (~300 DPI) canvas capture with zero font blur
      const canvas = await html2canvas(clone, {
        scale: 2.8,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        windowWidth: 1200,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          sanitizeColors(clonedDoc);
        },
      });

      // Lossless PNG data URL (prevents lossy JPEG dullness & compression artifacts around text)
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Single-page tolerance (if within 6mm over, fit in 1 page cleanly)
      if (imgHeight <= pdfHeight + 6) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), undefined, "FAST");

        // Add clickable PDF link annotations to Page 1
        linksData.forEach(({ url, x, y, w, h }) => {
          if (w > 0 && h > 0 && y < pdfHeight) {
            pdf.link(x, y, w, h, { url });
          }
        });
      } else {
        // Multi-page slicing
        let heightLeft = imgHeight;
        let position = 0;
        let totalPages = 1;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = position - pdfHeight;
          pdf.addPage();
          totalPages++;
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
          heightLeft -= pdfHeight;
        }

        // Add clickable PDF link annotations mapped to each page
        linksData.forEach(({ url, x, y, w, h }) => {
          if (w <= 0 || h <= 0) return;
          const pageIndex = Math.floor(y / pdfHeight);
          const pageNum = pageIndex + 1;
          if (pageNum <= totalPages) {
            const yInPage = y - pageIndex * pdfHeight;
            pdf.setPage(pageNum);
            pdf.link(x, yInPage, w, h, { url });
          }
        });
      }

      const fileName = `${(resumeData.personalInfo.name || "Resume").replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. You can also use the browser print option.");
    } finally {
      if (sandbox && sandbox.parentNode) {
        sandbox.parentNode.removeChild(sandbox);
      }
      setIsDownloading(false);
    }
  };

  // Secure Pay-Per-Download Credit Check & PDF Generation
  const handleDownloadClick = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    let currentId = resumeData._id;
    if (!currentId) {
      try {
        const saveRes = await apiClient.post(ENDPOINTS.RESUMES, {
          title: resumeData.title || `${resumeData.personalInfo.name || "My"}'s Resume`,
          templateId: resumeData.templateId,
          personalInfo: resumeData.personalInfo,
          visibility: resumeData.visibility,
          objective: resumeData.objective,
          education: resumeData.education,
          experience: resumeData.experience,
          customSections: resumeData.customSections,
          skills: resumeData.skills,
        });
        if (saveRes.data?.data?._id) {
          currentId = saveRes.data.data._id;
          setResumeData((prev) => ({ ...prev, _id: currentId }));
        }
      } catch (e) {
        currentId = `draft_${(resumeData.personalInfo.name || "resume").toLowerCase().replace(/\s+/g, "_")}`;
      }
    }

    if (!currentId) {
      currentId = `draft_${Date.now()}`;
    }

    await requestDownloadWithCredit(currentId, handleDownloadPdf);
  };

  // Download .tex (LaTeX markup)
  const handleDownloadTex = () => {
    const texContent = generateLatex(resumeData);
    const blob = new Blob([texContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(resumeData.personalInfo.name || "Resume").replace(/\s+/g, "_")}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("LaTeX (.tex) file downloaded!");
  };

  // Browser print
  const handleNativePrint = () => {
    window.print();
  };

  const TEMPLATES: { id: ResumeTemplateId; name: string; tag: string }[] = [
    { id: "classic_ats", name: "Classic ATS (LaTeX)", tag: "Recommended · Screenshot Match" },
    { id: "traditional", name: "Traditional Standard", tag: "Academic & Formal" },
    { id: "executive", name: "Executive Corporate", tag: "Senior & Management" },
    { id: "minimal", name: "Minimalist Clean", tag: "Modern Swiss Design" },
    { id: "tech_compact", name: "Tech Modern", tag: "Software & Engineers" },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* ── TOP HEADER (MATCHING THE USER'S PURPLE/INDIGO SCREENSHOT) ── */}
      <header className="h-16 bg-[#5046e5] text-white px-3 sm:px-6 flex items-center justify-between shadow-md shrink-0 z-30 select-none">
        {/* Left Branding */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-base sm:text-lg tracking-tight">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>King Resume Builder</span>
            </div>
            <div className="text-[10px] text-indigo-200 tracking-wider">
              Edit · Preview · Export
            </div>
          </div>

          {/* Action Pills: Sections, Format Toggles, Download */}
          <div className="hidden lg:flex items-center gap-1.5 ml-3">
            {/* Sections Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsSectionsMenuOpen(!isSectionsMenuOpen)}
                className="h-9 px-3 rounded-lg bg-indigo-700/80 hover:bg-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>☰ Sections</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isSectionsMenuOpen && (
                <div className="absolute left-0 top-11 w-64 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 text-xs">
                  <div className="px-2 py-1 mb-1 font-bold text-[10px] uppercase tracking-wider text-zinc-400 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                    <span>Reorder & Visibility</span>
                    <span className="text-[10px] lowercase text-zinc-400">order & eye</span>
                  </div>

                  {/* Header Fixed */}
                  <button
                    onClick={() => {
                      setActiveTab("header");
                      setIsSectionsMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg mb-1 flex items-center justify-between cursor-pointer ${
                      activeTab === "header"
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>Contact Header (Fixed)</span>
                    {activeTab === "header" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>

                  {/* Dynamic Reorderable Sections */}
                  {(resumeData.sectionOrder && resumeData.sectionOrder.length > 0
                    ? resumeData.sectionOrder
                    : DEFAULT_SECTION_ORDER
                  ).map((secKey, idx, arr) => {
                    const meta = SECTION_METADATA[secKey];
                    const isVisible = resumeData.visibility[meta.visibilityKey] !== false;
                    return (
                      <div
                        key={secKey}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-xl mb-0.5 group ${
                          activeTab === secKey
                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold text-indigo-700 dark:text-indigo-300"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActiveTab(secKey as ResumeSectionTab);
                            setIsSectionsMenuOpen(false);
                          }}
                          className="flex items-center gap-2 flex-1 text-left cursor-pointer truncate"
                        >
                          <span className="w-4 text-[10px] text-zinc-400 font-mono">#{idx + 1}</span>
                          <span className="truncate">{meta.label}</span>
                        </button>

                        <div className="flex items-center gap-0.5">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(secKey, "up");
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              idx === 0
                                ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                                : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                            title="Move section up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>

                          {/* Reorder Down */}
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(secKey, "down");
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              idx === arr.length - 1
                                ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                                : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                            title="Move section down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(secKey);
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              isVisible
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                : "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                            title={isVisible ? "Hide section" : "Unhide section"}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Template Selector Button */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                className="h-9 px-3 rounded-lg bg-indigo-700/80 hover:bg-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="capitalize">
                  {TEMPLATES.find((t) => t.id === resumeData.templateId)?.name.split(" ")[0] || "Template"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isTemplateMenuOpen && (
                <div className="absolute left-0 top-11 w-64 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl border border-zinc-200 dark:border-zinc-800 p-1.5 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Select Template
                  </div>
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleTemplateSelect(tpl.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col cursor-pointer ${
                        resumeData.templateId === tpl.id
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tpl.name}</span>
                        {resumeData.templateId === tpl.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{tpl.tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View format pills */}
            <div className="flex items-center bg-indigo-800/60 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPreviewFormat("html")}
                className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  previewFormat === "html" ? "bg-white text-indigo-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setPreviewFormat("pdf")}
                className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  previewFormat === "pdf" ? "bg-white text-indigo-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setPreviewFormat("tex")}
                className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  previewFormat === "tex" ? "bg-white text-indigo-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                .tex
              </button>
            </div>

            {/* Download .tex */}
            <button
              onClick={handleDownloadTex}
              className="h-9 px-3 rounded-lg bg-indigo-700/80 hover:bg-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download LaTeX source file"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-300" />
              <span>Download .tex</span>
            </button>

            {/* Download Credits / Admin Pill */}
            {isLoggedIn ? (
              isAdmin ? (
                <Link
                  href="/admin?tab=pricing"
                  className="h-9 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-400/40 shadow-xs"
                  title="Admin role: Free unlimited downloads · Click to manage pricing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Admin · Free Downloads</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="h-9 px-3 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-400/25 shadow-xs"
                  title="View download credits or buy more"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{credits} {credits === 1 ? "Credit" : "Credits"}</span>
                </button>
              )
            ) : null}

            {/* Primary Download PDF */}
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-100 text-[#5046e5] text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#5046e5]" />
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Template Switcher on Mobile, Reset Button */}
        <div className="flex items-center gap-2">
          {/* Mobile Download Credits Pill */}
          {isLoggedIn ? (
            isAdmin ? (
              <Link
                href="/admin?tab=pricing"
                className="lg:hidden h-8 px-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-400/40"
                title="Admin Free Downloads"
              >
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Admin</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="lg:hidden h-8 px-2.5 rounded-lg bg-indigo-800/80 text-white text-xs font-semibold flex items-center gap-1 border border-indigo-400/25"
                title="View download credits or buy more"
              >
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>{credits}</span>
              </button>
            )
          ) : null}

          {/* Mobile Download PDF button */}
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="lg:hidden h-8 px-3 rounded-lg bg-white text-indigo-600 text-xs font-bold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {/* Reset button (matching screenshot) */}
          <button
            onClick={handleReset}
            className="h-9 px-3 rounded-lg border border-white/20 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE (SPLIT 2-COLUMN LAYOUT) ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* ── LEFT PANEL: FORM EDITOR ── */}
        <div className="w-full md:w-1/2 lg:w-[48%] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <ResumeForm
            data={resumeData}
            onChange={setResumeData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* ── RIGHT PANEL: LIVE PDF PREVIEW (SCREENSHOT MATCH!) ── */}
        <div
          ref={previewContainerRef}
          className="w-full md:w-1/2 lg:w-[52%] h-full flex flex-col bg-zinc-800 text-white overflow-hidden"
        >
          {/* Preview Toolbar (Matching Screenshot Header) */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-700/80 px-4 flex items-center justify-between text-xs text-zinc-300 shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="font-bold tracking-wider text-[11px] text-zinc-400 uppercase">
                PDF Preview
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-[11px] text-zinc-400 capitalize">
                {TEMPLATES.find((t) => t.id === resumeData.templateId)?.name}
              </span>
            </div>

            {/* Center: Zoom Controls */}
            <div className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 40))}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-[11px] font-mono min-w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Right: Dimension & Print */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 hidden sm:inline">
                A4 — 210 × 297 mm
              </span>
              <button
                onClick={handleNativePrint}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Paper View Container */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-zinc-850">
            {previewFormat === "tex" ? (
              <div className="w-full max-w-2xl bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-2xl">
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">LaTeX (.tex) Source Output</span>
                  <button
                    onClick={handleDownloadTex}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-sans font-bold cursor-pointer"
                  >
                    Download .tex
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">{generateLatex(resumeData)}</pre>
              </div>
            ) : (
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease-out",
                }}
                className="origin-top"
              >
                <ResumePreview data={resumeData} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Download Credits Payment Modal */}
      <ResumePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plans={plans}
        currentCredits={credits}
        onSelectPack={purchasePack}
        isProcessing={isPaying}
      />

      {/* Guest Authentication Prompt Modal */}
      <ResumeAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

// LaTeX Generator Helper
function generateLatex(data: IResumeData): string {
  const {
    personalInfo,
    visibility = {},
    objective,
    skillGroups,
    experience,
    projects,
    education,
    certifications,
    achievements,
  } = data;

  const escapeLatex = (str?: string) => {
    if (!str) return "";
    let clean = str
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/~/g, "\\textasciitilde{}");

    // Convert markdown highlights to proper LaTeX commands
    clean = clean.replace(/==(.*?)==/g, "\\colorbox{yellow}{$1}");
    clean = clean.replace(/\*\*(.*?)\*\*/g, "\\textbf{$1}");
    clean = clean.replace(/\*(.*?)\*/g, "\\textit{$1}");
    clean = clean.replace(/__(.*?)__/g, "\\underline{$1}");

    return clean;
  };

  return `%-------------------------
% Resume in LaTeX
% Generated by King Resume Builder
%------------------------

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.name || "Your Name")}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personalInfo.phone || "")} $|$ \\href{mailto:${escapeLatex(personalInfo.email)}}{${escapeLatex(personalInfo.email || "")}} $|$ ${escapeLatex(personalInfo.address || "")} 
    ${personalInfo.customLinks?.map((l) => `$|$ \\href{${l.url}}{${escapeLatex(l.label)}}`).join(" ") || ""}
\\end{center}

${(data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER)
  .map((secKey) => {
    switch (secKey) {
      case "summary":
        if (visibility.showObjective === false || !objective) return "";
        return `
%-----------PROFESSIONAL SUMMARY-----------
\\section{Professional Summary}
${escapeLatex(objective)}
`;

      case "skills":
        if (visibility.showSkills === false || (!skillGroups?.length && !data.skills?.length)) return "";
        return `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
        ${skillGroups?.map((sg) => `\\textbf{${escapeLatex(sg.category)}}{: ${escapeLatex(sg.skills)}} \\\\`).join("\n        ") || ""}
    }}
\\end{itemize}
`;

      case "experience":
        if (visibility.showExperience === false || !experience?.length) return "";
        return `
%-----------EXPERIENCE-----------
\\section{Professional Experience}
\\begin{itemize}[leftmargin=0.15in, label={}]
${experience?.map((exp) => `  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLatex(exp.company || "")}} & ${escapeLatex(exp.duration || "")} \\\\
      \\textit{\\small ${escapeLatex(exp.title || "")}${exp.location ? ` - ${escapeLatex(exp.location)}` : ""}} & \\\\
    \\end{tabular*}\\vspace{-7pt}
    \\begin{itemize}
      ${(exp.points || (exp.details ? exp.details.split("\n") : [])).filter((p) => p.trim()).map((p) => `\\item \\small{${escapeLatex(p)}}`).join("\n      ")}
    \\end{itemize}`).join("\n")}
\\end{itemize}
`;

      case "projects":
        if (visibility.showProjects === false || !projects?.length) return "";
        return `
%-----------PROJECTS-----------
\\section{Projects}
\\begin{itemize}[leftmargin=0.15in, label={}]
${projects?.map((proj) => `  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLatex(proj.title || "")}} ${proj.techStack ? `$|$ \\textit{\\small ${escapeLatex(proj.techStack)}}` : ""} & ${escapeLatex(proj.duration || "")} \\\\
    \\end{tabular*}\\vspace{-7pt}
    \\begin{itemize}
      ${(proj.points || []).map((p) => `\\item \\small{${escapeLatex(p)}}`).join("\n      ")}
    \\end{itemize}`).join("\n")}
\\end{itemize}
`;

      case "education":
        if (visibility.showEducation === false || !education?.length) return "";
        return `
%-----------EDUCATION-----------
\\section{Education}
\\begin{itemize}[leftmargin=0.15in, label={}]
${education?.map((edu) => `  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLatex(edu.qualification || "")}} & ${escapeLatex(edu.year || "")} \\\\
      \\textit{\\small ${escapeLatex(edu.board || "")}} & \\textit{\\small ${escapeLatex(edu.percentage || "")}} \\\\
    \\end{tabular*}\\vspace{-7pt}`).join("\n")}
\\end{itemize}
`;

      case "certifications":
        if (visibility.showCertifications === false || !certifications?.length) return "";
        return `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
\\begin{itemize}[leftmargin=0.15in, label={}]
${certifications?.map((c) => `  \\item \\small{\\textbf{${escapeLatex(c.name)}}${c.issuer ? ` -- ${escapeLatex(c.issuer)}` : ""}${c.date ? ` (${escapeLatex(c.date)})` : ""}}`).join("\n")}
\\end{itemize}
`;

      case "achievements":
        if (visibility.showAchievements === false || !achievements?.length) return "";
        return `
%-----------ACHIEVEMENTS-----------
\\section{Achievements}
\\begin{itemize}[leftmargin=0.15in, label={}]
${achievements?.map((a) => `  \\item \\small{${escapeLatex(a.text)}}`).join("\n")}
\\end{itemize}
`;

      default:
        return "";
    }
  })
  .filter(Boolean)
  .join("\n")}

\\end{document}
`;
}
