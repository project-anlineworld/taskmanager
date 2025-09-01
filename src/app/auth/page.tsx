'use client'

import dynamic from 'next/dynamic'

// Import AuthPage with SSR disabled to prevent hydration issues
const AuthPageComponent = dynamic(() => import('@/components/AuthPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function AuthPage() {
  return <AuthPageComponent />
}