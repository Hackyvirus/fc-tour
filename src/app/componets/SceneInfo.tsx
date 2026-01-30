'use client'

import React from 'react'
import { Scene } from '../types/tour'
import { MapPin, Clock, Users, X, Info, Calendar, Building } from 'lucide-react'

interface SceneInfoProps {
  scene: Scene
  onClose?: () => void
}

const SceneInfo: React.FC<SceneInfoProps> = ({ scene, onClose }) => {
  const getSceneMetadata = (scene: Scene) => {
    // Mock metadata based on scene type/title
    const metadata = {
      'Main Gate': {
        type: 'Historic Entrance',
        established: '1885',
        accessibility: 'Public Access',
        hours: '24/7 Open',
        features: ['Historic Architecture', 'Welcome Center', 'Information Desk']
      },
      'Central Quadrangle': {
        type: 'Academic Hub',
        established: '1890',
        accessibility: 'Student Access',
        hours: '6:00 AM - 10:00 PM',
        features: ['Study Areas', 'WiFi Zone', 'Event Space']
      },
      'Main Library': {
        type: 'Academic Facility',
        established: '1920',
        accessibility: 'Students & Faculty',
        hours: '8:00 AM - 9:00 PM',
        features: ['100K+ Books', 'Digital Resources', 'Study Halls']
      }
    }
    
    return metadata[scene.title as keyof typeof metadata] || {
      type: 'Campus Location',
      established: 'N/A',
      accessibility: 'General Access',
      hours: 'Varies',
      features: ['Campus Facility']
    }
  }

  const sceneData = getSceneMetadata(scene)

  return (
    <div className="glass rounded-lg border border-white/20 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-white/20 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">
            {scene.title}
          </h3>
          <div className="flex items-center text-yellow-300 text-sm">
            <Building className="w-4 h-4 mr-1" />
            <span>{sceneData.type}</span>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-all"
            aria-label="Close info panel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <p className="text-white/90 leading-relaxed">
            {scene.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-white/70">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            <div>
              <div className="text-white/50 text-xs">Established</div>
              <div className="text-white">{sceneData.established}</div>
            </div>
          </div>
          
          <div className="flex items-center text-white/70">
            <Clock className="w-4 h-4 mr-2 text-yellow-400" />
            <div>
              <div className="text-white/50 text-xs">Hours</div>
              <div className="text-white">{sceneData.hours}</div>
            </div>
          </div>
          
          <div className="flex items-center text-white/70">
            <Users className="w-4 h-4 mr-2 text-yellow-400" />
            <div>
              <div className="text-white/50 text-xs">Access</div>
              <div className="text-white">{sceneData.accessibility}</div>
            </div>
          </div>
          
          <div className="flex items-center text-white/70">
            <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
            <div>
              <div className="text-white/50 text-xs">Hotspots</div>
              <div className="text-white">{scene.hotspots?.length || 0}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2 text-yellow-400" />
            Key Features
          </h4>
          <div className="flex flex-wrap gap-2">
            {sceneData.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs border border-white/20"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        {scene.coords && (
          <div className="pt-3 border-t border-white/20">
            <div className="text-xs text-white/60">
              <div>Coordinates:</div>
              <div className="font-mono">
                {scene.coords.lat.toFixed(6)}, {scene.coords.lng.toFixed(6)}
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-3 border-t border-white/20">
          <div className="text-xs text-white/60 leading-relaxed">
            💡 <strong>Tip:</strong> Look for colored hotspots to navigate to other areas 
            or get more information about specific features.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SceneInfo