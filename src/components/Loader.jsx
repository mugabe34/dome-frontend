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
    <div className="page-shell flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-8">doME</h1>
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[var(--text)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default Loader
