"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = stored || (systemDark ? "dark" : "light")
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return { theme, toggleTheme }
}
