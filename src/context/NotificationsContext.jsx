import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const NotificationsContext = createContext()

const STORAGE_KEY = 'dome_fired_reminders'

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.value = 0.05

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.2)
  } catch {
    // Ignore autoplay audio issues.
  }
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const firedRef = useRef(new Set())

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        firedRef.current = new Set(JSON.parse(stored))
      } catch {
        firedRef.current = new Set()
      }
    }
  }, [])

  useEffect(() => {
    if (!user?.id && !user?._id) {
      setNotifications([])
      return
    }

    let isCancelled = false

    const checkTaskReminders = async () => {
      try {
        const response = await api.get('/tasks')
        const tasks = response.data || []
        const now = Date.now()

        tasks.forEach((task) => {
          if (!task.reminderTime || task.status === 'completed') return

          const reminderAt = new Date(task.reminderTime).getTime()
          const token = `${task._id}-${reminderAt}`
          if (Number.isNaN(reminderAt) || reminderAt > now || firedRef.current.has(token)) return

          firedRef.current.add(token)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(firedRef.current)))

          const item = {
            id: token,
            taskId: task._id,
            title: task.title,
            message: `Reminder reached at ${new Date(task.reminderTime).toLocaleString()}`,
            at: new Date().toISOString(),
            read: false,
            alarmEnabled: task.alarmEnabled
          }

          if (!isCancelled) {
            setNotifications((prev) => [item, ...prev].slice(0, 100))
          }

          toast.custom(
            <div className="notice-toast">
              <p className="font-semibold">Reminder</p>
              <p className="text-xs">{task.title}</p>
            </div>,
            { duration: 5000 }
          )

          if (task.alarmEnabled) {
            playBeep()
          }
        })
      } catch {
        // Ignore background reminder polling failures.
      }
    }

    checkTaskReminders()
    const interval = setInterval(checkTaskReminders, 30000)

    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [user?.id, user?._id])

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0),
    [notifications]
  )

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications }),
    [notifications, unreadCount]
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
