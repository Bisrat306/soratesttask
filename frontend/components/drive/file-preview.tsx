import { X } from "lucide-react"

interface FilePreviewProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }
  onClose: () => void
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/")
  const isPDF = file.type === "application/pdf"
  const isText = file.type.startsWith("text/")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 border-b flex items-center justify-between px-4">
          <h2 className="text-lg font-medium truncate">{file.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-[calc(80vh-3rem)] p-4 overflow-auto">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full mx-auto object-contain"
            />
          ) : isPDF ? (
            <iframe
              src={file.url}
              className="w-full h-full"
              title={file.name}
            />
          ) : isText ? (
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {file.url}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Preview not available for this file type</p>
              <a
                href={file.url}
                download={file.name}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 