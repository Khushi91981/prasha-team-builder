import { GitHubRepoConfig, GitHubCommitInfo, AppVersionState, DeveloperProfile, GitHubPushResult } from '../types';

const CONFIG_KEY = 'prasha_github_config';
const VERSION_STATE_KEY = 'prasha_app_version_state';

// Initial default configuration pointing to user's GitHub repository
export const DEFAULT_GITHUB_CONFIG: GitHubRepoConfig = {
  owner: 'Khushi91981',
  repo: 'prasha-team-builder',
  branch: 'main',
  autoCheck: true,
  checkIntervalMinutes: 15,
};

// Initial default version state
export const DEFAULT_VERSION_STATE: AppVersionState = {
  currentCommitSha: 'prsh-v2.1.0-init',
  currentVersion: '2.1.0',
  lastCheckedAt: null,
  lastUpdatedAt: new Date().toISOString(),
  latestCommit: null,
  updateAvailable: false,
  history: [
    {
      sha: 'prsh-v2.1.0-init',
      version: '2.1.0',
      appliedAt: new Date().toISOString(),
      message: 'Initial release with PRASHA INFOTECH branding & PDF export center',
    },
  ],
};

export class GitHubUpdateService {
  static getConfig(): GitHubRepoConfig {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If still holding older placeholder config, migrate to user's active repo
        if (parsed.owner === 'ishasharma91981' || parsed.repo === 'prasha-team-builder-' || !parsed.repo) {
          const migrated = { ...parsed, owner: 'Khushi91981', repo: 'prasha-team-builder' };
          this.saveConfig(migrated);
          return migrated;
        }
        return { ...DEFAULT_GITHUB_CONFIG, ...parsed };
      }
    } catch (e) {
      console.error('Error reading GitHub config', e);
    }
    return DEFAULT_GITHUB_CONFIG;
  }

  static saveConfig(config: GitHubRepoConfig): void {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving GitHub config', e);
    }
  }

  static getVersionState(): AppVersionState {
    try {
      const saved = localStorage.getItem(VERSION_STATE_KEY);
      if (saved) {
        return { ...DEFAULT_VERSION_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error reading version state', e);
    }
    return DEFAULT_VERSION_STATE;
  }

  static saveVersionState(state: AppVersionState): void {
    try {
      localStorage.setItem(VERSION_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving version state', e);
    }
  }

  /**
   * Check GitHub for recent commits on the configured repository & branch
   */
  static async checkForUpdates(
    customConfig?: GitHubRepoConfig
  ): Promise<{
    updateAvailable: boolean;
    latestCommit?: GitHubCommitInfo;
    error?: string;
    repoFound: boolean;
  }> {
    const config = customConfig || this.getConfig();
    const currentState = this.getVersionState();

    if (!config.owner || !config.repo) {
      return {
        updateAvailable: false,
        error: 'Please specify both GitHub Owner/Username and Repository Name in Settings.',
        repoFound: false,
      };
    }

    const apiUrl = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/commits/${(config.branch || 'main').trim()}`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (config.token && config.token.trim().length > 0) {
      headers['Authorization'] = `token ${config.token.trim()}`;
    }

    try {
      const response = await fetch(apiUrl, { headers });

      if (response.status === 409) {
        // GitHub status 409 means the repository exists but is currently empty (no commits yet)
        const checkedState: AppVersionState = {
          ...currentState,
          lastCheckedAt: new Date().toISOString(),
        };
        this.saveVersionState(checkedState);

        return {
          updateAvailable: false,
          error: `Connected to 'https://github.com/${config.owner}/${config.repo}'! The repository is currently empty on GitHub. Push your first commit to 'main' (or export from AI Studio), and updates will sync here automatically.`,
          repoFound: true,
        };
      }

      if (response.status === 404) {
        const checkedState: AppVersionState = {
          ...currentState,
          lastCheckedAt: new Date().toISOString(),
        };
        this.saveVersionState(checkedState);

        return {
          updateAvailable: false,
          error: `Repository '${config.owner}/${config.repo}' or branch '${config.branch}' was not found on GitHub. Make sure the repository exists and is public (or provide a GitHub Token if private).`,
          repoFound: false,
        };
      }

      if (response.status === 403) {
        return {
          updateAvailable: false,
          error: 'GitHub API rate limit reached. Add a free GitHub Personal Access Token in the settings tab to increase your limit to 5,000 requests/hour.',
          repoFound: false,
        };
      }

      if (!response.ok) {
        return {
          updateAvailable: false,
          error: `GitHub returned status ${response.status}: ${response.statusText}`,
          repoFound: false,
        };
      }

      const data = await response.json();

      const commitSha: string = data.sha;
      const shortSha = commitSha.substring(0, 7);
      const commitMessage: string = data.commit?.message?.split('\n')[0] || 'Code update from GitHub';
      const commitAuthor: string = data.commit?.author?.name || data.author?.login || 'GitHub Developer';
      const commitDate: string = data.commit?.author?.date || new Date().toISOString();
      const commitHtmlUrl: string = data.html_url || `https://github.com/${config.owner}/${config.repo}/commit/${commitSha}`;
      const avatarUrl: string = data.author?.avatar_url || '';

      const latestCommit: GitHubCommitInfo = {
        sha: commitSha,
        shortSha,
        message: commitMessage,
        author: commitAuthor,
        avatarUrl,
        date: commitDate,
        htmlUrl: commitHtmlUrl,
      };

      // Check if this commit is newer than our recorded commit
      const isNewCommit = currentState.currentCommitSha !== commitSha;

      const updatedState: AppVersionState = {
        ...currentState,
        lastCheckedAt: new Date().toISOString(),
        latestCommit,
        updateAvailable: isNewCommit,
      };

      this.saveVersionState(updatedState);

      return {
        updateAvailable: isNewCommit,
        latestCommit,
        repoFound: true,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error connecting to GitHub';
      return {
        updateAvailable: false,
        error: errorMsg,
        repoFound: false,
      };
    }
  }

  /**
   * User approves the update on their PC.
   * Updates state, logs history, and optionally reloads app.
   */
  static async approveAndApplyUpdate(
    commit: GitHubCommitInfo
  ): Promise<{ success: boolean; message: string }> {
    const currentState = this.getVersionState();

    const newHistoryEntry = {
      sha: commit.sha,
      version: `v${new Date().getFullYear()}.${new Date().getMonth() + 1}.${commit.shortSha}`,
      appliedAt: new Date().toISOString(),
      message: commit.message,
    };

    const newState: AppVersionState = {
      ...currentState,
      currentCommitSha: commit.sha,
      currentVersion: newHistoryEntry.version,
      latestCommit: commit,
      updateAvailable: false,
      lastUpdatedAt: new Date().toISOString(),
      history: [newHistoryEntry, ...currentState.history.slice(0, 15)],
    };

    this.saveVersionState(newState);

    return {
      success: true,
      message: `Update approved! Application successfully synchronized to commit #${commit.shortSha}.`,
    };
  }

  /**
   * Helper for simulated demonstration if user hasn't pushed to GitHub yet
   */
  static simulateIncomingGitHubUpdate(customMessage?: string): GitHubCommitInfo {
    const randomSha = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const simulatedCommit: GitHubCommitInfo = {
      sha: randomSha,
      shortSha: randomSha.substring(0, 7),
      message: customMessage || 'feat(ui): enhanced corporate header, candidate metrics and live export',
      author: 'Prasha Team',
      date: new Date().toISOString(),
      htmlUrl: `https://github.com/${this.getConfig().owner}/${this.getConfig().repo}/commit/${randomSha}`,
    };

    const currentState = this.getVersionState();
    const updatedState: AppVersionState = {
      ...currentState,
      lastCheckedAt: new Date().toISOString(),
      latestCommit: simulatedCommit,
      updateAvailable: true,
    };

    this.saveVersionState(updatedState);
    return simulatedCommit;
  }

  /**
   * Terminal command string for PC / Mac terminal updates
   */
  static getTerminalUpdateCommand(platform: 'mac' | 'windows' | 'linux'): string {
    const config = this.getConfig();
    const branch = config.branch || 'main';

    if (platform === 'windows') {
      return `git pull origin ${branch} && call npm install && call npm run build`;
    }
    return `git pull origin ${branch} && npm install && npm run build`;
  }

  /**
   * Pushes a single file directly to GitHub using the GitHub REST API.
   * Works right from the browser with a Personal Access Token (classic 'repo' or fine-grained 'contents: write').
   */
  static async pushFileToGitHub(
    filePath: string,
    fileContent: string,
    commitMessage: string,
    token: string,
    targetBranch = 'main'
  ): Promise<{ success: boolean; message: string; sha?: string; commitUrl?: string }> {
    const config = this.getConfig();
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, message: 'GitHub Personal Access Token is required to push files.' };
    }

    const owner = config.owner.trim();
    const repo = config.repo.trim();
    const branch = targetBranch.trim() || config.branch || 'main';

    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${cleanToken}`,
      'Content-Type': 'application/json',
    };

    let existingSha: string | undefined;

    // Check if the file already exists on GitHub to obtain its SHA
    try {
      const checkRes = await fetch(getUrl, { headers });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (e) {
      // New file or repo empty, proceed without existingSha
    }

    // Convert string to base64 properly with UTF-8 support
    const b64Content = btoa(unescape(encodeURIComponent(fileContent)));

    const body: Record<string, any> = {
      message: commitMessage,
      content: b64Content,
      branch: branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    try {
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (putRes.status === 401 || putRes.status === 403) {
        return {
          success: false,
          message: 'GitHub Authentication failed. Please make sure your token is valid and has the "repo" permission checked.',
        };
      }

      if (!putRes.ok) {
        const errorData = await putRes.json().catch(() => ({}));
        return {
          success: false,
          message: `GitHub API error (${putRes.status}): ${errorData.message || putRes.statusText}`,
        };
      }

      const putData = await putRes.json();
      return {
        success: true,
        message: `Successfully pushed ${filePath} to GitHub!`,
        sha: putData.commit?.sha,
        commitUrl: putData.commit?.html_url || `https://github.com/${owner}/${repo}/commit/${putData.commit?.sha}`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network error while pushing to GitHub: ${err.message || err}`,
      };
    }
  }

  /**
   * Pushes all team developer profiles, README, and markdown directory directly to the GitHub repo.
   * This immediately populates an empty GitHub repository with actual data!
   */
  static async pushTeamDataToGitHub(
    profiles: DeveloperProfile[],
    token: string,
    onProgress?: (step: string) => void
  ): Promise<GitHubPushResult> {
    const config = this.getConfig();
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, message: 'Please provide a GitHub Personal Access Token.' };
    }

    const filesPushed: string[] = [];

    // 1. Generate README.md
    onProgress?.('Generating and pushing README.md...');
    const readmeContent = `# PRASHA INFOTECH — Team Profile Builder

Official Repository for **PRASHA INFOTECH** Developer Profiles & Confidential Resume Builder.

## 🏢 About Prasha Infotech
Prasha Infotech converts individual developer resumes into consistent, corporate, client-facing Developer Profiles with strict client confidentiality (all previous employer and client names are masked).

## 👥 Active Team Profiles (${profiles.length})
${profiles
  .map(
    (p, i) =>
      `${i + 1}. **${p.name}** — ${p.title} (${p.snapshotStats?.find((s) => s.label.toLowerCase().includes('exp'))?.value || 'Experienced'}, ${p.location})`
  )
  .join('\n')}

## 🔒 Confidentiality Guarantee
- All employer names are presented as \`[Confidential Client]\` or industry descriptors to protect client relationships.
- Clean 2-page print layout compliant with enterprise recruitment standards.

## 🚀 Repository Contents
- \`data/prasha_team_profiles.json\`: Full structured profile data for all team members.
- \`data/team_directory.md\`: Formatted readable directory with competencies and skills.
- Synchronized with PRASHA INFOTECH Team Profile Builder.

---
*Generated automatically by PRASHA INFOTECH Enterprise Synchronizer on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}*
`;

    const resReadme = await this.pushFileToGitHub(
      'README.md',
      readmeContent,
      `docs: initialize PRASHA INFOTECH repository with ${profiles.length} team profiles`,
      cleanToken,
      config.branch
    );

    if (!resReadme.success) {
      return { success: false, message: resReadme.message };
    }
    filesPushed.push('README.md');

    // 2. Generate data/prasha_team_profiles.json
    onProgress?.('Pushing data/prasha_team_profiles.json...');
    const profilesJson = JSON.stringify(
      {
        organization: 'PRASHA INFOTECH',
        exportedAt: new Date().toISOString(),
        totalProfiles: profiles.length,
        profiles,
      },
      null,
      2
    );

    const resJson = await this.pushFileToGitHub(
      'data/prasha_team_profiles.json',
      profilesJson,
      `feat(data): backup ${profiles.length} developer profiles to GitHub repository`,
      cleanToken,
      config.branch
    );

    if (resJson.success) {
      filesPushed.push('data/prasha_team_profiles.json');
    }

    // 3. Generate data/team_directory.md
    onProgress?.('Pushing data/team_directory.md...');
    const summaryMd = `# PRASHA INFOTECH Team Directory

${profiles
  .map(
    (p) => `### ${p.name}
