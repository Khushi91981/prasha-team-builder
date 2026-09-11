export interface SnapshotStat {
  value: string;
  label: string;
  subtext?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  duration: string;
  domainSpecialization?: string;
  location?: string;
  highlights: string[];
  /** Internal tracking only - strictly hidden from client view */
  rawEmployerName?: string;
  /** Whether employer identity is hidden (Default: true) */
  hideEmployer: boolean;
}

export interface TechStackCategory {
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  description: string;
  impact: string;
  technologies: string[];
  /** Whether client/company identity is masked (Default: true) */
  hideClientIdentity: boolean;
  rawClientName?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface DeveloperProfile {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  specializationTag: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  snapshotStats: SnapshotStat[];
  coreExpertise: SkillCategory[];
  experiences: ExperienceItem[];
  techStack: TechStackCategory[];
  selectedProjects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  // Source & Privacy metadata
  sourceFileName?: string;
  sourceText?: string;
  dateProcessed?: string;
  hideAllEmployers: boolean;
  hideAllClientNames: boolean;
}

export interface UploadedFileItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  extension: 'pdf' | 'doc' | 'docx' | 'txt';
  status: 'pending' | 'extracting' | 'parsed' | 'error';
  errorMessage?: string;
  profileId?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'editor';
  isAuthenticated: boolean;
  loginMethod: 'email_otp' | 'google' | 'password';
  lastLogin?: string;
}

export interface GitHubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
  autoCheck: boolean;
  checkIntervalMinutes: number;
}

export interface GitHubCommitInfo {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  avatarUrl?: string;
  date: string;
  htmlUrl: string;
}

export interface AppVersionState {
  currentCommitSha: string;
  currentVersion: string;
  lastCheckedAt: string | null;
  lastUpdatedAt: string | null;
  latestCommit: GitHubCommitInfo | null;
  updateAvailable: boolean;
  history: Array<{
    sha: string;
    version: string;
    appliedAt: string;
    message: string;
  }>;
}

export interface GitHubPushResult {
  success: boolean;
  message: string;
  filesPushed?: string[];
  commitUrl?: string;
  sha?: string;
}
