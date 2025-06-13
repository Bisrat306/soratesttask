"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { HardDrive, Users, Clock, Star, Trash2, Plus } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FolderPlus, Upload } from "lucide-react"

interface DriveSidebarProps {
  isOpen: boolean
}

const sidebarItems = [
  { name: "My Drive", href: "/drive", icon: HardDrive },
  { name: "Shared with me", href: "/drive/shared", icon: Users },
  { name: "Recent", href: "/drive/recent", icon: Clock },
  { name: "Starred", href: "/drive/starred", icon: Star },
  { name: "Trash", href: "/drive/trash", icon: Trash2 },
]

export function DriveSidebar({ isOpen }: DriveSidebarProps) {
  const pathname = usePathname()
  const [storageUsed] = useState(58) // 58% used
  const isMobile = useMobile()

  if (!isOpen) return null

  return (
    <aside className={`${isMobile ? "w-56" : "w-64"} bg-white flex flex-col border-r border-[#e8eaed]`}>
      <div className="p-3 sm:p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start gap-3 h-10 sm:h-12 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa] shadow-sm rounded-2xl text-sm">
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 ml-4">
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <FolderPlus className="w-5 h-5 text-[#5f6368]" />
              <span>New folder</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <Upload className="w-5 h-5 text-[#5f6368]" />
              <span>File upload</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <Upload className="w-5 h-5 text-[#5f6368]" />
              <span>Folder upload</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285f4"
                    d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                  />
                </svg>
              </div>
              <span>Google Docs</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#0f9d58"
                    d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z"
                  />
                </svg>
              </div>
              <span>Google Sheets</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#f9ab00"
                    d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z"
                  />
                </svg>
              </div>
              <span>Google Slides</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#ea4335"
                    d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z"
                  />
                </svg>
              </div>
              <span>Google Forms</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 py-3 text-[#5f6368]">
              <span className="text-sm">More</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 px-2 sm:px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 px-3 py-2 rounded-r-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#e8f0fe] text-[#1a73e8] border-r-3 border-[#1a73e8]"
                      : "text-[#3c4043] hover:bg-[#f1f3f4]",
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-[#1a73e8]" : "text-[#5f6368]")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-3 sm:p-4 border-t border-[#e8eaed]">
        <Link href="/drive/storage" className="block">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#5f6368]">Storage</span>
              <span className="font-medium text-[#3c4043]">{storageUsed}%</span>
            </div>
            <Progress value={storageUsed} className="h-1 bg-[#e8eaed]" />
            <div className="text-xs text-[#5f6368]">8.7 GB of 15 GB used</div>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] text-xs"
              >
                Buy storage
              </Button>
            )}
          </div>
        </Link>
      </div>
    </aside>
  )
}
