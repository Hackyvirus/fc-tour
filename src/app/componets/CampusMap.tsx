'use client'

import React, { useEffect, useRef } from 'react'
import { Scene } from '@/app/types/tour'

interface CampusMapProps {
  scenes: Scene[]
  currentScene: Scene | null
  onSceneSelect: (sceneId: string) => void
}

const CampusMap: React.FC<CampusMapProps> = ({ scenes, currentScene, onSceneSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapRef.current) return

    const initMap = async () => {
      try {
        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (!(window as any).L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
            script.crossOrigin = ''
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
          })
        }

        const L = (window as any).L

        // Clear existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        // Calculate center of all scenes
        const avgLat = scenes.reduce((sum, s) => sum + s.coords.lat, 0) / scenes.length
        const avgLng = scenes.reduce((sum, s) => sum + s.coords.lng, 0) / scenes.length

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: false
        }).setView([avgLat, avgLng], 16)

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(mapInstanceRef.current)

        // Add custom CSS for markers
        const style = document.createElement('style')
        style.textContent = `
          .scene-marker {
            width: 30px;
            height: 30px;
            background: rgba(251, 191, 36, 0.9);
            border: 3px solid rgba(17, 24, 39, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #111827;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          
          .scene-marker:hover {
            transform: scale(1.2);
            background: rgba(251, 191, 36, 1);
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
          }
          
          .scene-marker.active {
            background: rgba(239, 68, 68, 0.9);
            border-color: rgba(17, 24, 39, 1);
            transform: scale(1.3);
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            50% {
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
          }
          
          .leaflet-popup-content-wrapper {
            background: rgba(17, 24, 39, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
          }
          
          .leaflet-popup-tip {
            background: rgba(17, 24, 39, 0.95);
          }
          
          .scene-popup-title {
            font-weight: bold;
            margin-bottom: 4px;
            color: #FBBF24;
          }
          
          .scene-popup-desc {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 8px;
          }
          
          .scene-popup-btn {
            background: #FBBF24;
            color: #111827;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
          }
          
          .scene-popup-btn:hover {
            background: #F59E0B;
          }
        `
        if (!document.getElementById('map-custom-styles')) {
          style.id = 'map-custom-styles'
          document.head.appendChild(style)
        }

        // Clear old markers
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        // Add markers for each scene
        scenes.forEach((scene, index) => {
          const isActive = currentScene?._id === scene._id
          
          const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="scene-marker ${isActive ? 'active' : ''}">${index + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })

          const marker = L.marker([scene.coords.lat, scene.coords.lng], {
            icon: markerIcon
          }).addTo(mapInstanceRef.current)

          // Add popup
          const popupContent = `
            <div style="padding: 8px;">
              <div class="scene-popup-title">${scene.title}</div>
              <div class="scene-popup-desc">${scene.description || 'No description'}</div>
              <button class="scene-popup-btn" onclick="window.selectScene('${scene._id}')">
                ${isActive ? 'Current Scene' : 'Go to Scene'}
              </button>
            </div>
          `
          marker.bindPopup(popupContent)

          // Store marker
          markersRef.current.push(marker)

          // Add click event
          marker.on('click', () => {
            if (!isActive) {
              onSceneSelect(scene._id)
            }
          })
        })

        // Add lines between connected scenes
        scenes.forEach(scene => {
          if (scene.nextSceneId) {
            const nextScene = scenes.find(s => s._id === scene.nextSceneId)
            if (nextScene) {
              L.polyline(
                [
                  [scene.coords.lat, scene.coords.lng],
                  [nextScene.coords.lat, nextScene.coords.lng]
                ],
                {
                  color: '#FBBF24',
                  weight: 2,
                  opacity: 0.6,
                  dashArray: '5, 10'
                }
              ).addTo(mapInstanceRef.current)
            }
          }
        })

        // Pan to current scene if exists
        if (currentScene) {
          mapInstanceRef.current.panTo([currentScene.coords.lat, currentScene.coords.lng])
        }

        // Make selectScene available globally for popup buttons
        ;(window as any).selectScene = onSceneSelect

      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markersRef.current = []
    }
  }, [scenes, currentScene])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map legend */}
      <div className="absolute bottom-2 left-2 glass rounded-lg p-2 text-xs text-white/80 z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Scenes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  )
}

export default CampusMap