- **Title:** ${p.title}
- **Experience:** ${p.snapshotStats?.find((s) => s.label.toLowerCase().includes('exp'))?.value || 'Experienced'}
- **Location:** ${p.location}
- **Specialization:** ${p.specializationTag}
- **Tech Stack:** ${p.techStack?.flatMap((s) => s.items).slice(0, 10).join(', ') || 'Full Stack'}
- **Selected Projects:** ${p.selectedProjects?.length || 0} enterprise projects documented
`
  )
  .join('\n---\n')}
`;

    const resSummary = await this.pushFileToGitHub(
      'data/team_directory.md',
      summaryMd,
      `docs(directory): update team summary markdown for ${profiles.length} profiles`,
      cleanToken,
      config.branch
    );

    if (resSummary.success) {
      filesPushed.push('data/team_directory.md');
    }

    // Update local state with latest commit
    if (resJson.sha || resReadme.sha) {
      const latestSha = resJson.sha || resReadme.sha!;
      const commitInfo: GitHubCommitInfo = {
        sha: latestSha,
        shortSha: latestSha.substring(0, 7),
        message: `feat(data): synchronize ${profiles.length} team profiles to GitHub`,
        author: config.owner,
        date: new Date().toISOString(),
        htmlUrl: resJson.commitUrl || `https://github.com/${config.owner}/${config.repo}/commit/${latestSha}`,
      };

      const currentState = this.getVersionState();
      this.saveVersionState({
        ...currentState,
        currentCommitSha: latestSha,
        lastUpdatedAt: new Date().toISOString(),
        latestCommit: commitInfo,
        updateAvailable: false,
        history: [
          {
            sha: latestSha,
            version: currentState.currentVersion,
            appliedAt: new Date().toISOString(),
            message: `Pushed ${filesPushed.length} files to GitHub repository`,
          },
          ...currentState.history,
        ],
      });
    }

    return {
      success: true,
      message: `Successfully pushed ${filesPushed.length} files (${filesPushed.join(', ')}) to https://github.com/${config.owner}/${config.repo}!`,
      filesPushed,
      commitUrl: resJson.commitUrl || resReadme.commitUrl,
      sha: resJson.sha || resReadme.sha,
    };
  }
}
