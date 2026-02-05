'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PhotoIcon, 
  MapPinIcon, 
  TrashIcon,
  LinkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface Hotspot {
  id: string
  type: 'link' | 'info'
  label: string
  yaw: number
  pitch: number
  targetSceneId?: string
  description?: string
  mediaUrl?: string
}

const AddScenePage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [availableScenes, setAvailableScenes] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    latitude: '',
    longitude: '',
    yaw: '0',
    pitch: '0',
    fov: '75',
    published: false,
    nextSceneId: ''
  })

  // Hotspots
  const [hotspots, setHotspots] = useState<Hotspot[]>([])

  // Image file
  const [imageFile, setImageFile] = useState<File | null>(null)

  React.useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch('/api/scenes')
        const data = await response.json()
        setAvailableScenes(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching scenes:', error)
      }
    }
    fetchScenes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, title: value, slug }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, etc.)')
        return
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addHotspot = (type: 'link' | 'info') => {
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      type,
      label: '',
      yaw: 0,
      pitch: 0,
      ...(type === 'link' ? { targetSceneId: '' } : { description: '', mediaUrl: '' })
    }
    setHotspots(prev => [...prev, newHotspot])
  }

  const updateHotspot = (id: string, field: string, value: any) => {
    setHotspots(prev => prev.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ))
  }

  const removeHotspot = (id: string) => {
    setHotspots(prev => prev.filter(h => h.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.slug) {
      alert('Please fill in all required fields')
      return
    }

    if (!imageFile) {
      alert('Please upload a 360° image')
      return
    }

    if (!formData.latitude || !formData.longitude) {
      alert('Please set the location coordinates')
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('image', imageFile)
      submitData.append('title', formData.title)
      submitData.append('slug', formData.slug)
      submitData.append('description', formData.description)
      submitData.append('latitude', formData.latitude)
      submitData.append('longitude', formData.longitude)
      submitData.append('yaw', formData.yaw)
      submitData.append('pitch', formData.pitch)
      submitData.append('fov', formData.fov)
      submitData.append('published', formData.published.toString())
      
      if (formData.nextSceneId) {
        submitData.append('nextSceneId', formData.nextSceneId)
      }

      // Add hotspots as JSON
      if (hotspots.length > 0) {
        submitData.append('hotspots', JSON.stringify(hotspots))
      }

      const response = await fetch('/api/scenes', {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create scene')
      }

      alert('Scene created successfully!')
      router.push('/admin/manage-scenes')
    } catch (error: any) {
      alert('Error: ' + error.message)
      console.error('Error creating scene:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Scene</h1>
        <p className="text-white/70">Create a new 360° scene for your virtual tour</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Scene Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Main Gate, Library, Sports Complex"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                URL Slug * (auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="main-gate"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe this location..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* 360° Image Upload */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">360° Image *</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <PhotoIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white mb-2">Upload 360° panoramic image</p>
                  <p className="text-white/60 text-sm mb-4">
                    JPG, PNG (Max 10MB) - Recommended: 4096x2048px equirectangular
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                  <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                    Choose Image
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Location & Camera Settings */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6" />
            Location & Camera Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Latitude *
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="0.000001"
                placeholder="18.5204"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Longitude *
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="0.000001"
                placeholder="73.8567"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Yaw (Horizontal Rotation)
              </label>
              <input
                type="number"
                name="yaw"
                value={formData.yaw}
                onChange={handleInputChange}
                min="-180"
                max="180"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/50 mt-1">-180 to 180 degrees</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Pitch (Vertical Rotation)
              </label>
              <input
                type="number"
                name="pitch"
                value={formData.pitch}
                onChange={handleInputChange}
                min="-90"
                max="90"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/50 mt-1">-90 to 90 degrees</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Field of View (FOV)
              </label>
              <input
                type="number"
                name="fov"
                value={formData.fov}
                onChange={handleInputChange}
                min="30"
                max="120"
                placeholder="75"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/50 mt-1">30 to 120 degrees (recommended: 75)</p>
            </div>
          </div>
        </div>

        {/* Tour Navigation */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Tour Navigation</h2>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Next Scene in Tour
            </label>
            <select
              name="nextSceneId"
              value={formData.nextSceneId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="">-- No connection --</option>
              {availableScenes.map(scene => (
                <option key={scene._id} value={scene._id}>
                  {scene.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-white/50 mt-1">
              Link this scene to the next scene in your tour sequence
            </p>
          </div>
        </div>

        {/* Hotspots */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Hotspots (Interactive Points)</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addHotspot('link')}
                className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Add Link
              </button>
              <button
                type="button"
                onClick={() => addHotspot('info')}
                className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <InformationCircleIcon className="w-4 h-4" />
                Add Info
              </button>
            </div>
          </div>

          {hotspots.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              No hotspots added yet. Add link or info hotspots to make your scene interactive.
            </p>
          ) : (
            <div className="space-y-4">
              {hotspots.map((hotspot, index) => (
                <div key={hotspot.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      hotspot.type === 'link' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {hotspot.type === 'link' ? 'Link Hotspot' : 'Info Hotspot'} #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHotspot(hotspot.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">Label</label>
                      <input
                        type="text"
                        value={hotspot.label}
                        onChange={(e) => updateHotspot(hotspot.id, 'label', e.target.value)}
                        placeholder="e.g., Library Entrance, Historical Info"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Yaw (°)</label>
                      <input
                        type="number"
                        value={hotspot.yaw}
                        onChange={(e) => updateHotspot(hotspot.id, 'yaw', parseFloat(e.target.value))}
                        min="-180"
                        max="180"
                        step="1"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Pitch (°)</label>
                      <input
                        type="number"
                        value={hotspot.pitch}
                        onChange={(e) => updateHotspot(hotspot.id, 'pitch', parseFloat(e.target.value))}
                        min="-90"
                        max="90"
                        step="1"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    {hotspot.type === 'link' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">Target Scene</label>
                        <select
                          value={hotspot.targetSceneId || ''}
                          onChange={(e) => updateHotspot(hotspot.id, 'targetSceneId', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                        >
                          <option value="">-- Select Scene --</option>
                          {availableScenes.map(scene => (
                            <option key={scene._id} value={scene._id}>
                              {scene.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {hotspot.type === 'info' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <textarea
                          value={hotspot.description || ''}
                          onChange={(e) => updateHotspot(hotspot.id, 'description', e.target.value)}
                          rows={2}
                          placeholder="Information to display..."
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publishing */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Publishing</h2>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="w-5 h-5 rounded border-white/20 text-yellow-400 focus:ring-yellow-400"
            />
            <div>
              <span className="text-white font-medium">Publish this scene</span>
              <p className="text-white/60 text-sm">Make this scene visible in the public tour</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Scene...' : 'Create Scene'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddScenePage