import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useWeeklyAnalytics from '../hooks/useWeeklyAnalytics'
import api from '../lib/api'
import TaskComposer from '../components/dashboard/TaskComposer'
import TaskDayBoard from '../components/dashboard/TaskDayBoard'
import NotificationCenter from '../components/dashboard/NotificationCenter'
import ReportManager from '../components/dashboard/ReportManager'

const AnalyticsCharts = lazy(() => import('../components/dashboard/AnalyticsCharts'))

const sortTasks = (tasks, sortBy) => {
  const list = [...tasks]

  if (sortBy === 'priority') {
    const weight = { high: 0, medium: 1, low: 2 }
    return list.sort((a, b) => weight[a.priority] - weight[b.priority])
  }

  if (sortBy === 'status') {
    const weight = { pending: 0, overdue: 1, completed: 2 }
    return list.sort((a, b) => weight[a.status] - weight[b.status])
  }

  return list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
}

const ProductivityDashboard = () => {
  const { user } = useAuth()
  const { theme } = useTheme()

  const [tasks, setTasks] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedWeekKey, setSelectedWeekKey] = useState('')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('deadline')

  const debouncedQuery = useDebouncedValue(query, 300)
  const { weeks, weekMap, weeklyComparison } = useWeeklyAnalytics(tasks)

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch {
      toast.error('Failed to fetch tasks')
    }
  }

  const loadReports = async () => {
    try {
      const response = await api.get('/reports')
      setReports(response.data)
    } catch {
      toast.error('Failed to fetch reports')
    }
  }

  useEffect(() => {
    const boot = async () => {
      setLoading(true)
      await Promise.all([loadTasks(), loadReports()])
      setLoading(false)
    }

    boot()
  }, [])

  useEffect(() => {
    if (!selectedWeekKey && weeks.length) {
      setSelectedWeekKey(weeks[0].weekKey)
    }
  }, [weeks, selectedWeekKey])

  const selectedWeek = weekMap[selectedWeekKey] || {
    weekStart: new Date(),
    weekEnd: new Date(),
    label: 'Week 1',
    total: 0,
    completed: 0,
    overdue: 0,
    onTimeCompleted: 0,
    completionRate: 0,
    productivityScore: 0,
    dayStats: [
      { day: 'Monday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Tuesday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Wednesday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Thursday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Friday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Saturday', total: 0, completed: 0, overdue: 0, productivity: 0 },
      { day: 'Sunday', total: 0, completed: 0, overdue: 0, productivity: 0 }
    ],
    groupedByDay: {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
    }
  }

  const filteredGroupedTasks = useMemo(() => {
    const search = debouncedQuery.trim().toLowerCase()

    return Object.fromEntries(
      Object.entries(selectedWeek.groupedByDay).map(([day, dayTasks]) => {
        const filtered = dayTasks.filter((task) => {
          if (!search) return true
          return (
            task.title?.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search) ||
            task.priority?.toLowerCase().includes(search)
          )
        })

        return [day, sortTasks(filtered, sortBy)]
      })
    )
  }, [selectedWeek, debouncedQuery, sortBy])

  const createTask = async (form) => {
    if (!form.title || !form.deadline) {
      toast.error('Title and deadline are required')
      return
    }

    setCreating(true)
    try {
      await api.post('/tasks', {
        ...form,
        reminderTime: form.reminderTime || null,
        status: 'pending'
      })
      toast.success('Task created')
      await loadTasks()
    } catch {
      toast.error('Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const updateTaskStatus = async (task, nextStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        status: nextStatus
      })
      await loadTasks()
      toast.success('Task updated')
    } catch {
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      await loadTasks()
      toast.success('Task removed')
    } catch {
      toast.error('Failed to remove task')
    }
  }

  if (loading) {
    return <div className="page-shell"><div className="container-shell">Loading dashboard...</div></div>
  }

  return (
    <div className="page-shell">
      <div className="container-shell space-y-4 py-8">
        <header className="card p-5">
          <h1 className="text-2xl font-bold">{user?.name}'s Productivity Dashboard</h1>
          <p className="mt-1 text-sm opacity-80">
            Weekly planning, analytics, reminders, and professional reporting in one view.
          </p>
        </header>

        <TaskComposer onCreateTask={createTask} creating={creating} />

        <section className="card grid gap-3 p-4 md:grid-cols-4">
          <select className="input" value={selectedWeekKey} onChange={(event) => setSelectedWeekKey(event.target.value)}>
            {weeks.map((week) => {
              const current = weekMap[week.weekKey]
              return (
                <option key={week.weekKey} value={week.weekKey}>
                  {current.label} ({new Date(week.weekStart).toLocaleDateString()})
                </option>
              )
            })}
            {weeks.length === 0 && <option value="">No week data</option>}
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input"
            placeholder="Search title/description/priority"
          />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input">
            <option value="deadline">Sort: Deadline</option>
            <option value="priority">Sort: Priority</option>
            <option value="status">Sort: Status</option>
          </select>
          <div className="metrics-inline">
            <span>Completion {selectedWeek.completionRate}%</span>
            <span>Score {selectedWeek.productivityScore}</span>
          </div>
        </section>

        <TaskDayBoard groupedByDay={filteredGroupedTasks} onStatusChange={updateTaskStatus} onDelete={deleteTask} />

        <NotificationCenter tasks={tasks} />

        <Suspense fallback={<section className="card p-4">Loading charts...</section>}>
          <AnalyticsCharts weekData={selectedWeek} weeklyComparison={weeklyComparison} />
        </Suspense>

        <ReportManager
          userName={user?.name || 'User'}
          weekData={selectedWeek}
          reports={reports}
          theme={theme}
          onReloadReports={loadReports}
        />
      </div>
    </div>
  )
}

export default ProductivityDashboard
