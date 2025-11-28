/**
 * React Example Component (Fixed imports)
 * Shows how to use zoom-pan library in a React application
 */

import React, { useEffect, useRef, useState } from 'react'
import { zoomPan } from 'zoom-pan'
import type { IZoomPanInstance } from 'zoom-pan'

interface ZoomPanCanvasProps {
  minScale?: number;
  maxScale?: number;
  scaleSensitivity?: number;
}

/**
 * Reusable React component for zoom/pan functionality
 *
 * @example
 * <ZoomPanCanvas minScale={0.5} maxScale={5} />
 */
export const ZoomPanCanvas: React.FC<
  ZoomPanCanvasProps & { children?: React.ReactNode }
> = ({
  minScale = 0.1,
  maxScale = 30,
  scaleSensitivity = 50,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  const zoomPanInstanceRef = useRef<IZoomPanInstance | null>(null)

  useEffect(() => {
    if (!contentRef.current) return;

    // Initialize zoom/pan
    const instance = zoomPan({
      element: contentRef.current,
      minScale,
      maxScale,
      scaleSensitivity,
    })

    zoomPanInstanceRef.current = instance;

    // Update state on user interaction
    const updateState = () => {
      const transform = contentRef.current?.style.transform
      const match = transform?.match(/matrix\((.+)\)/)

      if (match) {
        const values = match[1].split(',').map(v => parseFloat(v.trim()))
        const [scale, , , , tx, ty] = values

        setState({ scale, translateX: tx, translateY: ty })
      }
    }

    // Listen for changes
    contentRef.current.addEventListener('wheel', updateState)
    document.addEventListener('mouseup', updateState)

    // Cleanup
    return () => {
      contentRef.current?.removeEventListener('wheel', updateState)
      document.removeEventListener('mouseup', updateState)
      instance.destroy()
    }
  }, [minScale, maxScale, scaleSensitivity])

  const handleReset = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = ''
      contentRef.current.style.transformOrigin = ''
      setState({ scale: 1, translateX: 0, translateY: 0 })
    }
  }

  const handleZoomIn = () => {
    if (!contentRef.current || !zoomPanInstanceRef.current) return

    zoomPanInstanceRef.current.api.zoom({
      element: contentRef.current,        // ✅ Обязательно
      x: contentRef.current.offsetWidth / 2,
      y: contentRef.current.offsetHeight / 2,
      deltaScale: 1
    })
  }

  const handleZoomOut = () => {
    if (!contentRef.current || !zoomPanInstanceRef.current) return

    zoomPanInstanceRef.current.api.zoom({
      element: contentRef.current,
      x: contentRef.current.offsetWidth / 2,
      y: contentRef.current.offsetHeight / 2,
      deltaScale: -1
    })
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children || <div>Zoom & Pan Content</div>}
      </div>

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Zoom In
        </button>

        <button
          onClick={handleZoomOut}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Zoom Out
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#764ba2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#00ff00',
          padding: '0.75rem',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        <div>Scale: {state.scale.toFixed(2)}x</div>
        <div>X: {Math.round(state.translateX)}px</div>
        <div>Y: {Math.round(state.translateY)}px</div>
      </div>
    </div>
  )
}

export default ZoomPanCanvas

/**
 * Usage in a React app:
 *
 * import { ZoomPanCanvas } from './components/ZoomPanCanvas';
 *
 * function App() {
 *   return (
 *     <div style={{ width: '800px', height: '600px' }}>
 *       <ZoomPanCanvas minScale={0.5} maxScale={5}>
 *         <img src="image.jpg" alt="Zoomable content" />
 *       </ZoomPanCanvas>
 *     </div>
 *   );
 * }
 */
