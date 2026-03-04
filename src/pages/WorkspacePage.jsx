import { ClipboardList, Search, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useProductivityData from '../hooks/useProductivityData'
import TaskComposer from '../components/dashboard/TaskComposer'
import TaskDayBoard from '../components/dashboard/TaskDayBoard'

const WorkspacePage = () => {
  const { user } = useAuth()
  const {
    loading,
    creating,
    weeks,
    weekMap,
    selectedWeek,
    selectedWeekKey,
    setSelectedWeekKey,
    query,
    setQuery,
    sortBy,
    setSortBy,
    filteredGroupedTasks,
    createTask,
    updateTaskStatus,
    deleteTask
  } = useProductivityData()

  if (loading) {
    return <div className="page-shell"><div className="container-shell py-8">Loading workspace...</div></div>
  }

  return (
    <div className="page-shell">
      <div className="container-shell space-y-4 py-6 md:py-8 pb-24 md:pb-8">
        <header className="card p-4 md:p-5">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <ClipboardList size={22} /> {user?.name}'s Task Workspace
          </h1>
          <p className="mt-1 text-sm opacity-80">Plan tasks by week and day with mobile-friendly workflow.</p>
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
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3.5 opacity-60" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input pl-9"
              placeholder="Search tasks"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-3 top-3.5 opacity-60" />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input pl-9">
              <option value="deadline">Sort: Deadline</option>
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
          <div className="metrics-inline">
            <span>Completion {selectedWeek.completionRate}%</span>
            <span>Score {selectedWeek.productivityScore}</span>
          </div>
        </section>

        <TaskDayBoard groupedByDay={filteredGroupedTasks} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
      </div>
    </div>
  )
}

export default WorkspacePage
