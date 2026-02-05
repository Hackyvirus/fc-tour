'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/app/componets/Header'
import VirtualTourViewer from '@/app/componets/VirtualTourViewer'
import CampusMap from '@/app/componets/CampusMap'
import SceneInfo from '@/app/componets/SceneInfo'
import TourControls from '@/app/componets/TourControls'
import SceneNavigation from '@/app/componets/SceneNavigation'
import LoadingSpinner from '@/app/componets/LoadingSpinner'
import { Scene } from '@/app/types/tour'


export default function TourClient({session}: {session: string})  {
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
        const response = await fetch('/api/scenes/published')

        if (!response.ok) {
          throw new Error('Failed to fetch scenes')
        }

        const data = await response.json()

        if (!data || !Array.isArray(data) || data.length === 0) {
          setError('No tour scenes available at the moment.')
          setLoading(false)
          return
        }

        const transformedScenes: Scene[] = data.map((scene: any) => ({
          _id: scene._id,
          title: scene.title,
          slug: scene.slug,
          description: scene.description || '',
          mediaUrl: scene.mediaUrl || scene.image_url,
          coords: {
            lat: parseFloat(scene.latitude) || 0,
            lng: parseFloat(scene.longitude) || 0
          },
          yawPitchFov: {
            yaw: parseInt(scene.yaw) || 0,
            pitch: parseInt(scene.pitch) || 0,
            fov: parseInt(scene.fov) || 75
          },
          published: scene.published,
          nextSceneId: scene.nextSceneId,
          hotspots: [] 
        }))

        setScenes(transformedScenes)

        const startingScene = transformedScenes.find(s => !s.nextSceneId) || transformedScenes[0]
        setCurrentScene(startingScene)

        setLoading(false)
      } catch (err) {
        setError('Failed to load tour data. Please try again later.')
        setLoading(false)
        console.error('Error fetching tour data:', err)
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

  const handleNextScene = () => {
    if (currentScene?.nextSceneId) {
      handleSceneChange(currentScene.nextSceneId)
    }
  }

  const handlePreviousScene = () => {
    if (!currentScene) return

    const previousScene = scenes.find(s => s.nextSceneId === currentScene._id)
    if (previousScene) {
      handleSceneChange(previousScene._id)
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextScene()
      } else if (e.key === 'ArrowLeft') {
        handlePreviousScene()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentScene, scenes])

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
        {currentScene && (
          <TourControls
            currentScene={currentScene}
            showMap={showMap}
            showInfo={showInfo}
            isFullscreen={isFullscreen}
            onToggleMap={() => setShowMap(!showMap)}
            onToggleInfo={() => setShowInfo(!showInfo)}
            onToggleFullscreen={toggleFullscreen}
            session={session}
          />
        )}

        <div className="flex-1 relative overflow-hidden">
          <VirtualTourViewer
            scene={currentScene}
            onSceneChange={handleSceneChange}
          />

          {currentScene && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
              {scenes.find(s => s.nextSceneId === currentScene._id) && (
                <button
                  onClick={handlePreviousScene}
                  className="glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                  title="Previous scene"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}

              {currentScene.nextSceneId && (
                <button
                  onClick={handleNextScene}
                  className="glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                  title="Next scene"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}

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

// export default TourClient