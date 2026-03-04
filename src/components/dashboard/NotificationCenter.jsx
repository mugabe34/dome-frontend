import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

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
    // Browser may block autoplay audio; skip sound if unavailable.
  }
}

const NotificationCenter = ({ tasks }) => {
  const [notifications, setNotifications] = useState([])
  const firedRef = useRef(new Set())

  const upcoming = useMemo(
    () => tasks.filter((task) => task.reminderTime && task.status !== 'completed').sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime)),
    [tasks]
  )

  useEffect(() => {
    const checkNotifications = () => {
      const now = Date.now()
      upcoming.forEach((task) => {
        const reminderAt = new Date(task.reminderTime).getTime()
        if (Number.isNaN(reminderAt) || reminderAt > now || firedRef.current.has(task._id)) return

        firedRef.current.add(task._id)
        const notification = {
          id: `${task._id}-${reminderAt}`,
          title: task.title,
          at: new Date(task.reminderTime).toLocaleString()
        }

        setNotifications((prev) => [notification, ...prev].slice(0, 8))
        toast(`${task.title} reminder`, { icon: '⏰' })

        if (task.alarmEnabled) {
          playBeep()
        }
      })
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)
    return () => clearInterval(interval)
  }, [upcoming])

  return (
    <section className="card p-4">
      <h3 className="mb-3 text-lg font-semibold">Notifications</h3>
      <div className="space-y-2">
        {notifications.map((item) => (
          <article key={item.id} className="notice-item">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs opacity-75">Triggered at {item.at}</p>
          </article>
        ))}
        {notifications.length === 0 && <p className="text-sm text-slate-500">No alerts yet</p>}
      </div>
    </section>
  )
}

export default NotificationCenter
