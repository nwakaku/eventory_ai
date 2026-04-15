import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setError(error.message)
          setTimeout(() => navigate("/"), 3000)
          return
        }

        if (session?.user) {
          navigate("/dashboard", { replace: true })
        } else {
          navigate("/", { replace: true })
        }
      } catch (err) {
        console.error("Unexpected auth error:", err)
        setError("An unexpected error occurred")
        setTimeout(() => navigate("/"), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <>
            <div className="text-center text-destructive">
              <p className="text-lg font-medium">Authentication Failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="mt-2 text-sm">Redirecting you back...</p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  )
}
