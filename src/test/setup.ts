import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

// Global test setup
beforeEach(() => {
  // Reset any mocks or globals before each test
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

// Mock ResizeObserver  
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react') as any;
  
  const createMotionComponent = (element: string) => ({ children, ...props }: any) => {
    const { 
      animate, initial, exit, variants, transition, custom,
      whileHover, whileTap, whileInView, whileFocus, whileDrag,
      drag, dragConstraints, dragElastic, dragMomentum,
      layoutId, layout, layoutDependency,
      viewport, amount, once, margin, root,
      onAnimationStart, onAnimationComplete,
      onUpdate, onDrag, onDragStart, onDragEnd,
      onHoverStart, onHoverEnd, onTap, onTapStart, onTapCancel,
      onViewportEnter, onViewportLeave,
      style,
      ...domProps 
    } = props;
    
    return React.createElement(element, {
      ...domProps,
      style: { ...style }
    }, children);
  };

  return {
    motion: {
      div: createMotionComponent('div'),
      section: createMotionComponent('section'),
      main: createMotionComponent('main'),
      article: createMotionComponent('article'),
      header: createMotionComponent('header'),
      footer: createMotionComponent('footer'),
      nav: createMotionComponent('nav'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      p: createMotionComponent('p'),
      ul: createMotionComponent('ul'),
      li: createMotionComponent('li'),
      img: createMotionComponent('img'),
      a: createMotionComponent('a'),
      form: createMotionComponent('form'),
      input: createMotionComponent('input'),
      textarea: createMotionComponent('textarea'),
      select: createMotionComponent('select'),
      option: createMotionComponent('option'),
      canvas: createMotionComponent('canvas'),
    },
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
    domAnimation: {},
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useAnimationControls: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn()
    }),
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
    useSpring: () => 0,
    useMotionValue: (value: any) => ({
      get: () => value,
      set: vi.fn(),
      on: vi.fn(),
      clearListeners: vi.fn()
    }),
    useViewportScroll: () => ({
      scrollX: { get: () => 0, set: vi.fn() },
      scrollY: { get: () => 0, set: vi.fn() },
      scrollXProgress: { get: () => 0, set: vi.fn() },
      scrollYProgress: { get: () => 0, set: vi.fn() }
    }),
    useDragControls: () => ({
      start: vi.fn()
    }),
    useMotionTemplate: () => 'mock-template',
    stagger: vi.fn(),
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    cubicBezier: vi.fn()
  }
})
