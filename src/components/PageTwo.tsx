import React from 'react';
import { DeveloperProfile } from '../types';
import { PrashaLogo } from './PrashaLogo';
import { 
  Briefcase, 
  Terminal, 
  FolderGit2, 
  GraduationCap, 
  Award, 
  Globe,
  Calendar,
  ShieldCheck,
  Edit3
} from 'lucide-react';

interface PageTwoProps {
  profile: DeveloperProfile;
  isLiveEditMode?: boolean;
  onUpdate?: (updated: DeveloperProfile) => void;
  onOpenEditModal?: () => void;
  containerId?: string;
}

export const PageTwo: React.FC<PageTwoProps> = ({ 
  profile, 
  isLiveEditMode = false,
  onUpdate,
  onOpenEditModal,
  containerId
}) => {
  const handleBulletChange = (expIdx: number, bIdx: number, val: string) => {
    if (onUpdate) {
      const exps = [...profile.experiences];
      const highlights = [...exps[expIdx].highlights];
      highlights[bIdx] = val;
      exps[expIdx] = { ...exps[expIdx], highlights };
      onUpdate({ ...profile, experiences: exps });
    }
  };

  const handleRoleChange = (expIdx: number, val: string) => {
    if (onUpdate) {
      const exps = [...profile.experiences];
      exps[expIdx] = { ...exps[expIdx], role: val };
      onUpdate({ ...profile, experiences: exps });
    }
  };

  const handleDomainChange = (expIdx: number, val: string) => {
    if (onUpdate) {
      const exps = [...profile.experiences];
      exps[expIdx] = { ...exps[expIdx], domainSpecialization: val };
      onUpdate({ ...profile, experiences: exps });
    }
  };

  const handleDurationChange = (expIdx: number, val: string) => {
    if (onUpdate) {
      const exps = [...profile.experiences];
      exps[expIdx] = { ...exps[expIdx], duration: val };
      onUpdate({ ...profile, experiences: exps });
    }
  };

  return (
    <div
      id={containerId || "profile-page-2"}
      data-page="2"
      className="print-page relative w-full max-w-[840px] min-h-[1140px] mx-auto bg-[#FFFFFF] border border-[#E8E4DA] shadow-sm p-8 sm:p-12 md:p-14 flex flex-col justify-between overflow-hidden text-[#171817]"
    >
      {/* Background Technical Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-80" />
      
      {/* Top Hairline Gold Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

      {/* Decorative Technical Corner Accents */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-[#B58A18]/70 select-none tracking-widest">
        + PRSH // EXP.SPEC
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-[#5F5F59]/60 select-none tracking-widest flex items-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-[#B58A18]" />
        VERIFIED CREDENTIALS // PRASHA INFOTECH
      </div>

      <div className="relative z-10">
        {/* HEADER SECTION (Page 2 Header) */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E4DA] gap-4">
          <PrashaLogo size="sm" showSubtitle={false} />

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8F6910] break-words">
              {profile.name} • {profile.title}
            </span>
            <span className="hidden sm:inline text-[#DFDACF]">|</span>
            <span className="text-[10px] font-mono text-[#5F5F59] tracking-wider uppercase shrink-0">
              PAGE 02 / 02
            </span>
            {onOpenEditModal && (
              <button
                onClick={onOpenEditModal}
                className="no-print inline-flex items-center gap-1 text-[10.5px] text-[#8F6910] hover:text-[#171817] font-semibold tracking-wider uppercase bg-[#FAF9F5] px-2 py-0.5 rounded-xs border border-[#E8E4DA] hover:border-[#B58A18] cursor-pointer transition-colors shrink-0"
                title="Edit all resume text fields"
              >
                <Edit3 className="w-3 h-3 text-[#B58A18]" />
                <span>Edit Text</span>
              </button>
            )}
          </div>
        </header>

        {/* SECTION 1: EXPERIENCE (VERTICAL TIMELINE - STRICTLY HIDES PREVIOUS EMPLOYER NAMES) */}
        <section className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#171817] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B58A18]" />
              <Briefcase className="w-3.5 h-3.5 text-[#B58A18]" />
              Professional Experience & Client Engagements
            </h2>
            <span className="text-[10px] font-mono text-[#8F6910] uppercase">
              Domain & Technical Impact
            </span>
          </div>

          <div className="relative pl-6 space-y-5 border-l border-[#B58A18]/30 ml-2">
            {profile.experiences.map((exp, expIdx) => {
              const isEmployerHidden = exp.hideEmployer !== false || profile.hideAllEmployers;
              
              return (
                <div key={exp.id} className="relative group min-w-0">
                  {/* Timeline node marker */}
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#B58A18] shadow-xs group-hover:bg-[#B58A18] transition-colors" />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1.5 min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* ROLE */}
                        {isLiveEditMode ? (
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleRoleChange(expIdx, e.target.value)}
                            className="text-[12px] font-extrabold text-[#171817] uppercase bg-amber-50 border border-dashed border-[#B58A18] rounded-xs px-1.5 py-0.5 focus:outline-hidden"
                          />
                        ) : (
                          <span className="text-[13px] font-extrabold text-[#171817] font-heading tracking-tight uppercase break-words">
                            {exp.role}
                          </span>
                        )}

                        {/* ENGAGEMENT STATUS BADGE (Sanitized client view) */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 text-[#8F6910] text-[9.5px] font-bold tracking-wider uppercase shrink-0">
                          {isEmployerHidden ? 'Client Engagement' : (exp.rawEmployerName || 'Enterprise Client')}
                        </span>
                      </div>

                      {/* DOMAIN SPECIALIZATION LINE */}
                      {isLiveEditMode ? (
                        <input
                          type="text"
                          value={exp.domainSpecialization || ''}
                          placeholder="DOMAIN SPECIALIZATION • ENTERPRISE..."
                          onChange={(e) => handleDomainChange(expIdx, e.target.value)}
                          className="text-[10px] font-mono font-bold text-[#8F6910] uppercase mt-1 bg-amber-50 border border-dashed border-[#B58A18] rounded-xs px-1.5 py-0.5 focus:outline-hidden w-full"
                        />
                      ) : (
                        exp.domainSpecialization && (
                          <div className="text-[10.5px] font-mono font-bold text-[#8F6910] tracking-wide uppercase mt-0.5 break-words">
                            {exp.domainSpecialization}
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10.5px] font-mono text-[#5F5F59] shrink-0 mt-0.5">
                      {isLiveEditMode ? (
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleDurationChange(expIdx, e.target.value)}
                          className="text-[10px] font-mono text-[#5F5F59] bg-amber-50 border border-dashed border-[#B58A18] rounded-xs px-1 py-0.5 focus:outline-hidden"
                        />
                      ) : (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#B58A18]" />
                          {exp.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Technical Achievement Bullets */}
                  <ul className="mt-2 space-y-1.5 text-[11.5px] text-[#171817]/90 leading-relaxed">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18] mt-1.5 shrink-0" />
                        {isLiveEditMode ? (
                          <textarea
                            value={bullet}
                            onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                            rows={2}
                            className="w-full text-[11.5px] text-[#171817] bg-amber-50/60 border border-dashed border-[#B58A18] rounded-xs p-1 focus:outline-hidden"
                          />
                        ) : (
                          <span className="break-words">{bullet}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: TECHNICAL STACK MATRIX */}
        <section className="pt-2 pb-4 border-t border-[#F0ECE1]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#171817] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B58A18]" />
              <Terminal className="w-3.5 h-3.5 text-[#B58A18]" />
              Technical Stack & Tooling Architecture
            </h2>
            <span className="text-[10px] font-mono text-[#8F6910] uppercase">
              Comprehensive Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {profile.techStack.map((category, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-sm p-2.5 flex flex-col justify-between min-w-0"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8F6910] mb-1 break-words">
                  {category.category}
                </div>
                <div className="text-xs font-medium text-[#171817] leading-relaxed break-words">
                  {category.items.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SELECTED PROJECTS & CASE STUDIES */}
        {profile.selectedProjects && profile.selectedProjects.length > 0 && (
          <section className="pt-2 pb-4 border-t border-[#F0ECE1]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#171817] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#B58A18]" />
                <FolderGit2 className="w-3.5 h-3.5 text-[#B58A18]" />
                Selected Enterprise Client Deployments
              </h2>
              <span className="text-[10px] font-mono text-[#8F6910] uppercase">
                Production Case Studies
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.selectedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#FFFFFF] border border-[#E8E4DA] rounded-sm p-3 flex flex-col justify-between hover:border-[#B58A18]/50 transition-colors min-w-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9.5px] font-mono uppercase text-[#8F6910] tracking-wider font-semibold break-words">
                        {proj.domain}
                      </span>
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 bg-[#FAF9F5] border border-[#B58A18]/30 text-[#8F6910] rounded-xs uppercase shrink-0">
                        Client Engagement
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-[#171817] font-heading leading-snug break-words">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-[#5F5F59] mt-1.5 break-words">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#F0ECE1]">
                    <div className="text-[10px] text-[#171817] font-medium break-words">
                      <span className="font-semibold text-[#8F6910]">Impact:</span> {proj.impact}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.slice(0, 5).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FAF9F5] border border-[#E8E4DA] text-[#5F5F59] rounded-xs break-words"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CERTIFICATIONS & EDUCATION */}
        <section className="pt-2 pb-3 border-t border-[#F0ECE1] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Certifications */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-[#B58A18]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#171817]">
                Certifications & Accreditations
              </h2>
            </div>
            <div className="space-y-1.5">
              {profile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-[#FAF9F5] border border-[#E8E4DA] px-2.5 py-1.5 rounded-sm flex items-center justify-between min-w-0 gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[#171817] leading-tight break-words">
                      {cert.name}
                    </div>
                    <div className="text-[9.5px] text-[#5F5F59] break-words">
                      {cert.issuer}
                    </div>
                  </div>
                  {cert.year && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#FFFFFF] border border-[#B58A18]/30 text-[#8F6910] font-semibold shrink-0">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#B58A18]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#171817]">
                Academic Background
              </h2>
            </div>
            <div className="space-y-1.5">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-[#FAF9F5] border border-[#E8E4DA] px-2.5 py-1.5 rounded-sm min-w-0"
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="text-[11px] font-bold text-[#171817] leading-tight break-words">
                      {edu.degree}
                    </div>
                    <span className="text-[9px] font-mono text-[#8F6910] shrink-0 font-semibold">
                      {edu.year}
                    </span>
                  </div>
                  <div className="text-[9.5px] text-[#5F5F59] mt-0.5 break-words">
                    {edu.institution}
                  </div>
                  {edu.details && (
                    <div className="text-[9px] text-[#8F6910] mt-1 font-medium break-words">
                      {edu.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER SECTION FOR PAGE 2 */}
      <footer className="relative z-10 pt-4 mt-3 border-t-2 border-[#B58A18] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#171817] tracking-[0.14em] uppercase font-heading">
            PRASHA INFOTECH
          </span>
          <span className="text-[#DFDACF]">|</span>
          <span className="text-[#5F5F59] text-[10.5px]">
            Digital Solutions • Software Development • AI & Automation
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px]">
          <a
            href="https://www.prashainfotech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#8F6910] hover:text-[#B58A18] font-mono font-semibold"
          >
            <Globe className="w-3 h-3 text-[#B58A18]" />
            www.prashainfotech.com
          </a>
          <span className="text-[#DFDACF]">•</span>
          <span className="font-mono text-[#5F5F59]">PAGE 02 / 02</span>
        </div>
      </footer>
    </div>
  );
};
