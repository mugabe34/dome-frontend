import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'

const Login = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const result = await login(name, password)

    if (result.success) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <div className="page-shell min-h-screen flex items-center justify-center p-4">
      <div className="card p-6 md:p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold mb-2">doME</h1>
          <p className="opacity-75">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-80">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
