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
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const React = await vi.importActual('react') as any;
  
  const createMotionComponent = (element: string) => ({ children, ...props }: any) => {
    const { 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      custom,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whileHover, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whileTap, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whileInView, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whileFocus, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whileDrag,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      drag, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dragConstraints, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dragElastic, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dragMomentum,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      layoutId, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      layout, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      layoutDependency,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      viewport, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      amount, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      once, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      margin, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      root,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAnimationStart, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAnimationComplete,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onUpdate, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDrag, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDragStart, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDragEnd,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onHoverStart, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onHoverEnd, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onTap, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onTapStart, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onTapCancel,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onViewportEnter, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onViewportLeave,
      style,
      ...domProps 
    } = props;
    
    return React.createElement(element, {
      ...domProps,
      style: { ...style },
      // Keep only valid DOM attributes
      'data-testid': domProps['data-testid'],
      className: domProps.className,
      id: domProps.id,
      role: domProps.role,
      tabIndex: domProps.tabIndex,
      'aria-label': domProps['aria-label']
    }, children);
  };

  return {
    ...actual,
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
