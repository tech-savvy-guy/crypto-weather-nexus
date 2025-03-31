"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "class", // Default to using class attribute
  enableSystem = true, // Default to enabling system theme
  disableTransitionOnChange = false, // Default to allowing transitions
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Once mounted, we can access localStorage and window
  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    } else if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [enableSystem, storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Remove previous theme classes
    if (attribute === "class") {
      root.classList.remove("light", "dark")
    } else {
      root.removeAttribute(attribute)
    }

    // Apply new theme
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      if (attribute === "class") {
        if (!disableTransitionOnChange) {
          root.classList.add(systemTheme)
        } else {
          // Disable transitions temporarily
          root.classList.add("no-transitions", systemTheme)
          setTimeout(() => root.classList.remove("no-transitions"), 0)
        }
      } else {
        root.setAttribute(attribute, systemTheme)
      }
    } else {
      if (attribute === "class") {
        if (!disableTransitionOnChange) {
          root.classList.add(theme)
        } else {
          // Disable transitions temporarily
          root.classList.add("no-transitions", theme)
          setTimeout(() => root.classList.remove("no-transitions"), 0)
        }
      } else {
        root.setAttribute(attribute, theme)
      }
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange, mounted])

  // Listen for system theme changes if enabled
  useEffect(() => {
    if (!enableSystem || !mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        const root = window.document.documentElement

        if (attribute === "class") {
          root.classList.remove("light", "dark")
          root.classList.add(systemTheme)
        } else {
          root.setAttribute(attribute, systemTheme)
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, attribute, enableSystem, mounted])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (mounted) {
        localStorage.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
  }

  // Prevent flash of incorrect theme by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

