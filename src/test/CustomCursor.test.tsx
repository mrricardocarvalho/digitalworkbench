import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CustomCursor from '../components/CustomCursor'

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn()
const mockCancelAnimationFrame = vi.fn()

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
})

describe('CustomCursor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation(callback => {
      callback()
      return 1
    })
  })

  it('should render cursor element', () => {
    const { container } = render(<CustomCursor />)
    const cursor = container.querySelector('.custom-cursor')
    
    expect(cursor).toBeInTheDocument()
  })

  it('should use requestAnimationFrame for performance', () => {
    render(<CustomCursor />)
    
    // Simulate mouse move
    fireEvent(document, new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 150
    }))
    
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })

  it('should clean up on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    
    const { unmount } = render(<CustomCursor />)
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    )
  })
})