"use client"

import { DriveContent } from "@/components/drive/drive-content"
import { Button } from "@/components/ui/button"
import { Trash2, RotateCcw } from "lucide-react"

const trashedFiles = [
  {
    id: "1",
    name: "Old Presentation.pptx",
    type: "file" as const,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 6.8 * 1024 * 1024,
    modifiedTime: new Date("2024-01-05"),
    deletedTime: new Date("2024-01-14"),
    owner: "You",
    shared: false,
    starred: false,
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Unused Images",
    type: "folder" as const,
    size: 0,
    modifiedTime: new Date("2024-01-03"),
    deletedTime: new Date("2024-01-13"),
    owner: "You",
    shared: false,
    starred: false,
    itemCount: 15,
  },
]

export default function TrashPage() {
  const handleFileAction = (action: string, file: any) => {
    console.log("Action:", action, "File:", file)
  }

  return (
    <div>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Trash</h1>
            <p className="text-sm text-gray-600 mt-1">Items in trash will be automatically deleted after 30 days</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore all
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Empty trash
            </Button>
          </div>
        </div>
      </div>
      <DriveContent
        files={trashedFiles}
        currentPath="Trash"
        onFileAction={handleFileAction}
        showDeletedTime={true}
        isTrash={true}
      />
    </div>
  )
}
