import React from 'react';
import { DeveloperProfile, AdminUser, GitHubCommitInfo } from '../types';
import { 
  Columns, 
  FileText, 
  Layers,
  ChevronDown,
  Users,
  UploadCloud,
  ShieldCheck,
  FileCheck,
  Download,
  Share2,
  Laptop,
  Plus,
  KeyRound,
  Sparkles,
  Edit3,
  GitBranch
} from 'lucide-react';

interface ToolbarProps {
  currentProfile: DeveloperProfile;
  availableProfiles: DeveloperProfile[];
  onSelectProfile: (profile: DeveloperProfile) => void;
  viewMode: 'spread' | 'page1' | 'page2' | 'stack' | 'all';
  onChangeViewMode: (mode: 'spread' | 'page1' | 'page2' | 'stack' | 'all') => void;
  onOpenEditModal: () => void;
  onOpenTeamDrawer: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onOpenShareModal: () => void;
  onOpenDesktopGuide: () => void;
  onOpenGitHubSync?: () => void;
  updateAvailable?: boolean;
  latestCommit?: GitHubCommitInfo | null;
  onOpenAdminModal: () => void;
  onNewProfile: () => void;
  adminUser: AdminUser | null;
  isLiveEditMode?: boolean;
  onToggleLiveEdit?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentProfile,
  availableProfiles,
  onSelectProfile,
  viewMode,
  onChangeViewMode,
  onOpenEditModal,
  onOpenTeamDrawer,
  onOpenImportModal,
  onOpenExportModal,
  onOpenShareModal,
  onOpenDesktopGuide,
  onOpenGitHubSync,
  updateAvailable = false,
  latestCommit,
  onOpenAdminModal,
  onNewProfile,
  adminUser,
  isLiveEditMode = false,
  onToggleLiveEdit
}) => {
  return (
    <nav className="no-print sticky top-0 z-40 bg-[#171817] text-[#FAF9F5] border-b border-[#B58A18]/40 px-3 sm:px-6 py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        {/* Left: Brand Identity, Profile Switcher & Admin Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 pr-3 border-r border-[#5F5F59]/40">
            <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
            <span className="font-heading font-extrabold text-xs uppercase tracking-[0.16em] text-[#FFFFFF]">
              PRASHA INFOTECH
            </span>
            <span className="text-[10px] text-[#B58A18] font-mono tracking-wider font-bold">
              TEAM BUILDER
            </span>
          </div>

          {/* Active Profile Dropdown Switcher */}
          <div className="relative inline-block">
            <select
              value={currentProfile.id}
              onChange={(e) => {
                const found = availableProfiles.find((p) => p.id === e.target.value);
                if (found) {
                  onSelectProfile(found);
                  if (viewMode === 'all') onChangeViewMode('spread');
                }
              }}
              className="bg-[#232423] text-xs font-medium text-[#FAF9F5] border border-[#5F5F59]/50 rounded-xs pl-2.5 pr-8 py-1.5 focus:outline-hidden focus:border-[#B58A18] cursor-pointer appearance-none max-w-[210px] truncate"
            >
              {availableProfiles.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#171817] text-[#FAF9F5]">
                  {p.name} ({p.specializationTag})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#B58A18] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Team Drawer Trigger */}
          <button
            onClick={onOpenTeamDrawer}
            className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#232423] hover:bg-[#303130] text-[#FAF9F5] border border-[#B58A18]/40 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Open Team Roster & Manage Resumes"
          >
            <Users className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>Roster ({availableProfiles.length})</span>
          </button>

          {/* Admin Create / Import buttons */}
          <button
            onClick={adminUser ? onNewProfile : onOpenAdminModal}
            className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#232423] hover:bg-[#303130] text-[#FAF9F5] border border-[#5F5F59]/50 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Create a new developer profile from scratch"
          >
            <Plus className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>+ New Profile</span>
          </button>

          <button
            onClick={adminUser ? onOpenImportModal : onOpenAdminModal}
            className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18]/20 hover:bg-[#B58A18]/30 text-[#D4A738] border border-[#B58A18]/50 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Import PDF / Word resumes"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>Import</span>
          </button>
        </div>

        {/* Center: View Mode Toggles */}
        <div className="flex items-center gap-1 bg-[#232423] p-1 rounded-xs border border-[#5F5F59]/40 self-start xl:self-auto flex-wrap">
          <button
            onClick={() => onChangeViewMode('spread')}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'spread'
                ? 'bg-[#B58A18] text-white'
                : 'text-[#FAF9F5]/70 hover:text-white hover:bg-white/5'
            }`}
            title="Two-Page Spread"
          >
            <Columns className="w-3 h-3" />
            <span>Spread</span>
          </button>

          <button
            onClick={() => onChangeViewMode('page1')}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'page1'
                ? 'bg-[#B58A18] text-white'
                : 'text-[#FAF9F5]/70 hover:text-white hover:bg-white/5'
            }`}
            title="View Page 1 only"
          >
            <FileText className="w-3 h-3" />
            <span>Page 1</span>
          </button>

          <button
            onClick={() => onChangeViewMode('page2')}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'page2'
                ? 'bg-[#B58A18] text-white'
                : 'text-[#FAF9F5]/70 hover:text-white hover:bg-white/5'
            }`}
            title="View Page 2 only"
          >
            <Layers className="w-3 h-3" />
            <span>Page 2</span>
          </button>

          <button
            onClick={() => onChangeViewMode('stack')}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'stack'
                ? 'bg-[#B58A18] text-white'
                : 'text-[#FAF9F5]/70 hover:text-white hover:bg-white/5'
            }`}
            title="Stacked vertical flow"
          >
            <span>Stacked</span>
          </button>

          <button
            onClick={() => onChangeViewMode('all')}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'all'
                ? 'bg-[#B58A18] text-white'
                : 'text-[#D4A738] hover:text-white hover:bg-white/5'
            }`}
            title="All Team Profiles in one document"
          >
            <FileCheck className="w-3 h-3" />
            <span>All ({availableProfiles.length})</span>
          </button>
        </div>

        {/* Right: Actions & Live Edit */}
        <div className="flex items-center gap-2 flex-wrap self-start xl:self-auto">
          {/* Live Edit On/Off Toggle */}
          {onToggleLiveEdit && (
            <button
              onClick={onToggleLiveEdit}
              className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
                isLiveEditMode
                  ? 'bg-[#B58A18] text-white border-[#D4A738] shadow-xs'
                  : 'bg-[#232423] text-[#D4A738] border-[#B58A18]/50 hover:bg-[#303130]'
              }`}
              title="Click to edit any text directly on the resume page"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A738]" />
              <span>{isLiveEditMode ? 'Live Edit: ON' : 'Live Edit'}</span>
            </button>
          )}

          {/* Edit All Profile Text Modal */}
          <button
            onClick={adminUser ? onOpenEditModal : onOpenAdminModal}
            className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#232423] hover:bg-[#303130] text-[#FAF9F5] border border-[#5F5F59]/50 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Edit all text in resume"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>Edit Text</span>
          </button>

          {/* Desktop App & Tool Files */}
          <button
            onClick={onOpenDesktopGuide}
            className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#232423] hover:bg-[#303130] text-[#FAF9F5] border border-[#5F5F59]/50 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download Tool Files and Install on Mac or Windows"
          >
            <Laptop className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>Desktop Tool</span>
          </button>

          {/* GitHub Sync & PC Updates */}
          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
                updateAvailable
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-xs animate-pulse hover:bg-amber-500/30'
                  : 'bg-[#232423] text-[#FAF9F5] border-[#5F5F59]/50 hover:bg-[#303130]'
              }`}
              title={
                updateAvailable
                  ? `GitHub update available: "${latestCommit?.message || 'New commit'}" - Click to review & approve on PC`
                  : 'Connect GitHub & manage updates on PC'
              }
            >
              <GitBranch className={`w-3.5 h-3.5 ${updateAvailable ? 'text-amber-400' : 'text-[#B58A18]'}`} />
              <span>{updateAvailable ? 'Update (PC)' : 'GitHub'}</span>
              {updateAvailable && (
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          )}

          {/* Share Resumes with Clients */}
          <button
            onClick={onOpenShareModal}
            className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#232423] hover:bg-[#303130] text-[#FAF9F5] border border-[#5F5F59]/50 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Share multiple profiles with clients via link or pitch"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>Share</span>
          </button>

          {/* Primary Export Button */}
          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#B58A18] hover:bg-[#8F6910] text-white rounded-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            title="Direct Download PDF or Print"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Admin Auth Status / Login */}
          <button
            onClick={onOpenAdminModal}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
              adminUser?.isAuthenticated
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
                : 'bg-[#232423] text-[#FAF9F5] border-[#B58A18]/50 hover:bg-[#303130]'
            }`}
            title={adminUser?.isAuthenticated ? `Logged in as Admin: ${adminUser.email}` : 'Sign in as Administrator'}
          >
            {adminUser?.isAuthenticated ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[85px] truncate">Admin</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-[#B58A18]" />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
