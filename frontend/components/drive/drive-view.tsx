"use client"

import { useState, useEffect } from "react"
import { FileGrid } from "./file-grid"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus, Upload } from "lucide-react"
import { filesApi, foldersApi } from "@/lib/api"

interface DriveViewProps {
  showOwner?: boolean
  isTrash?: boolean
}

function RenameModal({ isOpen, initialName, onClose, onSubmit }: { isOpen: boolean, initialName: string, onClose: () => void, onSubmit: (newName: string) => void }) {
  const [name, setName] = useState(initialName)
  useEffect(() => { setName(initialName) }, [initialName])
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-4">Rename</h2>
        <input
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-md font-medium"
            onClick={() => { if (name.trim()) onSubmit(name.trim()) }}
          >
            Rename
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DriveView({ showOwner, isTrash }: DriveViewProps) {
  const [currentFolder, setCurrentFolder] = useState<any>(null)
  const [folderContents, setFolderContents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<any>(null)

  // Load initial contents
  useEffect(() => {
    loadFolderContents()
  }, [])

  const loadFolderContents = async (folderId?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Load folders
      const foldersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/folders${folderId ? `?parentId=${folderId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!foldersResponse.ok) throw new Error('Failed to load folders')
      const folders = await foldersResponse.json()

      // Load files
      const filesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files${folderId ? `?folderId=${folderId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!filesResponse.ok) throw new Error('Failed to load files')
      const files = await filesResponse.json()

      // Combine and sort contents
      const contents = [...folders, ...files].sort((a, b) => {
        // Folders first, then files
        if ('children' in a && !('children' in b)) return -1
        if (!('children' in a) && 'children' in b) return 1
        // Then sort by name
        return a.name.localeCompare(b.name)
      })

      setFolderContents(contents)
    } catch (err) {
      setError('Failed to load contents')
      console.error('Error loading folder contents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFolderChange = async (folder: any) => {
    try {
      setIsLoading(true)
      setCurrentFolder(folder)

      if (!folder) {
        setBreadcrumbs([])
        await loadFolderContents()
        return
      }

      // Defensive: check for folder.id
      if (!folder.id) {
        console.error('Folder object missing id:', folder)
        setError('Invalid folder')
        setIsLoading(false)
        return
      }

      // Update breadcrumbs
      setBreadcrumbs((prev) => {
        // If navigating to a folder already in breadcrumbs, trim after it
        const idx = prev.findIndex((b) => b.id === folder.id)
        if (idx !== -1) {
          return prev.slice(0, idx + 1)
        }
        // Otherwise, add to end
        return [...prev, folder]
      })

      await loadFolderContents(folder.id)
    } catch (err) {
      console.error('Error changing folder:', err)
      setError('Failed to load folder contents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileAction = async (action: string, file: any) => {
    switch (action) {
      case 'download':
        try {
          const response = await filesApi.downloadFile(file.id)
          const blob = response // response is already a Blob
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } catch (err) {
          console.error('Error downloading file:', err)
        }
        break

      case 'delete':
        try {
          // If the object has 'children' or 'files' array, treat as folder, else as file
          alert("I AM HERE")
          console.log({file})
          if (Array.isArray(file.children) || Array.isArray(file.files)) {
            await foldersApi.deleteFolder(file.id)
          } else {
            await filesApi.deleteFile(file.id)
          }
          // Refresh current folder contents
          await loadFolderContents(currentFolder?.id)
        } catch (err) {
          console.error('Error deleting file:', err)
        }
        break

      case 'star':
        // Implement star functionality
        break

      case 'share':
        // Implement share functionality
        break

      case 'rename':
        setRenameTarget(file)
        setRenameModalOpen(true)
        break

      default:
        console.log('Unhandled action:', action)
    }
  }

  const handleRenameSubmit = async (newName: string) => {
    if (!renameTarget || !newName || newName === renameTarget.name) {
      setRenameModalOpen(false)
      setRenameTarget(null)
      return
    }
    try {
      if (Array.isArray(renameTarget.children) || Array.isArray(renameTarget.files)) {
        await foldersApi.renameFolder(renameTarget.id, newName)
      } else {
        await filesApi.renameFile(renameTarget.id, newName)
      }
      await loadFolderContents(currentFolder?.id)
    } catch (err) {
      console.error('Error renaming:', err)
    } finally {
      setRenameModalOpen(false)
      setRenameTarget(null)
    }
  }

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:')
    if (!name) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name,
          parentId: currentFolder?.id
        })
      })

      if (!response.ok) throw new Error('Failed to create folder')

      // Refresh current folder contents
      await loadFolderContents(currentFolder?.id)
    } catch (err) {
      console.error('Error creating folder:', err)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadUrl = currentFolder?.id
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/upload?folderId=${currentFolder.id}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/upload`

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })

        if (!response.ok) throw new Error('Failed to upload file')
      }

      // Refresh current folder contents
      await loadFolderContents(currentFolder?.id)
    } catch (err) {
      console.error('Error uploading files:', err)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-4 sm:px-6 py-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCreateFolder}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
          <FileGrid
            files={folderContents}
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            onFileAction={handleFileAction}
            showOwner={showOwner}
            isTrash={isTrash}
            breadcrumbs={breadcrumbs}
          />
        )}
        <RenameModal
          isOpen={renameModalOpen}
          initialName={renameTarget?.name || ''}
          onClose={() => { setRenameModalOpen(false); setRenameTarget(null) }}
          onSubmit={handleRenameSubmit}
        />
      </div>
    </div>
  )
} 