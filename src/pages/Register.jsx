import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { UserPlus, Loader2 } from 'lucide-react'

const Register = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { register, isProcessing } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters')
      return
    }

    setIsSubmitting(true)

    const result = await register(name, password)

    if (result.success) {
      toast.success('Account created successfully!')
      setTimeout(() => {
        navigate('/')
      }, 500)
    } else {
      toast.error(result.message || 'Registration failed')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="page-shell min-h-screen flex items-center justify-center p-4">
      <div className="card p-6 md:p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold mb-2">doME</h1>
          <p className="opacity-75">Create your account</p>
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

          <button
            type="submit"
            disabled={isProcessing || isSubmitting}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isProcessing || isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-80">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
