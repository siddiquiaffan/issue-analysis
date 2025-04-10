interface Issue {
  id: number
  number: number
  title: string
  state: string
  created_at: string
  closed_at: string | null
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

interface WeekData {
  weekLabel: string
  startDate: string
  endDate: string
  newIssues: number
  closedIssues: number
  openAtStart: number
  totalIssues: number
  newVsClosedRatio: number
  closureRate: number
}

export function processIssuesData(issues: Issue[]) {
  // Sort issues by creation date (newest first)
  const sortedIssues = [...issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Count issues by status
  const statusCounts = {
    open: issues.filter((issue) => issue.state === "open").length,
    closed: issues.filter((issue) => issue.state === "closed").length,
    total: issues.length,
  }

  // Process weekly data (last 10 weeks)
  const weeklyData = getWeeklyData(issues)

  // Calculate average weekly closure rate
  const validWeeks = weeklyData.filter((week) => week.openAtStart > 0 || week.newIssues > 0)

  const averageWeeklyClosureRate =
    validWeeks.length > 0 ? validWeeks.reduce((sum, week) => sum + week.closureRate, 0) / validWeeks.length : 0

  return {
    issues: sortedIssues,
    statusCounts,
    weeklyData,
    averageWeeklyClosureRate,
  }
}

function getWeeklyData(issues: Issue[]): WeekData[] {
  // Find the date range for the last 10 weeks
  const now = new Date()
  const tenWeeksAgo = new Date()
  tenWeeksAgo.setDate(now.getDate() - 70) // 10 weeks * 7 days

  // Create array of week boundaries
  const weeks: { start: Date; end: Date; label: string }[] = []

  for (let i = 0; i < 10; i++) {
    const endDate = new Date(now)
    endDate.setDate(now.getDate() - i * 7)

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    // Format week label (e.g., "Apr 1-7")
    const startMonth = startDate.toLocaleString("default", { month: "short" })
    const endMonth = endDate.toLocaleString("default", { month: "short" })

    let label = ""
    if (startMonth === endMonth) {
      label = `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`
    } else {
      label = `${startMonth} ${startDate.getDate()}-${endMonth} ${endDate.getDate()}`
    }

    weeks.unshift({ start: startDate, end: endDate, label })
  }

  // Process data for each week
  return weeks.map((week) => {
    // Count new issues created during this week
    const newIssues = issues.filter((issue) => {
      const createdDate = new Date(issue.created_at)
      return createdDate >= week.start && createdDate <= week.end
    }).length

    // Count issues closed during this week
    const closedIssues = issues.filter((issue) => {
      if (!issue.closed_at) return false
      const closedDate = new Date(issue.closed_at)
      return closedDate >= week.start && closedDate <= week.end
    }).length

    // Count issues that were open at the start of the week
    const openAtStart = issues.filter((issue) => {
      const createdDate = new Date(issue.created_at)

      // Issue was created before the start of the week
      if (createdDate < week.start) {
        // If it's closed, check if it was closed after the start of the week
        if (issue.closed_at) {
          const closedDate = new Date(issue.closed_at)
          return closedDate >= week.start
        }
        // If it's not closed, it was open at the start of the week
        return true
      }

      return false
    }).length

    // Calculate new vs closed ratio
    const newVsClosedRatio = closedIssues > 0 ? newIssues / closedIssues : newIssues > 0 ? Number.POSITIVE_INFINITY : 0

    // Calculate closure rate
    // (Number of Issues closed in the week) / ((Number of Issues open at start) + (Number of Issues newly added))
    const denominator = openAtStart + newIssues
    const closureRate = denominator > 0 ? closedIssues / denominator : 0

    return {
      weekLabel: week.label,
      startDate: week.start.toISOString(),
      endDate: week.end.toISOString(),
      newIssues,
      closedIssues,
      openAtStart,
      totalIssues: newIssues + openAtStart - closedIssues,
      newVsClosedRatio: newVsClosedRatio === Number.POSITIVE_INFINITY ? newIssues : newVsClosedRatio,
      closureRate,
    }
  })
}
