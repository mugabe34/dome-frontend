import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import { buildReportHtml, buildReportSummary, downloadReportPdf } from '../../lib/reporting'

const ReportManager = ({ userName, weekData, activities, reports, theme, onReloadReports }) => {
  const [notes, setNotes] = useState('')
  const [summary, setSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const defaultSummary = useMemo(() => buildReportSummary(weekData), [weekData])
  const performedActivities = useMemo(
    () => (activities || []).filter((item) => item.status === 'completed'),
    [activities]
  )

  useEffect(() => {
    setSummary(defaultSummary)
  }, [defaultSummary])

  const createReport = async () => {
    setSaving(true)
    try {
      const htmlContent = buildReportHtml({
        userName,
        weekData,
        theme,
        notes,
        summary,
        activities
      })

      await api.post('/reports', {
        weekStart: weekData.weekStart,
        weekEnd: weekData.weekEnd,
        weekLabel: weekData.label,
        summary,
        notes,
        metrics: {
          totalTasks: weekData.total,
          completedTasks: weekData.completed,
          completionRate: weekData.completionRate,
          onTimeCompleted: weekData.onTimeCompleted,
          overdueCount: weekData.overdue,
          productivityScore: weekData.productivityScore
        },
        theme,
        htmlContent
      })

      toast.success('Weekly report saved')
      onReloadReports()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save report')
    } finally {
      setSaving(false)
    }
  }

  const updateReport = async (report) => {
    setEditingId(report._id)
    try {
      await api.put(`/reports/${report._id}`, {
        summary,
        notes,
        theme
      })
      onReloadReports()
      toast.success('Report updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update report')
    } finally {
      setEditingId(null)
    }
  }

  const deleteReport = async (reportId) => {
    try {
      await api.delete(`/reports/${reportId}`)
      onReloadReports()
      toast.success('Report deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete report')
    }
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${weekData.label}: ${summary}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const shareEmail = () => {
    const subject = encodeURIComponent(`Productivity summary ${weekData.label}`)
    const body = encodeURIComponent(`${summary}\n\nNotes: ${notes || '-'}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <section className="card p-4">
      <h3 className="text-lg font-semibold">Weekly Reports</h3>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Editable Summary</label>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={4}
            className="input mt-1"
            placeholder="Edit summary before saving/downloading"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Editable Notes</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="input mt-1"
            placeholder="Add notes for this week"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <button className="btn-primary" disabled={saving} onClick={createReport}>
          {saving ? 'Saving...' : 'Generate + Save'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => downloadReportPdf({ userName, weekData, summary, notes, activities })}
        >
          Download PDF
        </button>
        <button className="btn-secondary" onClick={shareWhatsApp}>Share WhatsApp</button>
        <button className="btn-secondary" onClick={shareEmail}>Share Email</button>
      </div>

      <div className="mt-5 card p-4">
        <h4 className="font-semibold">Preview Before Download</h4>
        <p className="text-sm opacity-80 mt-2">{summary}</p>
        <p className="text-sm opacity-80 mt-2"><strong>Notes:</strong> {notes || '-'}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="report-item"><p className="text-xs opacity-70">Completion</p><p className="font-semibold">{weekData.completionRate}%</p></div>
          <div className="report-item"><p className="text-xs opacity-70">On-time</p><p className="font-semibold">{weekData.onTimeCompleted}</p></div>
          <div className="report-item"><p className="text-xs opacity-70">Overdue</p><p className="font-semibold">{weekData.overdue}</p></div>
          <div className="report-item"><p className="text-xs opacity-70">Score</p><p className="font-semibold">{weekData.productivityScore}</p></div>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold text-sm">Activities Performed ({performedActivities.length})</h5>
          <div className="mt-2 space-y-2 max-h-56 overflow-auto">
            {performedActivities.map((task) => (
              <article key={task._id} className="report-item">
                <p className="font-medium">{task.title}</p>
                <p className="text-xs opacity-70">{task.day} | {task.priority} | {task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}</p>
              </article>
            ))}
            {performedActivities.length === 0 && <p className="text-sm opacity-70">No performed activities yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {reports.map((report) => (
          <article key={report._id} className="report-item">
            <div>
              <p className="font-medium">{report.weekLabel}</p>
              <p className="text-xs opacity-70">{new Date(report.createdAt).toLocaleString()}</p>
              <p className="text-sm opacity-80 line-clamp-2">{report.summary}</p>
              <p className="text-sm opacity-80">{report.notes || 'No notes'}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" disabled={editingId === report._id} onClick={() => updateReport(report)}>
                Apply Edit
              </button>
              <button className="btn-danger" onClick={() => deleteReport(report._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {reports.length === 0 && <p className="text-sm opacity-80">No previous reports</p>}
      </div>
    </section>
  )
}

export default ReportManager
