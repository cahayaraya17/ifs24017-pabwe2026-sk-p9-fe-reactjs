import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useInput } from './useInput'
import { useTheme } from './useTheme'

describe('custom hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('handles useInput state updates', () => {
    const { result } = renderHook(() => useInput('awal'))
    expect(result.current[0]).toBe('awal')

    act(() => {
      result.current[1]({ target: { value: 'baru' } })
    })
    expect(result.current[0]).toBe('baru')
  })

  it('handles useTheme toggle', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.darkMode).toBe(false)

    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.darkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})