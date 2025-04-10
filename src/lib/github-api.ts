const MAX_ISSUES = 1000
const PER_PAGE = 100

export async function fetchRepositoryIssues(repo: string) {
  const [owner, repoName] = repo.split("/")

  if (!owner || !repoName) {
    throw new Error('Invalid repository format. Please use "owner/repo"')
  }

  let allIssues: any[] = []
  let page = 1
  let hasMoreIssues = true

  // Fetch issues page by page until we have MAX_ISSUES or there are no more issues
  while (hasMoreIssues && allIssues.length < MAX_ISSUES) {
    const url = `https://api.github.com/repos/${owner}/${repoName}/issues?state=all&per_page=${PER_PAGE}&page=${page}&sort=created&direction=desc`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Repository not found. Please check the repository name.")
      } else if (response.status === 403) {
        throw new Error("API rate limit exceeded. Please try again later.")
      } else {
        throw new Error(`GitHub API error: ${response.status}`)
      }
    }

    const issues = await response.json()

    if (issues.length === 0) {
      hasMoreIssues = false
    } else {
      allIssues = [...allIssues, ...issues]
      page++
    }
  }

  return allIssues.slice(0, MAX_ISSUES)
}
