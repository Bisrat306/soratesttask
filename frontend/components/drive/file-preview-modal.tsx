"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, Share, Star, MoreVertical } from "lucide-react"
import Image from "next/image"

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: any
  onFileAction: (action: string, file: any) => void
}

export function FilePreviewModal({ isOpen, onClose, file, onFileAction }: FilePreviewModalProps) {
  if (!file) return null

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
  const filePath = file.path?.match(/\/uploads\/.*/)?.[0] || ''

  const isImage = file.mimetype?.startsWith('image/')
  const isVideo = file.mimetype?.startsWith('video/')
  const isAudio = file.mimetype?.startsWith('audio/')
  const isPDF = file.mimetype?.includes('pdf')
  const isDocument = file.mimetype?.includes('document') || file.mimetype?.includes('text')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{file.name}</h2>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • Modified {formatDate(file.updatedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => onFileAction("download", file)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => onFileAction("share", file)}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onFileAction("star", file)}
                className={file.starred ? "text-yellow-500" : ""}
              >
                <Star className={`w-4 h-4 ${file.starred ? "fill-yellow-400" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-auto">
            {isImage ? (
              <div className="flex items-center justify-center h-full">
                <Image
                  src={`${API_URL}${filePath}`}
                  alt={file.name}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : isVideo ? (
              <div className="flex items-center justify-center h-full">
                <video
                  src={`${API_URL}${filePath}`}
                  controls
                  className="max-w-full max-h-full"
                />
              </div>
            ) : isAudio ? (
              <div className="flex items-center justify-center h-full">
                <audio
                  src={`${API_URL}${filePath}`}
                  controls
                  className="w-full max-w-md"
                />
              </div>
            ) : isPDF ? (
              <div className="h-full">
                <iframe
                  src={`${API_URL}${filePath}`}
                  className="w-full h-full"
                  title={file.name}
                />
              </div>
            ) : isDocument ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Preview not available for this document type</p>
                  <Button onClick={() => onFileAction("download", file)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                  <Button onClick={() => onFileAction("download", file)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
