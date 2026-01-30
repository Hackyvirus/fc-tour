'use client'

import React from 'react'

interface Props {
  message?: string
}

const LoadingSpinner: React.FC<Props> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner
