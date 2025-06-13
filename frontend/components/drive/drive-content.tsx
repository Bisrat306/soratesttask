"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { Breadcrumbs } from "./breadcrumbs"
import { LayoutGrid, List, SortAsc, Upload, FolderPlus, Filter } from "lucide-react"
import { FileUploadModal } from "./file-upload-modal"
import { CreateFolderModal } from "./create-folder-modal"
import { ShareModal } from "./share-modal"
import { toast } from "sonner"

interface DriveContentProps {
  files: any[]
  folders: any[]
  currentPath: string
  onUpload: (file: File) => Promise<any>
  onCreateFolder: (name: string) => Promise<any>
  onShare: (id: string, type: "file" | "folder") => Promise<void>
  onPreview: (file: any) => Promise<void>
  onStar: (id: string, type: "file" | "folder") => Promise<void>
  onDelete: (item:any) => Promise<any>
  onRename: (item:any, newName: string) => Promise<any>
  onFolderClick: (folder: any) => void
  onBack: () => void
  loadContent: () => Promise<any>
  isLoading: boolean
}

export function DriveContent({
  files = [],
  folders = [],
  currentPath,
  onUpload,
  onCreateFolder,
  onShare,
  onPreview,
  onStar,
  onDelete,
  onRename,
  onFolderClick,
  onBack,
  loadContent,
  isLoading,
}: DriveContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [renameTarget, setRenameTarget] = useState<any>(null)
  const [renameModalOpen, setRenameModalOpen] = useState(false)

  // Combine folders and files for display
  const allItems = [
    ...folders,
    ...files,
  ];

  const filteredItems = allItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "modified":
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      case "size":
        return (b.size || 0) - (a.size || 0)
      default:
        return 0
    }
  })

  const handleFileAction = async (action: string, file: any) => {
    try {
      switch (action) {
        case "share":
          setSelectedFile(file)
          setShareModalOpen(true)
          break
        case "preview":
          if (!renameModalOpen) {
            await onPreview(file)
          }
          break
        case "star":
          await onStar(file.id, file.type)
          const updatedContent = await loadContent()
          break
        case "delete":
          const newContent = await onDelete(file)
          break
        case "rename":
          setRenameTarget(file)
          setRenameModalOpen(true)
          setSelectedFile(null)
          break
        case "open":
          if (file.type === "folder") {
            onFolderClick(file)
          }
          break
      }
    } catch (error) {
      console.error("Error handling file action:", error)
      toast.error(`Failed to ${action} ${file.type}`)
    }
  }

  const handleUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        const newContent = await onUpload(file)
      }
      setUploadModalOpen(false)
    } catch (error) {
      console.error("Error uploading files:", error)
      toast.error("Failed to upload files")
    }
  }

  const handleCreateFolder = async (name: string) => {
    try {
      const newContent = await onCreateFolder(name)
      setCreateFolderModalOpen(false)
    } catch (error) {
      console.error("Error creating folder:", error)
      toast.error("Failed to create folder")
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-[#e8eaed]">
        <div className="p-4">
          <Breadcrumbs path={currentPath} onBack={onBack} />
        </div>

        <div className="px-4 pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setUploadModalOpen(true)}
              size="sm"
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button
              onClick={() => setCreateFolderModalOpen(true)}
              variant="outline"
              size="sm"
              className="border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New folder
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#5f6368] hover:bg-[#f1f3f4]">
                  <Filter className="w-4 h-4 mr-2" />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Documents</DropdownMenuItem>
                <DropdownMenuItem>Images</DropdownMenuItem>
                <DropdownMenuItem>Videos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#5f6368] hover:bg-[#f1f3f4]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Name
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("modified")}>Last modified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>Size</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-[#5f6368] hover:bg-[#f1f3f4]"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-[#5f6368]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a73e8] mb-4"></div>
            <p className="text-sm">Loading files...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#5f6368]">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2 text-[#3c4043]">
              {searchQuery ? "No files found" : "This folder is empty"}
            </h3>
            <p className="text-sm">
              {searchQuery ? "Try adjusting your search terms" : "Upload files or create folders to get started"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <FileGrid files={sortedItems} onFileAction={handleFileAction} />
        ) : (
          <FileList
            files={sortedItems}
            onFileAction={handleFileAction}
          />
        )}
      </div>

      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <CreateFolderModal
        isOpen={createFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={selectedFile}
      />
    </div>
  )
}
