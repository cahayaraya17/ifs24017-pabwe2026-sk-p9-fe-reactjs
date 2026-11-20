import { useState, useEffect } from 'react'

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleTheme = () => setDarkMode((prev) => !prev)
  return { darkMode, toggleTheme }
}