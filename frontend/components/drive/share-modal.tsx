"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Share, Copy, Mail, LinkIcon, Globe, Lock, Eye, Edit, X } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: any
}

export function ShareModal({ isOpen, onClose, file }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [linkSharing, setLinkSharing] = useState(false)
  const [sharedUsers] = useState([
    { id: "1", name: "John Smith", email: "john@example.com", role: "editor", avatar: "/placeholder-user.jpg" },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "viewer", avatar: "/placeholder-user.jpg" },
  ])

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // In a real app, add user to shared list
      setEmail("")
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://drive.example.com/file/${file?.id}`)
    // Show toast notification
  }

  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="w-5 h-5" />
            Share "{file.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleAddUser} className="space-y-2">
            <Label htmlFor="email">Add people</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1"
              />
              <Button type="submit" disabled={!email.trim()}>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {sharedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>People with access</Label>
              {sharedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={user.role}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            Viewer
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Edit className="w-3 h-3" />
                            Editor
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Get link</span>
              </div>
              <Switch checked={linkSharing} onCheckedChange={setLinkSharing} />
            </div>

            {linkSharing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 flex-1">Anyone with the link can view</span>
                  <Button variant="outline" size="sm" onClick={copyLink}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Select defaultValue="viewer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Viewer
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Edit className="w-3 h-3" />
                        Editor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {!linkSharing && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Restricted - only people with access can open</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
