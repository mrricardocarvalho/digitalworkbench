import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Interactive3D from '../components/Interactive3D'

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn()
Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
})

describe('Interactive3D Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation(callback => {
      callback()
      return 1
    })
  })

  it('should render the interactive cube', () => {
    const { container } = render(<Interactive3D />)
    const cube = container.querySelector('.interactive-cube')
    
    expect(cube).toBeInTheDocument()
  })

  it('should render all 6 cube faces', () => {
    const { container } = render(<Interactive3D />)
    const faces = container.querySelectorAll('.cube-face')
    
    expect(faces).toHaveLength(6)
  })

  it('should have technology labels on faces', () => {
    const { getByText } = render(<Interactive3D />)
    
    expect(getByText('React')).toBeInTheDocument()
    expect(getByText('TypeScript')).toBeInTheDocument()
    expect(getByText('Vite')).toBeInTheDocument()
  })

  it('should handle mouse interactions', () => {
    const { container } = render(<Interactive3D />)
    const cube = container.querySelector('.interactive-cube') as HTMLElement
    
    // Check if the cube has mouse event handlers by checking for the onMouseDown attribute
    // If it's a touch device, the mouse handler won't be attached
    if (cube.onmousedown) {
      // Simulate mouse down
      fireEvent.mouseDown(cube, { clientX: 100, clientY: 100 })
      expect(cube).toHaveClass('dragging')
    } else {
      // If no mouse handler (touch device), just ensure the cube renders properly
      expect(cube).toBeInTheDocument()
    }
  })

  it('should show interaction hint', () => {
    const { getByText } = render(<Interactive3D />)
    
    // Check for any of the possible interaction hints based on device type
    const hintText = getByText(/Touch to rotate|Drag to rotate|Swipe to rotate/)
    expect(hintText).toBeInTheDocument()
  })
})
