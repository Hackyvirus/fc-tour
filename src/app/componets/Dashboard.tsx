'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import {
  HomeIcon,
  PlusCircleIcon,
  CogIcon,
  UserIcon,
  MapIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type DashboardProps = {
  email: string;
  children?: React.ReactNode;
};


const Dashboard = ({ email, children }: DashboardProps) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const asideLinks = [
    {
      label: "Dashboard",
      link: "/admin",
      icon: HomeIcon,
      description: "Overview & Statistics"
    },
    {
      label: "Add Scene",
      link: "/admin/add-scene",
      icon: PlusCircleIcon,
      description: "Create new 360° scene"
    },
    {
      label: "Manage Scenes",
      link: "/admin/manage-scenes",
      icon: MapIcon,
      description: "Edit & organize scenes"
    },
    // {
    //   label: "Analytics",
    //   link: "/admin/analytics",
    //   icon: ChartBarIcon,
    //   description: "Tour performance metrics"
    // },
    // {
    //   label: "Settings",
    //   link: "/admin/settings",
    //   icon: CogIcon,
    //   description: "Configure tour settings"
    // },
    // {
    //   label: "Profile",
    //   link: "/admin/profile",
    //   icon: UserIcon,
    //   description: "Manage your account"
    // }
  ]

  const isActive = (link: string) => {
    if (link === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(link)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-white"
      >
        {sidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-80 glass border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white mb-1">
            Virtual Tour Admin
          </h1>
          <p className="text-sm text-white/60">Fergusson College</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {asideLinks.map((item) => {
            const Icon = item.icon
            const active = isActive(item.link)

            return (
              <Link
                key={item.label}
                href={item.link}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-start gap-3 p-4 rounded-lg
                  transition-all duration-200
                  ${active
                    ? 'bg-yellow-400/20 border border-yellow-400/30'
                    : 'hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <Icon
                  className={`
                    w-6 h-6 flex-shrink-0 mt-0.5
                    ${active ? 'text-yellow-400' : 'text-white/60 group-hover:text-white'}
                  `}
                />
                <div className="flex-1 min-w-0">
                  <div className={`
                    font-semibold mb-0.5
                    ${active ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'}
                  `}>
                    {item.label}
                  </div>
                  <p className="text-xs text-white/50 group-hover:text-white/70">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-dark rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  Admin User
                </div>
                <div className="text-xs text-white/50">
                  <p>{email}</p>
                </div>
              </div>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="w-full text-xs text-white/60 hover:text-white transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children || <DefaultDashboardContent />}
        </div>
      </main>
    </div>
  )
}

// Client component for dashboard content
const DefaultDashboardContent = () => {
  const [stats, setStats] = useState({
    totalScenes: 0,
    publishedScenes: 0,
    draftScenes: 0,
    connectedScenes: 0,
    loading: true
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/scenes")
        const scenes = await res.json()

        if (Array.isArray(scenes)) {
          const totalScenes = scenes.length
          const publishedScenes = scenes.filter((s: any) => s.published).length
          const draftScenes = totalScenes - publishedScenes
          const connectedScenes = scenes.filter((s: any) => s.nextSceneId).length

          setStats({
            totalScenes,
            publishedScenes,
            draftScenes,
            connectedScenes,
            loading: false
          })
        } else {
          setStats({
            totalScenes: 0,
            publishedScenes: 0,
            draftScenes: 0,
            connectedScenes: 0,
            loading: false
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({
          totalScenes: 0,
          publishedScenes: 0,
          draftScenes: 0,
          connectedScenes: 0,
          loading: false
        })
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      label: 'Total Scenes',
      value: stats.totalScenes.toString(),
      change: `${stats.publishedScenes} published`,
      trend: 'up',
      icon: MapIcon
    },
    {
      label: 'Published Scenes',
      value: stats.publishedScenes.toString(),
      change: `${stats.draftScenes} drafts`,
      trend: 'neutral',
      icon: ChartBarIcon
    },
    {
      label: 'Draft Scenes',
      value: stats.draftScenes.toString(),
      change: 'Not visible to users',
      trend: 'neutral',
      icon: PlusCircleIcon
    },
    {
      label: 'Scene Flow',
      value: stats.connectedScenes.toString(),
      change: 'Scenes with next link',
      trend: 'neutral',
      icon: CogIcon
    }
  ]

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-xl p-6 border border-white/10">
              <div className="animate-pulse">
                <div className="h-12 bg-white/10 rounded mb-4"></div>
                <div className="h-8 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, Admin!
        </h2>
        <p className="text-white/70">
          Here&apos;s what&apos;s happening with your virtual tour today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="glass rounded-xl p-6 border border-white/10 hover:border-yellow-400/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-yellow-400/10">
                  <Icon className="w-6 h-6 text-yellow-400" />
                </div>
                {stat.trend === 'up' && (
                  <span className="text-green-400 text-xs">↑</span>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 mb-2">{stat.label}</div>
              <div className="text-xs text-white/50">{stat.change}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/add-scene"
            className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/30 transition-all group"
          >
            <div className="p-2 rounded-lg bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors">
              <PlusCircleIcon className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                Add New Scene
              </div>
              <div className="text-xs text-white/50">Create 360° scene</div>
            </div>
          </Link>

          <Link
            href="/admin/manage-scenes"
            className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/30 transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors">
              <MapIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                Manage Scenes
              </div>
              <div className="text-xs text-white/50">Edit & organize</div>
            </div>
          </Link>

          <Link
            href="/tour"
            className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/30 transition-all group"
          >
            <div className="p-2 rounded-lg bg-green-400/10 group-hover:bg-green-400/20 transition-colors">
              <HomeIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-green-400 transition-colors">
                View Tour
              </div>
              <div className="text-xs text-white/50">Preview live tour</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard