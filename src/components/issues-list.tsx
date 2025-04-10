"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { useState } from "react"

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

interface IssuesListProps {
  issues: Issue[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const issuesPerPage = 10

  const indexOfLastIssue = currentPage * issuesPerPage
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue)
  const totalPages = Math.ceil(issues.length / issuesPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">View All Issues</Button>
        </DialogTrigger>
        <DialogContent className="min-w-min max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Repository Issues</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Closed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>#{issue.number}</TableCell>
                    <TableCell>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {issue.title}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={issue.state === "open" ? "outline" : "default"}>{issue.state}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(issue.created_at)}</TableCell>
                    <TableCell>{issue.closed_at ? formatDate(issue.closed_at) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 ? i + 1 : currentPage + i - 2

                  if (pageNumber > totalPages) return null

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
