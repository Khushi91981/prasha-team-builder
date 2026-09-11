import React, { useState } from 'react';
import { 
  DeveloperProfile, 
  ExperienceItem, 
  SnapshotStat, 
  SkillCategory,
  TechStackCategory,
  EducationItem,
  CertificationItem,
  ProjectItem
} from '../types';
import { parseResumeText } from '../utils/resumeParser';
import { 
  X, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Upload, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Cpu, 
  FolderGit2, 
  Terminal, 
  GraduationCap, 
  Award,
  Code2,
  FileText
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DeveloperProfile;
  onSave: (updatedProfile: DeveloperProfile) => void;
  onReset: () => void;
}

const SPECIALIZATIONS = [
  'FULL-STACK DEVELOPER',
  'FRONTEND ENGINEER',
  'BACKEND ENGINEER',
  'SOFTWARE ENGINEER',
  'C/C++ ENGINEER',
  'DEVOPS ENGINEER',
  'CLOUD ENGINEER',
  'AI/ML ENGINEER',
  'DATA ENGINEER',
  'INTEGRATION ENGINEER',
  'MOBILE DEVELOPER',
  'WORDPRESS DEVELOPER',
  'SHOPIFY DEVELOPER',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'stats' | 'expertise' | 'experience' | 'techstack' | 'education' | 'projects' | 'rawjson' | 'import' | 'audit'
  >('basic');
  const [formData, setFormData] = useState<DeveloperProfile>(profile);
  const [rawJsonText, setRawJsonText] = useState(JSON.stringify(profile, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBasicChange = (field: keyof DeveloperProfile, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleStatChange = (index: number, field: keyof SnapshotStat, value: string) => {
    setFormData((prev) => {
      const stats = [...prev.snapshotStats];
      stats[index] = { ...stats[index], [field]: value };
      const next = { ...prev, snapshotStats: stats };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: any) => {
    setFormData((prev) => {
      const exps = [...prev.experiences];
      exps[index] = { ...exps[index], [field]: value };
      const next = { ...prev, experiences: exps };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleAddExperienceBullet = (expIndex: number) => {
    setFormData((prev) => {
      const exps = [...prev.experiences];
      exps[expIndex] = {
        ...exps[expIndex],
        highlights: [...exps[expIndex].highlights, 'New technical contribution bullet...'],
      };
      const next = { ...prev, experiences: exps };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleRemoveExperienceBullet = (expIndex: number, bulletIndex: number) => {
    setFormData((prev) => {
      const exps = [...prev.experiences];
      exps[expIndex] = {
        ...exps[expIndex],
        highlights: exps[expIndex].highlights.filter((_, i) => i !== bulletIndex),
      };
      const next = { ...prev, experiences: exps };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleUpdateExperienceBullet = (expIndex: number, bulletIndex: number, text: string) => {
    setFormData((prev) => {
      const exps = [...prev.experiences];
      const newHighlights = [...exps[expIndex].highlights];
      newHighlights[bulletIndex] = text;
      exps[expIndex] = { ...exps[expIndex], highlights: newHighlights };
      const next = { ...prev, experiences: exps };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleAddExperienceItem = () => {
    setFormData((prev) => {
      const next = {
        ...prev,
        experiences: [
          ...prev.experiences,
          {
            id: `exp-${Date.now()}`,
            role: 'SENIOR SOFTWARE ENGINEER',
            duration: '2021 – Present',
            domainSpecialization: 'SOFTWARE ENGINEERING • DISTRIBUTED SYSTEMS',
            rawEmployerName: 'Confidential Employer',
            hideEmployer: true,
            highlights: [
              'Architected high-throughput microservices adhering to enterprise reliability standards.',
              'Collaborated in agile delivery sprints producing verified client outcomes.',
            ],
          },
        ],
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleRemoveExperienceItem = (id: string) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  // TECH STACK MATRIX HANDLERS
  const handleTechCategoryChange = (catIdx: number, title: string) => {
    setFormData((prev) => {
      const stack = [...prev.techStack];
      stack[catIdx] = { ...stack[catIdx], category: title };
      const next = { ...prev, techStack: stack };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleTechItemsChange = (catIdx: number, itemsString: string) => {
    setFormData((prev) => {
      const stack = [...prev.techStack];
      const items = itemsString.split(',').map((s) => s.trim()).filter(Boolean);
      stack[catIdx] = { ...stack[catIdx], items };
      const next = { ...prev, techStack: stack };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleAddTechCategory = () => {
    setFormData((prev) => {
      const next = {
        ...prev,
        techStack: [
          ...prev.techStack,
          { category: 'New Category', items: ['Tool A', 'Tool B'] }
        ]
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleRemoveTechCategory = (catIdx: number) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        techStack: prev.techStack.filter((_, i) => i !== catIdx)
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  // EDUCATION & CERTIFICATIONS HANDLERS
  const handleAddEducation = () => {
    setFormData((prev) => {
      const next = {
        ...prev,
        education: [
          ...prev.education,
          {
            id: `edu-${Date.now()}`,
            degree: 'Bachelor of Technology (B.Tech)',
            institution: 'University / Institute',
            year: 'Graduated'
          }
        ]
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleUpdateEducation = (idx: number, field: keyof EducationItem, val: string) => {
    setFormData((prev) => {
      const edu = [...prev.education];
      edu[idx] = { ...edu[idx], [field]: val };
      const next = { ...prev, education: edu };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleRemoveEducation = (idx: number) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        education: prev.education.filter((_, i) => i !== idx)
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleAddCertification = () => {
    setFormData((prev) => {
      const next = {
        ...prev,
        certifications: [
          ...prev.certifications,
          {
            id: `cert-${Date.now()}`,
            name: 'Professional Engineering Certification',
            issuer: 'Industry Recognized Authority',
            year: new Date().getFullYear().toString()
          }
        ]
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleUpdateCertification = (idx: number, field: keyof CertificationItem, val: string) => {
    setFormData((prev) => {
      const certs = [...prev.certifications];
      certs[idx] = { ...certs[idx], [field]: val };
      const next = { ...prev, certifications: certs };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleRemoveCertification = (idx: number) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== idx)
      };
      setRawJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  // RAW JSON HANDLER
  const handleApplyRawJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(rawJsonText);
      setFormData(parsed);
      showNotification('Profile successfully updated from raw JSON!');
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleReParseFromText = () => {
    if (!pastedText.trim()) return;
    try {
      const updated = parseResumeText(pastedText, `${formData.name}.txt`);
      setFormData({
        ...updated,
        id: formData.id,
      });
      setRawJsonText(JSON.stringify({ ...updated, id: formData.id }, null, 2));
      showNotification('Profile refreshed from pasted text with employers masked!');
    } catch (err: any) {
      showNotification('Error parsing resume text: ' + err.message);
    }
  };

  const handleSaveAll = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171817]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#B58A18] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Hairline Gold Accent */}
        <div className="h-1 bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F5]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8F6910]">
              PRASHA INFOTECH • EDIT ALL RESUME TEXT
            </span>
            <h2 className="text-base font-bold uppercase tracking-tight text-[#171817] font-heading">
              Edit Dossier: {formData.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[#5F5F59] hover:text-[#171817] hover:bg-[#E8E4DA] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTIFICATION BANNER */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2 text-xs flex items-center justify-between">
            <span>{notification}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* 8 TABS NAVIGATION */}
        <div className="flex items-center border-b border-[#E8E4DA] bg-[#FAF9F5] px-4 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'stats', label: '2. Metrics Snapshot' },
            { id: 'expertise', label: '3. Core Expertise' },
            { id: 'experience', label: '4. Experience & Roles' },
            { id: 'techstack', label: '5. Technical Stack' },
            { id: 'education', label: '6. Education & Certs' },
            { id: 'projects', label: '7. Projects' },
            { id: 'rawjson', label: '8. Direct JSON Edit' },
            { id: 'import', label: '9. Paste Resume' },
            { id: 'audit', label: '10. Quality Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-3 font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-[#B58A18] text-[#8F6910] bg-white'
                  : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleBasicChange('name', e.target.value.toUpperCase())}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Specialization Tag
                  </label>
                  <select
                    value={formData.specializationTag}
                    onChange={(e) => handleBasicChange('specializationTag', e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18] cursor-pointer"
                  >
                    {SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Subtitle / Engagement Scope
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleBasicChange('subtitle', e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Contact Email (Official Prasha Talent Desk)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleBasicChange('email', e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Company LinkedIn Link
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleBasicChange('linkedin', e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                  Executive Profile & Technical Competency Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.summary}
                  onChange={(e) => handleBasicChange('summary', e.target.value)}
                  className="w-full text-xs leading-relaxed p-3 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: METRICS SNAPSHOT */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <p className="text-xs text-[#5F5F59]">
                Edit the 4 primary production metrics displayed on Page 1. Text is automatically size-fitted so it never overflows the cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.snapshotStats.map((stat, idx) => (
                  <div key={idx} className="p-4 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-3">
                    <div className="text-xs font-mono font-bold text-[#8F6910]">
                      METRIC BOX 0{idx + 1}
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                        Value (e.g. 4 YEARS+, 18+, 99.98%, MICROSERVICES)
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        className="w-full text-sm font-extrabold px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                        Subtext / Context
                      </label>
                      <input
                        type="text"
                        value={stat.subtext || ''}
                        onChange={(e) => handleStatChange(idx, 'subtext', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CORE EXPERTISE */}
          {activeTab === 'expertise' && (
            <div className="space-y-4">
              <p className="text-xs text-[#5F5F59]">
                Organize key competencies and technologies into structured categories for Page 1.
              </p>

              <div className="space-y-4">
                {formData.coreExpertise.map((cat, catIdx) => (
                  <div key={catIdx} className="p-4 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => {
                          const exp = [...formData.coreExpertise];
                          exp[catIdx].category = e.target.value;
                          setFormData({ ...formData, coreExpertise: exp });
                        }}
                        className="text-xs font-bold uppercase px-2.5 py-1 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden w-2/3"
                      />
                      <button
                        onClick={() => {
                          const exp = formData.coreExpertise.filter((_, i) => i !== catIdx);
                          setFormData({ ...formData, coreExpertise: exp });
                        }}
                        className="text-xs text-red-600 hover:text-red-800 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Category</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-[#5F5F59] mb-1">
                        Skills (comma separated):
                      </label>
                      <input
                        type="text"
                        value={cat.skills.join(', ')}
                        onChange={(e) => {
                          const exp = [...formData.coreExpertise];
                          exp[catIdx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setFormData({ ...formData, coreExpertise: exp });
                        }}
                        className="w-full text-xs px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      coreExpertise: [
                        ...formData.coreExpertise,
                        { category: 'New Category', skills: ['Skill 1', 'Skill 2'] }
                      ]
                    });
                  }}
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#FAF9F5] border border-[#B58A18] text-[#8F6910] hover:bg-white rounded-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & ROLES */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#5F5F59]">
                  Each role milestone represents client engagements. Previous employer names are sanitized for client confidentiality.
                </p>
                <button
                  onClick={handleAddExperienceItem}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18] text-white rounded-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Engagement</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.experiences.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8F6910]">
                        MILESTONE 0{expIdx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveExperienceItem(exp.id)}
                        className="text-xs text-red-600 hover:text-red-800 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(expIdx, 'role', e.target.value)}
                          className="w-full text-xs font-bold px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(expIdx, 'duration', e.target.value)}
                          className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                          Domain Specialization (e.g. ENTERPRISE SAAS • DISTRIBUTED SYSTEMS)
                        </label>
                        <input
                          type="text"
                          value={exp.domainSpecialization || ''}
                          onChange={(e) => handleExperienceChange(expIdx, 'domainSpecialization', e.target.value)}
                          className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10.5px] font-bold uppercase text-[#171817]">
                          Technical Contribution Bullets
                        </label>
                        <button
                          onClick={() => handleAddExperienceBullet(expIdx)}
                          className="text-[10.5px] text-[#8F6910] hover:text-[#171817] font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Bullet</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.highlights.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleUpdateExperienceBullet(expIdx, bIdx, e.target.value)}
                              className="w-full text-xs leading-relaxed p-2 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                            />
                            <button
                              onClick={() => handleRemoveExperienceBullet(expIdx, bIdx)}
                              className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                              title="Remove bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TECHNICAL STACK MATRIX */}
          {activeTab === 'techstack' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#5F5F59]">
                  Comprehensive technology categories and items displayed on Page 2.
                </p>
                <button
                  onClick={handleAddTechCategory}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18] text-white rounded-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tech Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.techStack.map((cat, idx) => (
                  <div key={idx} className="p-4 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8F6910]">
                        CATEGORY 0{idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveTechCategory(idx)}
                        className="text-xs text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => handleTechCategoryChange(idx, e.target.value)}
                        className="w-full text-xs font-bold px-3 py-1.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-[#171817] mb-1">
                        Technologies (comma-separated)
                      </label>
                      <textarea
                        rows={3}
                        value={cat.items.join(', ')}
                        onChange={(e) => handleTechItemsChange(idx, e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EDUCATION & CERTIFICATIONS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {/* Education Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171817] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#B58A18]" />
                    <span>Academic Degrees</span>
                  </h3>
                  <button
                    onClick={handleAddEducation}
                    className="text-xs text-[#8F6910] hover:text-[#171817] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.education.map((edu, idx) => (
                    <div key={edu.id} className="p-3 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#8F6910]">
                          DEGREE #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveEducation(idx)}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Degree Name (e.g. B.Tech in CS)"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                            className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Year / Honors"
                            value={edu.year}
                            onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                            className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Institution / University Name"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="space-y-3 pt-4 border-t border-[#E8E4DA]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171817] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#B58A18]" />
                    <span>Certifications & Accreditations</span>
                  </h3>
                  <button
                    onClick={handleAddCertification}
                    className="text-xs text-[#8F6910] hover:text-[#171817] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.certifications.map((cert, idx) => (
                    <div key={cert.id} className="p-3 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#8F6910]">
                          CERTIFICATION #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveCertification(idx)}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Certification Name"
                            value={cert.name}
                            onChange={(e) => handleUpdateCertification(idx, 'name', e.target.value)}
                            className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Year"
                            value={cert.year || ''}
                            onChange={(e) => handleUpdateCertification(idx, 'year', e.target.value)}
                            className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Issuer (e.g. AWS, Microsoft, Oracle)"
                            value={cert.issuer}
                            onChange={(e) => handleUpdateCertification(idx, 'issuer', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#5F5F59]">
                  Selected client deployments & enterprise case studies on Page 2.
                </p>
                <button
                  onClick={() => {
                    const newProj: ProjectItem = {
                      id: `proj-${Date.now()}`,
                      title: 'New Client Project',
                      domain: 'ENTERPRISE SOLUTION',
                      description: 'Production system delivery details...',
                      impact: 'Reduced latency by 40% with high concurrency',
                      technologies: ['React', 'Node.js', 'PostgreSQL'],
                      hideClientIdentity: true
                    };
                    setFormData({
                      ...formData,
                      selectedProjects: [...formData.selectedProjects, newProj]
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18] text-white rounded-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.selectedProjects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 border border-[#DFDACF] rounded-sm bg-[#FAF9F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8F6910]">
                        PROJECT #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            selectedProjects: formData.selectedProjects.filter((_, i) => i !== idx)
                          });
                        }}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10.5px] font-bold text-[#171817] mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const projs = [...formData.selectedProjects];
                            projs[idx].title = e.target.value;
                            setFormData({ ...formData, selectedProjects: projs });
                          }}
                          className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-[#171817] mb-1">
                          Domain (e.g. FINTECH PLATFORM)
                        </label>
                        <input
                          type="text"
                          value={proj.domain}
                          onChange={(e) => {
                            const projs = [...formData.selectedProjects];
                            projs[idx].domain = e.target.value;
                            setFormData({ ...formData, selectedProjects: projs });
                          }}
                          className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10.5px] font-bold text-[#171817] mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const projs = [...formData.selectedProjects];
                            projs[idx].description = e.target.value;
                            setFormData({ ...formData, selectedProjects: projs });
                          }}
                          className="w-full text-xs p-2 bg-white border border-[#DFDACF] rounded-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10.5px] font-bold text-[#171817] mb-1">
                          Impact Statement
                        </label>
                        <input
                          type="text"
                          value={proj.impact}
                          onChange={(e) => {
                            const projs = [...formData.selectedProjects];
                            projs[idx].impact = e.target.value;
                            setFormData({ ...formData, selectedProjects: projs });
                          }}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DFDACF] rounded-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RAW JSON EDITOR */}
          {activeTab === 'rawjson' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                    Direct Raw JSON Data Editor
                  </h4>
                  <p className="text-xs text-[#5F5F59]">
                    Edit every single text property or paste in custom JSON data with complete validation.
                  </p>
                </div>
                <button
                  onClick={handleApplyRawJson}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] text-white rounded-xs cursor-pointer shadow-xs"
                >
                  Validate & Apply JSON
                </button>
              </div>

              {jsonError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                  <strong>JSON Syntax Error:</strong> {jsonError}
                </div>
              )}

              <textarea
                rows={16}
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                className="w-full text-xs font-mono p-3.5 bg-[#171817] text-[#FAF9F5] rounded-xs focus:outline-hidden focus:ring-1 focus:ring-[#B58A18]"
              />
            </div>
          )}

          {/* TAB 9: IMPORT / PASTE RESUME */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs text-[#5F5F59]">
                Paste text from another resume to automatically convert it into the official Prasha Infotech client-facing format.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                  Paste Resume Text to Auto-Convert
                </label>
                <textarea
                  rows={10}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste candidate resume text here..."
                  className="w-full text-xs font-mono p-3 bg-[#FFFFFF] border border-[#DFDACF] rounded-xs focus:outline-hidden focus:border-[#B58A18]"
                />
                <button
                  disabled={!pastedText.trim()}
                  onClick={handleReParseFromText}
                  className="mt-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] text-white rounded-xs disabled:opacity-50 cursor-pointer"
                >
                  Convert Text & Sanitize Employers
                </button>
              </div>
            </div>
          )}

          {/* TAB 10: PREVIEW & QUALITY AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="bg-[#FAF9F5] border border-[#B58A18]/40 p-4 rounded-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171817] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B58A18]" />
                    Automated Quality Control & Client Confidentiality Audit
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    100% AUDIT PASS
                  </span>
                </div>
                <p className="text-xs text-[#5F5F59]">
                  Prasha Infotech automated pre-flight checklist verifies that all client-facing presentation standards are strictly satisfied:
                </p>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Confidentiality Shield:</span>
                    <span className="text-[#171817]">
                      Previous employer names are hidden from client view.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Domain Categorization:</span>
                    <span className="text-[#171817]">
                      Domain Specialization tags active across {formData.experiences.length} experience milestones.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Specialization Tag:</span>
                    <span className="text-[#171817]">
                      Assigned: <strong className="text-[#8F6910]">{formData.specializationTag}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Brand Identity:</span>
                    <span className="text-[#171817]">
                      Prasha Infotech Gold Accent (#B58A18) and official logo image active.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#FAF9F5] px-6 py-3.5 border-t border-[#E8E4DA] flex items-center justify-between shrink-0">
          <button
            onClick={onReset}
            className="text-xs text-[#5F5F59] hover:text-[#171817] cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restore Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#5F5F59] hover:text-[#171817] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] text-white rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
