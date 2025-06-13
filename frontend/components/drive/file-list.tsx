"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  File as FileIcon,
} from "lucide-react"

interface FileListProps {
  files: any[]
  onFileAction: (action: string, file: any) => void
  showOwner?: boolean
  showDeletedTime?: boolean
  isTrash?: boolean
}

function getFileIcon(item: any) {
  if (item.userId && !item.mimetype) return Folder; // Folder
  const mimeType = item.mimetype || "";
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("pdf")) return FileText;
  if (mimeType.includes("msword") || mimeType.includes("officedocument")) return FileText;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return Archive;
  return FileIcon;
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

export function FileList({ files, onFileAction, showOwner, showDeletedTime, isTrash }: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

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
      if (file.mimetype) {
        onFileAction("preview", file)
      }
    }
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
            <ContextMenuItem onClick={(e) => {  onFileAction("rename", file)}}>
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
    <div className="p-6">
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-1">
            <Checkbox />
          </div>
          <div className="col-span-5">Name</div>
          {showOwner && <div className="col-span-2">Owner</div>}
          <div className="col-span-2">Last modified</div>
          {showDeletedTime && <div className="col-span-2">Deleted</div>}
          <div className="col-span-1">Size</div>
          <div className="col-span-1"></div>
        </div>

        {files.map((file) => {
          const isFolder = file.userId && !file.mimetype;
          const Icon = getFileIcon(file);
          const isSelected = selectedFiles.has(file.id);

          return (
            <FileContextMenu key={file.id} file={file}>
              <div
                className={cn(
                  "grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors",
                  isSelected && "bg-blue-50",
                )}
                onClick={(e) => handleFileClick(file, e)}
              >
                <div className="col-span-1 flex items-center">
                  <Checkbox checked={isSelected} onChange={() => {}} onClick={(e) => e.stopPropagation()} />
                </div>

                <div className="col-span-5 flex items-center gap-3">
                  {file.mimetype && file.mimetype.startsWith("image/") ? (
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={file.path.replace('/Users/bme/Documents/Projects/SoraUnion/SoraTestTask/backend/uploads', '/uploads')}
                        alt={file.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Icon className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate" title={file.name}>
                      {file.name}
                    </div>
                    {!file.mimetype?.startsWith("image/") && file.mimetype && (
                      <div className="text-xs text-gray-400">{file.mimetype.split('/')[1]?.toUpperCase()}</div>
                    )}
                    {isFolder && (
                      <div className="text-xs text-gray-500">{file.itemCount || 0} items</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {file.starred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    {file.shared && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                  </div>
                </div>

                {showOwner && <div className="col-span-2 flex items-center text-sm text-gray-600">{file.owner}</div>}

                <div className="col-span-2 flex items-center text-sm text-gray-600">
                  {formatDate(new Date(file.updatedAt || file.createdAt))}
                </div>

                {showDeletedTime && (
                  <div className="col-span-2 flex items-center text-sm text-gray-600">
                    {file.deletedTime ? formatDate(file.deletedTime) : "-"}
                  </div>
                )}

                <div className="col-span-1 flex items-center text-sm text-gray-600">
                  {isFolder ? "-" : formatFileSize(file.size)}
                </div>

                <div className="col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
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
                          <DropdownMenuItem
                            onClick={() => onFileAction("delete-forever", file)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete forever
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </FileContextMenu>
          )
        })}
      </div>
    </div>
  )
}
