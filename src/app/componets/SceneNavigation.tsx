'use client'

import React from 'react'
import { Scene } from '@/app/types/tour'

interface Props {
  scenes: Scene[]
  currentScene: Scene | null
  onSceneChange: (sceneId: string) => void
}

const SceneNavigation: React.FC<Props> = ({ scenes, currentScene, onSceneChange }) => {
  return (
    <div className="bg-gray-900/90 text-white flex overflow-x-auto px-4 py-2 gap-4">
      {scenes.map(scene => (
        <button
          key={scene._id}
          onClick={() => onSceneChange(scene._id)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition 
            ${currentScene?._id === scene._id 
              ? 'bg-yellow-400 text-black font-semibold' 
              : 'bg-white/20 hover:bg-white/30'}`}
        >
          {scene.title}
        </button>
      ))}
    </div>
  )
}

export default SceneNavigation
