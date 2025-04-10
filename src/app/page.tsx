"use client"

import type React from "react"

export const metadata = {
  title: "GitHub Issues Dashboard",
  description: "Analyze GitHub repository issues with ease.",
}

import IssuesList from "@/components/issues-list"
import IssuesMetrics from "@/components/issues-metrics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeeklyChart from "@/components/weekly-chart"
import { processIssuesData } from "@/lib/data-processing"
import { fetchRepositoryIssues } from "@/lib/github-api"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [repoInput, setRepoInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [issuesData, setIssuesData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!repoInput || !repoInput.includes("/")) {
      setError("Please enter a valid repository name in the format 'owner/repo'")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const issues = await fetchRepositoryIssues(repoInput)
      const processedData = processIssuesData(issues)
      setIssuesData(processedData)
    } catch (err: any) {
      setError(err.message || "Failed to fetch repository issues")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">GitHub Repository Issues Dashboard</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter repository name (e.g., facebook/react)"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Analyze Issues"
                )}
              </Button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {issuesData && (
          <div className="space-y-8">
            <IssuesMetrics data={issuesData} />

            <Tabs defaultValue="weekly-count">
              <TabsList className="mb-4">
                <TabsTrigger value="weekly-count">Weekly Issue Count</TabsTrigger>
                <TabsTrigger value="new-vs-closed">New vs Closed Ratio</TabsTrigger>
                <TabsTrigger value="closure-rate">Weekly Closure Rate</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly-count">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Issue Count (Last 10 Weeks)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklyChart data={issuesData.weeklyData} dataKey="totalIssues" label="Issue Count" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="new-vs-closed">
                <Card>
                  <CardHeader>
                    <CardTitle>New vs Closed Issues Ratio (Last 10 Weeks)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklyChart data={issuesData.weeklyData} dataKey="newVsClosedRatio" label="Ratio" isRatio={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="closure-rate">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Closure Rate (Last 10 Weeks)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklyChart
                      data={issuesData.weeklyData}
                      dataKey="closureRate"
                      label="Closure Rate"
                      isPercentage={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <IssuesList issues={issuesData.issues} />
          </div>
        )}
      </div>
    </main>
  )
}
