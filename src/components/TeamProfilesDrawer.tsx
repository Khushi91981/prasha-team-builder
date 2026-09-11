import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { 
  X, 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  Printer, 
  Edit3, 
  ShieldCheck, 
  Check, 
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';

interface TeamProfilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: DeveloperProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: DeveloperProfile) => void;
  onEditProfile: (profile: DeveloperProfile) => void;
  onDuplicateProfile: (profile: DeveloperProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  onOpenImportModal: () => void;
  onExportAllProfiles: () => void;
  onNewProfile?: () => void;
}

export const TeamProfilesDrawer: React.FC<TeamProfilesDrawerProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onEditProfile,
  onDuplicateProfile,
  onDeleteProfile,
  onOpenImportModal,
  onExportAllProfiles,
  onNewProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specializationTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterSpec === 'ALL' ||
      p.specializationTag.toLowerCase().includes(filterSpec.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#171817]/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E8E4DA] shadow-2xl flex flex-col text-[#171817]">
          {/* HEADER */}
          <div className="bg-[#171817] text-[#FAF9F5] p-5 border-b border-[#B58A18]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-[#B58A18]/20 border border-[#B58A18] flex items-center justify-center text-[#B58A18]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] font-heading text-white">
                  Prasha Team Profiles
                </h2>
                <p className="text-[10.5px] text-[#5F5F59] font-mono">
                  {profiles.length} Verified Developer Dossiers
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

          {/* ACTIONS TOOLBAR */}
          <div className="bg-[#FAF9F5] p-3 border-b border-[#E8E4DA] flex flex-wrap items-center gap-2">
            {onNewProfile && (
              <button
                onClick={() => {
                  onNewProfile();
                  onClose();
                }}
                className="py-1.5 px-2.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-[#FAF9F5] text-[#171817] border border-[#DFDACF] rounded-xs flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-colors"
                title="Create blank developer profile from scratch"
              >
                <Plus className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>+ Blank</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenImportModal();
                onClose();
              }}
              className="flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] text-white rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import Resumes</span>
            </button>

            <button
              onClick={() => {
                onExportAllProfiles();
                onClose();
              }}
              className="py-1.5 px-2.5 text-xs font-bold uppercase tracking-wider bg-[#171817] hover:bg-[#232423] text-white border border-[#B58A18]/40 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export all profiles sequentially in one unified PDF document"
            >
              <Printer className="w-3.5 h-3.5 text-[#B58A18]" />
              <span>Export All ({profiles.length})</span>
            </button>
          </div>

          {/* SEARCH & FILTER */}
          <div className="p-3 border-b border-[#E8E4DA] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5F5F59] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name, role, or stack..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
              />
            </div>

            {/* Specialization Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {['ALL', 'FULL-STACK', 'C/C++', 'INTEGRATION', 'BACKEND', 'FRONTEND'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterSpec(tag)}
                  className={`px-2 py-0.5 rounded-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    filterSpec === tag
                      ? 'bg-[#B58A18] text-white'
                      : 'bg-[#FAF9F5] border border-[#E8E4DA] text-[#5F5F59] hover:text-[#171817]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* CANDIDATE PROFILES LIST */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0ECE1] p-3 space-y-2.5">
            {filteredProfiles.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5F5F59]">
                No profiles match your filter. Try clearing your search query or import new resumes.
              </div>
            ) : (
              filteredProfiles.map((p) => {
                const isActive = p.id === activeProfileId;
                return (
                  <div
                    key={p.id}
                    className={`rounded-sm border p-3 transition-all ${
                      isActive
                        ? 'border-[#B58A18] bg-[#FAF9F5] shadow-xs'
                        : 'border-[#E8E4DA] bg-white hover:border-[#B58A18]/50 hover:bg-[#FAF9F5]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#FAF9F5] border border-[#B58A18]/40 text-[#8F6910] rounded-xs uppercase">
                            {p.specializationTag}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#171817] text-white rounded-xs">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <h3 className="text-xs font-bold text-[#171817] font-heading uppercase tracking-tight mt-1 truncate">
                          {p.name}
                        </h3>

                        <div className="text-[11px] font-semibold text-[#8F6910] truncate">
                          {p.title}
                        </div>

                        <div className="text-[10px] text-[#5F5F59] mt-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3 text-[#B58A18]" />
                          <span>Confidentiality Verified • {p.snapshotStats[0]?.value || '4+ YRS'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions bar for this candidate */}
                    <div className="mt-3 pt-2.5 border-t border-[#E8E4DA] flex items-center justify-between gap-1 text-[10.5px]">
                      <button
                        onClick={() => {
                          onSelectProfile(p);
                          onClose();
                        }}
                        className={`px-2.5 py-1 font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'bg-[#B58A18] text-white'
                            : 'bg-[#FAF9F5] border border-[#DFDACF] text-[#171817] hover:bg-[#B58A18] hover:text-white'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Viewing</span>
                          </>
                        ) : (
                          <>
                            <span>Select & View</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onEditProfile(p);
                            onClose();
                          }}
                          className="p-1 text-[#5F5F59] hover:text-[#171817] hover:bg-[#FAF9F5] rounded-xs cursor-pointer"
                          title="Edit candidate profile & audit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDuplicateProfile(p)}
                          className="p-1 text-[#5F5F59] hover:text-[#171817] hover:bg-[#FAF9F5] rounded-xs cursor-pointer"
                          title="Duplicate candidate profile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {profiles.length > 1 && (
                          <button
                            onClick={() => onDeleteProfile(p.id)}
                            className="p-1 text-[#5F5F59] hover:text-red-600 hover:bg-red-50 rounded-xs cursor-pointer"
                            title="Delete candidate profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div className="bg-[#FAF9F5] p-3 border-t border-[#E8E4DA] text-[10.5px] text-[#5F5F59] text-center font-mono">
            PRASHA INFOTECH • CLIENT PROFILE BUILDER ENGINE
          </div>
        </div>
      </div>
    </div>
  );
};
