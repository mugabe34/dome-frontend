import { BellRing, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '../context/NotificationsContext'

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()

  return (
    <div className="page-shell">
      <div className="container-shell space-y-4 py-6 md:py-8 pb-24 md:pb-8">
        <header className="card p-4 md:p-5">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <BellRing size={22} /> Notifications
          </h1>
          <p className="mt-1 text-sm opacity-80">Unread alerts: {unreadCount}</p>
        </header>

        <section className="card p-4">
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary inline-flex items-center gap-2" onClick={markAllAsRead}>
              <CheckCheck size={16} /> Mark all read
            </button>
            <button className="btn-danger inline-flex items-center gap-2" onClick={clearNotifications}>
              <Trash2 size={16} /> Clear all
            </button>
          </div>
        </section>

        <section className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`notice-item ${item.read ? 'opacity-75' : 'notice-item-unread'}`}
              onClick={() => markAsRead(item.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <p className="text-sm opacity-80">{item.message}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(item.at).toLocaleString()}</p>
                </div>
                {!item.read && <span className="notice-dot" />}
              </div>
            </article>
          ))}
          {notifications.length === 0 && <div className="card p-4 text-sm opacity-80">No notifications yet.</div>}
        </section>
      </div>
    </div>
  )
}

export default NotificationsPage
