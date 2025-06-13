"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Folder,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  MoreVertical,
  Star,
  Share,
  Download,
  Trash2,
  Edit,
  Eye,
  RotateCcw,
  ChevronRight,
  Home,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { FilePreviewModal } from "./file-preview-modal"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

interface FileGridProps {
  files: any[]
  onFileAction: (action: string, file: any) => void
  showOwner?: boolean
  isTrash?: boolean
  currentFolder?: any
  onFolderChange?: (folder: any) => void
  breadcrumbs?: any[]
}

function getFileIcon(file: any) {
  if ('children' in file || 'files' in file) return Folder;

  const mimeType = file.mimeType || file.mimetype || "";
  
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) return FileText;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return Archive;
  return FileText;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function FileGrid({ files, onFileAction, showOwner, isTrash, currentFolder, onFolderChange, breadcrumbs = [] }: FileGridProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [previewFile, setPreviewFile] = useState<any>(null)
  const isMobile = useMobile()

  const handleFileClick = (file: any, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = new Set(selectedFiles)
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id)
      } else {
        newSelected.add(file.id)
      }
      setSelectedFiles(newSelected)
    } else {
      setSelectedFiles(new Set([file.id]))
      if (!file.mimetype) {
        onFolderChange?.(file)
      } else {
        setPreviewFile(file)
      }
    }
  }

  const handlePreviewClose = () => {
    setPreviewFile(null)
  }

  const handleBreadcrumbClick = (folder: any) => {
    onFolderChange?.(folder)
  }

  const FileContextMenu = ({ file, children }: { file: any; children: React.ReactNode }) => (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {!isTrash ? (
          <>
            <ContextMenuItem onClick={() => onFileAction("preview", file)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFileAction("share", file)}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFileAction("download", file)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={(e) => { e.stopPropagation(); onFileAction("rename", file); }}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFileAction("star", file)}>
              <Star className={cn("w-4 h-4 mr-2", file.starred && "fill-yellow-400 text-yellow-400")} />
              {file.starred ? "Remove from starred" : "Add to starred"}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onFileAction("delete", file)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Move to trash
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem onClick={() => onFileAction("restore", file)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFileAction("delete-forever", file)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete forever
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )

  return (
    <>
      <div className="px-4 sm:px-6 py-2 border-b">
        <div className="flex items-center space-x-2 text-sm">
          <button
            className="flex items-center text-gray-900 font-semibold hover:underline focus:outline-none"
            onClick={() => onFolderChange?.(null)}
          >
            <Home className="w-4 h-4 text-gray-900 mr-1" />
            My Drive
          </button>
          {breadcrumbs && breadcrumbs.map((folder, idx) => (
            <span key={folder.id} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              <button
                className="text-gray-900 font-semibold hover:underline focus:outline-none max-w-[200px] truncate"
                title={folder.name}
                onClick={() => onFolderChange?.(folder)}
              >
                {folder.name}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {files.map((file) => {
            const Icon = getFileIcon(file)
            const isSelected = selectedFiles.has(file.id)
            const isFolder = 'children' in file && 'files' in file

            return (
              <FileContextMenu key={file.id} file={file}>
                <div
                  className={cn(
                    "group relative p-2 sm:p-3 rounded-lg border-2 border-transparent hover:border-[#c2e7ff] hover:bg-[#f8fafd] cursor-pointer transition-all",
                    isSelected && "border-[#c2e7ff] bg-[#f8fafd]",
                  )}
                  onClick={(e) => handleFileClick(file, e)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {isFolder ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-[#5f6368]" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                        {file.mimetype?.startsWith('image/') ? (
                          <Image
                            src={`${API_URL}${file.path.match(/\/uploads\/.*/)?.[0] || ''}`}
                            alt={file.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : file.mimetype?.startsWith('video/') ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={file.thumbnail ? `${API_URL}${file.thumbnail.match(/\/uploads\/.*/)?.[0] || ''}` : "/video-placeholder.svg"}
                              alt={file.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : file.mimetype?.startsWith('audio/') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Music className="w-8 h-8 text-[#5f6368]" />
                          </div>
                        ) : file.mimetype?.includes('pdf') ? (
                          <div className="w-full h-full flex items-center justify-center bg-red-50">
                            <FileText className="w-8 h-8 text-red-500" />
                          </div>
                        ) : file.mimetype?.includes('document') || file.mimetype?.includes('text') ? (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50">
                            <FileText className="w-8 h-8 text-blue-500" />
                          </div>
                        ) : file.mimetype?.includes('zip') || file.mimetype?.includes('rar') || file.mimetype?.includes('tar') ? (
                          <div className="w-full h-full flex items-center justify-center bg-orange-50">
                            <Archive className="w-8 h-8 text-orange-500" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <FileText className="w-8 h-8 text-[#5f6368]" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="w-full text-center">
                      <div className="text-xs sm:text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-[#5f6368] mt-1">
                        {isFolder ? `${(file.children?.length || 0) + (file.files?.length || 0)} items` : formatFileSize(file.size)}
                      </div>
                      {showOwner && <div className="text-xs text-[#5f6368] mt-1">{file.owner}</div>}
                    </div>
                  </div>

                  {file.starred && <Star className="absolute top-2 left-2 w-4 h-4 fill-yellow-400 text-yellow-400" />}

                  {file.shared && <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isTrash ? (
                        <>
                          <DropdownMenuItem onClick={() => onFileAction("preview", file)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onFileAction("share", file)}>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onFileAction("download", file)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onFileAction("rename", file); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onFileAction("star", file)}>
                            <Star className={cn("w-4 h-4 mr-2", file.starred && "fill-yellow-400 text-yellow-400")} />
                            {file.starred ? "Remove from starred" : "Add to starred"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onFileAction("delete", file)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Move to trash
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => onFileAction("restore", file)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onFileAction("delete-forever", file)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete forever
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FileContextMenu>
            )
          })}
          {files.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8">
              This folder is empty
            </div>
          )}
        </div>
      </div>
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={handlePreviewClose}
        file={previewFile}
        onFileAction={onFileAction}
      />
    </>
  )
}
