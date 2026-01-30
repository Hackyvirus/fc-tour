'use client'

import React, { useEffect, useRef } from 'react'
import { Scene } from '../types/tour'
import { MapPin, Navigation } from 'lucide-react'

interface CampusMapProps {
  scenes: Scene[]
  currentScene: Scene | null
  onSceneSelect: (sceneId: string) => void
}

const CampusMap: React.FC<CampusMapProps> = ({ 
  scenes, 
  currentScene, 
  onSceneSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)

  // Mock MapLibre GL JS initialization
  useEffect(() => {
    if (!mapRef.current) return

    // In real implementation, initialize MapLibre GL JS here:
    // const map = new maplibregl.Map({
    //   container: mapRef.current,
    //   style: 'https://demotiles.maplibre.org/style.json',
    //   center: [73.8567, 18.5204],
    //   zoom: 17
    // })
    
    // Add markers for each scene
    // scenes.forEach(scene => {
    //   if (scene.coords) {
    //     const marker = new maplibregl.Marker()
    //       .setLngLat([scene.coords.lng, scene.coords.lat])
    //       .addTo(map)
    //   }
    // })

    return () => {
      // Cleanup map
    }
  }, [scenes])

  const getScenePosition = (scene: Scene, index: number) => {
    // Mock positioning based on scene coords or fallback to grid
    if (scene.coords) {
      // Convert lat/lng to percentage (simplified)
      const x = ((scene.coords.lng - 73.8550) / 0.0050) * 100
      const y = ((18.5220 - scene.coords.lat) / 0.0020) * 100
      return {
        left: `${Math.max(5, Math.min(95, x))}%`,
        top: `${Math.max(5, Math.min(95, y))}%`
      }
    }
    
    // Fallback grid positioning
    const cols = Math.ceil(Math.sqrt(scenes.length))
    const row = Math.floor(index / cols)
    const col = index % cols
    return {
      left: `${15 + (col * 70 / Math.max(1, cols - 1))}%`,
      top: `${20 + (row * 60 / Math.max(1, Math.ceil(scenes.length / cols) - 1))}%`
    }
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div 
          ref={mapRef}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), 
                             url('https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop')`
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 20 30 Q 50 25 80 35 T 90 60 Q 70 80 40 75 T 20 30"
              stroke="#10b981"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
              opacity="0.6"
            />
            <path
              d="M 15 50 L 85 50 M 50 15 L 50 85"
              stroke="#10b981"
              strokeWidth="0.3"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>
      
      {scenes.map((scene, index) => {
        const isActive = currentScene?._id === scene._id
        const position = getScenePosition(scene, index)
        
        return (
          <button
            key={scene._id}
            onClick={() => onSceneSelect(scene._id)}
            className={`absolute group transition-all duration-300 hover:scale-110 transform -translate-x-1/2 -translate-y-1/2 ${
              isActive ? 'z-20' : 'z-10'
            }`}
            style={position}
            title={scene.title}
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all ${
              isActive 
                ? 'bg-yellow-400 scale-125 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}>
              <span className="text-xs text-white font-bold">
                {index + 1}
              </span>
              
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping"></div>
              )}
            </div>
            
            <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap transition-all ${
              isActive 
                ? 'bg-yellow-400 text-gray-900 opacity-100' 
                : 'bg-black/80 text-white opacity-0 group-hover:opacity-100'
            }`}>
              {scene.title}
            </div>
          </button>
        )
      })}
      
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button
          className="w-8 h-8 bg-white/90 rounded shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          title="Reset view"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded p-2">
        <div className="text-xs text-gray-700 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">•</span>
            </div>
            <span>Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">•</span>
            </div>
            <span>Available Scenes ({scenes.length})</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 left-2 w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center">
        <div className="text-xs font-bold text-gray-700">N</div>
        <div className="absolute top-1 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500"></div>
      </div>
    </div>
  )
}

export default CampusMap