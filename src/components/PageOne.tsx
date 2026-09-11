import React from 'react';
import { DeveloperProfile, SnapshotStat } from '../types';
import { PrashaLogo } from './PrashaLogo';
import { 
  Mail, 
  Linkedin, 
  Globe,
  ShieldCheck, 
  Layers, 
  Cpu, 
  CheckCircle2,
  Sparkles,
  Edit3
} from 'lucide-react';

interface PageOneProps {
  profile: DeveloperProfile;
  isLiveEditMode?: boolean;
  onUpdate?: (updated: DeveloperProfile) => void;
  onOpenEditModal?: () => void;
  containerId?: string;
}

export const PageOne: React.FC<PageOneProps> = ({ 
  profile, 
  isLiveEditMode = false,
  onUpdate,
  onOpenEditModal,
  containerId
}) => {
  // Helper to handle field updates
  const handleFieldChange = (field: keyof DeveloperProfile, value: any) => {
    if (onUpdate) {
      onUpdate({
        ...profile,
        [field]: value
      });
    }
  };

  const handleStatChange = (idx: number, field: keyof SnapshotStat, value: string) => {
    if (onUpdate) {
      const stats = [...profile.snapshotStats];
      stats[idx] = { ...stats[idx], [field]: value };
      onUpdate({
        ...profile,
        snapshotStats: stats
      });
    }
  };

  // Dynamic font sizing for stat values to guarantee they NEVER overflow the box
  const getStatFontSize = (val: string) => {
    const len = val.trim().length;
    if (len >= 13) return 'text-xs sm:text-[13px] tracking-tight';
    if (len >= 10) return 'text-sm sm:text-base tracking-tight';
    if (len >= 7) return 'text-base sm:text-lg tracking-tight';
    return 'text-xl sm:text-2xl tracking-tight';
  };

  return (
    <div
      id={containerId || "profile-page-1"}
      data-page="1"
      className="print-page relative w-full max-w-[840px] min-h-[1140px] mx-auto bg-[#FFFFFF] border border-[#E8E4DA] shadow-sm p-8 sm:p-12 md:p-14 flex flex-col justify-between overflow-hidden text-[#171817]"
    >
      {/* Background Technical Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-80" />
      
      {/* Decorative Technical Corner Accents */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-[#B58A18]/70 select-none tracking-widest">
        + PRSH // TALENT DOSSIER
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-[#5F5F59]/60 select-none tracking-widest flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18]" />
        CONFIDENTIAL // CLIENT BRIEF
      </div>

      {/* Decorative hairline gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

      <div className="relative z-10">
        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 sm:pb-7 border-b border-[#E8E4DA] gap-4">
          <PrashaLogo size="md" showSubtitle={true} />

          <div className="flex flex-col sm:items-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/50 text-[#8F6910] text-[11px] font-bold tracking-[0.18em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18] animate-pulse" />
              Developer Profile • Prasha Infotech
            </span>
            <span className="text-[10px] font-mono text-[#5F5F59] mt-1 tracking-wider uppercase">
              Client Engineering Delivery
            </span>
          </div>
        </header>

        {/* HERO / CANDIDATE IDENTITY SECTION */}
        <section className="pt-6 pb-6">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            {isLiveEditMode ? (
              <input
                type="text"
                value={profile.specializationTag}
                onChange={(e) => handleFieldChange('specializationTag', e.target.value)}
                className="px-2.5 py-0.5 rounded-xs bg-amber-50 border border-dashed border-[#B58A18] text-[#8F6910] text-[10.5px] font-bold tracking-[0.16em] uppercase focus:outline-hidden"
              />
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 text-[#8F6910] text-[10.5px] font-bold tracking-[0.16em] uppercase">
                <Sparkles className="w-3 h-3 text-[#B58A18]" />
                {profile.specializationTag || 'TECHNICAL SPECIALIST'}
              </span>
            )}
            <span className="text-xs text-[#DFDACF]">•</span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5F5F59]">
              Verified Candidate
            </span>
            {onOpenEditModal && (
              <button
                onClick={onOpenEditModal}
                className="ml-auto no-print inline-flex items-center gap-1 text-[10.5px] text-[#8F6910] hover:text-[#171817] font-semibold tracking-wider uppercase bg-[#FAF9F5] px-2 py-0.5 rounded-xs border border-[#E8E4DA] hover:border-[#B58A18] cursor-pointer transition-colors"
                title="Edit all resume text fields"
              >
                <Edit3 className="w-3 h-3 text-[#B58A18]" />
                <span>Edit Text</span>
              </button>
            )}
          </div>

          {/* NAME */}
          {isLiveEditMode ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold uppercase text-[#171817] tracking-tight font-heading bg-amber-50/60 border border-dashed border-[#B58A18] rounded-xs px-2 py-1 focus:outline-hidden focus:bg-white"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-[#171817] tracking-tight font-heading leading-tight break-words">
              {profile.name}
            </h1>
          )}

          {/* TITLE */}
          {isLiveEditMode ? (
            <input
              type="text"
              value={profile.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full mt-2 text-base sm:text-lg font-semibold text-[#8F6910] tracking-wide bg-amber-50/60 border border-dashed border-[#B58A18] rounded-xs px-2 py-1 focus:outline-hidden focus:bg-white"
            />
          ) : (
            <div className="mt-2 text-base sm:text-lg md:text-xl font-semibold text-[#8F6910] tracking-wide break-words">
              {profile.title}
            </div>
          )}

          {/* SUBTITLE */}
          {isLiveEditMode ? (
            <input
              type="text"
              value={profile.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#5F5F59] bg-amber-50/60 border border-dashed border-[#B58A18] rounded-xs px-2 py-1 focus:outline-hidden focus:bg-white"
            />
          ) : (
            <div className="mt-1.5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#5F5F59] break-words">
              <span>{profile.subtitle}</span>
            </div>
          )}

          {/* Official Liaison & Contact Row (Client-Safe) */}
          <div className="mt-5 pt-3.5 border-t border-[#F0ECE1] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5F5F59]">
            <div className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#B58A18] shrink-0" />
              <span className="text-[#171817] break-all">{profile.email || 'talent@prashainfotech.com'}</span>
            </div>
            <a 
              href="https://www.linkedin.com/in/prasha-infotech-3b8536325/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-[#171817] hover:text-[#B58A18] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#B58A18] shrink-0" />
              <span className="underline decoration-[#B58A18]/40 hover:decoration-[#B58A18] break-all">
                linkedin.com/in/prasha-infotech-3b8536325
              </span>
            </a>
            <div className="flex items-center gap-1.5 font-medium text-[#8F6910]">
              <Globe className="w-3.5 h-3.5 text-[#B58A18] shrink-0" />
              <span>prashainfotech.com</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-5 bg-[#FAF9F5] border-l-2 border-[#B58A18] p-4 sm:p-4.5 rounded-r-sm">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8F6910] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B58A18]" />
              Executive Profile & Technical Competency
            </div>
            {isLiveEditMode ? (
              <textarea
                value={profile.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                rows={4}
                className="w-full text-xs sm:text-[13px] leading-relaxed text-[#171817] bg-white border border-dashed border-[#B58A18] rounded-xs p-2 focus:outline-hidden"
              />
            ) : (
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#171817]/90 font-normal break-words">
                {profile.summary}
              </p>
            )}
          </div>
        </section>

        {/* PROFESSIONAL SNAPSHOT SECTION - FIXED: AUTO SIZING & OVERFLOW SAFE */}
        <section className="pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#171817] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B58A18]" />
              Professional Snapshot
            </h2>
            <span className="text-[10px] font-mono text-[#8F6910] uppercase tracking-wider">
              Verified Production Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {profile.snapshotStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E8E4DA] rounded-sm p-3 sm:p-3.5 flex flex-col justify-between hover:border-[#B58A18]/50 transition-colors min-w-0 overflow-hidden"
              >
                <div className="min-w-0">
                  {/* VALUE: Scaled font size with zero overflow risk */}
                  {isLiveEditMode ? (
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full font-bold text-[#171817] bg-amber-50/70 border border-dashed border-[#B58A18] rounded-xs px-1.5 py-0.5 text-sm focus:outline-hidden"
                    />
                  ) : (
                    <div 
                      className={`font-extrabold text-[#171817] font-heading leading-tight max-w-full break-words break-all ${getStatFontSize(stat.value)}`}
                      title={stat.value}
                    >
                      {stat.value.includes('+') ? (
                        <>
                          {stat.value.replace('+', '')}
                          <span className="text-[#B58A18] font-bold">+</span>
                        </>
                      ) : stat.value.includes('%') ? (
                        <>
                          {stat.value.replace('%', '')}
                          <span className="text-[#B58A18] font-bold">%</span>
                        </>
                      ) : (
                        <span className="text-[#171817]">{stat.value}</span>
                      )}
                    </div>
                  )}

                  {/* LABEL */}
                  {isLiveEditMode ? (
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="w-full text-[9.5px] font-bold tracking-[0.1em] uppercase text-[#8F6910] mt-1 bg-amber-50/70 border border-dashed border-[#B58A18] rounded-xs px-1 py-0.5 focus:outline-hidden"
                    />
                  ) : (
                    <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8F6910] mt-1 break-words">
                      {stat.label}
                    </div>
                  )}
                </div>

                {/* SUBTEXT */}
                {isLiveEditMode ? (
                  <input
                    type="text"
                    value={stat.subtext || ''}
                    onChange={(e) => handleStatChange(idx, 'subtext', e.target.value)}
                    placeholder="Subtext..."
                    className="w-full text-[9px] text-[#5F5F59] mt-2 pt-1 border-t border-[#F0ECE1] bg-amber-50/70 border-dashed border-[#B58A18] rounded-xs px-1 py-0.5 focus:outline-hidden"
                  />
                ) : (
                  stat.subtext && (
                    <p className="text-[10px] leading-snug text-[#5F5F59] mt-2 pt-2 border-t border-[#F0ECE1] break-words">
                      {stat.subtext}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CORE EXPERTISE SECTION */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#171817] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B58A18]" />
              Core Expertise & Technical Specialization
            </h2>
            <span className="text-[10px] text-[#5F5F59] font-medium tracking-wide">
              Key Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.coreExpertise.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-sm p-3.5 hover:border-[#B58A18]/40 transition-colors min-w-0"
              >
                <div className="flex items-center justify-between mb-2 min-w-0">
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#171817] flex items-center gap-1.5 break-words">
                    {idx % 2 === 0 ? (
                      <Cpu className="w-3 h-3 text-[#B58A18] shrink-0" />
                    ) : (
                      <Layers className="w-3 h-3 text-[#B58A18] shrink-0" />
                    )}
                    {item.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18]/40 shrink-0" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center text-[10.5px] px-2 py-0.5 rounded-xs bg-[#FFFFFF] border border-[#DFDACF] text-[#171817] font-medium break-words"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#B58A18] mr-1 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER SECTION FOR PAGE 1 */}
      <footer className="relative z-10 pt-4 mt-4 border-t border-[#E8E4DA] flex items-center justify-between text-[10px] font-medium text-[#5F5F59]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#171817] uppercase tracking-wider">PRASHA INFOTECH</span>
          <span>•</span>
          <span className="text-[#8F6910]">Technical Talent & Solutions Division</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#B58A18]">PAGE 01</span>
          <span>/</span>
          <span>02</span>
        </div>
      </footer>
    </div>
  );
};
