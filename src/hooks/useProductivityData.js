import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import useDebouncedValue from './useDebouncedValue'
import useWeeklyAnalytics from './useWeeklyAnalytics'
import api from '../lib/api'

const defaultWeek = {
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

const useProductivityData = () => {
  const [tasks, setTasks] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedWeekKey, setSelectedWeekKey] = useState('')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('deadline')

  const debouncedQuery = useDebouncedValue(query, 300)
  const { weeks, weekMap, weeklyComparison } = useWeeklyAnalytics(tasks)

  const loadTasks = async (silent = false) => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Failed to fetch tasks')
      }
    }
  }

  const loadReports = async (silent = false) => {
    try {
      const response = await api.get('/reports')
      setReports(response.data)
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Failed to fetch reports')
      }
    }
  }

  useEffect(() => {
    const boot = async () => {
      setLoading(true)
      await Promise.all([loadTasks(true), loadReports(true)])
      setLoading(false)
    }

    boot()
  }, [])

  useEffect(() => {
    if (!selectedWeekKey && weeks.length) {
      setSelectedWeekKey(weeks[0].weekKey)
    }
  }, [weeks, selectedWeekKey])

  const selectedWeek = weekMap[selectedWeekKey] || defaultWeek
  const selectedWeekActivities = Object.entries(selectedWeek.groupedByDay).flatMap(([day, dayTasks]) =>
    dayTasks.map((task) => ({
      ...task,
      day
    }))
  )

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
      return false
    }

    setCreating(true)
    try {
      const payload = {
        ...form,
        deadline: new Date(form.deadline).toISOString(),
        reminderTime: form.reminderTime ? new Date(form.reminderTime).toISOString() : null,
        status: 'pending'
      }

      await api.post('/tasks', payload)
      await loadTasks(true)
      toast.success('Task created')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
      return false
    } finally {
      setCreating(false)
    }
  }

  const updateTaskStatus = async (task, nextStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
        reminderTime: task.reminderTime ? new Date(task.reminderTime).toISOString() : null,
        status: nextStatus
      })
      await loadTasks(true)
      toast.success('Task updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      await loadTasks(true)
      toast.success('Task removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove task')
    }
  }

  return {
    tasks,
    reports,
    loading,
    creating,
    weeks,
    weekMap,
    weeklyComparison,
    selectedWeek,
    selectedWeekActivities,
    selectedWeekKey,
    setSelectedWeekKey,
    query,
    setQuery,
    sortBy,
    setSortBy,
    filteredGroupedTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    loadReports
  }
}

export default useProductivityData
