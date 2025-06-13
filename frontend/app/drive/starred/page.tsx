"use client"

import { DriveContent } from "@/components/drive/drive-content"

const starredFiles = [
  {
    id: "1",
    name: "Important Contract.pdf",
    type: "file" as const,
    mimeType: "application/pdf",
    size: 3.2 * 1024 * 1024,
    modifiedTime: new Date("2024-01-12"),
    owner: "You",
    shared: false,
    starred: true,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Key Resources",
    type: "folder" as const,
    size: 0,
    modifiedTime: new Date("2024-01-10"),
    owner: "You",
    shared: true,
    starred: true,
    itemCount: 8,
  },
  {
    id: "3",
    name: "Annual Report.docx",
    type: "file" as const,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 5.4 * 1024 * 1024,
    modifiedTime: new Date("2024-01-08"),
    owner: "Lisa Wilson",
    shared: true,
    starred: true,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
]

export default function StarredPage() {
  const handleFileAction = (action: string, file: any) => {
    console.log("Action:", action, "File:", file)
  }

  return <DriveContent files={starredFiles} currentPath="Starred" onFileAction={handleFileAction} showOwner={true} />
}
