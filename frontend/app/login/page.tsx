"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMobile } from "@/hooks/use-mobile"
import { authApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { GoogleLogo } from "@/components/ui/google-logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "password">("email")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (email.trim()) {
      try {
        setIsLoading(true)
        const response = await authApi.login(email) as { ok?: boolean; error?: string }
        if (response.error) {
          setError("Couldn't find your Google Account")
          return
        }
        if (response.ok) {
          setStep("password")
        }
      } catch (error) {
        setError("Couldn't find your Google Account")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setIsLoading(true)
      let response;
      try {
        response = await authApi.login(email, password) as { access_token?: string; error?: string; status?: number }
      } catch (err: any) {
        // If the backend throws a 401 Unauthorized, show the correct error
        if (err.message==='Login failed') {
          setError("Wrong password. Try again or click 'Forgot password?' to reset it.");
          return;
        }
        setError("Failed to sign in. Please try again.");
        return;
      }
      if (response?.error === 'Incorrect password') {
        setError("Wrong password. Try again or click 'Forgot password?' to reset it.");
        return;
      }
      if (response?.error) {
        setError(response.error);
        return;
      }
      if (response?.access_token) {
        localStorage.setItem("token", response.access_token)
        router.push("/drive")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-[#dadce0] p-6 sm:p-12 shadow-sm">
            {/* Google Logo */}
            <div className="mb-6 flex justify-center sm:justify-start">
              
            <GoogleLogo />
            </div>

            {step === "email" ? (
              <>
                {/* Sign in heading */}
                <div className="mb-8 text-center sm:text-left">
                  <h1 className="text-2xl font-normal text-[#202124] mb-2">Sign in</h1>
                  <p className="text-base text-[#5f6368]">to continue to Google Drive</p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-1 ${error ? "text-[#ea4335]" : "text-gray-300"}`}
                    >
                      Email or phone
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or phone"
                      className={`h-14 w-full text-base rounded-md border bg-transparent text-black outline-none transition-colors px-4 py-3
                        ${error ? "border-[#ea4335] focus:border-[#ea4335]" : "border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"}
                      `}
                      required
                      autoFocus
                    />
                    <Link href="/forgot-email" className="inline-block mt-3 text-sm text-[#1a73e8] hover:underline">
                      Forgot email?
                    </Link>
                  </div>

                  <div className="text-sm text-[#5f6368]">
                    Not your computer? Use Guest mode to sign in privately.{" "}
                    <Link href="#" className="text-[#1a73e8] hover:underline">
                      Learn more about using Guest mode
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Link href="/signup" className="text-sm font-medium text-[#1a73e8] hover:underline">
                      Create account
                    </Link>
                    <Button
                      type="submit"
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-md font-medium"
                      disabled={!email.trim()}
                    >
                      Next
                    </Button>
                  </div>
                </form>

                {error && step === "email" && (
                  <div className="flex items-center mt-2 text-[#ea4335] text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Password heading */}
                <div className="mb-8 text-center sm:text-left">
                  <h1 className="text-2xl font-normal text-[#202124] mb-2">Welcome</h1>
                  <div className="flex items-center justify-center sm:justify-start mt-4 bg-[#f8f9fa] border border-[#dadce0] rounded-full py-1 px-2 w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="mr-2"
                    >
                      <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z"
                        fill="#5F6368"
                      />
                    </svg>
                    <span className="text-sm text-[#5f6368] truncate max-w-[200px]">{email}</span>
                    <button
                      onClick={handleBackToEmail}
                      className="ml-1 text-[#5f6368] hover:text-[#1a73e8] focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path d="M9 5.25L13.5 9.75L12.4425 10.8075L9.75 8.1225V13.5H8.25V8.1225L5.5575 10.8075L4.5 9.75L9 5.25Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <div className="mb-1 text-base text-[#202124]">Enter your password</div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 text-base border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                        required
                      />
                    </div>
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="show-password"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="h-4 w-4 text-[#1a73e8] border-[#5f6368] rounded focus:ring-[#1a73e8]"
                      />
                      <label htmlFor="show-password" className="ml-2 text-sm text-[#5f6368]">
                        Show password
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Link href="/forgot-password" className="text-sm font-medium text-[#1a73e8] hover:underline">
                      Forgot password?
                    </Link>
                    <Button
                      type="submit"
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-md font-medium"
                      disabled={!password.trim()}
                    >
                      Next
                    </Button>
                  </div>
                </form>

                {error && step === "password" && (
                  <div className="flex items-center mt-2 text-[#ea4335] text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                  </div>
                )}
              </>
            )}
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
