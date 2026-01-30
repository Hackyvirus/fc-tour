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
}

const ManageScenes = () => {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching scenes
    const fetchScenes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockScenes: Scene[] = [
        {
          _id: '1',
          title: 'Main Gate',
          slug: 'main-gate',
          description: 'Historic entrance to Fergusson College established in 1885.',
          mediaUrl: '/images/gate.jpg',
          published: true,
          coords: { lat: 18.5204, lng: 73.8567 },
          hotspots: 2,
          views: 1245,
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Central Quadrangle',
          slug: 'central-quad',
          description: 'The heart of campus with beautiful colonial architecture.',
          mediaUrl: '/images/quad.jpg',
          published: true,
          coords: { lat: 18.5206, lng: 73.8570 },
          hotspots: 4,
          views: 892,
          createdAt: '2024-01-16'
        },
        {
          _id: '3',
          title: 'Main Library',
          slug: 'library',
          description: 'Modern library with extensive digital resources.',
          mediaUrl: '/images/library.jpg',
          published: true,
          coords: { lat: 18.5208, lng: 73.8572 },
          hotspots: 3,
          views: 710,
          createdAt: '2024-01-17'
        },
        {
          _id: '4',
          title: 'Science Block',
          slug: 'science-block',
          description: 'State-of-the-art laboratories and research facilities.',
          mediaUrl: '/images/science.jpg',
          published: false,
          coords: { lat: 18.5210, lng: 73.8574 },
          hotspots: 1,
          views: 0,
          createdAt: '2024-01-18'
        },
        {
          _id: '5',
          title: 'Sports Complex',
          slug: 'sports-complex',
          description: 'Indoor and outdoor sports facilities.',
          mediaUrl: '/images/sports.jpg',
          published: false,
          coords: { lat: 18.5212, lng: 73.8576 },
          hotspots: 0,
          views: 0,
          createdAt: '2024-01-19'
        }
      ]

      setScenes(mockScenes)
      setFilteredScenes(mockScenes)
      setLoading(false)
    }

    fetchScenes()
  }, [])

  useEffect(() => {
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

  const togglePublishStatus = (sceneId: string) => {
    setScenes(prev =>
      prev.map(scene =>
        scene._id === sceneId ? { ...scene, published: !scene.published } : scene
      )
    )
  }

  const handleDelete = (sceneId: string) => {
    setScenes(prev => prev.filter(scene => scene._id !== sceneId))
    setDeleteConfirm(null)
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              All ({scenes.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Published ({scenes.filter(s => s.published).length})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Drafts ({scenes.filter(s => !s.published).length})
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
              className="glass rounded-xl border border-white/10 overflow-hidden hover:border-yellow-400/30 transition-colors"
            >
              {/* Scene Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapIcon className="w-16 h-16 text-white/20" />
                </div>
                {!scene.published && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 rounded-full text-xs font-semibold text-white">
                    Draft
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {scene.hotspots} hotspots
                  </div>
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {scene.views} views
                  </div>
                </div>
              </div>

              {/* Scene Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {scene.title}
                </h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {scene.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                  <MapIcon className="w-4 h-4" />
                  <span>
                    {scene.coords.lat.toFixed(4)}, {scene.coords.lng.toFixed(4)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>Added {new Date(scene.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublishStatus(scene._id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      scene.published
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                    }`}
                  >
                    {scene.published ? (
                      <>
                        <EyeIcon className="w-4 h-4" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => alert(`Edit scene: ${scene.title}`)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>

                  {deleteConfirm === scene._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(scene._id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(scene._id)}
                      className="flex items-center justify-center p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
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
              {scenes.length}
            </div>
            <div className="text-sm text-white/60">Total Scenes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {scenes.filter(s => s.published).length}
            </div>
            <div className="text-sm text-white/60">Published</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {scenes.filter(s => !s.published).length}
            </div>
            <div className="text-sm text-white/60">Drafts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {scenes.reduce((acc, scene) => acc + scene.views, 0)}
            </div>
            <div className="text-sm text-white/60">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageScenes