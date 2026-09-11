import React, { useState, useEffect } from 'react';
import { defaultProfile } from './data/defaultProfile';
import { nehaSharmaProfile, ankushOjhaProfile } from './data/alternateProfiles';
import { PageOne } from './components/PageOne';
import { PageTwo } from './components/PageTwo';
import { Toolbar } from './components/Toolbar';
import { EditProfileModal } from './components/EditProfileModal';
import { TeamProfilesDrawer } from './components/TeamProfilesDrawer';
import { BulkImportModal } from './components/BulkImportModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ExportModal } from './components/ExportModal';
import { ShareClientModal } from './components/ShareClientModal';
import { DesktopAppGuideModal } from './components/DesktopAppGuideModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { GitHubUpdateService } from './services/githubUpdateService';
import { DeveloperProfile, AdminUser, AppVersionState, GitHubCommitInfo } from './types';
import { 
  ShieldCheck, 
  Printer, 
  Sparkles, 
  Building2, 
  Users, 
  UploadCloud, 
  Check, 
  Columns, 
  FileCheck,
  ArrowRight,
  Download,
  Share2,
  Laptop,
  Lock,
  ExternalLink,
  GitBranch
} from 'lucide-react';

export default function App() {
  // Profiles state with persistent storage support
  const [allProfiles, setAllProfiles] = useState<DeveloperProfile[]>(() => {
    try {
      const saved = localStorage.getItem('prasha_team_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved profiles from localStorage', e);
    }
    return [defaultProfile, nehaSharmaProfile, ankushOjhaProfile];
  });

  const [currentProfile, setCurrentProfile] = useState<DeveloperProfile>(() => {
    // Check if URL has ?profile=...
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get('profile');
    if (profileId) {
      const found = allProfiles.find((p) => p.id === profileId);
      if (found) return found;
    }
    return allProfiles[0] || defaultProfile;
  });

  // Admin user state (saved in localStorage)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('prasha_admin_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading admin user', e);
    }
    return null;
  });

  // UI state
  const [viewMode, setViewMode] = useState<'spread' | 'page1' | 'page2' | 'stack' | 'all'>('spread');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDesktopGuideOpen, setIsDesktopGuideOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [versionState, setVersionState] = useState<AppVersionState>(GitHubUpdateService.getVersionState);
  const [isLiveEditMode, setIsLiveEditMode] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Check if client presentation share mode
  const isClientMode = new URLSearchParams(window.location.search).get('share') === 'client';

  // Check for updates on mount and periodically
  useEffect(() => {
    const config = GitHubUpdateService.getConfig();
    if (config.autoCheck) {
      GitHubUpdateService.checkForUpdates().then((res) => {
        setVersionState(GitHubUpdateService.getVersionState());
        if (res.updateAvailable && res.latestCommit) {
          notify(`GitHub update ready: "${res.latestCommit.message.substring(0, 45)}..."`);
        }
      });

      const intervalMs = (config.checkIntervalMinutes || 15) * 60 * 1000;
      const timer = setInterval(() => {
        GitHubUpdateService.checkForUpdates().then((res) => {
          setVersionState(GitHubUpdateService.getVersionState());
        });
      }, intervalMs);

      return () => clearInterval(timer);
    }
  }, []);

  // Persist profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('prasha_team_profiles', JSON.stringify(allProfiles));
    } catch (e) {
      console.error('Failed to persist profiles', e);
    }
  }, [allProfiles]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSelectProfile = (profile: DeveloperProfile) => {
    setCurrentProfile(profile);
    if (viewMode === 'all') {
      setViewMode('spread');
    }
  };

  const handleSaveProfile = (updated: DeveloperProfile) => {
    setCurrentProfile(updated);
    setAllProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    notify(`Saved changes for ${updated.name}`);
  };

  const handleResetProfile = () => {
    setCurrentProfile(defaultProfile);
    notify('Reset to default profile');
  };

  const handleDuplicateProfile = (profileToDup: DeveloperProfile) => {
    const duplicated: DeveloperProfile = {
      ...profileToDup,
      id: `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${profileToDup.name} (COPY)`,
    };
    setAllProfiles((prev) => [...prev, duplicated]);
    setCurrentProfile(duplicated);
    notify(`Duplicated profile as ${duplicated.name}`);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (allProfiles.length <= 1) {
      notify('Cannot delete the last remaining developer profile.');
      return;
    }
    const remaining = allProfiles.filter((p) => p.id !== profileId);
    setAllProfiles(remaining);
    if (currentProfile.id === profileId) {
      setCurrentProfile(remaining[0]);
    }
    notify('Candidate profile removed from roster');
  };

  const handleAddProfiles = (newProfiles: DeveloperProfile[]) => {
    setAllProfiles((prev) => [...prev, ...newProfiles]);
    if (newProfiles.length > 0) {
      setCurrentProfile(newProfiles[0]);
      notify(`Successfully imported ${newProfiles.length} developer profile(s)!`);
    }
  };

  const handleLoadPreloadedProfile = (which: 'kashika' | 'neha' | 'ankush') => {
    let target = defaultProfile;
    if (which === 'neha') target = nehaSharmaProfile;
    if (which === 'ankush') target = ankushOjhaProfile;

    const existing = allProfiles.find((p) => p.id === target.id);
    if (!existing) {
      setAllProfiles((prev) => [...prev, target]);
    }
    setCurrentProfile(target);
    notify(`Loaded verified dossier for ${target.name}`);
  };

  const handleCreateBlankProfile = () => {
    const newId = `profile-${Date.now()}`;
    const blankProfile: DeveloperProfile = {
      id: newId,
      name: 'NEW DEVELOPER CANDIDATE',
      title: 'SENIOR SOFTWARE ENGINEER',
      subtitle: 'CLIENT TECHNICAL ENGAGEMENT & ARCHITECTURE DOSSIER',
      specializationTag: 'FULL-STACK ENGINEERING',
      summary:
        'Experienced engineer with a demonstrated track record of designing scalable cloud applications, high-performance services, and responsive user interfaces. Delivered end-to-end production systems following modern development standards.',
      location: '',
      email: 'talent@prashainfotech.com',
      phone: '',
      linkedin: 'https://www.linkedin.com/in/prasha-infotech-3b8536325/',
      snapshotStats: [
        { label: 'Industry Experience', value: '4+ Yrs', subtext: 'Core Engineering' },
        { label: 'Technical Domain', value: 'Full-Stack', subtext: 'Distributed Systems' },
        { label: 'Production Projects', value: '8+ Apps', subtext: 'Enterprise Grade' },
        { label: 'Client Satisfaction', value: '100%', subtext: 'On-Time Delivery' },
      ],
      coreExpertise: [
        {
          category: 'Software Engineering & Architecture',
          skills: ['TypeScript', 'JavaScript (ES6+)', 'System Design', 'RESTful APIs', 'Microservices', 'Git'],
        },
        {
          category: 'Frontend & UI Engineering',
          skills: ['React', 'Next.js', 'Tailwind CSS', 'State Management', 'Responsive UI', 'Accessibility'],
        },
        {
          category: 'Backend & Cloud Infrastructure',
          skills: ['Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS / Cloud', 'CI/CD Pipelines'],
        },
      ],
      experiences: [
        {
          id: `exp-${Date.now()}-1`,
          role: 'SENIOR FULL-STACK ENGINEER',
          duration: 'Jan 2023 – Present',
          domainSpecialization: 'ENTERPRISE SAAS PLATFORM • DISTRIBUTED APIS',
          rawEmployerName: 'Confidential Tech Corp',
          hideEmployer: true,
          highlights: [
            'Architected and deployed responsive full-stack applications serving over 50,000 active users.',
            'Optimized database queries and API response times by 40%, ensuring sub-200ms latency across key workflows.',
            'Collaborated with cross-functional engineering teams to implement secure authentication and automated CI/CD pipelines.',
          ],
        },
      ],
      selectedProjects: [],
      education: [
        {
          id: `edu-${Date.now()}-1`,
          degree: 'Bachelor of Technology (B.Tech) in Computer Science',
          institution: 'Accredited Institute of Technology',
          year: 'Graduated with Honors',
        },
      ],
      certifications: [
        {
          id: `cert-${Date.now()}-1`,
          name: 'Certified Cloud Practitioner / Full-Stack Specialist',
          issuer: 'Industry Recognized Certification Authority',
          year: '2023',
        },
      ],
      techStack: [
        {
          category: 'Languages & Core',
          items: ['TypeScript', 'JavaScript', 'SQL', 'HTML5/CSS3'],
        },
        {
          category: 'Frameworks & Libraries',
          items: ['React', 'Next.js', 'Express', 'Node.js', 'Tailwind CSS'],
        },
        {
          category: 'Databases & Tools',
          items: ['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Postman'],
        },
      ],
      hideAllEmployers: true,
      hideAllClientNames: true,
    };

    setAllProfiles((prev) => [blankProfile, ...prev]);
    setCurrentProfile(blankProfile);
    setIsEditOpen(true);
    notify('Created new blank developer profile — ready to edit');
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    try {
      localStorage.setItem('prasha_admin_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    notify(`Welcome, ${user.email} (Admin Authenticated)`);
  };

  const handleLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('prasha_admin_user');
    } catch (e) {
      console.error(e);
    }
    notify('Logged out of admin session');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#171817] flex flex-col selection:bg-[#B58A18] selection:text-white">
      {/* Sticky Top Navigation Bar (Hidden in Print) */}
      <Toolbar
        currentProfile={currentProfile}
        availableProfiles={allProfiles}
        onSelectProfile={handleSelectProfile}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenEditModal={() => setIsEditOpen(true)}
        onOpenTeamDrawer={() => setIsTeamDrawerOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenShareModal={() => setIsShareOpen(true)}
        onOpenDesktopGuide={() => setIsDesktopGuideOpen(true)}
        onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
        updateAvailable={versionState.updateAvailable}
        latestCommit={versionState.latestCommit}
        onOpenAdminModal={() => setIsAdminAuthOpen(true)}
        onNewProfile={handleCreateBlankProfile}
        adminUser={adminUser}
        isLiveEditMode={isLiveEditMode}
        onToggleLiveEdit={() => setIsLiveEditMode(!isLiveEditMode)}
      />

      {/* GitHub Update Pending Banner (Hidden in Print) */}
      {versionState.updateAvailable && versionState.latestCommit && (
        <div className="no-print bg-amber-400 text-black px-4 py-2 text-xs font-medium border-b border-amber-500 shadow-xs flex items-center justify-between gap-3 flex-wrap animate-in fade-in">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-black shrink-0" />
            <span>
              <strong>GitHub Update Ready:</strong> "{versionState.latestCommit.message}" (Commit #{versionState.latestCommit.shortSha} by {versionState.latestCommit.author})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGitHubSyncOpen(true)}
              className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-xs text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Review &amp; Approve on PC
            </button>
          </div>
        </div>
      )}

      {/* Interactive Status & Quick Actions Banner (Hidden in Print) */}
      <div className="no-print bg-[#F5F1E6] border-b border-[#E8E4DA] py-2 px-4 text-xs text-[#5F5F59]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[10.5px] text-[#8F6910] tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#B58A18]" />
              PRASHA INFOTECH • TEAM PROFILE BUILDER
            </span>
            <span className="text-[#DFDACF]">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#171817]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Client Confidentiality (Employer Names Masked)</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <span className="font-mono text-[#5F5F59]">
              Active: <strong className="text-[#171817]">{currentProfile.name}</strong> ({currentProfile.specializationTag})
            </span>
            <span className="text-[#DFDACF]">•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-[#8F6910] hover:text-[#B58A18] font-bold inline-flex items-center gap-1 cursor-pointer underline"
            >
              <Download className="w-3 h-3" />
              <span>Export PDF / Print</span>
            </button>
            <span className="text-[#DFDACF]">•</span>
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-[#8F6910] hover:text-[#B58A18] font-bold inline-flex items-center gap-1 cursor-pointer underline"
            >
              <Share2 className="w-3 h-3" />
              <span>Share with Clients</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-[#171817] text-white px-5 py-3 rounded-xs border border-[#B58A18] shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#B58A18]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Canvas */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-8 overflow-x-hidden">
        {/* ================= PRINT LAYOUT (ALWAYS RENDERS IN PRINT) ================= */}
        <div className="hidden print:block space-y-0">
          {viewMode === 'all' ? (
            // Print all profiles sequentially in one document
            allProfiles.map((p, idx) => (
              <React.Fragment key={p.id}>
                <PageOne profile={p} containerId={`print-page-1-${idx}`} />
                <PageTwo profile={p} containerId={`print-page-2-${idx}`} />
              </React.Fragment>
            ))
          ) : (
            // Print active profile only
            <>
              <PageOne profile={currentProfile} containerId="print-page-1-active" />
              <PageTwo profile={currentProfile} containerId="print-page-2-active" />
            </>
          )}
        </div>

        {/* Dedicated Offscreen PDF Export Stage (Always Mounted & Sized for html2canvas) */}
        <div
          id="export-pdf-stage"
          className="no-print pointer-events-none"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '840px',
            zIndex: -100,
            background: '#FFFFFF',
            visibility: 'visible',
            overflow: 'visible',
          }}
          aria-hidden="true"
        >
          <PageOne profile={currentProfile} containerId="export-stage-page-1" />
          <PageTwo profile={currentProfile} containerId="export-stage-page-2" />
        </div>

        {/* ================= SCREEN VIEW MODES (RESPONSIVE) ================= */}
        <div className="print:hidden">
          {/* Live Edit Mode Announcement Banner */}
          {isLiveEditMode && (
            <div className="max-w-4xl mx-auto mb-6 bg-[#FAF9F5] border border-[#B58A18] rounded-sm p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#171817]">
                <Sparkles className="w-4 h-4 text-[#B58A18] shrink-0 animate-pulse" />
                <span>
                  <strong>Interactive In-Place Edit Mode Active:</strong> Click directly on any text, candidate name, stats, or bullet points right here on the page to edit. All edits auto-save.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="px-3 py-1 bg-white border border-[#B58A18] text-[#8F6910] text-[11px] font-bold uppercase rounded-xs cursor-pointer hover:bg-[#FAF9F5]"
                >
                  Open Full Editor
                </button>
                <button
                  onClick={() => setIsLiveEditMode(false)}
                  className="px-3 py-1 bg-[#B58A18] hover:bg-[#8F6910] text-white text-[11px] font-bold uppercase rounded-xs cursor-pointer"
                >
                  Done Editing
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE: SPREAD (2-PAGE SIDE-BY-SIDE) */}
          {viewMode === 'spread' && (
            <div className="max-w-[1780px] mx-auto">
              <div className="flex flex-col 2xl:flex-row items-center 2xl:items-start justify-center gap-8 lg:gap-10">
                {/* Page 1 Sheet */}
                <div className="w-full max-w-[840px]">
                  <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18]" />
                      PAGE 01 // CANDIDATE DOSSIER & CORE EXPERTISE
                    </span>
                    <span className="text-[#8F6910] font-semibold">PRASHA INFOTECH</span>
                  </div>
                  <PageOne 
                    profile={currentProfile} 
                    isLiveEditMode={isLiveEditMode}
                    onUpdate={handleSaveProfile}
                    onOpenEditModal={() => setIsEditOpen(true)}
                  />
                </div>

                {/* Page 2 Sheet */}
                <div className="w-full max-w-[840px]">
                  <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B58A18]" />
                      PAGE 02 // EXPERIENCE & TECHNICAL MATRIX
                    </span>
                    <span className="text-[#8F6910] font-semibold">PRASHA INFOTECH</span>
                  </div>
                  <PageTwo 
                    profile={currentProfile} 
                    isLiveEditMode={isLiveEditMode}
                    onUpdate={handleSaveProfile}
                    onOpenEditModal={() => setIsEditOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE: PAGE 1 ONLY */}
          {viewMode === 'page1' && (
            <div className="max-w-[840px] mx-auto">
              <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                <span>PAGE 01 // CANDIDATE DOSSIER & CORE EXPERTISE</span>
                <span className="text-[#8F6910] font-semibold">PAGE 1 OF 2</span>
              </div>
              <PageOne 
                profile={currentProfile} 
                isLiveEditMode={isLiveEditMode}
                onUpdate={handleSaveProfile}
                onOpenEditModal={() => setIsEditOpen(true)}
              />
            </div>
          )}

          {/* VIEW MODE: PAGE 2 ONLY */}
          {viewMode === 'page2' && (
            <div className="max-w-[840px] mx-auto">
              <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                <span>PAGE 02 // EXPERIENCE & TECHNICAL MATRIX</span>
                <span className="text-[#8F6910] font-semibold">PAGE 2 OF 2</span>
              </div>
              <PageTwo 
                profile={currentProfile} 
                isLiveEditMode={isLiveEditMode}
                onUpdate={handleSaveProfile}
                onOpenEditModal={() => setIsEditOpen(true)}
              />
            </div>
          )}

          {/* VIEW MODE: STACKED (CONTINUOUS VERTICAL) */}
          {viewMode === 'stack' && (
            <div className="max-w-[840px] mx-auto space-y-10">
              <div>
                <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                  <span>PAGE 01 // CANDIDATE DOSSIER & CORE EXPERTISE</span>
                  <span className="text-[#8F6910] font-semibold">PAGE 1 OF 2</span>
                </div>
                <PageOne 
                  profile={currentProfile} 
                  isLiveEditMode={isLiveEditMode}
                  onUpdate={handleSaveProfile}
                  onOpenEditModal={() => setIsEditOpen(true)}
                />
              </div>

              <div>
                <div className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-widest mb-2 flex items-center justify-between px-2">
                  <span>PAGE 02 // EXPERIENCE & TECHNICAL MATRIX</span>
                  <span className="text-[#8F6910] font-semibold">PAGE 2 OF 2</span>
                </div>
                <PageTwo 
                  profile={currentProfile} 
                  isLiveEditMode={isLiveEditMode}
                  onUpdate={handleSaveProfile}
                  onOpenEditModal={() => setIsEditOpen(true)}
                />
              </div>
            </div>
          )}

          {/* VIEW MODE: ALL PROFILES (UNIFIED TEAM BOOKLET) */}
          {viewMode === 'all' && (
            <div className="max-w-[1780px] mx-auto space-y-12">
              <div className="bg-[#FFFFFF] border border-[#B58A18]/50 p-6 rounded-sm shadow-sm max-w-4xl mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF9F5] border border-[#B58A18]/40 rounded-xs text-xs font-mono font-bold text-[#8F6910]">
                  <FileCheck className="w-4 h-4 text-[#B58A18]" />
                  <span>UNIFIED TEAM DOSSIER • {allProfiles.length} DEVELOPER PROFILES</span>
                </div>
                <h2 className="text-xl font-bold font-heading uppercase text-[#171817]">
                  Continuous Team Presentation Booklet ({allProfiles.length * 2} Pages Total)
                </h2>
                <p className="text-xs text-[#5F5F59] max-w-xl mx-auto">
                  All team members formatted into the Prasha Infotech client-facing standard with previous employer names scrubbed. Ready for client submission.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="px-6 py-2.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Booklet</span>
                  </button>
                  <button
                    onClick={() => setViewMode('spread')}
                    className="px-4 py-2.5 bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#171817] border border-[#DFDACF] text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    Return to Single Profile
                  </button>
                </div>
              </div>

              {allProfiles.map((p, idx) => (
                <div key={p.id} className="pt-6 border-t-2 border-[#E8E4DA]">
                  <div className="max-w-[840px] mx-auto mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-heading text-[#8F6910] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
                      Profile 0{idx + 1} of 0{allProfiles.length}: {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#5F5F59] uppercase px-2 py-0.5 bg-white border border-[#E8E4DA] rounded-xs">
                      {p.specializationTag}
                    </span>
                  </div>

                  <div className="flex flex-col 2xl:flex-row items-center 2xl:items-start justify-center gap-8 lg:gap-10">
                    <div className="w-full max-w-[840px]">
                      <PageOne profile={p} />
                    </div>
                    <div className="w-full max-w-[840px]">
                      <PageTwo profile={p} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Screen Footer (Hidden in Print) */}
      <footer className="no-print border-t border-[#E8E4DA] bg-[#FFFFFF] py-6 px-4 text-xs text-[#5F5F59]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
            <span className="font-heading font-extrabold uppercase tracking-widest text-[#171817]">
              PRASHA INFOTECH
            </span>
            <span>• Team Profile Builder</span>
            <span className="text-[#DFDACF]">|</span>
            <span className="text-[#8F6910] font-mono text-[11px]">
              {allProfiles.length} Team Members Loaded
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-[#8F6910] hover:text-[#B58A18] font-semibold cursor-pointer underline"
            >
              Export Resumes (PDF)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-[#8F6910] hover:text-[#B58A18] font-semibold cursor-pointer underline"
            >
              Share with Clients
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDesktopGuideOpen(true)}
              className="text-[#8F6910] hover:text-[#B58A18] font-semibold cursor-pointer underline"
            >
              Use on Mac/Windows
            </button>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/prasha-infotech-3b8536325/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5F5F59] hover:text-[#171817] font-mono"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="https://www.prashainfotech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5F5F59] hover:text-[#171817] font-mono"
            >
              www.prashainfotech.com
            </a>
          </div>
        </div>
      </footer>

      {/* 6-Tab Admin Editor Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={currentProfile}
        onSave={handleSaveProfile}
        onReset={handleResetProfile}
      />

      {/* Team Profiles Manager Drawer */}
      <TeamProfilesDrawer
        isOpen={isTeamDrawerOpen}
        onClose={() => setIsTeamDrawerOpen(false)}
        profiles={allProfiles}
        activeProfileId={currentProfile.id}
        onSelectProfile={handleSelectProfile}
        onEditProfile={(p) => {
          setCurrentProfile(p);
          setIsEditOpen(true);
        }}
        onDuplicateProfile={handleDuplicateProfile}
        onDeleteProfile={handleDeleteProfile}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportAllProfiles={() => setIsExportOpen(true)}
        onNewProfile={handleCreateBlankProfile}
      />

      {/* Bulk Import Modal (PDF / DOCX / Text) */}
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAddProfiles={handleAddProfiles}
        onLoadPreloadedProfile={handleLoadPreloadedProfile}
      />

      {/* Export & Download PDF Center Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentProfile={currentProfile}
        allProfiles={allProfiles}
        onOpenDesktopGuide={() => setIsDesktopGuideOpen(true)}
      />

      {/* Share Resumes with Clients Modal */}
      <ShareClientModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        currentProfile={currentProfile}
        allProfiles={allProfiles}
        onSelectProfile={handleSelectProfile}
      />

      {/* Mac & Windows Desktop App Installation Guide Modal */}
      <DesktopAppGuideModal
        isOpen={isDesktopGuideOpen}
        onClose={() => setIsDesktopGuideOpen(false)}
      />

      {/* Admin Authentication Modal (Email/Password + OTP Verification) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={adminUser}
        onLogout={handleLogout}
      />

      {/* GitHub Sync & PC Auto-Updater Modal */}
      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        profiles={allProfiles}
        onUpdateApproved={(commit) => {
          setVersionState(GitHubUpdateService.getVersionState());
          notify(`PC update approved! Synchronized to commit #${commit.shortSha}`);
        }}
      />
    </div>
  );
}
