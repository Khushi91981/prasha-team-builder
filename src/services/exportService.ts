import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DeveloperProfile } from '../types';

/**
 * Sanitizes a candidate name for a clean filename
 */
function sanitizeFilename(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Direct PDF generation of a single profile (Page 1 + Page 2)
 * using html2canvas and jsPDF. Bypasses browser iframe print restrictions.
 */
export async function exportSingleProfileToPdf(
  profile: DeveloperProfile,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    onProgress?.('Initializing high-resolution renderer...');

    // First try to find the dedicated offscreen export stage pages
    let page1El = document.getElementById('export-stage-page-1');
    let page2El = document.getElementById('export-stage-page-2');

    // Fallback: search for visible screen pages with dimensions > 0
    if (!page1El || page1El.offsetWidth === 0) {
      const allPage1s = document.querySelectorAll('#profile-page-1, [data-page="1"]');
      for (const el of Array.from(allPage1s)) {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetWidth > 100 && htmlEl.offsetHeight > 100) {
          page1El = htmlEl;
          break;
        }
      }
    }

    if (!page2El || page2El.offsetWidth === 0) {
      const allPage2s = document.querySelectorAll('#profile-page-2, [data-page="2"]');
      for (const el of Array.from(allPage2s)) {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetWidth > 100 && htmlEl.offsetHeight > 100) {
          page2El = htmlEl;
          break;
        }
      }
    }

    // If still missing, grab any available
    if (!page1El) page1El = document.getElementById('profile-page-1');
    if (!page2El) page2El = document.getElementById('profile-page-2');

    if (!page1El) {
      throw new Error('Profile Page 1 could not be located in the DOM.');
    }

    onProgress?.('Rendering Page 1 (Dossier & Core Expertise)...');

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const renderOpts = {
      scale: 2, // 2x for sharp 300 DPI text & gold foil borders
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1200,
      ignoreElements: (el: Element) => el.classList.contains('no-print'),
    };

    // Render Page 1
    const canvas1 = await html2canvas(page1El, renderOpts);
    const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    // Render Page 2 if available
    if (page2El) {
      onProgress?.('Rendering Page 2 (Experience & Technical Matrix)...');
      const canvas2 = await html2canvas(page2El, renderOpts);
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
      pdf.addPage('a4', 'portrait');
      pdf.addImage(imgData2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    onProgress?.('Saving PDF document...');
    const filename = `${sanitizeFilename(profile.name)}_Prasha_Infotech_Profile.pdf`;
    pdf.save(filename);

    onProgress?.('Complete!');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: If html2canvas fails due to browser iframe constraints, download standalone HTML
    onProgress?.('PDF render restricted by browser sandbox. Triggering standalone HTML export...');
    exportProfileToStandaloneHtml(profile);
    throw error;
  }
}

/**
 * Direct PDF generation of all profiles into a combined multi-page document.
 */
export async function exportAllProfilesToPdf(
  profiles: DeveloperProfile[],
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const renderOpts = {
      scale: 1.8,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 1200,
      ignoreElements: (el: Element) => el.classList.contains('no-print'),
    };

    let pageAdded = false;

    // Find all visible print pages or render pages
    const printPages = Array.from(document.querySelectorAll('.print-page')).filter((el) => {
      const htmlEl = el as HTMLElement;
      // Skip hidden print template elements
      return htmlEl.closest('.hidden') === null && (htmlEl.offsetWidth > 0 || htmlEl.id.startsWith('export-stage'));
    });

    if (printPages.length === 0) {
      // Fallback to standalone HTML booklet
      exportAllProfilesToStandaloneHtml(profiles);
      return true;
    }

    for (let i = 0; i < printPages.length; i++) {
      const pageEl = printPages[i] as HTMLElement;
      onProgress?.(`Rendering page ${i + 1} of ${printPages.length}...`);

      const canvas = await html2canvas(pageEl, renderOpts);
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (pageAdded) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pageAdded = true;
    }

    onProgress?.('Saving combined team booklet...');
    pdf.save(`PRASHA_INFOTECH_Team_Profiles_Booklet_${profiles.length}_Members.pdf`);
    return true;
  } catch (error) {
    console.error('Error in batch PDF export:', error);
    exportAllProfilesToStandaloneHtml(profiles);
    throw error;
  }
}

