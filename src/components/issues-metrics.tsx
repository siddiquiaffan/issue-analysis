import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IssuesMetricsProps {
  data: {
    statusCounts: {
      open: number
      closed: number
      total: number
    }
    averageWeeklyClosureRate: number
  }
}

export default function IssuesMetrics({ data }: IssuesMetricsProps) {
  const { statusCounts, averageWeeklyClosureRate } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{statusCounts.total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Open Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-500">{statusCounts.open}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Closed Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-500">{statusCounts.closed}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Avg Weekly Closure Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-500">{(averageWeeklyClosureRate * 100).toFixed(1)}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
