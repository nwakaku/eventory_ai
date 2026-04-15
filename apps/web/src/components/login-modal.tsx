import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message)
  }
  return "An unexpected error occurred"
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, name)
        if (error) {
          setError(getErrorMessage(error))
        } else {
          setSuccessMessage(
            "Account created! Check your email to confirm your account."
          )
          setEmail("")
          setPassword("")
          setName("")
        }
      } else {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setError(getErrorMessage(error))
        } else {
          onSuccess()
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(getErrorMessage(error))
      }
    } catch {
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setSuccessMessage(null)
    setEmail("")
    setPassword("")
    setName("")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto">
        <div className="rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-2 sm:p-4">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground sm:text-xl">
                {isSignUp ? "Create account" : "Welcome back"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-card-foreground transition-colors hover:bg-accent disabled:opacity-50 sm:gap-3 sm:py-3 sm:text-sm"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                ) : (
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="hidden sm:inline">Continue with Google</span>
                <span className="sm:hidden">Google</span>
              </button>
            </div>

            <div className="relative mt-4 sm:mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-3 sm:mt-6 sm:space-y-4"
            >
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-card-foreground sm:text-sm"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={isSignUp}
                    className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none sm:py-2.5 sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-card-foreground sm:text-sm"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none sm:py-2.5 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-card-foreground sm:text-sm"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none sm:py-2.5 sm:text-sm"
                />
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline sm:text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="h-10 w-full sm:h-11"
                size="sm"
                disabled={loading || googleLoading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-6 sm:text-sm">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up free
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