/**
 * Exports a self-contained, standalone HTML dossier file that can be double-clicked
 * on Mac or Windows to view or print as 100% sharp vector PDF.
 */
export function exportProfileToStandaloneHtml(profile: DeveloperProfile): void {
  const linkedinUrl = profile.linkedin || 'https://www.linkedin.com/in/prasha-infotech-3b8536325/';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.name} — Prasha Infotech Developer Profile</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #FAF9F5; color: #171817; line-height: 1.5; padding: 20px; }
    .no-print { text-align: center; margin-bottom: 25px; padding: 15px; background: #FFFFFF; border: 1px solid #B58A18; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .print-btn { background: #B58A18; color: #FFFFFF; border: none; padding: 10px 24px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 3px; cursor: pointer; }
    .print-btn:hover { background: #8F6910; }
    .page { width: 100%; max-width: 820px; min-height: 1100px; margin: 0 auto 30px auto; background: #FFFFFF; border: 1px solid #E8E4DA; padding: 40px; box-shadow: 0 4px 14px rgba(0,0,0,0.05); position: relative; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E8E4DA; padding-bottom: 18px; margin-bottom: 22px; }
    .brand { font-size: 18px; font-weight: 800; letter-spacing: 0.12em; color: #171817; text-transform: uppercase; }
    .brand-sub { font-size: 10px; color: #8F6910; font-family: monospace; font-weight: bold; }
    .badge { font-size: 10px; text-transform: uppercase; font-weight: 700; padding: 4px 10px; background: #FAF9F5; border: 1px solid #B58A18; color: #8F6910; border-radius: 2px; }
    .candidate-name { font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 4px; color: #171817; }
    .candidate-tag { font-size: 13px; font-weight: 700; color: #8F6910; text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-bar { display: flex; flex-wrap: wrap; gap: 15px; font-size: 11px; margin: 12px 0 20px 0; padding: 8px 12px; background: #FAF9F5; border-left: 3px solid #B58A18; }
    .summary { font-size: 12px; line-height: 1.6; color: #3A3B3A; margin-bottom: 24px; text-align: justify; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
    .stat-card { background: #FAF9F5; border: 1px solid #E8E4DA; padding: 12px; text-align: center; border-radius: 3px; }
    .stat-val { font-size: 20px; font-weight: 800; color: #8F6910; font-family: monospace; }
    .stat-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #5F5F59; margin-top: 3px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #171817; border-bottom: 2px solid #B58A18; padding-bottom: 4px; margin-bottom: 14px; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .skill-card { background: #FFFFFF; border: 1px solid #E8E4DA; padding: 12px; border-radius: 3px; }
    .skill-name { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #171817; margin-bottom: 4px; }
    .skill-desc { font-size: 10.5px; color: #5F5F59; line-height: 1.4; }
    .exp-item { margin-bottom: 18px; border-bottom: 1px solid #F0ECE1; padding-bottom: 14px; }
    .exp-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 3px; }
    .exp-role { color: #171817; }
    .exp-period { font-family: monospace; font-size: 10.5px; color: #8F6910; }
    .exp-client { font-size: 11px; color: #5F5F59; margin-bottom: 6px; }
    .exp-bullets { margin-left: 18px; font-size: 11px; color: #3A3B3A; }
    .exp-bullets li { margin-bottom: 4px; line-height: 1.45; }
    .footer { border-top: 1px solid #E8E4DA; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9.5px; color: #5F5F59; font-family: monospace; text-transform: uppercase; }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .no-print { display: none !important; }
      .page { margin: 0; box-shadow: none; border: none; padding: 25px 30px; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <p style="font-size: 11px; color: #5F5F59; margin-top: 8px;">Tip: Select destination "Save as PDF" and paper size "A4" for optimal presentation.</p>
  </div>

  <!-- PAGE 1 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="brand">PRASHA INFOTECH</div>
      </div>
      <div class="badge">Developer Profile • Confidential</div>
    </div>

    <div class="candidate-name">${profile.name}</div>
    <div class="candidate-tag">${profile.title} • ${profile.specializationTag}</div>

    <div class="meta-bar">
      <div><strong>Profile ID:</strong> ${profile.id}</div>
      <div><strong>Role:</strong> ${profile.subtitle}</div>
      <div><strong>Official LinkedIn:</strong> <a href="${linkedinUrl}" target="_blank" style="color:#8F6910; text-decoration:none;">Prasha Infotech</a></div>
    </div>

    <div class="section-title">Executive Summary</div>
    <div class="summary">${profile.summary}</div>

    <div class="stats-grid">
      ${profile.snapshotStats
        .map(
          (s) => `
        <div class="stat-card">
          <div class="stat-val">${s.value}</div>
          <div class="stat-lbl">${s.label}</div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section-title">Core Expertise &amp; Technical Domains</div>
    <div class="skills-grid">
      ${profile.coreExpertise
        .map(
          (c) => `
        <div class="skill-card">
          <div class="skill-name">${c.category}</div>
          <div class="skill-desc">${c.skills.join(' • ')}</div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer" style="position: absolute; bottom: 25px; left: 40px; right: 40px;">
      <span>Prasha Infotech Client Dossier</span>
      <span>Confidential • Page 1 of 2</span>
      <span>${profile.id}</span>
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="page">
    <div class="header">
      <div>
        <div class="brand">PRASHA INFOTECH</div>
      </div>
      <div class="badge">${profile.name} • ${profile.id}</div>
    </div>

    <div class="section-title">Professional Experience &amp; Client Engagements</div>
    ${profile.experiences
      .map(
        (exp) => `
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-role">${exp.role}</span>
          <span class="exp-period">${exp.duration}</span>
        </div>
        ${exp.domainSpecialization ? `<div class="exp-client">${exp.domainSpecialization}</div>` : ''}
        <ul class="exp-bullets">
          ${exp.highlights.map((b) => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}

    <div class="section-title" style="margin-top: 20px;">Technical Stack Matrix</div>
    <div style="font-size: 11px; margin-bottom: 20px;">
      ${profile.techStack
        .map(
          (m) => `
        <div style="margin-bottom: 6px;">
          <strong style="color: #8F6910; text-transform: uppercase;">${m.category}:</strong>
          <span style="color: #3A3B3A;"> ${m.items.join(', ')}</span>
        </div>
      `
        )
        .join('')}
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <div class="section-title">Education</div>
        ${profile.education
          .map(
            (edu) => `
          <div style="font-size: 11px; margin-bottom: 6px;">
            <strong>${edu.degree}</strong><br>
            <span style="color: #5F5F59;">${edu.institution} • ${edu.year}</span>
          </div>
        `
          )
          .join('')}
      </div>
      <div>
        <div class="section-title">Certifications</div>
        ${profile.certifications
          .map(
            (cert) => `
          <div style="font-size: 11px; margin-bottom: 6px;">
            <strong>${cert.name}</strong><br>
            <span style="color: #5F5F59;">${cert.issuer} ${cert.year ? `• ${cert.year}` : ''}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="footer" style="position: absolute; bottom: 25px; left: 40px; right: 40px;">
      <span>Prasha Infotech Client Dossier</span>
      <span>Confidential • Page 2 of 2</span>
      <span>${profile.id}</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(profile.name)}_Prasha_Infotech_Profile.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports all profiles into a combined standalone HTML booklet
 */
export function exportAllProfilesToStandaloneHtml(profiles: DeveloperProfile[]): void {
  profiles.forEach((p, idx) => {
    setTimeout(() => {
      exportProfileToStandaloneHtml(p);
    }, idx * 250);
  });
}

/**
 * Exports candidate profile as a formatted Word Document (.doc)
 * Opens cleanly in MS Word, Google Docs, Apple Pages, and LibreOffice.
 */
export function exportProfileToWordDoc(profile: DeveloperProfile): void {
  const linkedinUrl = profile.linkedin || 'https://www.linkedin.com/in/prasha-infotech-3b8536325/';
  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${profile.name} — Prasha Infotech Profile</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #171817; line-height: 1.35; }
    h1 { font-size: 20pt; color: #171817; margin-bottom: 2pt; text-transform: uppercase; }
    h2 { font-size: 13pt; color: #8F6910; border-bottom: 1.5pt solid #B58A18; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase; }
    h3 { font-size: 11pt; color: #171817; margin-bottom: 1pt; }
    p { margin-bottom: 6pt; }
    .brand { font-size: 14pt; font-weight: bold; color: #B58A18; letter-spacing: 1.5pt; text-transform: uppercase; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; background: #FAF9F5; }
    .meta-table td { padding: 6pt; border: 0.5pt solid #E8E4DA; font-size: 10pt; }
    .stat-table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
    .stat-table td { padding: 8pt; border: 1pt solid #B58A18; text-align: center; background: #FAF9F5; }
    .stat-val { font-size: 16pt; font-weight: bold; color: #8F6910; }
    .stat-lbl { font-size: 8.5pt; color: #5F5F59; text-transform: uppercase; }
    ul { margin-top: 2pt; margin-bottom: 8pt; padding-left: 18pt; }
    li { margin-bottom: 3pt; font-size: 10.5pt; }
  </style>
</head>
<body>
  <div class="brand">PRASHA INFOTECH</div>
  <p style="font-size: 9pt; color: #5F5F59; font-family: monospace;">CONFIDENTIAL // PREPARED FOR CLIENT REVIEW</p>
  <hr style="border: none; border-top: 2pt solid #B58A18;" />

  <h1>${profile.name}</h1>
  <p style="font-size: 12pt; font-weight: bold; color: #8F6910;">${profile.title} • ${profile.specializationTag}</p>

  <table class="meta-table">
    <tr>
      <td><strong>Candidate ID:</strong> ${profile.id}</td>
      <td><strong>Role:</strong> ${profile.subtitle}</td>
    </tr>
    <tr>
      <td><strong>Company LinkedIn:</strong> ${linkedinUrl}</td>
      <td><strong>Status:</strong> Available for Immediate Deployment</td>
    </tr>
  </table>

  <h2>Executive Summary</h2>
  <p>${profile.summary}</p>

  <h2>Candidate Metrics Snapshot</h2>
  <table class="stat-table">
    <tr>
      ${profile.snapshotStats
        .map(
          (s) => `
        <td>
          <div class="stat-val">${s.value}</div>
          <div class="stat-lbl">${s.label}</div>
        </td>
      `
        )
        .join('')}
    </tr>
  </table>

  <h2>Core Expertise</h2>
  <ul>
    ${profile.coreExpertise.map((c) => `<li><strong>${c.category}:</strong> ${c.skills.join(', ')}</li>`).join('')}
  </ul>

  <h2>Professional Experience &amp; Client Engagements</h2>
  ${profile.experiences
    .map(
      (e) => `
    <h3>${e.role} | <span style="color: #8F6910;">${e.duration}</span></h3>
    ${e.domainSpecialization ? `<p style="font-style: italic; color: #5F5F59; margin-bottom: 4pt;">${e.domainSpecialization}</p>` : ''}
    <ul>
      ${e.highlights.map((b) => `<li>${b}</li>`).join('')}
    </ul>
  `
    )
    .join('')}

  <h2>Technical Stack Matrix</h2>
  <ul>
    ${profile.techStack.map((m) => `<li><strong>${m.category}:</strong> ${m.items.join(', ')}</li>`).join('')}
  </ul>

  <h2>Education &amp; Credentials</h2>
  <ul>
    ${profile.education.map((edu) => `<li><strong>${edu.degree}</strong> — ${edu.institution} (${edu.year})</li>`).join('')}
    ${profile.certifications.map((cert) => `<li><strong>Certification:</strong> ${cert.name} — ${cert.issuer} ${cert.year ? `(${cert.year})` : ''}</li>`).join('')}
  </ul>

  <hr style="border: none; border-top: 1pt solid #E8E4DA; margin-top: 20pt;" />
  <p style="font-size: 8.5pt; color: #5F5F59; text-align: center;">PRASHA INFOTECH • Enterprise Engineering &amp; Client Talent Delivery • All Rights Reserved</p>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + docContent], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(profile.name)}_Prasha_Infotech_Profile.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads all profiles as a clean JSON backup file
 */
export function exportProfilesToJson(profiles: DeveloperProfile[]): void {
  const dataStr = JSON.stringify(profiles, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prasha_team_profiles_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
