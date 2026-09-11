import React, { useState } from 'react';
import { PrashaLogo } from './PrashaLogo';
import { 
  X, 
  Laptop, 
  Apple, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  Download, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FolderArchive,
  FileCode,
  Layers
} from 'lucide-react';

interface DesktopAppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopAppGuideModal: React.FC<DesktopAppGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'pwa' | 'package' | 'local'>('tools');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const macNativefierCmd = `npx nativefier --name "Prasha Team Builder" --title-bar-style hidden --icon public/logo.png "${window.location.origin}"`;
  const winNativefierCmd = `npx nativefier --name "Prasha Team Builder" --icon public/logo.png "${window.location.origin}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171817]/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#B58A18] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Gold Banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <PrashaLogo size="sm" showSubtitle={false} />
            <div className="h-4 w-px bg-[#DFDACF]" />
            <span className="text-[11px] font-mono font-bold text-[#8F6910] uppercase tracking-wider">
              Mac & Windows App Installation & Tool Files
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[#5F5F59] hover:text-[#171817] hover:bg-[#E8E4DA] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-2 border-b border-[#E8E4DA] flex items-center gap-4 bg-white overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'border-[#B58A18] text-[#8F6910]'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>1. Download Tool Files</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'border-[#B58A18] text-[#8F6910]'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>2. 1-Click Desktop App (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'package'
                ? 'border-[#B58A18] text-[#8F6910]'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>3. Package Standalone (.dmg / .exe)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'local'
                ? 'border-[#B58A18] text-[#8F6910]'
                : 'border-transparent text-[#5F5F59] hover:text-[#171817]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#B58A18]" />
            <span>4. Source Code (Node.js)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: TOOL FILES */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F5] border border-[#B58A18]/40 p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
                  <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                    Ready-to-Use Desktop Tool Files
                  </h4>
                </div>
                <p className="text-xs text-[#5F5F59] leading-relaxed">
                  Download the tool files below to run or compile the Prasha Infotech Team Profile Builder directly on your Mac or Windows computer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Windows Tool File */}
                <div className="bg-[#FFFFFF] border border-[#E8E4DA] p-4 rounded-sm flex flex-col justify-between space-y-3 hover:border-[#B58A18]/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#171817]">
                      <div className="w-7 h-7 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <span>Windows Tool File</span>
                        <div className="text-[10px] font-mono text-[#8F6910] font-semibold lowercase">
                          start-prasha-windows.bat
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#5F5F59] mt-2 leading-relaxed">
                      Double-clickable batch launcher for Windows 10/11. Automatically checks dependencies and launches the desktop tool with one click.
                    </p>
                  </div>

                  <a
                    href="/launchers/start-prasha-windows.bat"
                    download="start-prasha-windows.bat"
                    className="w-full py-2 bg-[#FAF9F5] hover:bg-[#B58A18] text-[#8F6910] hover:text-white border border-[#B58A18]/60 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Windows Launcher (.bat)</span>
                  </a>
                </div>

                {/* Mac Tool File */}
                <div className="bg-[#FFFFFF] border border-[#E8E4DA] p-4 rounded-sm flex flex-col justify-between space-y-3 hover:border-[#B58A18]/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#171817]">
                      <div className="w-7 h-7 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                        <Apple className="w-4 h-4" />
                      </div>
                      <div>
                        <span>macOS Tool File</span>
                        <div className="text-[10px] font-mono text-[#8F6910] font-semibold lowercase">
                          start-prasha-mac.command
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#5F5F59] mt-2 leading-relaxed">
                      Double-clickable macOS script. Double-click in Finder to start the application and open your browser automatically.
                    </p>
                  </div>

                  <a
                    href="/launchers/start-prasha-mac.command"
                    download="start-prasha-mac.command"
                    className="w-full py-2 bg-[#FAF9F5] hover:bg-[#B58A18] text-[#8F6910] hover:text-white border border-[#B58A18]/60 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Mac Launcher (.command)</span>
                  </a>
                </div>

                {/* Native Packager Tool */}
                <div className="md:col-span-2 bg-[#FAF9F5] border border-[#E8E4DA] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#171817]">
                      <FileCode className="w-4 h-4 text-[#B58A18]" />
                      <span>Native Executable Builder Script (DMG &amp; EXE Packager)</span>
                    </div>
                    <p className="text-xs text-[#5F5F59] mt-1">
                      Shell script that packages the web app into a single native Mac .app/.dmg or Windows .exe executable with custom Prasha Infotech icon.
                    </p>
                  </div>
                  <a
                    href="/launchers/package-native-desktop.sh"
                    download="package-native-desktop.sh"
                    className="px-4 py-2 bg-[#171817] hover:bg-[#282928] text-white rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>Download Packager Script</span>
                  </a>
                </div>

                {/* GitHub Auto-Update 1-Click Launchers */}
                <div className="md:col-span-2 bg-[#171817] text-[#FAF9F5] p-4 rounded-sm border border-[#B58A18]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#D4A738]">
                      <Sparkles className="w-4 h-4 text-[#D4A738]" />
                      <span>GitHub Auto-Update Scripts (Mac &amp; Windows)</span>
                    </div>
                    <p className="text-xs text-[#A0A09A] mt-1">
                      Run this script on your PC whenever you want to pull and install approved updates from your GitHub repo in 1-click.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <a
                      href="/launchers/update-prasha-mac.command"
                      download="update-prasha-mac.command"
                      className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-white text-[#171817] rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>Mac Auto-Update</span>
                    </a>
                    <a
                      href="/launchers/update-prasha-windows.bat"
                      download="update-prasha-windows.bat"
                      className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-white text-[#171817] rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B58A18]" />
                      <span>Windows Auto-Update</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Alert for Mac Gatekeeper & npx not found */}
              <div className="bg-amber-50/90 border-2 border-amber-400/80 p-4 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900 font-heading">
                  <Apple className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Mac Help: Fixing "Unidentified Developer" or "command not found: npx"</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Gatekeeper Error */}
                  <div className="bg-white/80 p-3 rounded-xs border border-amber-300">
                    <strong className="text-amber-950 block mb-1">
                      ⚠️ "Cannot be opened because it is from an unidentified developer"
                    </strong>
                    <p className="text-amber-900 leading-relaxed text-[11.5px] mb-2">
                      macOS Gatekeeper blocks downloaded scripts from the web by default.
                    </p>
                    <div className="font-semibold text-emerald-800 text-[11.5px] space-y-1">
                      <div><strong>Easy Fix (2 clicks):</strong></div>
                      <div>1. <strong>Right-click</strong> (or hold Control + click) on <code className="bg-amber-100 px-1 py-0.5 rounded">start-prasha-mac.command</code></div>
                      <div>2. Click <strong>"Open"</strong> from the popup menu</div>
                      <div>3. Click the <strong>"Open"</strong> button in the dialog</div>
                    </div>
                  </div>

                  {/* npx not found */}
                  <div className="bg-white/80 p-3 rounded-xs border border-amber-300">
                    <strong className="text-amber-950 block mb-1">
                      ⚠️ "zsh: command not found: npx"
                    </strong>
                    <p className="text-amber-900 leading-relaxed text-[11.5px] mb-2">
                      Your Mac does not have <strong>Node.js</strong> installed yet.
                    </p>
                    <div className="space-y-1.5 text-[11.5px]">
                      <div>
                        1. Download the macOS installer from <a href="https://nodejs.org/" target="_blank" rel="noreferrer" className="text-amber-900 underline font-bold">nodejs.org</a>.
                      </div>
                      <div>
                        2. Double-click the downloaded <code>.pkg</code> file and follow the installer.
                      </div>
                      <div>
                        3. Re-open Terminal and commands will work!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Alternative */}
                <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xs flex items-center justify-between gap-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>No terminal needed!</strong> Use the <strong>"1-Click Desktop App (PWA)"</strong> tab to install straight to your Mac Dock &amp; Applications folder in 2 seconds.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('pwa')}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-[11px] font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Switch to 1-Click
                  </button>
                </div>
              </div>

              {/* Quick Instructions */}
              <div className="p-3.5 bg-white border border-[#DFDACF] rounded-xs space-y-2 text-xs text-[#5F5F59]">
                <strong className="text-[#171817] uppercase tracking-wider block">
                  How to Use the Tool Files:
                </strong>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    Export the project code via Google AI Studio's top-right <strong>Settings &gt; Export as ZIP</strong>.
                  </li>
                  <li>
                    Unzip the folder on your Mac or Windows computer and place the downloaded launcher tool file into that folder.
                  </li>
                  <li>
                    Double-click <strong>start-prasha-windows.bat</strong> (on Windows) or <strong>start-prasha-mac.command</strong> (on Mac).
                  </li>
                  <li>
                    The tool starts your local server and opens the application immediately!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: PWA 1-CLICK */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F5] border border-[#B58A18]/40 p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#B58A18]" />
                  <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                    Zero-Install Desktop App (Direct from Browser)
                  </h4>
                </div>
                <p className="text-xs text-[#5F5F59] leading-relaxed">
                  This web application is configured with a Progressive Web App (PWA) manifest. You can install it directly onto macOS or Windows as a standalone application running in its own desktop window with zero browser bars!
                </p>
              </div>

              {/* Dual OS instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* macOS */}
                <div className="bg-[#FFFFFF] border border-[#E8E4DA] p-4 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#171817]">
                    <div className="w-6 h-6 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                      <Apple className="w-3.5 h-3.5" />
                    </div>
                    <span>For Mac Users (macOS)</span>
                  </div>

                  <ol className="text-xs text-[#5F5F59] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      Open this application in <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong> on your Mac.
                    </li>
                    <li>
                      In Chrome/Edge: Look at the top right of the URL bar and click the <strong>Install App</strong> icon (or menu ⋮ &gt; <em>"Install PRASHA INFOTECH Team Profile Builder..."</em>).
                    </li>
                    <li>
                      In Safari: Click <strong>File &gt; Add to Dock</strong>.
                    </li>
                    <li>
                      The app will appear in your Mac <strong>Dock</strong> and <strong>/Applications</strong> folder just like a native Mac app!
                    </li>
                  </ol>
                </div>

                {/* Windows */}
                <div className="bg-[#FFFFFF] border border-[#E8E4DA] p-4 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase font-heading text-[#171817]">
                    <div className="w-6 h-6 rounded-xs bg-[#FAF9F5] border border-[#B58A18]/40 flex items-center justify-center text-[#B58A18]">
                      <Laptop className="w-3.5 h-3.5" />
                    </div>
                    <span>For Windows Users (10 / 11)</span>
                  </div>

                  <ol className="text-xs text-[#5F5F59] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      Open this application in <strong>Microsoft Edge</strong> or <strong>Google Chrome</strong>.
                    </li>
                    <li>
                      Click the <strong>"App available - Install"</strong> icon in the address bar (or menu &gt; <em>"Apps &gt; Install this site as an app"</em>).
                    </li>
                    <li>
                      Click <strong>Install</strong>.
                    </li>
                    <li>
                      The app launches in a dedicated desktop window and adds a shortcut to your <strong>Windows Start Menu</strong> and <strong>Taskbar</strong>!
                    </li>
                  </ol>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Advantage:</strong> Instant launch, runs in its own dedicated window, full keyboard shortcuts, and automatically updates.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGE STANDALONE */}
          {activeTab === 'package' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Package as Standalone Native Desktop Binary (.dmg / .exe)
                </h4>
                <p className="text-xs text-[#5F5F59] mt-0.5 leading-relaxed">
                  You can convert this tool into a standalone compiled desktop installer for distribution to colleagues using <strong>Nativefier</strong> or <strong>Electron</strong>.
                </p>
              </div>

              {/* Mac Command */}
              <div className="bg-[#FAF9F5] border border-[#E8E4DA] p-4 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-heading text-[#171817] flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>macOS Terminal Command (Generates .app / .dmg)</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(macNativefierCmd, 'mac')}
                    className="text-[11px] font-mono text-[#8F6910] hover:text-[#B58A18] flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copiedCmd === 'mac' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#171817] text-[#FAF9F5] p-3 rounded-xs font-mono text-[11px] overflow-x-auto select-all">
                  {macNativefierCmd}
                </div>
              </div>

              {/* Windows Command */}
              <div className="bg-[#FAF9F5] border border-[#E8E4DA] p-4 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-heading text-[#171817] flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#B58A18]" />
                    <span>Windows PowerShell Command (Generates .exe installer)</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(winNativefierCmd, 'win')}
                    className="text-[11px] font-mono text-[#8F6910] hover:text-[#B58A18] flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copiedCmd === 'win' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#171817] text-[#FAF9F5] p-3 rounded-xs font-mono text-[11px] overflow-x-auto select-all">
                  {winNativefierCmd}
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#B58A18]/40 rounded-xs text-xs text-[#5F5F59]">
                <strong className="text-[#171817]">Prerequisites:</strong> Requires Node.js installed on your computer. Running the command creates a ready-to-use folder containing the standalone executable.
              </div>
            </div>
          )}

          {/* TAB 4: RUN LOCALLY */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold font-heading uppercase text-[#171817]">
                  Run Locally from Source Code (Mac & Windows)
                </h4>
                <p className="text-xs text-[#5F5F59] mt-0.5 leading-relaxed">
                  Download the project as a ZIP or clone from GitHub to run 100% locally on your machine.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] border border-[#E8E4DA] rounded-sm">
                  <span className="w-6 h-6 rounded-full bg-[#B58A18] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-[#171817] uppercase">
                      Download the Code
                    </h5>
                    <p className="text-[11px] text-[#5F5F59] mt-0.5">
                      In Google AI Studio, click the top right <strong>Settings</strong> icon &gt; click <strong>"Export as ZIP"</strong> or <strong>"Push to GitHub"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] border border-[#E8E4DA] rounded-sm">
                  <span className="w-6 h-6 rounded-full bg-[#B58A18] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-[#171817] uppercase">
                      Extract & Install Dependencies
                    </h5>
                    <p className="text-[11px] text-[#5F5F59] mt-0.5">
                      Open Terminal (Mac) or PowerShell (Windows), navigate to the folder and run:
                    </p>
                    <div className="mt-2 bg-[#171817] text-[#FAF9F5] p-2.5 rounded-xs font-mono text-[11px]">
                      npm install
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAF9F5] border border-[#E8E4DA] rounded-sm">
                  <span className="w-6 h-6 rounded-full bg-[#B58A18] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-[#171817] uppercase">
                      Launch Local Server
                    </h5>
                    <div className="mt-2 bg-[#171817] text-[#FAF9F5] p-2.5 rounded-xs font-mono text-[11px]">
                      npm run dev
                    </div>
                    <p className="text-[11px] text-[#5F5F59] mt-1.5">
                      Open <strong>http://localhost:3000</strong> in your browser. All profiles and parsing work completely locally!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E4DA] bg-[#FAF9F5] flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-[#5F5F59]">
            PRASHA INFOTECH • Enterprise Deployment Guide
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase rounded-xs cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
