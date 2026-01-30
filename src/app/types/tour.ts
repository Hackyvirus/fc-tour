export interface User {
  _id: string
  name: string
  email: string
  password_hash: string
  role: 'admin' | 'viewer'
  createdAt: Date
}

export interface Scene {
  _id: string
  title: string
  slug: string
  description: string
  mediaUrl: string
  mediaPublicId?: string
  coords?: { lat: number; lng: number }
  yawPitchFov?: { yaw: number; pitch: number; fov: number }
  published: boolean
  createdBy?: string
  createdAt?: Date
  hotspots: Hotspot[]
}

export interface Hotspot {
  _id: string
  sceneId: string
  type: 'link' | 'info'
  targetSceneId?: string
  label?: string
  mediaUrl?: string
  yawPitch: { yaw: number; pitch: number }
  order?: number
  createdAt?: Date
}

export interface MediaAsset {
  _id: string
  url: string
  publicId: string
  type: 'image' | 'video'
  meta?: {
    size?: number
    width?: number
    height?: number
    format?: string
  }
  uploadedBy: string
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}


export interface SceneResponse extends ApiResponse<Scene> {}
export interface ScenesResponse extends ApiResponse<Scene[]> {}
export interface HotspotResponse extends ApiResponse<Hotspot> {}
export interface MediaResponse extends ApiResponse<MediaAsset> {}

export interface SceneFormData {
  title: string
  slug: string
  description: string
  mediaUrl?: string
  coords?: { lat: number; lng: number }
  yawPitchFov?: { yaw: number; pitch: number; fov: number }
  published: boolean
}

export interface HotspotFormData {
  sceneId: string
  type: 'link' | 'info'
  targetSceneId?: string
  label?: string
  mediaUrl?: string
  yawPitch: { yaw: number; pitch: number }
  order?: number
}

export interface TourViewerProps {
  scene: Scene | null
  onSceneChange: (sceneId: string) => void
}

export interface CampusMapProps {
  scenes: Scene[]
  currentScene: Scene | null
  onSceneSelect: (sceneId: string) => void
}

export interface SceneInfoProps {
  scene: Scene
  onClose?: () => void
}

export interface TourControlsProps {
  currentScene: Scene | null
  showMap: boolean
  showInfo: boolean
  isFullscreen: boolean
  onToggleMap: () => void
  onToggleInfo: () => void
  onToggleFullscreen: () => void
}

export interface SceneNavigationProps {
  scenes: Scene[]
  currentScene: Scene | null
  onSceneChange: (sceneId: string) => void
}

export interface AdminStats {
  totalScenes: number
  publishedScenes: number
  totalHotspots: number
  totalViews?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: 'admin' | 'viewer'
}