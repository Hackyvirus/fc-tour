'use client'

import React from 'react'
import { Maximize2, Map, Info } from 'lucide-react'

interface Props {
  currentScene: { title: string } | string
  showMap: boolean
  showInfo: boolean
  isFullscreen: boolean
  onToggleMap: () => void
  onToggleInfo: () => void
  onToggleFullscreen: () => void
}

const TourControls: React.FC<Props> = ({
  currentScene,
  showMap,
  showInfo,
  isFullscreen,
  onToggleMap,
  onToggleInfo,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center justify-center bg-gray-900/80 text-white py-2 px-4 gap-4">
      <span className="font-semibold">{typeof currentScene === 'object' ? currentScene?.title : currentScene || 'Tour'}</span>
      <button 
      >
        <Map className="inline-block w-4 h-4 mr-1" /> Map
      </button>
      <button 
        onClick={onToggleInfo} 
        className={`px-3 py-1 rounded-lg text-sm ${showInfo ? 'bg-yellow-400 text-black' : 'bg-white/20 hover:bg-white/30'}`}
      >
        <Info className="inline-block w-4 h-4 mr-1" /> Info
      </button>
      <button 
        onClick={onToggleFullscreen} 
        className="px-3 py-1 rounded-lg text-sm bg-white/20 hover:bg-white/30"
      >
        <Maximize2 className="inline-block w-4 h-4 mr-1" /> 
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  )
}

export default TourControls
