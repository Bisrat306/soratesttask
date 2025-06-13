"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useMobile } from "@/hooks/use-mobile"
import { usersApi } from "@/lib/api"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isMobile = useMobile()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      setIsLoading(true)
      await usersApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.username,
        password: formData.password,
      })
      router.push("/login")
    } catch (err: any) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[448px]">
          <div className="bg-white rounded-lg border border-[#dadce0] p-6 sm:p-12 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="mb-6 sm:mb-0 sm:mr-8">
                <svg width="75" height="24" viewBox="0 0 75 24" className="mb-4">
                  <path
                    fill="#4285f4"
                    d="M36.3425 10.2841V14.4659H42.6023C42.3068 15.9318 41.5341 17.1477 40.3977 17.9886L43.6932 20.4773C45.4205 18.9432 46.3864 16.6591 46.3864 13.9545C46.3864 13.1818 46.3182 12.4432 46.1818 11.7386H36.3425V10.2841Z"
                  />
                  <path
                    fill="#34a853"
                    d="M20.2727 24C25.2955 24 29.4773 22.2727 32.6364 19.0909L29.0909 16.3636C27.9545 17.1364 26.4545 17.5909 20.2727 17.5909C15.4091 17.5909 11.3636 14.8636 10.0909 11.0909L6.40909 13.6364C9.54545 19.9091 14.4545 24 20.2727 24Z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M10.0909 11.0909C9.68182 10.0909 9.45455 9 9.45455 7.90909C9.45455 6.81818 9.68182 5.72727 10.0909 4.72727L6.40909 2.18182C5.18182 4.63636 4.36364 7.45455 4.36364 10.5C4.36364 13.5455 5.18182 16.3636 6.40909 18.8182L10.0909 16.2727V11.0909Z"
                  />
                  <path
                    fill="#ea4335"
                    d="M20.2727 6.40909C22.8636 6.40909 25.1364 7.31818 26.9091 9L30.1364 5.77273C27.2727 3.13636 23.4545 1.5 20.2727 1.5C14.4545 1.5 9.54545 5.59091 6.40909 11.8636L10.0909 14.4091C11.3636 10.6364 15.4091 6.40909 20.2727 6.40909Z"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-normal text-[#202124] mb-2">Create a Google Account</h1>
                <p className="text-base text-[#5f6368]">to continue to Google Drive</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                  required
                />
                <div className="mt-1 text-sm text-[#5f6368]">You can use letters, numbers & periods</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                    required
                  />
                </div>
              </div>
              <div className="text-sm text-[#5f6368]">
                Use 8 or more characters with a mix of letters, numbers & symbols
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className="h-4 w-4 text-[#1a73e8] border-[#5f6368] rounded focus:ring-[#1a73e8]"
                />
                <label htmlFor="terms" className="text-sm text-[#5f6368]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#1a73e8] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1a73e8] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4">
                <Link href="/login" className="text-sm font-medium text-[#1a73e8] hover:underline mb-4 sm:mb-0">
                  Sign in instead
                </Link>
                <Button
                  type="submit"
                  className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-md font-medium"
                  disabled={!formData.agreeToTerms || isLoading}
                >
                  {isLoading ? "Signing up..." : "Next"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-[#5f6368]">
          <Select defaultValue="en-US">
            <SelectTrigger className="w-full sm:w-48 border-none shadow-none text-[#5f6368] mb-4 sm:mb-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (United States)</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="#" className="hover:underline">
              Help
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
