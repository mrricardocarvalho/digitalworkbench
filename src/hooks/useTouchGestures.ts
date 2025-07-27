import { useState, useRef, useCallback } from 'react';

interface TouchGesture {
  startTime: number;
  startTouches: React.TouchList;
  currentTouches: React.TouchList | null;
  deltaX: number;
  deltaY: number;
  distance: number;
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
  isValid: boolean;
}

interface TouchHandlers {
  onPan?: (gesture: TouchGesture) => void;
  onPinch?: (gesture: TouchGesture) => void;
  onRotate?: (gesture: TouchGesture) => void;
  onTap?: (gesture: TouchGesture) => void;
  onDoubleTap?: (gesture: TouchGesture) => void;
  onLongPress?: (gesture: TouchGesture) => void;
}

interface GestureOptions {
  preventScroll?: boolean;
  minPanDistance?: number;
  minPinchScale?: number;
  doubleTapDelay?: number;
  longPressDelay?: number;
}

export const useTouchGestures = (
  handlers: TouchHandlers,
  options: GestureOptions = {}
) => {
  const {
    preventScroll = true,
    minPanDistance = 10,
    minPinchScale = 0.1,
    doubleTapDelay = 300,
    longPressDelay = 500
  } = options;

  const [gesture, setGesture] = useState<TouchGesture | null>(null);
  const gestureRef = useRef<TouchGesture | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  const calculateDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateAngle = (touch1: React.Touch, touch2: React.Touch): number => {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI;
  };

  const getCenterPoint = (touches: React.TouchList): { x: number; y: number } => {
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches.item(i);
      if (touch) {
        x += touch.clientX;
        y += touch.clientY;
      }
    }
    return { x: x / touches.length, y: y / touches.length };
  };

  const clearTimers = () => {
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    clearTimers();

    const touches = e.touches;
    const now = Date.now();

    const newGesture: TouchGesture = {
      startTime: now,
      startTouches: touches,
      currentTouches: touches,
      deltaX: 0,
      deltaY: 0,
      distance: touches.length > 1 && touches.item(0) && touches.item(1) 
        ? calculateDistance(touches.item(0)!, touches.item(1)!) 
        : 0,
      scale: 1,
      rotation: 0,
      velocity: { x: 0, y: 0 },
      isValid: true
    };

    setGesture(newGesture);
    gestureRef.current = newGesture;

    // Long press detection for single touch
    if (touches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        if (gestureRef.current && handlers.onLongPress) {
          handlers.onLongPress(gestureRef.current);
        }
      }, longPressDelay);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers, preventScroll, longPressDelay]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!gestureRef.current) return;

    const touches = e.touches;
    const currentGesture = gestureRef.current;
    const startCenter = getCenterPoint(currentGesture.startTouches);
    const currentCenter = getCenterPoint(touches);

    const deltaX = currentCenter.x - startCenter.x;
    const deltaY = currentCenter.y - startCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate velocity
    const timeDelta = Date.now() - currentGesture.startTime;
    const velocity = {
      x: timeDelta > 0 ? deltaX / timeDelta : 0,
      y: timeDelta > 0 ? deltaY / timeDelta : 0
    };

    const updatedGesture: TouchGesture = {
      ...currentGesture,
      currentTouches: touches,
      deltaX,
      deltaY,
      velocity,
      isValid: distance > minPanDistance || touches.length > 1
    };

    // Handle multi-touch gestures
    if (touches.length === 2 && currentGesture.startTouches.length === 2) {
      const touch0 = touches.item(0);
      const touch1 = touches.item(1);
      const startTouch0 = currentGesture.startTouches.item(0);
      const startTouch1 = currentGesture.startTouches.item(1);
      
      if (touch0 && touch1 && startTouch0 && startTouch1) {
        const currentDistance = calculateDistance(touch0, touch1);
        const startDistance = calculateDistance(startTouch0, startTouch1);
        
        const scale = startDistance > 0 ? currentDistance / startDistance : 1;
        const currentAngle = calculateAngle(touch0, touch1);
        const startAngle = calculateAngle(startTouch0, startTouch1);
        const rotation = currentAngle - startAngle;

        updatedGesture.scale = scale;
        updatedGesture.rotation = rotation;
        updatedGesture.distance = currentDistance;

        // Trigger pinch handler
        if (Math.abs(scale - 1) > minPinchScale && handlers.onPinch) {
          handlers.onPinch(updatedGesture);
        }

        // Trigger rotate handler
        if (Math.abs(rotation) > 5 && handlers.onRotate) {
          handlers.onRotate(updatedGesture);
        }
      }
    }

    // Handle pan gesture
    if (updatedGesture.isValid && handlers.onPan) {
      handlers.onPan(updatedGesture);
    }

    setGesture(updatedGesture);
    gestureRef.current = updatedGesture;

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers, minPanDistance, minPinchScale, preventScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    clearTimers();

    if (!gestureRef.current) return;

    const currentGesture = gestureRef.current;
    const distance = Math.sqrt(currentGesture.deltaX ** 2 + currentGesture.deltaY ** 2);
    const duration = Date.now() - currentGesture.startTime;

    // Handle tap gestures
    if (distance < minPanDistance && duration < 500) {
      tapCountRef.current++;

      if (tapCountRef.current === 1) {
        // Wait for potential double tap
        tapTimerRef.current = setTimeout(() => {
          if (handlers.onTap) {
            handlers.onTap(currentGesture);
          }
          tapCountRef.current = 0;
        }, doubleTapDelay);
      } else if (tapCountRef.current === 2) {
        // Double tap detected
        if (tapTimerRef.current) {
          clearTimeout(tapTimerRef.current);
          tapTimerRef.current = null;
        }
        if (handlers.onDoubleTap) {
          handlers.onDoubleTap(currentGesture);
        }
        tapCountRef.current = 0;
      }
    }

    setGesture(null);
    gestureRef.current = null;

    if (preventScroll) {
      e.preventDefault();
    }
  }, [handlers, minPanDistance, doubleTapDelay]);

  return {
    gesture,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};

export default useTouchGestures;
