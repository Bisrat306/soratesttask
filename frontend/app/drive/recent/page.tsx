"use client"

import { DriveContent } from "@/components/drive/drive-content"

const recentFiles = [
  {
    id: "1",
    name: "Meeting Notes.docx",
    type: "file" as const,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 0.8 * 1024 * 1024,
    modifiedTime: new Date("2024-01-15T14:30:00"),
    owner: "You",
    shared: false,
    starred: false,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Budget Analysis.xlsx",
    type: "file" as const,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 2.1 * 1024 * 1024,
    modifiedTime: new Date("2024-01-15T11:20:00"),
    owner: "You",
    shared: true,
    starred: false,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Project Timeline.pdf",
    type: "file" as const,
    mimeType: "application/pdf",
    size: 1.5 * 1024 * 1024,
    modifiedTime: new Date("2024-01-14T16:45:00"),
    owner: "John Smith",
    shared: true,
    starred: true,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
]

export default function RecentPage() {
  const handleFileAction = (action: string, file: any) => {
    console.log("Action:", action, "File:", file)
  }

  return <DriveContent files={recentFiles} currentPath="Recent" onFileAction={handleFileAction} showOwner={true} />
}
