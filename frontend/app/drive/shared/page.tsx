"use client"

import { DriveContent } from "@/components/drive/drive-content"

const sharedFiles = [
  {
    id: "1",
    name: "Q4 Report.pdf",
    type: "file" as const,
    mimeType: "application/pdf",
    size: 4.2 * 1024 * 1024,
    modifiedTime: new Date("2024-01-10"),
    owner: "Sarah Johnson",
    shared: true,
    starred: false,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Design Assets",
    type: "folder" as const,
    size: 0,
    modifiedTime: new Date("2024-01-08"),
    owner: "Mike Chen",
    shared: true,
    starred: true,
    itemCount: 24,
  },
  {
    id: "3",
    name: "Client Presentation.pptx",
    type: "file" as const,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 8.7 * 1024 * 1024,
    modifiedTime: new Date("2024-01-05"),
    owner: "Emily Davis",
    shared: true,
    starred: false,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
]

export default function SharedPage() {
  const handleFileAction = (action: string, file: any) => {
    console.log("Action:", action, "File:", file)
  }

  return (
    <DriveContent files={sharedFiles} currentPath="Shared with me" onFileAction={handleFileAction} showOwner={true} />
  )
}
