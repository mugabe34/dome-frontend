import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loader = ({ redirect = true, durationMs = 2000 }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!redirect) return
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token')
      if (token) {
        navigate('/')
      } else {
        navigate('/login')
      }
    }, durationMs)
    return () => clearTimeout(timer)
  }, [navigate, redirect, durationMs])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-blue">
      <h1 className="text-6xl font-bold text-white mb-8">doMe</h1>
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default Loader

