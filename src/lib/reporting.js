import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const formatRange = (start, end) =>
  `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`

export const buildReportSummary = (weekData) => {
  if (!weekData.total) {
    return 'No tasks were scheduled for this week. Plan your top priorities for the next cycle.'
  }

  return `Completion ${weekData.completionRate}%. ${weekData.completed}/${weekData.total} tasks completed, ${weekData.onTimeCompleted} on time, ${weekData.overdue} overdue. Productivity score ${weekData.productivityScore}.`
}

const getPerformedActivities = (activities = []) => activities.filter((item) => item.status === 'completed')

export const buildReportHtml = ({ userName, weekData, theme, notes, summary, activities = [] }) => {
  const dark = theme === 'dark'
  const bg = dark ? '#000000' : '#f5f5f5'
  const card = dark ? '#121212' : '#ffffff'
  const text = dark ? '#f5f5f5' : '#101010'
  const performed = getPerformedActivities(activities)

  const metric = (label, value) => `<div style="background:${card};padding:12px;border-radius:10px"><div style="font-size:12px;opacity:.75">${label}</div><div style="font-size:24px;font-weight:700">${value}</div></div>`

  const rows = weekData.dayStats
    .map((d) => `<tr><td style="padding:8px;border-bottom:1px solid #cbd5e1">${d.day}</td><td style="padding:8px;border-bottom:1px solid #cbd5e1">${d.completed}/${d.total}</td><td style="padding:8px;border-bottom:1px solid #cbd5e1">${d.productivity}</td></tr>`)
    .join('')

  const activityRows = performed
    .map((task) => `<tr><td style="padding:8px;border-bottom:1px solid #cbd5e1">${task.title}</td><td style="padding:8px;border-bottom:1px solid #cbd5e1">${task.day || '-'}</td><td style="padding:8px;border-bottom:1px solid #cbd5e1">${task.priority || '-'}</td><td style="padding:8px;border-bottom:1px solid #cbd5e1">${task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}</td></tr>`)
    .join('')

  return `
  <div style="font-family:Inter,Arial,sans-serif;background:${bg};color:${text};padding:20px">
    <h1 style="margin:0 0 8px">Productivity Report</h1>
    <p style="margin:0 0 16px">${userName} | ${weekData.label} | ${formatRange(weekData.weekStart, weekData.weekEnd)}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
      ${metric('Completion Rate', `${weekData.completionRate}%`)}
      ${metric('On-time', weekData.onTimeCompleted)}
      ${metric('Overdue', weekData.overdue)}
      ${metric('Score', weekData.productivityScore)}
    </div>
    <div style="background:${card};padding:14px;border-radius:10px;margin-bottom:16px">
      <h3 style="margin:0 0 8px">Summary</h3>
      <p style="margin:0">${summary}</p>
      <p style="margin:8px 0 0;font-size:13px;opacity:.8"><strong>Notes:</strong> ${notes || '-'}</p>
    </div>
    <div style="background:${card};padding:14px;border-radius:10px;margin-bottom:16px">
      <h3 style="margin:0 0 8px">Activities Performed (${performed.length})</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Task</th><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Day</th><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Priority</th><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Completed At</th></tr></thead>
        <tbody>${activityRows || '<tr><td colspan="4" style="padding:8px">No performed activities</td></tr>'}</tbody>
      </table>
    </div>
    <div style="background:${card};padding:14px;border-radius:10px">
      <h3 style="margin:0 0 8px">Daily Snapshot</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Day</th><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Completed</th><th align="left" style="padding:8px;border-bottom:2px solid #94a3b8">Productivity</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`
}

const makeChartSnapshot = async (weekData) => {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 220
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const barW = 90
  const maxValue = Math.max(100, ...weekData.dayStats.map((d) => d.productivity))
  weekData.dayStats.forEach((day, idx) => {
    const x = 30 + idx * 120
    const h = Math.max(6, (day.productivity / maxValue) * 140)
    ctx.fillStyle = '#111111'
    ctx.fillRect(x, 170 - h, barW, h)
    ctx.fillStyle = '#111111'
    ctx.font = '13px Arial'
    ctx.fillText(day.day.slice(0, 3), x + 20, 190)
  })

  return canvas.toDataURL('image/png')
}

export const downloadReportPdf = async ({ userName, weekData, summary, notes, activities = [] }) => {
  const performed = getPerformedActivities(activities)
  const doc = new jsPDF({ unit: 'pt' })

  doc.setFontSize(18)
  doc.text('Productivity Weekly Report', 40, 40)
  doc.setFontSize(11)
  doc.text(`${userName} | ${weekData.label} | ${formatRange(weekData.weekStart, weekData.weekEnd)}`, 40, 60)

  doc.setFillColor(245, 245, 245)
  doc.roundedRect(40, 78, 515, 64, 8, 8, 'F')
  doc.setFontSize(12)
  doc.text(`Completion Rate: ${weekData.completionRate}%`, 52, 102)
  doc.text(`On-time: ${weekData.onTimeCompleted}`, 240, 102)
  doc.text(`Overdue: ${weekData.overdue}`, 360, 102)
  doc.text(`Score: ${weekData.productivityScore}`, 470, 102)

  const chartImage = await makeChartSnapshot(weekData)
  doc.addImage(chartImage, 'PNG', 40, 160, 515, 130)

  autoTable(doc, {
    startY: 310,
    head: [['Task', 'Day', 'Priority', 'Completed At']],
    body: performed.length
      ? performed.map((task) => [
          task.title,
          task.day || '-',
          task.priority || '-',
          task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'
        ])
      : [['No performed activities', '-', '-', '-']]
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    head: [['Day', 'Total', 'Completed', 'Overdue', 'Productivity']],
    body: weekData.dayStats.map((d) => [d.day, d.total, d.completed, d.overdue, d.productivity])
  })

  const finalY = doc.lastAutoTable.finalY + 24
  doc.setFontSize(12)
  doc.text('Summary', 40, finalY)
  doc.setFontSize(10)
  const split = doc.splitTextToSize(`${summary}\nNotes: ${notes || '-'}`, 515)
  doc.text(split, 40, finalY + 18)

  doc.save(`productivity-${weekData.label.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}
