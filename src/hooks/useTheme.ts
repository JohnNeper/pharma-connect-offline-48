import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto theme based on time (6AM-6PM = light, 6PM-6AM = dark)
  const setAutoTheme = () => {
    const hour = new Date().getHours()
    const isDay = hour >= 6 && hour < 18
    setTheme(isDay ? 'light' : 'dark')
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  if (!mounted) {
    return {
      theme: 'light',
      setTheme,
      toggleTheme,
      setAutoTheme,
      resolvedTheme: 'light'
    }
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    setAutoTheme,
    resolvedTheme: theme === 'system' ? systemTheme : theme
  }
}