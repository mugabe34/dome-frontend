import { FileText, CalendarDays } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import useProductivityData from '../hooks/useProductivityData'
import ReportManager from '../components/dashboard/ReportManager'

const ReportsPage = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const {
    loading,
    reports,
    weeks,
    weekMap,
    selectedWeek,
    selectedWeekActivities,
    selectedWeekKey,
    setSelectedWeekKey,
    loadReports
  } = useProductivityData()

  if (loading) {
    return <div className="page-shell"><div className="container-shell py-8">Loading reports...</div></div>
  }

  return (
    <div className="page-shell">
      <div className="container-shell space-y-4 py-6 md:py-8 pb-24 md:pb-8">
        <header className="card p-4 md:p-5">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <FileText size={22} /> Reports & Sharing
          </h1>
          <p className="mt-1 text-sm opacity-80">Generate, edit, download and share your weekly performance reports.</p>
        </header>

        <section className="card p-4">
          <div className="relative max-w-sm">
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
        </section>

        <ReportManager
          userName={user?.name || 'User'}
          weekData={selectedWeek}
          activities={selectedWeekActivities}
          reports={reports}
          theme={theme}
          onReloadReports={() => loadReports(true)}
        />
      </div>
    </div>
  )
}

export default ReportsPage
