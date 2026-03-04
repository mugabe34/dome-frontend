import { useMemo } from 'react'

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const startOfWeek = (dateLike) => {
  const date = new Date(dateLike)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

const endOfWeek = (weekStart) => {
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

const toDayIndex = (dateLike) => {
  const day = new Date(dateLike).getDay()
  return day === 0 ? 6 : day - 1
}

const pct = (value) => Math.round(value * 100) / 100

const useWeeklyAnalytics = (tasks = []) =>
  useMemo(() => {
    const byWeek = new Map()

    tasks.forEach((task) => {
      if (!task.deadline) return
      const weekStart = startOfWeek(task.deadline)
      const key = weekStart.toISOString()

      if (!byWeek.has(key)) {
        byWeek.set(key, {
          weekKey: key,
          weekStart,
          weekEnd: endOfWeek(weekStart),
          tasks: []
        })
      }

      byWeek.get(key).tasks.push(task)
    })

    const weeks = Array.from(byWeek.values()).sort((a, b) => b.weekStart - a.weekStart)

    const weekMap = {}

    weeks.forEach((week, index) => {
      const label = `Week ${index + 1}`
      const total = week.tasks.length
      const completed = week.tasks.filter((task) => task.status === 'completed').length
      const overdue = week.tasks.filter((task) => task.status === 'overdue').length
      const onTimeCompleted = week.tasks.filter((task) => {
        if (task.status !== 'completed' || !task.completedAt || !task.deadline) return false
        return new Date(task.completedAt) <= new Date(task.deadline)
      }).length

      const completionRate = total ? pct((completed / total) * 100) : 0
      const productivityScore = pct(Math.max(0, completionRate * 0.7 + (onTimeCompleted / Math.max(1, total)) * 30 - overdue * 2))

      const dayStats = DAY_LABELS.map((day, dayIndex) => {
        const dayTasks = week.tasks.filter((task) => toDayIndex(task.deadline) === dayIndex)
        const dayCompleted = dayTasks.filter((task) => task.status === 'completed').length
        const dayOverdue = dayTasks.filter((task) => task.status === 'overdue').length
        const dayScore = dayTasks.length ? pct((dayCompleted / dayTasks.length) * 100 - dayOverdue * 5) : 0

        return {
          day,
          total: dayTasks.length,
          completed: dayCompleted,
          overdue: dayOverdue,
          productivity: dayScore
        }
      })

      const groupedByDay = DAY_LABELS.reduce((acc, day, dayIndex) => {
        acc[day] = week.tasks
          .filter((task) => toDayIndex(task.deadline) === dayIndex)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        return acc
      }, {})

      weekMap[week.weekKey] = {
        ...week,
        label,
        total,
        completed,
        overdue,
        onTimeCompleted,
        completionRate,
        productivityScore,
        dayStats,
        groupedByDay
      }
    })

    const weeklyComparison = weeks
      .map((week) => {
        const analytics = weekMap[week.weekKey]
        return {
          weekKey: week.weekKey,
          weekLabel: analytics.label,
          completionRate: analytics.completionRate,
          productivityScore: analytics.productivityScore,
          total: analytics.total
        }
      })
      .reverse()

    return {
      weeks,
      weekMap,
      weeklyComparison,
      dayLabels: DAY_LABELS
    }
  }, [tasks])

export default useWeeklyAnalytics
