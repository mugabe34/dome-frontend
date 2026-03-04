import { lazy, Suspense } from 'react'
import { BarChart3, CalendarDays } from 'lucide-react'
import useProductivityData from '../hooks/useProductivityData'

const AnalyticsCharts = lazy(() => import('../components/dashboard/AnalyticsCharts'))

const AnalyticsPage = () => {
  const {
    loading,
    weeks,
    weekMap,
    selectedWeek,
    selectedWeekKey,
    setSelectedWeekKey,
    weeklyComparison
  } = useProductivityData()

  if (loading) {
    return <div className="page-shell"><div className="container-shell py-8">Loading analytics...</div></div>
  }

  return (
    <div className="page-shell">
      <div className="container-shell space-y-4 py-6 md:py-8 pb-24 md:pb-8">
        <header className="card p-4 md:p-5">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={22} /> Performance Analytics
          </h1>
          <p className="mt-1 text-sm opacity-80">Compare daily and weekly productivity trends.</p>
        </header>

        <section className="card p-4 grid gap-3 md:grid-cols-2">
          <div className="relative">
            <CalendarDays size={16} className="absolute left-3 top-3.5 opacity-60" />
            <select className="input pl-9" value={selectedWeekKey} onChange={(event) => setSelectedWeekKey(event.target.value)}>
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
          </div>
          <div className="metrics-inline">
            <span>On-time {selectedWeek.onTimeCompleted}</span>
            <span>Overdue {selectedWeek.overdue}</span>
          </div>
        </section>

        <Suspense fallback={<section className="card p-4">Loading charts...</section>}>
          <AnalyticsCharts weekData={selectedWeek} weeklyComparison={weeklyComparison} />
        </Suspense>
      </div>
    </div>
  )
}

export default AnalyticsPage
