'use client'

import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MapIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

interface Scene {
  _id: string
  title: string
  slug: string
  description: string
  mediaUrl: string
  published: boolean
  coords: { lat: number; lng: number }
  hotspots: number
  views: number
  createdAt: string
  nextSceneId?: string
}

const ManageScenes = () => {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchScenes()
  }, [])

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes')
      const data = await response.json()

      // Ensure data is an array
      const scenesArray = Array.isArray(data) ? data : []
      setScenes(scenesArray)
      setFilteredScenes(scenesArray)
    } catch (error) {
      console.error('Error fetching scenes:', error)
      setScenes([])
      setFilteredScenes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure scenes is an array before filtering
    if (!Array.isArray(scenes)) {
      setFilteredScenes([])
      return
    }

    let result = scenes

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(scene =>
        filterStatus === 'published' ? scene.published : !scene.published
      )
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(scene =>
        scene.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredScenes(result)
  }, [searchQuery, filterStatus, scenes])

  const togglePublishStatus = async (sceneId: string) => {
    setUpdating(sceneId)
    try {
      const scene = Array.isArray(scenes) ? scenes.find(s => s._id === sceneId) : null
      if (!scene) return

      const response = await fetch('/api/scenes/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          published: !scene.published
        })
      })

      if (response.ok) {
        setScenes(prev =>
          Array.isArray(prev)
            ? prev.map(s =>
              s._id === sceneId ? { ...s, published: !s.published } : s
            )
            : []
        )
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const updateNextScene = async (sceneId: string, nextSceneId: string) => {
    setUpdating(sceneId)
    try {
      const response = await fetch('/api/scenes/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          nextSceneId: nextSceneId || null
        })
      })

      if (response.ok) {
        setScenes(prev =>
          Array.isArray(prev)
            ? prev.map(s =>
              s._id === sceneId ? { ...s, nextSceneId: nextSceneId || undefined } : s
            )
            : []
        )
      }
    } catch (error) {
      console.error('Error updating next scene:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (sceneId: string) => {
    try {
      const response = await fetch(`/api/scenes/${sceneId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setScenes(prev => Array.isArray(prev) ? prev.filter(scene => scene._id !== sceneId) : [])
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error deleting scene:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading scenes...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Scenes</h1>
          <p className="text-white/70">
            Edit, organize, and publish your virtual tour scenes
          </p>
        </div>
        <Link
          href="/admin/add-scene"
          className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Scene
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="glass rounded-xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenes..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white/5 text-white hover:bg-white/10'
                }`}
            >
              All ({Array.isArray(scenes) ? scenes.length : 0})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'published'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white/5 text-white hover:bg-white/10'
                }`}
            >
              Published ({Array.isArray(scenes) ? scenes.filter(s => s.published).length : 0})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'draft'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white/5 text-white hover:bg-white/10'
                }`}
            >
              Drafts ({Array.isArray(scenes) ? scenes.filter(s => !s.published).length : 0})
            </button>
          </div>
        </div>
      </div>

      {/* Scenes Grid/List */}
      {filteredScenes.length === 0 ? (
        <div className="glass rounded-xl p-12 border border-white/10 text-center">
          <MapIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No scenes found
          </h3>
          <p className="text-white/60 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by adding your first scene'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/add-scene"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Scene
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScenes.map((scene) => (
            <div
              key={scene._id}
              className="glass rounded-xl border border-white/10 overflow-hidden"
            >
              {/* Scene Image */}
              <div className="relative h-48 bg-white/5">
                <Image
                  width={200}
                  height={100}
                  src={scene.mediaUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${scene.published
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                  >
                    {scene.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Scene Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {scene.title}
                </h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {scene.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-white/50">
                  <span>{scene.hotspots} hotspots</span>
                  <span>•</span>
                  <span>{scene.views} views</span>
                  <span>•</span>
                  <span>/{scene.slug}</span>
                </div>

                {/* Next Scene Connection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Connect to Next Scene
                  </label>
                  <select
                    value={scene.nextSceneId || ''}
                    onChange={(e) => updateNextScene(scene._id, e.target.value)}
                    disabled={updating === scene._id}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  >
                    <option value="">-- No Connection --</option>
                    {Array.isArray(scenes) && scenes
                      .filter(s => s._id !== scene._id)
                      .map(s => (
                        <option key={s._id} value={s._id}>
                          {s.title}
                        </option>
                      ))}
                  </select>
                  {scene.nextSceneId && Array.isArray(scenes) && (
                    <p className="text-xs text-white/50 mt-1">
                      → {scenes.find(s => s._id === scene.nextSceneId)?.title}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublishStatus(scene._id)}
                    disabled={updating === scene._id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
                    title={scene.published ? 'Unpublish' : 'Publish'}
                  >
                    {scene.published ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                    {scene.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <Link
                    href={`/admin/edit-scene/${scene._id}`}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>

                  {deleteConfirm === scene._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(scene._id)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(scene._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="glass rounded-xl p-6 border border-white/10 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {Array.isArray(scenes) ? scenes.length : 0}
            </div>
            <div className="text-sm text-white/60">Total Scenes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {Array.isArray(scenes) ? scenes.filter(s => s.published).length : 0}
            </div>
            <div className="text-sm text-white/60">Published</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {Array.isArray(scenes) ? scenes.filter(s => !s.published).length : 0}
            </div>
            <div className="text-sm text-white/60">Drafts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {Array.isArray(scenes) ? scenes.reduce((acc, scene) => acc + scene.views, 0) : 0}
            </div>
            <div className="text-sm text-white/60">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageScenes