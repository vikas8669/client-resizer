"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";
import { IResumeData } from "../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Trash2, Edit3, Download, Cloud, Loader2, Calendar } from "lucide-react";

interface ResumeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResume: (resume: IResumeData) => void;
}

export const ResumeHistoryModal: React.FC<ResumeHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectResume,
}) => {
  const [resumes, setResumes] = useState<IResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.RESUMES);
      if (response.data?.success) {
        setResumes(response.data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch resume history:", error);
      toast.error(error?.response?.data?.message || "Failed to load saved resumes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume from Cloudinary & Database?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await apiClient.delete(ENDPOINTS.RESUME_BY_ID(id));
      if (response.data?.success) {
        toast.success("Resume deleted from Cloudinary & database successfully");
        setResumes((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (error: any) {
      console.error("Failed to delete resume:", error);
      toast.error(error?.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl text-blue-600 dark:text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Cloud Saved Resumes</h2>
              <p className="text-xs text-zinc-500">Edit, download, or delete your resumes stored in Cloudinary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-xs font-medium">Loading saved resumes from Cloudinary...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Cloud className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No saved resumes found</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Save your resume to the cloud while logged in to access edit history and Cloudinary PDF downloads anytime.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {resume.title || resume.personalInfo?.name || "Untitled Resume"}
                      </h3>
                      <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        {resume.templateId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : "Saved"}
                      </span>
                      {resume.cloudinaryUrl && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Cloudinary Stored
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onSelectResume(resume);
                        onClose();
                        toast.success("Resume loaded into editor!");
                      }}
                      className="h-9 text-xs gap-1.5 rounded-xl"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Button>

                    {resume.cloudinaryUrl && (
                      <a
                        href={resume.cloudinaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </a>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDelete(resume._id!, e)}
                      disabled={deletingId === resume._id}
                      className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                    >
                      {deletingId === resume._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
