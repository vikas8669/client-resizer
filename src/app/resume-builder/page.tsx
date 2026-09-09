"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { ResumeForm } from "@/features/resume/components/ResumeForm";
import { ResumePreview } from "@/features/resume/components/ResumePreview";
import { ResumeHistoryModal } from "@/features/resume/components/ResumeHistoryModal";
import { INITIAL_RESUME_DATA, IResumeData } from "@/features/resume/types";
import { getStoredUser, AuthUser } from "@/lib/auth";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";

import {
  Download,
  Cloud,
  History,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  FileCheck,
  Zap,
} from "lucide-react";

let colorCtx: CanvasRenderingContext2D | null = null;

/**
 * Helper to normalize CSS colors (oklch, lab, color-mix) to exact RGB/RGBA strings for PDF generation
 */
function parseCssColorToRgb(colorStr: string): string {
  if (
    !colorStr ||
    colorStr === "transparent" ||
    colorStr === "inherit" ||
    colorStr === "initial" ||
    colorStr === "none"
  ) {
    return colorStr;
  }
  if (colorStr.startsWith("rgb") && !colorStr.includes("oklch") && !colorStr.includes("lab")) {
    return colorStr;
  }

  try {
    if (!colorCtx && typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      colorCtx = canvas.getContext("2d", { willReadFrequently: true });
    }
    if (!colorCtx) return colorStr;

    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = "#000000";
    colorCtx.fillStyle = colorStr;
    colorCtx.fillRect(0, 0, 1, 1);

    const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return "transparent";
    if (a === 255) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  } catch {
    return colorStr;
  }
}

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<IResumeData>(INITIAL_RESUME_DATA);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

  // Load saved draft on initial mount
  useEffect(() => {
    setUser(getStoredUser());
    const refreshUser = () => setUser(getStoredUser());
    window.addEventListener("auth-user-updated", refreshUser);

    try {
      const savedDraft = localStorage.getItem("printpix_resume_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object" && parsed.personalInfo) {
          setResumeData(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load draft from localStorage", err);
    } finally {
      setIsLoadedFromStorage(true);
    }

    return () => window.removeEventListener("auth-user-updated", refreshUser);
  }, []);

  // Save draft to localStorage whenever resumeData changes (after initial load)
  useEffect(() => {
    if (!isLoadedFromStorage) return;
    try {
      localStorage.setItem("printpix_resume_draft", JSON.stringify(resumeData));
    } catch (err) {
      console.error("Failed to save draft to localStorage", err);
    }
  }, [resumeData, isLoadedFromStorage]);

  const renderResumeToCanvas = async (element: HTMLElement, scale = 3) => {
    return await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // 1. Remove external <link rel="stylesheet"> tags to prevent html2canvas from fetching and failing on unhandled lab()/oklch() in Next.js/Tailwind v4 global CSS
        const links = Array.from(clonedDoc.querySelectorAll("link[rel='stylesheet']"));
        links.forEach((link) => link.remove());

        // 2. Convert modern CSS colors (oklch, lab, color-mix) in all <style> tags to valid RGB/RGBA
        const styleElements = Array.from(clonedDoc.querySelectorAll("style"));
        styleElements.forEach((style) => {
          if (style.textContent) {
            style.textContent = style.textContent.replace(
              /(?:oklch|lab|color-mix)\((?:[^()]+|\([^()]*\))*\)/gi,
              (match) => parseCssColorToRgb(match)
            );
          }
        });

        if (clonedDoc.body) {
          clonedDoc.body.style.margin = "0";
          clonedDoc.body.style.padding = "0";
          clonedDoc.body.style.backgroundColor = "#ffffff";
        }

        const paper = clonedDoc.getElementById("resume-paper");
        if (paper) {
          paper.style.position = "relative";
          paper.style.top = "0";
          paper.style.left = "0";
          paper.style.margin = "0";
          paper.style.width = "794px";
          paper.style.minWidth = "794px";
          paper.style.maxWidth = "794px";
          paper.style.minHeight = "1123px";
          paper.style.height = "auto";
          paper.style.transform = "none";
          paper.style.backgroundColor = "#ffffff";
          paper.style.letterSpacing = "normal";
          paper.style.boxSizing = "border-box";
          paper.style.padding = "36px 40px";
          paper.style.setProperty("-webkit-font-smoothing", "subpixel-antialiased");
          paper.style.setProperty("-moz-osx-font-smoothing", "auto");
          paper.style.setProperty("text-rendering", "geometricPrecision");

          const sourceElements = Array.from(element.querySelectorAll("*"));
          const clonedElements = Array.from(paper.querySelectorAll("*"));

          clonedElements.forEach((clonedEl, idx) => {
            const htmlEl = clonedEl as HTMLElement;
            const sourceEl = sourceElements[idx] as HTMLElement | undefined;

            htmlEl.style.letterSpacing = "normal";
            htmlEl.style.setProperty("-webkit-font-smoothing", "subpixel-antialiased");
            htmlEl.style.setProperty("-moz-osx-font-smoothing", "auto");

            if (sourceEl) {
              const compStyle = window.getComputedStyle(sourceEl);

              const colorVal = compStyle.color;
              if (colorVal && colorVal !== "transparent" && colorVal !== "rgba(0, 0, 0, 0)") {
                htmlEl.style.color = parseCssColorToRgb(colorVal);
              }

              const bgVal = compStyle.backgroundColor;
              if (bgVal && bgVal !== "transparent" && bgVal !== "rgba(0, 0, 0, 0)") {
                htmlEl.style.backgroundColor = parseCssColorToRgb(bgVal);
              }

              const borderVal = compStyle.borderColor;
              if (borderVal && borderVal !== "transparent" && borderVal !== "rgba(0, 0, 0, 0)") {
                htmlEl.style.borderColor = parseCssColorToRgb(borderVal);
              }
            }

            // Sanitize any remaining inline cssText with lab/oklch
            if (htmlEl.style.cssText && (htmlEl.style.cssText.includes("lab(") || htmlEl.style.cssText.includes("oklch(") || htmlEl.style.cssText.includes("color-mix("))) {
              htmlEl.style.cssText = htmlEl.style.cssText.replace(
                /(?:oklch|lab|color-mix)\((?:[^()]+|\([^()]*\))*\)/gi,
                (match) => parseCssColorToRgb(match)
              );
            }
          });

          const badges = paper.querySelectorAll(".skill-badge");
          badges.forEach((b) => {
            const badgeEl = b as HTMLElement;
            badgeEl.style.display = "inline-flex";
            badgeEl.style.alignItems = "center";
            badgeEl.style.justifyContent = "center";
            badgeEl.style.height = "30px";
            badgeEl.style.lineHeight = "1";
            badgeEl.style.padding = "0 16px";
            badgeEl.style.boxSizing = "border-box";
          });
        }
      },
    });
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const paperElement = document.getElementById("resume-paper");
      if (!paperElement) {
        toast.error("Resume preview not found");
        return;
      }

      toast.info("Generating PDF...");
      const canvas = await renderResumeToCanvas(paperElement, 3);
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfHeight, 297), undefined, "FAST");
      const fileName = `${resumeData.personalInfo.name || "Resume"}_PrintPix.pdf`.replace(/\s+/g, "_");
      pdf.save(fileName);
      toast.success("PDF downloaded successfully!");
    } catch (error: unknown) {
      console.error("PDF download error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      toast.error("Please login first to store your resume in Cloudinary & Database history");
      return;
    }

    setIsSaving(true);
    try {
      const paperElement = document.getElementById("resume-paper");
      let pdfBase64 = "";

      if (paperElement) {
        const canvas = await renderResumeToCanvas(paperElement, 2);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

        pdfBase64 = pdf.output("datauristring");
      }

      const payload = {
        title: resumeData.title || `${resumeData.personalInfo.name}'s Resume`,
        headerTitle: resumeData.headerTitle,
        jobTitle: resumeData.jobTitle,
        templateId: resumeData.templateId,
        personalInfo: resumeData.personalInfo,
        visibility: resumeData.visibility,
        objective: resumeData.objective,
        education: resumeData.education,
        experience: resumeData.experience,
        customSections: resumeData.customSections,
        skills: resumeData.skills,
        pdfBase64,
      };

      let response;
      if (resumeData._id) {
        response = await apiClient.put(ENDPOINTS.RESUME_BY_ID(resumeData._id), payload);
      } else {
        response = await apiClient.post(ENDPOINTS.RESUMES, payload);
      }

      if (response.data?.success) {
        toast.success(response.data.message || "Resume saved to Cloudinary & Database!");
        if (response.data.data) {
          setResumeData(response.data.data);
        }
      }
    } catch (error: any) {
      console.error("Cloud Save Error:", error);
      toast.error(error?.response?.data?.message || "Failed to save resume to cloud");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset form to default screenshot template sample data?")) {
      setResumeData(INITIAL_RESUME_DATA);
      try {
        localStorage.removeItem("printpix_resume_draft");
      } catch (e) {}
      toast.info("Form reset to default sample values");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Live Preview & Cloudinary Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Resume Builder
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Type on the left to see your resume render live instantly on the right. Download as a sharp A4 PDF or store in Cloudinary.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/product">
              <Button variant="ghost" size="sm" className="h-10 text-xs rounded-xl gap-1.5">
                <ArrowLeft className="w-4 h-4" /> PDF Resizer
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-10 text-xs rounded-xl gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="h-10 text-xs rounded-xl gap-1.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <History className="w-4 h-4" /> History
              </Button>
            )}

            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="h-10 text-xs rounded-xl gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 shadow-md shadow-blue-500/20"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download PDF</span>
            </Button>

            <Button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="h-10 text-xs rounded-xl gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-4 shadow-md"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>{user ? "Save to Cloud" : "Login to Save"}</span>
            </Button>
          </div>
        </div>

        {/* LOGGED IN / GUEST NOTIFICATION BANNER */}
        {!user ? (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                You are currently building as a <strong>Guest</strong>. You can live edit and download PDFs for free.{" "}
                <Link href="/login" className="underline font-bold hover:text-amber-700">
                  Log in
                </Link>{" "}
                to save resumes permanently on Cloudinary & access edit history.
              </span>
            </div>
            <Link
              href="/login"
              className="shrink-0 bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-amber-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-3.5 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Signed in as <strong>{user.name}</strong>. Your resumes will be safely synced to Cloudinary and MongoDB database history.
            </span>
          </div>
        )}

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM EDITOR (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>

          {/* RIGHT: LIVE PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 sticky top-24 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
              <span className="font-bold flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                <FileCheck className="w-4 h-4 text-blue-600" /> Live PDF Preview (A4 Scale)
              </span>
              <span className="text-[11px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                {resumeData.templateId.toUpperCase()} TEMPLATE
              </span>
            </div>

            <div className="bg-zinc-300/60 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 p-4 sm:p-6 rounded-3xl shadow-inner overflow-auto max-h-[85vh]">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY MODAL */}
      <ResumeHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectResume={setResumeData}
      />
    </div>
  );
}
