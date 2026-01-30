'use client'

import React, { useState } from 'react'
import { 
  PhotoIcon, 
  MapPinIcon, 
  InformationCircleIcon,
  ArrowUpTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const AddScene = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    latitude: '',
    longitude: '',
    yaw: '0',
    pitch: '0',
    fov: '75',
    published: false
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }))
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 10MB' }))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!imagePreview) {
      newErrors.image = '360° panorama image is required'
    }
    if (!formData.latitude || !formData.longitude) {
      newErrors.coordinates = 'Coordinates are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setUploading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Scene data:', { ...formData, image: imagePreview })

      setFormData({
        title: '',
        slug: '',
        description: '',
        latitude: '',
        longitude: '',
        yaw: '0',
        pitch: '0',
        fov: '75',
        published: false
      })
      setImagePreview(null)

      alert('Scene added successfully!')
    } catch (error) {
      console.error('Error adding scene:', error)
      alert('Failed to add scene. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Scene</h1>
        <p className="text-white/70">
          Upload a 360° panorama and configure scene settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <PhotoIcon className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">360° Panorama Image</h2>
          </div>

          {!imagePreview ? (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center cursor-pointer hover:border-yellow-400/50 transition-colors">
                <ArrowUpTrayIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-white/50">
                  Recommended: Equirectangular 360° image (JPG, PNG)
                </p>
                <p className="text-xs text-white/40 mt-1">Max file size: 10MB</p>
              </div>
            </label>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {errors.image && (
            <p className="text-red-400 text-sm mt-2">{errors.image}</p>
          )}
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <InformationCircleIcon className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
          </div>

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
                placeholder="e.g., Main Gate, Central Quadrangle"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.title ? 'border-red-400' : 'border-white/10'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400`}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                URL Slug (auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/40 mt-1">
                URL: /tour/{formData.slug || 'scene-slug'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe this location and what visitors will see..."
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.description ? 'border-red-400' : 'border-white/10'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 resize-none`}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Location & Camera</h2>
          </div>

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
                step="0.0001"
                placeholder="18.5204"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.coordinates ? 'border-red-400' : 'border-white/10'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400`}
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
                step="0.0001"
                placeholder="73.8567"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.coordinates ? 'border-red-400' : 'border-white/10'
                } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400`}
              />
            </div>

            {errors.coordinates && (
              <p className="text-red-400 text-sm col-span-2">{errors.coordinates}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Yaw (°)
              </label>
              <input
                type="number"
                name="yaw"
                value={formData.yaw}
                onChange={handleInputChange}
                step="1"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/40 mt-1">Horizontal rotation (0-360)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Pitch (°)
              </label>
              <input
                type="number"
                name="pitch"
                value={formData.pitch}
                onChange={handleInputChange}
                step="1"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/40 mt-1">Vertical rotation (-90 to 90)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Field of View (°)
              </label>
              <input
                type="number"
                name="fov"
                value={formData.fov}
                onChange={handleInputChange}
                step="1"
                min="30"
                max="120"
                placeholder="75"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              />
              <p className="text-xs text-white/40 mt-1">Recommended: 75° (30-120)</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="w-5 h-5 rounded border-white/20 text-yellow-400 focus:ring-yellow-400"
            />
            <div>
              <div className="text-white font-medium">Publish immediately</div>
              <div className="text-sm text-white/60">
                Make this scene visible in the tour
              </div>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Adding Scene...' : 'Add Scene'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddScene