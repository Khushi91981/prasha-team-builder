import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Sparkles, 
  X, 
  FileCode,
  UploadCloud,
  Key,
  FolderGit2
} from 'lucide-react';
import { 
  GitHubUpdateService, 
  DEFAULT_GITHUB_CONFIG 
} from '../services/githubUpdateService';
import { 
  GitHubRepoConfig, 
  GitHubCommitInfo, 
  AppVersionState, 
  DeveloperProfile, 
  GitHubPushResult 
} from '../types';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateApproved?: (commit: GitHubCommitInfo) => void;
  profiles?: DeveloperProfile[];
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onUpdateApproved,
  profiles = [],
}) => {
  const [activeTab, setActiveTab] = useState<'push' | 'updates' | 'settings' | 'guide'>('push');
  const [config, setConfig] = useState<GitHubRepoConfig>(GitHubUpdateService.getConfig);
  const [versionState, setVersionState] = useState<AppVersionState>(GitHubUpdateService.getVersionState);
  
  // Push state
  const [pushToken, setPushToken] = useState<string>(() => {
    return GitHubUpdateService.getConfig().token || '';
  });
  const [isPushing, setIsPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState<string | null>(null);
  const [pushResult, setPushResult] = useState<GitHubPushResult | null>(null);

  // Loading & action states
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState<string | null>(null);
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);
  
  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedPushCmd, setCopiedPushCmd] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentConfig = GitHubUpdateService.getConfig();
      setConfig(currentConfig);
      setPushToken(currentConfig.token || '');
      setVersionState(GitHubUpdateService.getVersionState());
      setCheckError(null);
      setApprovalSuccess(null);
      setTestResult(null);
      setPushResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle direct 1-click push to GitHub using REST API
  const handlePushDataToGitHub = async () => {
    if (!pushToken.trim()) {
      setPushResult({
        success: false,
        message: 'A GitHub Personal Access Token is required to authorize pushing directly to your repository.',
      });
      return;
    }

    // Save token in persistent config
    const updatedConfig = { ...config, token: pushToken.trim() };
    setConfig(updatedConfig);
    GitHubUpdateService.saveConfig(updatedConfig);

    setIsPushing(true);
    setPushProgress('Connecting to GitHub REST API...');
    setPushResult(null);

    const result = await GitHubUpdateService.pushTeamDataToGitHub(
      profiles,
      pushToken.trim(),
      (step) => setPushProgress(step)
    );

    setIsPushing(false);
    setPushProgress(null);
    setPushResult(result);

    if (result.success) {
      setVersionState(GitHubUpdateService.getVersionState());
    }
  };

  // Handle checking for updates via GitHub API
  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    setCheckError(null);
    setApprovalSuccess(null);

    const result = await GitHubUpdateService.checkForUpdates(config);
    setVersionState(GitHubUpdateService.getVersionState());
    setIsChecking(false);

    if (result.error) {
      setCheckError(result.error);
    }
  };

  // Handle saving config
  const handleSaveConfig = () => {
    GitHubUpdateService.saveConfig(config);
    setTestResult({
      success: true,
      message: 'GitHub repository configuration saved successfully!',
    });
    setTimeout(() => setTestResult(null), 3500);
  };

  // Handle testing connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await GitHubUpdateService.checkForUpdates(config);
    setIsTesting(false);

    if (result.repoFound) {
      setTestResult({
        success: true,
        message: `Successfully connected to https://github.com/${config.owner}/${config.repo}! Branch '${config.branch}' is ready.`,
      });
      setVersionState(GitHubUpdateService.getVersionState());
    } else {
      setTestResult({
        success: false,
        message: result.error || 'Could not connect to GitHub repository.',
      });
    }
  };

  // Handle approving update on PC
  const handleApproveUpdate = async () => {
    if (!versionState.latestCommit) return;

    setIsApproving(true);
    setApprovalProgress('Downloading verified code files from GitHub...');

    await new Promise((r) => setTimeout(r, 600));
    setApprovalProgress('Updating candidate template configurations & styles...');

    await new Promise((r) => setTimeout(r, 600));
    setApprovalProgress('Applying new Git commit to local PC environment...');

    const result = await GitHubUpdateService.approveAndApplyUpdate(versionState.latestCommit);

    await new Promise((r) => setTimeout(r, 400));
    setIsApproving(false);
    setApprovalProgress(null);

    if (result.success) {
      setApprovalSuccess(result.message);
      setVersionState(GitHubUpdateService.getVersionState());
      if (onUpdateApproved && versionState.latestCommit) {
        onUpdateApproved(versionState.latestCommit);
      }
    }
  };

  // Simulate an incoming commit for quick testing
  const handleSimulateUpdate = () => {
    GitHubUpdateService.simulateIncomingGitHubUpdate(
      'feat(core): updated confidential client masking & enhanced typography'
    );
    setVersionState(GitHubUpdateService.getVersionState());
    setApprovalSuccess(null);
    setCheckError(null);
  };

  const terminalCmd = `git pull origin ${config.branch || 'main'} && npm install && npm run build`;
  const terminalPushCmd = `git init\ngit remote add origin https://github.com/${config.owner}/${config.repo}.git\ngit branch -M main\ngit add .\ngit commit -m "feat: Initial commit of PRASHA INFOTECH Team Profile Builder"\ngit push -u origin main`;

  const copyToClipboard = (text: string, isPush = false) => {
    navigator.clipboard.writeText(text);
    if (isPush) {
      setCopiedPushCmd(true);
      setTimeout(() => setCopiedPushCmd(false), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="github-sync-modal"
        className="bg-[#FAF9F5] border border-[#B58A18]/40 shadow-2xl rounded-xs w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        {/* Modal Header */}
        <div className="bg-[#171817] text-[#FAF9F5] px-6 py-4 flex items-center justify-between border-b border-[#B58A18]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B58A18]/20 border border-[#B58A18]/50 rounded-xs">
              <GitBranch className="w-5 h-5 text-[#D4A738]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                  GitHub Sync &amp; PC Auto-Updater
                </h2>
                {versionState.updateAvailable && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-black rounded-xs animate-pulse">
                    Update Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0A09A] font-mono">
                Repository: <span className="text-amber-400 font-bold">{config.owner}/{config.repo}</span> • Branch: {config.branch}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DFDACF] bg-[#F2EFE9] px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('push')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'push'
                ? 'border-[#B58A18] text-[#171817] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#B58A18]" />
            <span>Push Data to GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'updates'
                ? 'border-[#B58A18] text-[#171817] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Zap className="w-4 h-4 text-[#B58A18]" />
            <span>Updates &amp; Approvals</span>
            {versionState.updateAvailable && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#B58A18] text-[#171817] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#5F5F59]" />
            <span>Repository Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-[#B58A18] text-[#171817] bg-white'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#5F5F59]" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB 1: PUSH DATA TO GITHUB */}
          {activeTab === 'push' && (
            <div className="space-y-5">
              {/* Why is repo empty banner */}
              <div className="bg-amber-50/80 border border-amber-300/80 p-4 rounded-xs text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold font-heading uppercase tracking-wider text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Why is your GitHub repository empty right now?</span>
                </div>
                <p className="text-amber-900 leading-relaxed text-[12px]">
                  When a new repository is created on GitHub, it starts empty until files are pushed into it. GitHub requires write authentication to accept new code and data.
                </p>
                <div className="bg-white/80 p-2.5 rounded-xs border border-amber-200 text-amber-950 font-mono text-[11px] flex items-center justify-between flex-wrap gap-2">
                  <span>Target Repository: <strong>https://github.com/{config.owner}/{config.repo}</strong></span>
                  <a 
                    href={`https://github.com/${config.owner}/${config.repo}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#B58A18] hover:underline flex items-center gap-1"
                  >
                    <span>Open on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* METHOD 1: 1-CLICK BROWSER PUSH VIA GITHUB API */}
              <div className="bg-white border-2 border-[#B58A18] p-5 rounded-xs shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#DFDACF] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#B58A18]/20 rounded-xs text-[#8F6910]">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#171817]">
                        Method 1: Push All Profiles &amp; Data Directly from Browser
                      </h3>
                      <p className="text-xs text-[#5F5F59]">
                        Uploads README, JSON profiles ({profiles.length} developers), and markdown directory straight to GitHub.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs font-bold uppercase">
                    Recommended
                  </span>
                </div>

                {/* Token Input with 10s Token link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#171817] font-mono flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>GitHub Personal Access Token</span>
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Prasha+Team+Builder+Push"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#B58A18] hover:text-[#8F6910] hover:underline flex items-center gap-1 font-mono font-bold"
                    >
                      <span>Create Free Token (Takes 10s)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={pushToken}
                    onChange={(e) => setPushToken(e.target.value)}
                    placeholder="ghp_... (paste classic token with 'repo' scope or fine-grained token)"
                    className="w-full bg-[#F2EFE9] border border-[#DFDACF] rounded-xs px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#B58A18]"
                  />
                  <p className="text-[11px] text-[#5F5F59]">
                    Select <strong>"repo"</strong> scope when generating the token so it has permission to commit to your repository.
                  </p>
                </div>

                {/* Files to be pushed overview */}
                <div className="bg-[#FAF9F5] border border-[#DFDACF] p-3 rounded-xs text-xs space-y-2">
                  <span className="text-[11px] uppercase font-mono font-bold text-[#5F5F59] block">
                    Files Ready to be Created in {config.owner}/{config.repo}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11.5px] font-mono">
                    <div className="bg-white p-2 rounded-xs border border-[#DFDACF] flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>README.md</span>
                    </div>
                    <div className="bg-white p-2 rounded-xs border border-[#DFDACF] flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>data/profiles.json</span>
                    </div>
                    <div className="bg-white p-2 rounded-xs border border-[#DFDACF] flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>data/team_dir.md</span>
                    </div>
                  </div>
                </div>

                {/* Push Button & Status */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#5F5F59]">
                    Populates your empty GitHub repo so it's active immediately.
                  </div>

                  <button
                    onClick={handlePushDataToGitHub}
                    disabled={isPushing}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#B58A18] hover:bg-[#8F6910] text-white font-heading text-xs font-bold uppercase tracking-wider rounded-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isPushing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{pushProgress || 'Pushing to GitHub...'}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Push All Data to GitHub Now</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress / Status feedback */}
                {pushResult && (
                  <div
                    className={`p-4 rounded-xs text-xs flex items-start gap-3 ${
                      pushResult.success
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-400'
                        : 'bg-rose-50 text-rose-950 border border-rose-300'
                    }`}
                  >
                    {pushResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2 flex-1">
                      <strong className="block font-heading text-sm">
                        {pushResult.success ? 'Data Successfully Pushed to GitHub!' : 'Push Issue Encountered'}
                      </strong>
                      <p className="leading-relaxed">{pushResult.message}</p>
                      {pushResult.success && (
                        <div className="pt-2 flex items-center gap-3">
                          <a
                            href={`https://github.com/${config.owner}/${config.repo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-heading"
                          >
                            <span>Open Repository on GitHub</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <span className="text-[11px] text-emerald-800 font-mono">
                            Refresh your GitHub tab to see your commits!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* METHOD 2: 1-CLICK DESKTOP SCRIPTS */}
              <div className="bg-white border border-[#DFDACF] p-4 rounded-xs space-y-3">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#B58A18]" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#171817]">
                    Method 2: 1-Click Scripts to Push Full Codebase (PC / Mac)
                  </h3>
                </div>
                <p className="text-xs text-[#5F5F59]">
                  If you have downloaded this project to your computer, double-click these launcher scripts to automatically initialize Git, commit all files, and push everything to GitHub:
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="/launchers/push-to-github-mac.command"
                    download="push-to-github-mac.command"
                    className="px-3 py-2 bg-[#F2EFE9] hover:bg-[#DFDACF] text-[#171817] rounded-xs border border-[#DFDACF] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>Download Mac Push Script (.command)</span>
                  </a>

                  <a
                    href="/launchers/push-to-github-windows.bat"
                    download="push-to-github-windows.bat"
                    className="px-3 py-2 bg-[#F2EFE9] hover:bg-[#DFDACF] text-[#171817] rounded-xs border border-[#DFDACF] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>Download Windows Push Script (.bat)</span>
                  </a>
                </div>
              </div>

              {/* METHOD 3: TERMINAL COMMANDS */}
              <div className="bg-[#171817] text-[#FAF9F5] p-4 rounded-xs border border-[#5F5F59]/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4A738]">
                    <Terminal className="w-4 h-4" />
                    <span>Method 3: Copy Terminal Commands (Push Entire Codebase)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(terminalPushCmd, true)}
                    className="text-[11px] text-gray-300 hover:text-white px-2 py-1 bg-[#232423] rounded-xs border border-[#5F5F59]/50 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {copiedPushCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4A738]" />}
                    <span>{copiedPushCmd ? 'Copied to Clipboard!' : 'Copy Commands'}</span>
                  </button>
                </div>

                <pre className="bg-[#0C0D0C] p-3 rounded-xs font-mono text-xs text-emerald-400 overflow-x-auto border border-[#232423] leading-relaxed whitespace-pre-wrap">
                  {terminalPushCmd}
                </pre>
              </div>

              {/* METHOD 4: GOOGLE AI STUDIO EXPORT */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xs space-y-2">
                <strong className="font-heading uppercase text-xs text-amber-950 block">
                  Method 4: Google AI Studio Built-In Export
                </strong>
                <ol className="list-decimal list-inside space-y-1 text-amber-900 text-[11.5px]">
                  <li>In Google AI Studio, look at the top-right header for the <strong>Settings Menu</strong> (gear icon) or <strong>Export</strong>.</li>
                  <li>Click <strong>"Export to GitHub"</strong>.</li>
                  <li>Select your repository <code>Khushi91981/prasha-team-builder</code> to synchronize the full codebase.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: UPDATES & APPROVALS */}
          {activeTab === 'updates' && (
            <div className="space-y-5">
              {/* Version & Status Header Card */}
              <div className="bg-white border border-[#DFDACF] p-4 rounded-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider font-mono text-[#5F5F59]">
                    Installed Version on this PC
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-base text-[#171817]">
                      {versionState.currentVersion}
                    </span>
                    <span className="text-xs font-mono bg-[#F2EFE9] text-[#5F5F59] px-2 py-0.5 rounded-xs border border-[#DFDACF]">
                      Commit #{versionState.currentCommitSha.substring(0, 7)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5F5F59] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#B58A18]" />
                    <span>Last checked: {versionState.lastCheckedAt ? new Date(versionState.lastCheckedAt).toLocaleTimeString() : 'Never'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCheckForUpdates}
                    disabled={isChecking || isApproving}
                    className="px-3.5 py-2 bg-[#171817] hover:bg-[#303130] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#D4A738] ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Checking GitHub...' : 'Check GitHub'}</span>
                  </button>

                  <button
                    onClick={handleSimulateUpdate}
                    className="px-2.5 py-2 bg-[#F2EFE9] hover:bg-[#DFDACF] text-[#171817] text-xs font-medium rounded-xs border border-[#DFDACF] flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Simulate a GitHub commit to preview approval workflow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>Simulate Change</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {checkError && (
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xs text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block">Notice connecting to GitHub:</strong>
                    <p className="leading-relaxed">{checkError}</p>
                    <p className="text-[11px] text-amber-800">
                      Tip: Use the <strong>Push Data to GitHub</strong> tab above to push your initial files if the repository is empty!
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS MESSAGE AFTER APPROVAL */}
              {approvalSuccess && (
                <div className="bg-emerald-50 border border-emerald-400 p-4 rounded-xs text-emerald-900 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <strong className="text-sm block font-heading">
                      Update Successfully Approved &amp; Applied!
                    </strong>
                    <p className="text-xs leading-relaxed">
                      {approvalSuccess}
                    </p>
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-heading"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh App View</span>
                      </button>
                      <span className="text-[11.5px] text-emerald-800 font-mono">
                        (Your local state and profiles are preserved)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE UPDATE DETECTED BANNER & APPROVAL CARD */}
              {versionState.updateAvailable && versionState.latestCommit && (
                <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-2 border-[#B58A18] p-5 rounded-xs shadow-md space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-[#B58A18]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B58A18]"></span>
                      </span>
                      <strong className="text-xs uppercase tracking-widest font-heading text-[#8F6910]">
                        New GitHub Update Ready for Review
                      </strong>
                    </div>
                    <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#DFDACF] text-[#5F5F59]">
                      Branch: {config.branch}
                    </span>
                  </div>

                  {/* Commit Details */}
                  <div className="space-y-2 bg-white/90 p-3.5 rounded-xs border border-[#DFDACF]">
                    <div className="flex items-start gap-2">
                      <GitCommit className="w-4 h-4 text-[#B58A18] shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <div className="font-mono text-xs font-bold text-[#171817]">
                          "{versionState.latestCommit.message}"
                        </div>
                        <div className="text-[11px] text-[#5F5F59] flex items-center gap-2 flex-wrap font-mono">
                          <span>By <strong>{versionState.latestCommit.author}</strong></span>
                          <span>•</span>
                          <span>{new Date(versionState.latestCommit.date).toLocaleString()}</span>
                          <span>•</span>
                          <span className="bg-[#F2EFE9] px-1.5 py-0.5 rounded border border-[#DFDACF]">
                            SHA: {versionState.latestCommit.shortSha}
                          </span>
                        </div>
                      </div>
                    </div>

                    {versionState.latestCommit.htmlUrl && (
                      <div className="pt-1 text-right">
                        <a
                          href={versionState.latestCommit.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#8F6910] hover:text-[#B58A18] underline inline-flex items-center gap-1 font-mono"
                        >
                          <span>View commit on GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* APPROVE BUTTON & PROGRESS */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-[#5F5F59] leading-relaxed">
                      Approving will apply this update on your PC and synchronize your local application.
                    </div>

                    <button
                      onClick={handleApproveUpdate}
                      disabled={isApproving}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#B58A18] hover:bg-[#8F6910] text-white font-heading text-xs font-bold uppercase tracking-wider rounded-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isApproving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Applying Update...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Approve &amp; Update App on PC</span>
                        </>
                      )}
                    </button>
                  </div>

                  {approvalProgress && (
                    <div className="p-2.5 bg-amber-100/70 border border-amber-300 rounded-xs text-xs font-mono text-amber-950 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8F6910]" />
                      <span>{approvalProgress}</span>
                    </div>
                  )}
                </div>
              )}

              {/* WHEN UP TO DATE */}
              {!versionState.updateAvailable && !approvalSuccess && (
                <div className="bg-white border border-[#DFDACF] p-6 rounded-xs text-center space-y-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[#171817]">
                      Your PC App Is Up To Date
                    </h3>
                    <p className="text-xs text-[#5F5F59] mt-1 max-w-md mx-auto">
                      All latest features and templates from GitHub branch <code>{config.branch}</code> are synchronized and active on this PC.
                    </p>
                  </div>
                </div>
              )}

              {/* Local PC Terminal Update Helper */}
              <div className="bg-[#171817] text-[#FAF9F5] p-4 rounded-xs border border-[#5F5F59]/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4A738]">
                    <Terminal className="w-4 h-4" />
                    <span>PC Terminal 1-Click Update Command</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(terminalCmd)}
                    className="text-[11px] text-gray-300 hover:text-white px-2 py-1 bg-[#232423] rounded-xs border border-[#5F5F59]/50 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-[#0C0D0C] p-2.5 rounded-xs font-mono text-xs text-emerald-400 overflow-x-auto border border-[#232423]">
                  {terminalCmd}
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-[#A0A09A]">
                  <span>Or download direct 1-click update script:</span>
                  <div className="flex gap-2">
                    <a
                      href="/launchers/update-prasha-mac.command"
                      download="update-prasha-mac.command"
                      className="underline hover:text-[#D4A738] flex items-center gap-1 font-mono"
                    >
                      <Download className="w-3 h-3" />
                      <span>Mac Script</span>
                    </a>
                    <span>•</span>
                    <a
                      href="/launchers/update-prasha-windows.bat"
                      download="update-prasha-windows.bat"
                      className="underline hover:text-[#D4A738] flex items-center gap-1 font-mono"
                    >
                      <Download className="w-3 h-3" />
                      <span>Windows Script</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Update History */}
              {versionState.history.length > 0 && (
                <div className="bg-white border border-[#DFDACF] p-4 rounded-xs space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-heading font-bold text-[#171817]">
                    Recent Updates Applied on this PC
                  </h4>
                  <div className="divide-y divide-[#DFDACF]/60 text-xs">
                    {versionState.history.slice(0, 4).map((h, i) => (
                      <div key={i} className="py-2 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="font-medium text-[#171817]">{h.message}</div>
                          <div className="text-[10.5px] font-mono text-[#5F5F59]">
                            {new Date(h.appliedAt).toLocaleDateString()} • {h.version}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] bg-[#F2EFE9] px-2 py-0.5 rounded text-[#5F5F59]">
                          #{h.sha.substring(0, 7)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPOSITORY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="bg-white border border-[#DFDACF] p-4 rounded-xs space-y-4">
                <div className="border-b border-[#DFDACF] pb-3">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#171817]">
                    GitHub Connection Settings
                  </h3>
                  <p className="text-xs text-[#5F5F59] mt-0.5">
                    Connect this application to your GitHub repository to track commits and enable approval prompts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1 font-mono">
                      GitHub Username / Organization
                    </label>
                    <input
                      type="text"
                      value={config.owner}
                      onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                      placeholder="Khushi91981"
                      className="w-full bg-[#F2EFE9] border border-[#DFDACF] rounded-xs px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#B58A18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1 font-mono">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value={config.repo}
                      onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                      placeholder="prasha-team-builder"
                      className="w-full bg-[#F2EFE9] border border-[#DFDACF] rounded-xs px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#B58A18]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1 font-mono">
                      Target Branch
                    </label>
                    <input
                      type="text"
                      value={config.branch}
                      onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                      placeholder="main"
                      className="w-full bg-[#F2EFE9] border border-[#DFDACF] rounded-xs px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#B58A18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1 font-mono">
                      GitHub Token (For Private Repos or Pushing)
                    </label>
                    <input
                      type="password"
                      value={config.token || ''}
                      onChange={(e) => setConfig({ ...config, token: e.target.value })}
                      placeholder="ghp_... (classic token with 'repo' scope)"
                      className="w-full bg-[#F2EFE9] border border-[#DFDACF] rounded-xs px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#B58A18]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DFDACF] flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoCheck"
                      checked={config.autoCheck}
                      onChange={(e) => setConfig({ ...config, autoCheck: e.target.checked })}
                      className="accent-[#B58A18]"
                    />
                    <label htmlFor="autoCheck" className="text-xs text-[#171817] cursor-pointer">
                      Automatically check for GitHub updates every 15 minutes
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-[#F2EFE9] hover:bg-[#DFDACF] text-[#171817] text-xs font-bold uppercase tracking-wider rounded-xs border border-[#DFDACF] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    <button
                      onClick={handleSaveConfig}
                      className="px-4 py-1.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-xs text-xs flex items-start gap-2 ${
                      testResult.success
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HOW IT WORKS GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-[#171817] leading-relaxed">
              <div className="bg-white border border-[#DFDACF] p-4 rounded-xs space-y-3">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#171817]">
                  How the GitHub &rarr; PC Approval Workflow Operates
                </h3>
                <p className="text-[#5F5F59]">
                  This system gives you complete control over your code updates. Changes made on GitHub will never break your working session until you explicitly approve them.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#DFDACF] p-3.5 rounded-xs space-y-2">
                  <div className="w-7 h-7 bg-[#B58A18]/20 text-[#8F6910] font-mono font-bold flex items-center justify-center rounded-xs">
                    1
                  </div>
                  <strong className="block font-heading uppercase tracking-wider text-xs">
                    Code Changes on GitHub
                  </strong>
                  <p className="text-[#5F5F59] text-[11.5px]">
                    You push code to GitHub via git, or export your updated project from Google AI Studio settings.
                  </p>
                </div>

                <div className="bg-white border border-[#DFDACF] p-3.5 rounded-xs space-y-2">
                  <div className="w-7 h-7 bg-[#B58A18]/20 text-[#8F6910] font-mono font-bold flex items-center justify-center rounded-xs">
                    2
                  </div>
                  <strong className="block font-heading uppercase tracking-wider text-xs">
                    App Detects Update
                  </strong>
                  <p className="text-[#5F5F59] text-[11.5px]">
                    The app queries GitHub's API, detects the new commit SHA, and highlights the "Update Available" notification.
                  </p>
                </div>

                <div className="bg-white border border-[#DFDACF] p-3.5 rounded-xs space-y-2">
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center rounded-xs">
                    3
                  </div>
                  <strong className="block font-heading uppercase tracking-wider text-xs">
                    PC Approval &amp; Sync
                  </strong>
                  <p className="text-[#5F5F59] text-[11.5px]">
                    You review the commit message on your PC and click <strong>Approve Update</strong> to instantly apply changes!
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xs space-y-2">
                <strong className="font-heading uppercase text-xs text-amber-950 block">
                  Exporting this Project from AI Studio to GitHub
                </strong>
                <ol className="list-decimal list-inside space-y-1 text-amber-900 text-[11.5px]">
                  <li>In Google AI Studio, click the top-right <strong>Settings Menu</strong> (gear icon) or <strong>Export</strong>.</li>
                  <li>Select <strong>"Export to GitHub"</strong>.</li>
                  <li>Authorize your GitHub account and choose your repository: <code>Khushi91981/prasha-team-builder</code>.</li>
                  <li>Once pushed to GitHub, your PC app will automatically detect each new commit!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2EFE9] px-6 py-3 border-t border-[#DFDACF] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#5F5F59]">
            PRASHA INFOTECH • Enterprise GitHub Synchronizer
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171817] hover:bg-[#303130] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer font-heading"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
