import React, { useState, useRef } from 'react';
import { DeveloperProfile, UploadedFileItem } from '../types';
import { extractTextFromFile } from '../utils/fileExtractor';
import { parseResumeText } from '../utils/resumeParser';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Check, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfiles: (newProfiles: DeveloperProfile[]) => void;
  onLoadPreloadedProfile: (profileId: 'kashika' | 'neha' | 'ankush') => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onAddProfiles,
  onLoadPreloadedProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pastedCandidateName, setPastedCandidateName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const newItems: UploadedFileItem[] = Array.from(files).map((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        size: file.size,
        extension: (['pdf', 'doc', 'docx', 'txt'].includes(ext) ? ext : 'txt') as any,
        status: 'pending',
      };
    });

    setUploadedFiles((prev) => [...prev, ...newItems]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleProcessFiles = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMsg('Please upload at least one resume file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    const parsedProfiles: DeveloperProfile[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const item = uploadedFiles[i];
      // update status
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'extracting' } : f))
      );

      try {
        let extractedText = '';
        if (item.file) {
          extractedText = await extractTextFromFile(item.file);
        } else {
          extractedText = 'Sample Resume Content';
        }

        const profile = parseResumeText(extractedText, item.name);
        parsedProfiles.push(profile);

        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'parsed', profileId: profile.id } : f))
        );
      } catch (err: any) {
        console.error('Error processing file:', item.name, err);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'error', errorMessage: err?.message || 'Failed to parse' }
              : f
          )
        );
      }
    }

    setIsProcessing(false);

    if (parsedProfiles.length > 0) {
      onAddProfiles(parsedProfiles);
      setTimeout(() => {
        onClose();
        setUploadedFiles([]);
      }, 1000);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim() || pastedText.length < 50) {
      setErrorMsg('Please paste a substantial resume text (at least 50 characters).');
      return;
    }

    try {
      const profile = parseResumeText(pastedText, pastedCandidateName ? `${pastedCandidateName}.txt` : 'Pasted_Resume.txt');
      if (pastedCandidateName.trim()) {
        profile.name = pastedCandidateName.trim().toUpperCase();
      }
      onAddProfiles([profile]);
      setPastedText('');
      setPastedCandidateName('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process resume text.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171817]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-sm border border-[#E8E4DA] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[#171817]">
        {/* MODAL HEADER */}
        <div className="bg-[#171817] text-[#FAF9F5] px-6 py-4 flex items-center justify-between border-b border-[#B58A18]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#B58A18]/20 border border-[#B58A18] flex items-center justify-center text-[#B58A18]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] font-heading text-white">
                Team Profile Builder — Resume Importer
              </h2>
              <p className="text-[11px] text-[#5F5F59] font-mono">
                Convert PDF / DOCX / Text Resumes into Prasha Infotech Developer Profiles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F5]/60 hover:text-white p-1 rounded-xs hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRIVACY MANDATE BANNER */}
        <div className="bg-[#FAF9F5] border-b border-[#B58A18]/30 px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B58A18] shrink-0" />
            <span className="font-semibold text-[#8F6910]">
              Strict Confidentiality Enforced:
            </span>
            <span className="text-[#5F5F59]">
              Previous employer names, client IDs, and logos are automatically hidden for client presentations.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-xs bg-[#FFFFFF] border border-[#B58A18]/30 text-[10px] font-mono text-[#8F6910] font-bold shrink-0">
            AUTO-SCRUB ACTIVE
          </span>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center border-b border-[#E8E4DA] bg-[#FAF9F5]/50 px-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === 'upload'
                ? 'border-[#B58A18] text-[#8F6910] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            1. Bulk File Upload ({uploadedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === 'paste'
                ? 'border-[#B58A18] text-[#8F6910] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            2. Paste Resume Text
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === 'samples'
                ? 'border-[#B58A18] text-[#8F6910] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            3. Preloaded Candidate Samples
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xs text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: BULK FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-[#B58A18] bg-[#FAF9F5]'
                    : 'border-[#DFDACF] hover:border-[#B58A18] bg-[#FFFFFF] hover:bg-[#FAF9F5]/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#B58A18]/40 mx-auto flex items-center justify-center text-[#B58A18] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-[#171817] font-heading uppercase tracking-wide">
                  Choose Multiple Resumes or Drag & Drop Here
                </div>
                <div className="text-xs text-[#5F5F59] mt-1">
                  Supports PDF, DOCX, DOC and TXT files • Multiple files processed simultaneously
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#FAF9F5] border border-[#E8E4DA] text-[11px] font-mono text-[#8F6910]">
                  <span>e.g. Kashika_Ajmera.pdf, Neha_Sharma_CV_C++.pdf, AnkushOjha.docx</span>
                </div>
              </div>

              {/* Uploaded Files Table */}
              {uploadedFiles.length > 0 && (
                <div className="border border-[#E8E4DA] rounded-sm overflow-hidden">
                  <div className="bg-[#FAF9F5] px-4 py-2 border-b border-[#E8E4DA] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#171817]">
                    <span>Queued Resumes ({uploadedFiles.length})</span>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-[10px] text-red-600 hover:underline cursor-pointer font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-[#F0ECE1] max-h-56 overflow-y-auto">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#FAF9F5]/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#B58A18] shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-[#171817] truncate">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-[#5F5F59] font-mono">
                              {(file.size / 1024).toFixed(1)} KB • {file.extension.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {file.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-xs bg-[#FAF9F5] border border-[#E8E4DA] text-[10px] text-[#5F5F59] font-mono">
                              Ready to Parse
                            </span>
                          )}
                          {file.status === 'extracting' && (
                            <span className="px-2 py-0.5 rounded-xs bg-amber-50 border border-amber-300 text-[10px] text-amber-700 font-mono flex items-center gap-1 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Extracting...
                            </span>
                          )}
                          {file.status === 'parsed' && (
                            <span className="px-2 py-0.5 rounded-xs bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Profile Generated
                            </span>
                          )}
                          {file.status === 'error' && (
                            <span className="px-2 py-0.5 rounded-xs bg-red-50 border border-red-300 text-[10px] text-red-700 font-mono">
                              {file.errorMessage || 'Error'}
                            </span>
                          )}

                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-[#5F5F59] hover:text-red-600 p-1 cursor-pointer transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE RESUME TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                  Candidate Full Name (Optional - will auto-detect from text if empty)
                </label>
                <input
                  type="text"
                  value={pastedCandidateName}
                  onChange={(e) => setPastedCandidateName(e.target.value)}
                  placeholder="e.g. KASHIKA AJMERA"
                  className="w-full text-xs font-medium px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                  Resume Content (Paste text from any PDF, Word document, or LinkedIn export)
                </label>
                <textarea
                  rows={10}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste candidate resume here...
e.g.
Software Engineer | Appperfect | June 2022 – Present
• Built React.js and TypeScript frontend components
• Integrated payment gateways with high-availability microservices..."
                  className="w-full text-xs font-mono p-3 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18] leading-relaxed"
                />
                <p className="text-[11px] text-[#5F5F59] mt-1">
                  Previous company and employer names will be automatically detected and converted into client-ready domain badges.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRELOADED SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <div className="text-xs text-[#5F5F59] mb-2">
                Click any of the prompt's featured developer resumes to instantly load their formatted profile with employer confidentiality verified:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Kashika Ajmera */}
                <div className="border border-[#E8E4DA] rounded-sm p-4 bg-[#FAF9F5] hover:border-[#B58A18] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[9px] font-mono font-bold text-[#8F6910] uppercase px-1.5 py-0.5 bg-[#FFFFFF] border border-[#B58A18]/30 rounded-xs mb-2">
                      FULL-STACK DEVELOPER
                    </span>
                    <h3 className="text-sm font-bold text-[#171817] font-heading uppercase">
                      Kashika Ajmera
                    </h3>
                    <p className="text-[11px] text-[#5F5F59] mt-1">
                      React.js • TypeScript • Node.js • Payments Gateway (ex-Appperfect masked)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLoadPreloadedProfile('kashika');
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#B58A18] hover:text-white text-[#171817] border border-[#DFDACF] rounded-xs cursor-pointer transition-colors"
                  >
                    Load Kashika Ajmera
                  </button>
                </div>

                {/* Neha Sharma */}
                <div className="border border-[#E8E4DA] rounded-sm p-4 bg-[#FAF9F5] hover:border-[#B58A18] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[9px] font-mono font-bold text-[#8F6910] uppercase px-1.5 py-0.5 bg-[#FFFFFF] border border-[#B58A18]/30 rounded-xs mb-2">
                      C/C++ ENGINEER
                    </span>
                    <h3 className="text-sm font-bold text-[#171817] font-heading uppercase">
                      Neha Sharma
                    </h3>
                    <p className="text-[11px] text-[#5F5F59] mt-1">
                      Modern C++ • Telecom Messaging • SMPP • Low-Latency (ex-ValueFirst masked)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLoadPreloadedProfile('neha');
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#B58A18] hover:text-white text-[#171817] border border-[#DFDACF] rounded-xs cursor-pointer transition-colors"
                  >
                    Load Neha Sharma
                  </button>
                </div>

                {/* Ankush Ojha */}
                <div className="border border-[#E8E4DA] rounded-sm p-4 bg-[#FAF9F5] hover:border-[#B58A18] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[9px] font-mono font-bold text-[#8F6910] uppercase px-1.5 py-0.5 bg-[#FFFFFF] border border-[#B58A18]/30 rounded-xs mb-2">
                      INTEGRATION ENGINEER
                    </span>
                    <h3 className="text-sm font-bold text-[#171817] font-heading uppercase">
                      Ankush Ojha
                    </h3>
                    <p className="text-[11px] text-[#5F5F59] mt-1">
                      Dell Boomi • Enterprise iPaaS • SAP & Salesforce (ex-UKG masked)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLoadPreloadedProfile('ankush');
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#B58A18] hover:text-white text-[#171817] border border-[#DFDACF] rounded-xs cursor-pointer transition-colors"
                  >
                    Load Ankush Ojha
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#FAF9F5] px-6 py-3.5 border-t border-[#E8E4DA] flex items-center justify-between">
          <div className="text-xs text-[#5F5F59] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
            <span>Prasha Infotech Automated Resume Normalization Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#5F5F59] hover:text-[#171817] cursor-pointer"
            >
              Cancel
            </button>

            {activeTab === 'upload' && (
              <button
                disabled={uploadedFiles.length === 0 || isProcessing}
                onClick={handleProcessFiles}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] disabled:bg-[#DFDACF] disabled:cursor-not-allowed text-white rounded-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing {uploadedFiles.length} Resumes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convert {uploadedFiles.length} Resumes to Profiles</span>
                  </>
                )}
              </button>
            )}

            {activeTab === 'paste' && (
              <button
                disabled={!pastedText.trim()}
                onClick={handleProcessPastedText}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] disabled:bg-[#DFDACF] disabled:cursor-not-allowed text-white rounded-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Convert Text to Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
