"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { HardDrive, ImageIcon, FileText, Video, Music, Archive } from "lucide-react"

const storageData = {
  total: 15 * 1024 * 1024 * 1024, // 15 GB
  used: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
  breakdown: [
    { type: "Documents", size: 2.1 * 1024 * 1024 * 1024, icon: FileText, color: "bg-blue-500" },
    { type: "Images", size: 3.2 * 1024 * 1024 * 1024, icon: ImageIcon, color: "bg-green-500" },
    { type: "Videos", size: 2.8 * 1024 * 1024 * 1024, icon: Video, color: "bg-red-500" },
    { type: "Audio", size: 0.4 * 1024 * 1024 * 1024, icon: Music, color: "bg-purple-500" },
    { type: "Other", size: 0.2 * 1024 * 1024 * 1024, icon: Archive, color: "bg-gray-500" },
  ],
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function StoragePage() {
  const usagePercentage = (storageData.used / storageData.total) * 100

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Storage</h1>
        <p className="text-gray-600">Manage your storage usage and upgrade your plan</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{formatBytes(storageData.used)}</div>
              <div className="text-sm text-gray-600">of {formatBytes(storageData.total)} used</div>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="text-center text-sm text-gray-600">{(100 - usagePercentage).toFixed(1)}% available</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storageData.breakdown.map((item) => {
                const Icon = item.icon
                const percentage = (item.size / storageData.used) * 100
                return (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatBytes(item.size)}</div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Basic</h3>
              <div className="text-2xl font-bold mb-2">Free</div>
              <div className="text-sm text-gray-600 mb-4">15 GB storage</div>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </div>
            <div className="border rounded-lg p-4 border-blue-500 relative">
              <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">Popular</div>
              <h3 className="font-semibold mb-2">Pro</h3>
              <div className="text-2xl font-bold mb-2">$9.99/mo</div>
              <div className="text-sm text-gray-600 mb-4">100 GB storage</div>
              <Button className="w-full">Upgrade</Button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Business</h3>
              <div className="text-2xl font-bold mb-2">$19.99/mo</div>
              <div className="text-sm text-gray-600 mb-4">1 TB storage</div>
              <Button variant="outline" className="w-full">
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
