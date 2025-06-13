"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbsProps {
  path: string
  onBack?: () => void
}

export function Breadcrumbs({ path, onBack }: BreadcrumbsProps) {
  const segments = path.split("/").filter(Boolean)

  return (
    <nav className="flex items-center space-x-1 text-sm">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
      ) : (
      <Link href="/drive" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
        <Home className="w-4 h-4" />
        <span>My Drive</span>
      </Link>
      )}

      {segments.length > 0 && segments[0] !== "My Drive" && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">{path}</span>
        </>
      )}

      {segments.length > 1 &&
        segments.slice(1).map((segment, index) => (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={`/drive/${segments.slice(0, index + 2).join("/")}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {segment}
            </Link>
          </div>
        ))}
    </nav>
  )
}
