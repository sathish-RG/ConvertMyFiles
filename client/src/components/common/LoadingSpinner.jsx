import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Processing...', 
  className = '',
  showText = true,
  color = 'primary'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    gray: 'text-gray-600',
    white: 'text-white',
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600'
  }

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 
          className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        />
      </div>
      
      {showText && text && (
        <div className="text-center">
          <p className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
            {text}
          </p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Progress spinner variant
export const ProgressSpinner = ({ 
  progress = 0, 
  text = 'Processing...', 
  className = '' 
}) => {
  const circumference = 2 * Math.PI * 20
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative w-16 h-16">
        {/* Background circle */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary-600 transition-all duration-300 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      {text && (
        <p className="text-sm font-medium text-gray-700 text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  )
}

// Minimal inline spinner
export const InlineSpinner = ({ 
  size = 'sm', 
  className = '', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    gray: 'text-gray-600',
    white: 'text-white',
    current: 'text-current'
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  )
}

// Pulse loading dots
export const PulseLoader = ({ className = '' }) => {
  return (
    <div className={`flex space-x-2 justify-center items-center ${className}`}>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  )
}

export default LoadingSpinner