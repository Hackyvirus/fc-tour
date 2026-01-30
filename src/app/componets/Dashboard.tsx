'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
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

const Dashboard = ({ children }: { children?: React.ReactNode }) => {
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
    {
      label: "Analytics",
      link: "/admin/analytics",
      icon: ChartBarIcon,
      description: "Tour performance metrics"
    },
    {
      label: "Settings",
      link: "/admin/settings",
      icon: CogIcon,
      description: "Configure tour settings"
    },
    {
      label: "Profile",
      link: "/admin/profile",
      icon: UserIcon,
      description: "Manage your account"
    }
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
                  admin@fergusson.edu
                </div>
              </div>
            </div>
            <button className="w-full text-xs text-white/60 hover:text-white transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children || <DefaultDashboardContent />}
        </div>
      </main>
    </div>
  )
}

const DefaultDashboardContent = () => {
  const stats = [
    {
      label: 'Total Scenes',
      value: '12',
      change: '+3 this month',
      trend: 'up',
      icon: MapIcon
    },
    {
      label: 'Total Views',
      value: '2,847',
      change: '+12% this week',
      trend: 'up',
      icon: ChartBarIcon
    },
    {
      label: 'Active Hotspots',
      value: '34',
      change: '8 pending review',
      trend: 'neutral',
      icon: PlusCircleIcon
    },
    {
      label: 'Published Tours',
      value: '3',
      change: '1 draft',
      trend: 'neutral',
      icon: CogIcon
    }
  ]

  const recentActivity = [
    {
      action: 'Scene added',
      item: 'Central Quadrangle',
      time: '2 hours ago',
      user: 'Admin'
    },
    {
      action: 'Hotspot updated',
      item: 'Main Gate - College History',
      time: '5 hours ago',
      user: 'Admin'
    },
    {
      action: 'Scene published',
      item: 'Main Library',
      time: '1 day ago',
      user: 'Admin'
    },
    {
      action: 'Settings changed',
      item: 'Tour navigation preferences',
      time: '2 days ago',
      user: 'Admin'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, Admin!
        </h2>
        <p className="text-white/70">
          Here's what's happening with your virtual tour today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">
                    <span className="font-semibold">{activity.action}:</span>{' '}
                    {activity.item}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {activity.time} • {activity.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/add-scene"
              className="flex items-center gap-3 p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400/20 transition-colors group"
            >
              <PlusCircleIcon className="w-6 h-6 text-yellow-400" />
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                  Add New Scene
                </div>
                <div className="text-xs text-white/60">
                  Upload 360° panorama
                </div>
              </div>
            </Link>

            <Link
              href="/admin/manage-scenes"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <MapIcon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              <div className="flex-1">
                <div className="text-white font-semibold">
                  Manage Scenes
                </div>
                <div className="text-xs text-white/60">
                  Edit existing scenes
                </div>
              </div>
            </Link>

            <Link
              href="/tour"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <HomeIcon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              <div className="flex-1">
                <div className="text-white font-semibold">
                  Preview Tour
                </div>
                <div className="text-xs text-white/60">
                  View as visitor
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">
          Tour Health Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">Scene Coverage</span>
                <span className="text-sm text-yellow-400">85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">Hotspot Links</span>
                <span className="text-sm text-green-400">100%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">Media Quality</span>
                <span className="text-sm text-yellow-400">92%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard