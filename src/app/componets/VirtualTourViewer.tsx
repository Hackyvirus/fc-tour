'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Scene, Hotspot } from '../types/tour'
import { Info, ArrowRight, X } from 'lucide-react'
import Image from 'next/image'


interface VirtualTourViewerProps {
  scene: Scene | null
  onSceneChange: (sceneId: string) => void
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ 
  scene, 
  onSceneChange 
}) => {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewerError, setViewerError] = useState<string | null>(null)

  useEffect(() => {
    if (!viewerRef.current || !scene) return

    const loadScene = async () => {
      try {
        setIsLoading(true)
        setViewerError(null)


        if (viewerRef.current) {
          viewerRef.current.style.backgroundImage = `url(${scene.mediaUrl})`
          viewerRef.current.style.backgroundSize = 'cover'
          viewerRef.current.style.backgroundPosition = 'center'
        }

        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setViewerError('Failed to load 360° scene')
        setIsLoading(false)
      }
    }

    loadScene()
    return () => setSelectedHotspot(null)
  }, [scene])

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'link' && hotspot.targetSceneId) {
      setIsLoading(true)
      setTimeout(() => {
        onSceneChange(hotspot.targetSceneId!)
      }, 300)
    } else if (hotspot.type === 'info') {
      setSelectedHotspot(hotspot)
    }
  }

  const renderHotspots = () => {
    if (!scene?.hotspots) return null

    return scene.hotspots.map((hotspot) => {
      const x = 50 + (hotspot.yawPitch.yaw / 360) * 40
      const y = 50 - (hotspot.yawPitch.pitch / 90) * 30
      
      return (
        <button
          key={hotspot._id}
          onClick={() => handleHotspotClick(hotspot)}
          aria-label={hotspot.label || `Hotspot ${hotspot.type}`}
          className="absolute group"
          style={{
            left: `${Math.max(5, Math.min(95, x))}%`,
            top: `${Math.max(5, Math.min(95, y))}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md 
            ${hotspot.type === 'link' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
            {hotspot.type === 'link' 
              ? <ArrowRight className="w-5 h-5 text-white" /> 
              : <Info className="w-5 h-5 text-white" />}
          </div>

          {/* Label */}
          {hotspot.label && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 
              bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
              {hotspot.label}
            </div>
          )}

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
        </button>
      )
    })
  }

  if (!scene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/70">
        No scene selected
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      {/* Panorama container */}
      <div ref={viewerRef} className="w-full h-full relative">
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <div className="text-white">Loading scene...</div>
          </div>
        )}

        {/* Error */}
        {viewerError && (
          <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center z-20">
            <div className="p-6 bg-gray-900/90 rounded-lg text-center">
              <p className="text-red-400 mb-2">⚠️ {viewerError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 px-4 py-2 rounded text-white"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Hotspots */}
        {!isLoading && !viewerError && renderHotspots()}
      </div>

      {/* Info modal */}
      {selectedHotspot && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 p-4">
          <div className="bg-gray-900/90 rounded-lg max-w-md w-full p-6 relative text-white">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-3">
              {selectedHotspot.label || 'Information'}
            </h3>

            {selectedHotspot.mediaUrl && (
              <Image
                src={selectedHotspot.mediaUrl}
                alt={selectedHotspot.label || 'Hotspot media'}
                className="w-full h-40 object-cover rounded mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+Not+Found'
                }}
              />
            )}

            <p>
              Learn more about this campus location. This hotspot provides 
              additional context or resources.
            </p>

            <button
              onClick={() => setSelectedHotspot(null)}
              className="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Scene footer */}
      <div className="absolute bottom-4 left-4 right-4 bg-gray-900/70 rounded-lg p-3 z-10">
        <h3 className="text-white font-semibold">{scene.title}</h3>
        <p className="text-white/80 text-sm">{scene.description}</p>
      </div>
    </div>
  )
}

export default VirtualTourViewer
