"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DriveHeader } from "@/components/drive/drive-header"
import { DriveSidebar } from "@/components/drive/drive-sidebar"
import { useMobile } from "@/hooks/use-mobile"

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMobile()

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  return (
    <div className="h-screen flex flex-col bg-white">
      <DriveHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  )
}
