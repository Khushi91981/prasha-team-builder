import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { PrashaLogo } from './PrashaLogo';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Link, 
  Mail, 
  ShieldCheck, 
  Users, 
  CheckSquare, 
  Square,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ShareClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: DeveloperProfile;
  allProfiles: DeveloperProfile[];
  onSelectProfile: (profile: DeveloperProfile) => void;
}

export const ShareClientModal: React.FC<ShareClientModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  allProfiles,
  onSelectProfile,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([currentProfile.id]);

  if (!isOpen) return null;

  const toggleProfileSelect = (id: string) => {
    setSelectedProfileIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((pId) => pId !== id) : prev) : [...prev, id]
    );
  };

  const selectedProfiles = allProfiles.filter((p) => selectedProfileIds.includes(p.id));

  const shareUrl = `${window.location.origin}${window.location.pathname}?share=client&profiles=${selectedProfileIds.join(',')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const pitchText = `Team Introduction from PRASHA INFOTECH:

${selectedProfiles
  .map(
    (p, idx) => `[CANDIDATE 0${idx + 1}]: ${p.name}
Role: ${p.title}
Specialization: ${p.specializationTag}
Experience Highlights: ${p.snapshotStats.map((s) => `${s.value} ${s.label}`).join(' | ')}
Core Technologies: ${p.techStack.map((t) => `${t.category}: ${t.items.slice(0, 5).join(', ')}`).join('; ')}
Profile Dossier: Verified & Client-Masked by Prasha Infotech`
  )
  .join('\n\n----------------------------------------\n\n')}

Official Prasha Infotech Liaison:
• Email: talent@prashainfotech.com
• LinkedIn: https://www.linkedin.com/in/prasha-infotech-3b8536325/
• Web: www.prashainfotech.com`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171817]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#B58A18] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Top Gold Banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <PrashaLogo size="sm" showSubtitle={false} />
            <div className="h-4 w-px bg-[#DFDACF]" />
            <span className="text-[11px] font-mono font-bold text-[#8F6910] uppercase tracking-wider">
              Share Resumes with Clients
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <h3 className="text-base font-bold font-heading uppercase text-[#171817] tracking-tight">
              Share Candidate Profiles
            </h3>
            <p className="text-xs text-[#5F5F59] mt-0.5">
              Select one or multiple developer resumes to share with prospective corporate clients.
            </p>
          </div>

          {/* Select profiles to include */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-2 flex items-center justify-between">
              <span>Select Profiles to Include in Client Packet ({selectedProfileIds.length} Selected)</span>
              <span className="text-[10px] font-mono text-[#8F6910]">Client View Safe</span>
            </label>

            <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-[#FAF9F5] border border-[#E8E4DA] rounded-xs">
              {allProfiles.map((p) => {
                const isSelected = selectedProfileIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProfileSelect(p.id)}
                    className={`flex items-center justify-between p-2 rounded-xs border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#B58A18] shadow-2xs'
                        : 'bg-transparent border-transparent hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#B58A18]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#DFDACF]" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#171817] uppercase">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-[#5F5F59]">
                          {p.title}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9.5px] font-mono font-bold text-[#8F6910] uppercase px-1.5 py-0.5 bg-[#FAF9F5] border border-[#E8E4DA] rounded-xs">
                      {p.specializationTag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Share Link Box */}
          <div className="bg-[#FAF9F5] border border-[#E8E4DA] p-3.5 rounded-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171817] flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Direct Client Presentation Link</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-xs">
                No Admin Controls Shown
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-white border border-[#DFDACF] text-xs font-mono text-[#5F5F59] px-3 py-1.5 rounded-xs select-all focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formatted Client Email Pitch */}
          <div className="bg-[#FAF9F5] border border-[#E8E4DA] p-3.5 rounded-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171817] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Client Introduction Pitch (Ready to Send)</span>
              </span>
              <button
                onClick={handleCopyPitch}
                className="text-[11px] font-mono text-[#8F6910] hover:text-[#B58A18] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedPitch ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Full Pitch</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-[#FFFFFF] border border-[#DFDACF] p-3 rounded-xs text-[11px] font-mono text-[#171817] whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
              {pitchText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E4DA] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#5F5F59]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Prasha Infotech Format</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171817] hover:bg-[#303130] text-white text-xs font-bold uppercase rounded-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
