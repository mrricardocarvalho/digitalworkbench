import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SEO from '../components/SEO'

// Mock the document for testing
const mockDocumentTitle = { value: '' }
const mockMetaElements = new Map()

Object.defineProperty(document, 'title', {
  get: () => mockDocumentTitle.value,
  set: (value) => { mockDocumentTitle.value = value }
})

Object.defineProperty(document, 'querySelector', {
  value: (selector: string) => {
    return mockMetaElements.get(selector) || null
  }
})

describe('SEO Component', () => {
  beforeEach(() => {
    mockDocumentTitle.value = ''
    mockMetaElements.clear()
    
    // Mock meta elements
    const createMockElement = () => ({
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
    })
    
    mockMetaElements.set('meta[name="description"]', createMockElement())
    mockMetaElements.set('meta[name="keywords"]', createMockElement())
    mockMetaElements.set('meta[property="og:title"]', createMockElement())
  })

  it('should update document title', () => {
    const title = 'Test Page Title'
    render(<SEO title={title} />)
    
    expect(document.title).toBe(title)
  })

  it('should use default title when none provided', () => {
    render(<SEO />)
    
    expect(document.title).toContain('Ricardo Carvalho')
  })

  it('should update meta description', () => {
    const description = 'Test page description'
    const mockMeta = mockMetaElements.get('meta[name="description"]')
    
    render(<SEO description={description} />)
    
    expect(mockMeta?.setAttribute).toHaveBeenCalledWith('content', description)
  })

  it('should handle missing meta elements gracefully', () => {
    // Clear mock elements to simulate missing meta tags
    mockMetaElements.clear()
    
    // Should not throw an error
    expect(() => {
      render(<SEO title="Test" description="Test desc" />)
    }).not.toThrow()
  })
})
