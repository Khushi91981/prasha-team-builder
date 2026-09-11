import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { 
  exportSingleProfileToPdf, 
  exportAllProfilesToPdf, 
  exportProfileToStandaloneHtml,
  exportAllProfilesToStandaloneHtml,
  exportProfileToWordDoc,
  exportProfilesToJson 
} from '../services/exportService';
import { PrashaLogo } from './PrashaLogo';
import { 
  X, 
  Download, 
  FileText, 
  Files, 
  Globe,
  Database, 
  Laptop, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Printer,
  Sparkles
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: DeveloperProfile;
  allProfiles: DeveloperProfile[];
  onOpenDesktopGuide: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  allProfiles,
  onOpenDesktopGuide,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSinglePdf = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await exportSingleProfileToPdf(currentProfile, (status) => setStatusMessage(status));
      setSuccessMessage(`Successfully generated and downloaded PDF for ${currentProfile.name}!`);
      setTimeout(() => {
        setIsExporting(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setIsExporting(false);
      setErrorMessage(
        err.message ||
          'PDF capture was blocked by browser sandbox. An interactive standalone HTML file has been downloaded for you as a backup!'
      );
    }
  };

  const handleDownloadAllPdf = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await exportAllProfilesToPdf(allProfiles, (status) => setStatusMessage(status));
      setSuccessMessage(`Successfully exported combined booklet with ${allProfiles.length} profiles!`);
      setTimeout(() => {
        setIsExporting(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setIsExporting(false);
      setErrorMessage(err.message || 'Batch PDF render failed. You can export standalone HTML or individual profiles.');
    }
  };

  const handleDownloadStandaloneHtml = () => {
    try {
      exportProfileToStandaloneHtml(currentProfile);
      setSuccessMessage(`Downloaded standalone HTML dossier for ${currentProfile.name}! Double click to view or print.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage('Failed to generate HTML dossier: ' + err.message);
    }
  };

  const handleDownloadWordDoc = () => {
    try {
      exportProfileToWordDoc(currentProfile);
      setSuccessMessage(`Downloaded formatted Word document (.doc) for ${currentProfile.name}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage('Failed to generate Word document: ' + err.message);
    }
  };

  const handleJsonBackup = () => {
    exportProfilesToJson(allProfiles);
    setSuccessMessage(`Exported JSON backup for ${allProfiles.length} developer profiles!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171817]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#B58A18] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gold Banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <PrashaLogo size="sm" showSubtitle={false} />
            <div className="h-4 w-px bg-[#DFDACF]" />
            <span className="text-[11px] font-mono font-bold text-[#8F6910] uppercase tracking-wider">
              Export & Delivery Center
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[#5F5F59] hover:text-[#171817] hover:bg-[#E8E4DA] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          <div>
            <h3 className="text-base font-bold font-heading uppercase text-[#171817] tracking-tight">
              Export Developer Dossiers
            </h3>
            <p className="text-xs text-[#5F5F59] mt-0.5">
              Client-ready profiles with confidential employer names scrubbed and Prasha Infotech branding preserved.
            </p>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div className="p-3 bg-[#FAF9F5] border border-[#B58A18] rounded-xs text-xs text-[#8F6910] flex items-center gap-2.5 font-mono">
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#B58A18]" />
              <span>{statusMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xs text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grid of Export Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Direct Single PDF Download */}
            <div className="bg-[#FAF9F5] border border-[#E8E4DA] hover:border-[#B58A18] p-4 rounded-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xs bg-white border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#DFDACF] text-[#8F6910] rounded-xs font-bold uppercase">
                    Primary PDF
                  </span>
                </div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Download PDF (Single)
                </h4>
                <p className="text-[11px] text-[#5F5F59] mt-1 leading-relaxed">
                  Direct 2-page PDF document for <strong>{currentProfile.name}</strong>. Rendered at 300 DPI with gold accents.
                </p>
              </div>

              <button
                onClick={handleDownloadSinglePdf}
                disabled={isExporting}
                className="mt-4 w-full py-2 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Profile (.pdf)</span>
              </button>
            </div>

            {/* 2. Standalone Client Dossier (HTML) */}
            <div className="bg-[#FAF9F5] border border-[#E8E4DA] hover:border-[#B58A18] p-4 rounded-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xs bg-white border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs font-bold uppercase">
                    100% Reliable
                  </span>
                </div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Standalone HTML Dossier
                </h4>
                <p className="text-[11px] text-[#5F5F59] mt-1 leading-relaxed">
                  Single file containing full styles & logos. Double-click on Mac/Windows to open or print to PDF with native vector sharpness.
                </p>
              </div>

              <button
                onClick={handleDownloadStandaloneHtml}
                className="mt-4 w-full py-2 bg-white hover:bg-[#FAF9F5] text-[#171817] border border-[#B58A18] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Download Dossier (.html)</span>
              </button>
            </div>

            {/* 3. Word Document (.doc) */}
            <div className="bg-[#FAF9F5] border border-[#E8E4DA] hover:border-[#B58A18] p-4 rounded-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xs bg-white border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#DFDACF] text-[#5F5F59] rounded-xs font-bold uppercase">
                    Editable Doc
                  </span>
                </div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Word Document (.doc)
                </h4>
                <p className="text-[11px] text-[#5F5F59] mt-1 leading-relaxed">
                  Fully editable document formatted for Microsoft Word, Google Docs, Apple Pages, and LibreOffice.
                </p>
              </div>

              <button
                onClick={handleDownloadWordDoc}
                className="mt-4 w-full py-2 bg-white hover:bg-[#FAF9F5] text-[#171817] border border-[#DFDACF] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Save Word (.doc)</span>
              </button>
            </div>

            {/* 4. Combined PDF Booklet */}
            <div className="bg-[#FAF9F5] border border-[#E8E4DA] hover:border-[#B58A18] p-4 rounded-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xs bg-white border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                    <Files className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#DFDACF] text-[#5F5F59] rounded-xs font-bold uppercase">
                    {allProfiles.length} Candidates
                  </span>
                </div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Combined Team Booklet
                </h4>
                <p className="text-[11px] text-[#5F5F59] mt-1 leading-relaxed">
                  Merges all {allProfiles.length} developer profiles into a unified multi-page presentation PDF for client proposals.
                </p>
              </div>

              <button
                onClick={handleDownloadAllPdf}
                disabled={isExporting}
                className="mt-4 w-full py-2 bg-[#171817] hover:bg-[#2c2d2c] text-[#FAF9F5] border border-[#B58A18]/50 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shadow-xs"
              >
                <Files className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Export All ({allProfiles.length})</span>
              </button>
            </div>
          </div>

          {/* Secondary Actions Row: Data Backup & Direct Print */}
          <div className="pt-2 border-t border-[#E8E4DA] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleJsonBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white border border-[#DFDACF] hover:border-[#B58A18] text-[#5F5F59] hover:text-[#171817] font-mono text-[11px] cursor-pointer transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Backup Database (.json)</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white border border-[#DFDACF] hover:border-[#B58A18] text-[#5F5F59] hover:text-[#171817] font-mono text-[11px] cursor-pointer transition-colors"
                title="Opens app outside iframe for unrestricted browser Ctrl+P printing"
              >
                <Printer className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Open in New Tab (Direct Print)</span>
              </a>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenDesktopGuide();
              }}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#8F6910] hover:text-[#171817] font-medium cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop App Guide (Mac & Windows)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
