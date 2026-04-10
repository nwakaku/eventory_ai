import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: string
  title: string
  description?: string
  type: ToastType
}

let toastId = 0
let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

const emitChange = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

export const toast = ({
  title,
  description,
  type = "info",
}: Omit<Toast, "id">) => {
  const id = String(++toastId)
  toasts = [...toasts, { id, title, description, type }]
  emitChange()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emitChange()
  }, 5000)
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setCurrentToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setCurrentToasts)
    }
  }, [])

  return (
    <div className="fixed right-4 bottom-4 z-[100] flex max-w-sm flex-col gap-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`flex animate-in items-start gap-3 rounded-lg border p-4 shadow-lg slide-in-from-right ${
            t.type === "success"
              ? "border-[#00C853]/20 bg-[#00C853]/10"
              : t.type === "error"
                ? "border-destructive/20 bg-destructive/10"
                : "border-border bg-card"
          }`}
        >
          <div
            className={`shrink-0 rounded-full p-1 ${
              t.type === "success"
                ? "bg-[#00C853]/20"
                : t.type === "error"
                  ? "bg-destructive/20"
                  : "bg-primary/10"
            }`}
          >
            {t.type === "success" && (
              <Check className="h-3 w-3 text-[#00C853]" />
            )}
            {t.type === "error" && <X className="h-3 w-3 text-destructive" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{t.title}</p>
            {t.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t.description}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              toasts = toasts.filter((toast) => toast.id !== t.id)
              emitChange()
            }}
            className="shrink-0 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
