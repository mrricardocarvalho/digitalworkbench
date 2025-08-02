/**
 * React 19 Compatibility Layer
 * 
 * This file ensures compatibility between React 19 and dependencies
 * that might not be fully updated yet.
 */

import React from 'react';

// Ensure React is available globally for legacy dependencies
if (typeof window !== 'undefined') {
  // Make React hooks available globally
  (window as any).React = React;
  
  // Provide backward compatibility for useLayoutEffect
  if (!React.useLayoutEffect) {
    console.warn('useLayoutEffect not found in React, providing fallback');
    (React as any).useLayoutEffect = React.useEffect;
  }
}

// Re-export React to ensure it's properly available
export default React;
export {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  startTransition,
  Suspense,
  lazy,
  memo,
  forwardRef,
  createContext,
  createElement,
  cloneElement,
  isValidElement,
  Children,
  Fragment,
  StrictMode,
  Profiler,
} from 'react';
