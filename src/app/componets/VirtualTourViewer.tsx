'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Scene } from '@/app/types/tour'

interface VirtualTourViewerProps {
  scene: Scene | null
  onSceneChange: (sceneId: string) => void
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ scene, onSceneChange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!scene || !containerRef.current) return

    let loadTimeout: NodeJS.Timeout

    // Load Pannellum library dynamically
    const loadPannellum = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Pannellum is already loaded
        if (!(window as any).pannellum) {
          // Add Pannellum CSS
          if (!document.getElementById('pannellum-css')) {
            const link = document.createElement('link')
            link.id = 'pannellum-css'
            link.rel = 'stylesheet'
            link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
            document.head.appendChild(link)
          }

          // Add Pannellum JS
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
          })
        }

        // Wait a bit for Pannellum to initialize
        await new Promise(resolve => setTimeout(resolve, 100))

        // Clear previous viewer
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy()
          } catch (e) {
            console.log('Viewer already destroyed')
          }
        }

        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }

        // Set a fallback timeout to hide loading if onLoad doesn't fire
        loadTimeout = setTimeout(() => {
          console.log('Load timeout - forcing loading state to false')
          setLoading(false)
        }, 5000)

        // Prepare hotspots for Pannellum
        const hotspots = (scene.hotspots || []).map((hotspot) => ({
          id: hotspot._id,
          pitch: hotspot.yawPitch.pitch,
          yaw: hotspot.yawPitch.yaw,
          type: hotspot.type === 'link' ? 'scene' : 'info',
          text: hotspot.label,
          sceneId: hotspot.targetSceneId,
          description: hotspot.description,
          createTooltipFunc: function(hotSpotDiv: HTMLElement) {
            hotSpotDiv.classList.add('custom-hotspot')
            hotSpotDiv.innerHTML = `
              <div class="hotspot-tooltip">
                <span class="hotspot-icon">${hotspot.type === 'link' ? '→' : 'ℹ'}</span>
                <span class="hotspot-label">${hotspot.label}</span>
              </div>
            `
          },
          clickHandlerFunc: function() {
            if (hotspot.type === 'link' && hotspot.targetSceneId) {
              onSceneChange(hotspot.targetSceneId)
            } else if (hotspot.type === 'info') {
              // Show info modal instead of alert
              const modal = document.createElement('div')
              modal.className = 'info-modal'
              modal.innerHTML = `
                <div class="info-modal-content">
                  <button class="info-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                  <h3>${hotspot.label}</h3>
                  <p>${hotspot.description || 'No description available'}</p>
                </div>
              `
              document.body.appendChild(modal)
              setTimeout(() => modal.classList.add('active'), 10)
            }
          }
        }))

        // Initialize Pannellum viewer
        const pannellum = (window as any).pannellum
        viewerRef.current = pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: scene.mediaUrl,
          autoLoad: true,
          showControls: true,
          showFullscreenCtrl: false,
          showZoomCtrl: true,
          mouseZoom: true,
          doubleClickZoom: true,
          draggable: true,
          keyboardZoom: true,
          friction: 0.15,
          
          // Camera settings
          yaw: scene.yawPitchFov.yaw,
          pitch: scene.yawPitchFov.pitch,
          hfov: scene.yawPitchFov.fov,
          
          // Limits
          minHfov: 30,
          maxHfov: 120,
          minPitch: -90,
          maxPitch: 90,
          
          // Auto rotate
          autoRotate: -2,
          autoRotateInactivityDelay: 3000,
          autoRotateStopDelay: 5000,
          
          // Hotspots
          hotSpots: hotspots
        })

        // Add event listeners
        viewerRef.current.on('load', function() {
          console.log('Pannellum loaded successfully')
          clearTimeout(loadTimeout)
          setLoading(false)
        })

        viewerRef.current.on('error', function(err: string) {
          console.error('Pannellum error:', err)
          clearTimeout(loadTimeout)
          setError('Failed to load 360° image')
          setLoading(false)
        })

        viewerRef.current.on('errorcleared', function() {
          setError(null)
        })

      } catch (err) {
        console.error('Error loading Pannellum:', err)
        clearTimeout(loadTimeout)
        setError('Failed to initialize 360° viewer')
        setLoading(false)
      }
    }

    loadPannellum()

    // Cleanup
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout)
      }
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy()
        } catch (e) {
          console.error('Error destroying viewer:', e)
        }
      }
    }
  }, [scene])

  if (!scene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <p className="text-white/60">No scene selected</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Pannellum container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-900"
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-white">Loading 360° view...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center max-w-md glass rounded-lg p-8">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for hotspots */}
      <style jsx global>{`
        .custom-hotspot {
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .custom-hotspot:hover {
          transform: scale(1.1);
        }
        
        .hotspot-tooltip {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .hotspot-icon {
          font-size: 16px;
          color: #FBBF24;
        }
        
        .hotspot-label {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }
        
        /* Info Modal */
        .info-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .info-modal.active {
          opacity: 1;
        }
        
        .info-modal-content {
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        
        .info-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 24px;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .info-modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .info-modal-content h3 {
          color: #FBBF24;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          padding-right: 40px;
        }
        
        .info-modal-content p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.6;
        }
        
        /* Override Pannellum default styles */
        .pnlm-container {
          background: #111827 !important;
        }
        
        .pnlm-load-box {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
        }
        
        .pnlm-load-box p {
          color: white !important;
        }
        
        .pnlm-lbox {
          background: rgba(0, 0, 0, 0.8) !important;
        }
        
        .pnlm-zoom-controls {
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 8px !important;
          padding: 4px !important;
        }
        
        .pnlm-zoom-in,
        .pnlm-zoom-out {
          background: transparent !important;
          color: white !important;
          width: 32px !important;
          height: 32px !important;
          margin: 2px !important;
          border-radius: 4px !important;
        }
        
        .pnlm-zoom-in:hover,
        .pnlm-zoom-out:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .pnlm-compass {
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  )
}

export default VirtualTourViewer