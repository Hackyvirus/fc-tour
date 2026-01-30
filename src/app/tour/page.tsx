'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/app/componets/Header'
import VirtualTourViewer from '@/app/componets/VirtualTourViewer'
import CampusMap from '@/app/componets/CampusMap'
import SceneInfo from '@/app/componets/SceneInfo'
import TourControls from '@/app/componets/TourControls'
import SceneNavigation from '@/app/componets/SceneNavigation'
import LoadingSpinner from '@/app/componets/LoadingSpinner'
import { Scene, Hotspot } from '@/app/types/tour'

const TourPage: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [showMap, setShowMap] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const mockScenes: Scene[] = [
          {
            _id: '1',
            title: 'Main Gate',
            slug: 'main-gate',
            description: 'Historic entrance to Fergusson College established in 1885. This magnificent gate has welcomed generations of students.',
            mediaUrl: 'data:image/jpeg;base64,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',
            coords: { lat: 18.5204, lng: 73.8567 },
            yawPitchFov: { yaw: 0, pitch: 0, fov: 75 },
            published: true,
            hotspots: [
              {
                _id: 'h1',
                sceneId: '1',
                type: 'link',
                targetSceneId: '2',
                label: 'Enter Campus →',
                yawPitch: { yaw: 0, pitch: 0 },
                order: 1
              },
              {
                _id: 'h2', 
                sceneId: '1',
                type: 'info',
                label: 'College History',
                mediaUrl: '/images/history.jpg',
                yawPitch: { yaw: 90, pitch: -10 },
                order: 2
              }
            ]
          },
          {
            _id: '2',
            title: 'Central Quadrangle',
            slug: 'central-quad',
            description: 'The heart of campus with beautiful colonial architecture and lush green lawns where students gather.',
            mediaUrl: '/images/quad-360.jpg',
            coords: { lat: 18.5206, lng: 73.8570 },
            yawPitchFov: { yaw: 45, pitch: 0, fov: 75 },
            published: true,
            hotspots: [
              {
                _id: 'h3',
                sceneId: '2',
                type: 'link',
                targetSceneId: '3',
                label: 'Main Library →',
                yawPitch: { yaw: 45, pitch: 0 },
                order: 1
              },
              {
                _id: 'h4',
                sceneId: '2',
                type: 'link',
                targetSceneId: '1',
                label: '← Back to Gate',
                yawPitch: { yaw: 180, pitch: 0 },
                order: 2
              }
            ]
          },
          {
            _id: '3',
            title: 'Main Library',
            slug: 'library',
            description: 'Modern library with extensive digital resources, study halls, and over 100,000 books and journals.',
            mediaUrl: '/images/library-360.jpg',
            coords: { lat: 18.5208, lng: 73.8572 },
            yawPitchFov: { yaw: 0, pitch: 0, fov: 75 },
            published: true,
            hotspots: [
              {
                _id: 'h5',
                sceneId: '3',
                type: 'info',
                label: 'Library Resources',
                mediaUrl: '/images/books.jpg',
                yawPitch: { yaw: 0, pitch: -20 },
                order: 1
              },
              {
                _id: 'h6',
                sceneId: '3',
                type: 'link',
                targetSceneId: '2',
                label: '← Back to Quad',
                yawPitch: { yaw: 180, pitch: 0 },
                order: 2
              }
            ]
          }
        ]
        
        setScenes(mockScenes)
        setCurrentScene(mockScenes[0])
        setLoading(false)
      } catch (err) {
        setError('Failed to load tour data. Please try again later.')
        setLoading(false)
      }
    }

    fetchTourData()
  }, [])

  const handleSceneChange = (sceneId: string) => {
    const scene = scenes.find(s => s._id === sceneId)
    if (scene) {
      setCurrentScene(scene)
      setShowInfo(false)
    }
  }

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner message="Loading virtual tour..." />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="glass rounded-lg p-8 text-center max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Unable to Load Tour
            </h2>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {!isFullscreen && <Header />}
      <div className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-80px)]'} flex flex-col`}>
        <TourControls
          currentScene={currentScene}
          showMap={showMap}
          showInfo={showInfo}
          isFullscreen={isFullscreen}
          onToggleMap={() => setShowMap(!showMap)}
          onToggleInfo={() => setShowInfo(!showInfo)}
          onToggleFullscreen={toggleFullscreen}
        />

        <div className="flex-1 relative overflow-hidden">
          <VirtualTourViewer
            scene={currentScene}
            onSceneChange={handleSceneChange}
          />
          
          {showMap && (
            <div className="absolute top-4 left-4 w-80 h-60 glass rounded-lg overflow-hidden z-10">
              <CampusMap
                scenes={scenes}
                currentScene={currentScene}
                onSceneSelect={handleSceneChange}
              />
            </div>
          )}
          
          {showInfo && currentScene && (
            <div className="absolute top-4 right-4 w-80 z-10">
              <SceneInfo 
                scene={currentScene} 
                onClose={() => setShowInfo(false)}
              />
            </div>
          )}
        </div>

        <SceneNavigation
          scenes={scenes}
          currentScene={currentScene}
          onSceneChange={handleSceneChange}
        />
      </div>
    </>
  )
}

export default TourPage