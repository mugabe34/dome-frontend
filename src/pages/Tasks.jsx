import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Sparkles, CheckCircle2 } from 'lucide-react'

const Tasks = () => {
  const { user } = useAuth()
  const [activity, setActivity] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!activity || !date || !time) {
      toast.error('Please fill in all fields')
      return
    }

    if (!confirmed) {
      toast.error('Please confirm your activities first')
      return
    }

    const token = localStorage.getItem('token')
    
    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { name: activity, date, time, status: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Activity added successfully!')
      setActivity('')
      setDate('')
      setTime('')
      setConfirmed(false)
    } catch (error) {
      toast.error('Failed to add activity')
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-dark-blue mb-4 shine-text relative inline-block">
            Hey, {user?.name}! What's your plan today?
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Stay focused and organized — one task at a time ✨
          </p>
        </div>

        {/* Activity Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border-2 border-dark-blue/30 relative hover:shadow-blue-200 transition-all duration-500">
          {/* Star Icon */}
          <div className="absolute top-6 right-6 animate-bounce-slow">
            <Sparkles size={32} className="text-yellow-500 drop-shadow-md" />
          </div>

          <h2 className="text-2xl font-bold text-dark-blue mb-8 text-center border-b pb-4 border-blue-200">
            Add your activity of the day
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Activity Name
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none transition-shadow duration-300 hover:shadow-sm"
                placeholder="e.g., Go to gym"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none transition-shadow duration-300 hover:shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none transition-shadow duration-300 hover:shadow-sm"
                />
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 border border-blue-100">
              <CheckCircle2 
                size={26} 
                className={`cursor-pointer transition-all duration-300 ${confirmed ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-green-400'}`}
                onClick={() => setConfirmed(!confirmed)}
              />
              <label className="cursor-pointer text-dark-blue font-medium">
                Confirm those activities (if done)
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-dark-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-800 hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Add Activity
            </button>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Shine Animation */
        @keyframes shine {
          0% { background-position: -200%; }
          20% { background-position: 200%; }
          100% { background-position: 200%; }
        }
        .shine-text {
          background: linear-gradient(90deg, #001f3f, #007bff, #001f3f);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 2s linear infinite;
          animation-delay: 3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .shine-text {
          animation: shineEffect 6s infinite;
        }
        @keyframes shineEffect {
          0%, 50% { background-position: 0%; }
          25% { background-position: 200%; }
          100% { background-position: 0%; }
        }

        /* Slow Bounce for Icon */
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default Tasks
