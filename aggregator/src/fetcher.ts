import { Octokit } from '@octokit/rest';

export interface FetchResult {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Initialize Octokit with GitHub token from environment
 */
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN environment variable is not set. Please set it to your GitHub Personal Access Token.'
    );
  }
  return new Octokit({ auth: token });
}

/**
 * Fetch a file from GitHub repository
 */
export async function fetchFileFromGitHub(
  repo: string,
  filePath: string,
  branch: string = 'main'
): Promise<FetchResult> {
  try {
    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      return {
        success: false,
        error: `Invalid repo format: ${repo}. Expected format: owner/repo`,
      };
    }

    const octokit = getOctokit();

    // Try to get the file content
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
        ref: branch,
      });

      // Handle both file and directory responses
      if (Array.isArray(response.data)) {
        return {
          success: false,
          error: `Path ${filePath} is a directory, not a file`,
        };
      }

      // Decode the content (GitHub API returns base64 encoded content)
      if ('content' in response.data && response.data.encoding === 'base64') {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return {
          success: true,
          content,
        };
      }

      return {
        success: false,
        error: 'Unexpected response format from GitHub API',
      };
    } catch (error: any) {
      // Handle GitHub API errors
      if (error.status === 404) {
        return {
          success: false,
          error: `File not found: ${filePath} in ${repo}`,
        };
      }
      if (error.status === 403) {
        return {
          success: false,
          error: `Access forbidden. Check token permissions and rate limits.`,
        };
      }
      throw error;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error fetching file',
    };
  }
}

/**
 * Fetch project summary file from GitHub
 * Tries common branch names (main, master) if branch is not specified
 */
export async function fetchProjectFile(
  repo: string,
  filePath: string,
  branch?: string
): Promise<FetchResult> {
  // If branch is specified, try that first
  if (branch) {
    const result = await fetchFileFromGitHub(repo, filePath, branch);
    if (result.success) {
      return result;
    }
  }

  // Try common branch names
  const branches = ['main', 'master'];
  for (const branchName of branches) {
    const result = await fetchFileFromGitHub(repo, filePath, branchName);
    if (result.success) {
      return result;
    }
    // If it's a 404, try next branch
    // If it's another error (403, etc.), return that error
    if (result.error && !result.error.includes('not found')) {
      return result;
    }
  }

  // If all branches failed, return the last error
  return {
    success: false,
    error: `File not found in any branch (tried: ${branches.join(', ')})`,
  };
}


