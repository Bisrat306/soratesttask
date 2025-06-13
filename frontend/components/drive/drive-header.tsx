"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Settings, LogOut, User, HelpCircle, Grid3X3 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface DriveHeaderProps {
  onMenuClick: () => void
}

export function DriveHeader({ onMenuClick }: DriveHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const isMobile = useMobile()
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <header className="h-16 border-b border-[#e8eaed] bg-white flex items-center px-2 sm:px-4 gap-2 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="hover:bg-[#f1f3f4] rounded-full">
          <Menu className="w-5 h-5 text-[#5f6368]" />
        </Button>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Google Drive Logo */}
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#1a73e8]">
            <path fill="#0f9d58" d="m12.5 25.5 4.5-7.8 7.8 13.5H8.2z" />
            <path fill="#f9ab00" d="m25 25.5-4.5 7.8L12.7 20h15.6z" />
            <path fill="#4285f4" d="M12.5 25.5 20.5 12l7.8 13.5z" />
          </svg>
          <span className="text-[18px] sm:text-[22px] font-normal text-[#5f6368]">Drive</span>
        </div>
      </div>

      {isMobile ? (
        <>
          {showSearch ? (
            <div className="flex-1 flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5f6368]" />
                <Input
                  placeholder="Search in Drive"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-[#f1f3f4] border-0 rounded-full focus:bg-white focus:ring-1 focus:ring-[#1a73e8] text-base w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(false)}
                className="ml-2 hover:bg-[#f1f3f4] rounded-full"
              >
                <span className="text-[#5f6368]">Cancel</span>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hover:bg-[#f1f3f4] rounded-full w-10 h-10"
              >
                <Search className="w-5 h-5 text-[#5f6368]" />
              </Button>
            </>
          )}
        </>
      ) : (
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5f6368]" />
            <Input
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-[#f1f3f4] border-0 rounded-full focus:bg-white focus:ring-1 focus:ring-[#1a73e8] text-base"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        {!isMobile && (
          <>
            <Button variant="ghost" size="sm" className="hover:bg-[#f1f3f4] rounded-full w-12 h-12">
              <HelpCircle className="w-5 h-5 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-[#f1f3f4] rounded-full w-12 h-12">
              <Settings className="w-5 h-5 text-[#5f6368]" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-[#f1f3f4] rounded-full w-12 h-12">
              <Grid3X3 className="w-5 h-5 text-[#5f6368]" />
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-[#1a73e8] text-white">
                  {(() => {
                    // Try to get initials from username
                    const username = user?.username;
                    if (!username) return "U";
                    return username
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase();
                  })()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <UserProfileDropdown />
        </DropdownMenu>
      </div>
    </header>
  )
}

function UserProfileDropdown() {
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
    </DropdownMenuContent>
  )

  return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-1 leading-none">
          <p className="font-medium">{user?.username || "Unknown User"}</p>
          <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
