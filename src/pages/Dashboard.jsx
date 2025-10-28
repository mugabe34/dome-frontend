import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Star, Calendar, Bell, FileText, Trash2, BarChart3 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import CalendarComponent from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [reminders, setReminders] = useState([])
  const [reminderText, setReminderText] = useState('')
  const [reminderDate, setReminderDate] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTasks()
    fetchReminders()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReminders(response.data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
  }

  const handleTaskComplete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Task marked as completed!')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Task deleted!')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleAddReminder = async (e) => {
    e.preventDefault()
    if (!reminderText || !reminderDate || !reminderTime) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await axios.post(
        'http://localhost:5000/api/reminders',
        { text: reminderText, date: reminderDate, time: reminderTime },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Reminder added!')
      setReminderText('')
      setReminderDate('')
      setReminderTime('')
      fetchReminders()
    } catch (error) {
      toast.error('Failed to add reminder')
    }
  }

  const handleDeleteReminder = async (reminderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reminders/${reminderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Reminder deleted!')
      fetchReminders()
    } catch (error) {
      toast.error('Failed to delete reminder')
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      // Get completed tasks grouped by week
      const completedTasks = tasks.filter(t => t.status === 'completed')
      
      // Create PDF
      const doc = new jsPDF()
      
      // Title
      doc.setFontSize(18)
      doc.text('Weekly Activity Report', 14, 22)
      
      // Table data
      const tableData = completedTasks.map(task => [
        task.name,
        task.date,
        task.time,
        task.status
      ])

      autoTable(doc, {
        head: [['Activity', 'Date', 'Time', 'Status']],
        body: tableData,
        startY: 35,
      })

      // Summary
      let summaryY = doc.lastAutoTable.finalY + 20
      doc.setFontSize(14)
      doc.text('Summary', 14, summaryY)
      
      const summary = generateSummary(completedTasks)
      doc.setFontSize(11)
      const splitSummary = doc.splitTextToSize(summary, 180)
      doc.text(splitSummary, 14, summaryY + 10)

      doc.save('weekly-report.pdf')
      toast.success('Report generated successfully!')
      
      // Save report to backend
      await axios.post(
        'http://localhost:5000/api/reports',
        { summary, taskCount: completedTasks.length },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      toast.error('Failed to generate report')
    }
    setLoading(false)
  }

  const generateSummary = (completedTasks) => {
    if (completedTasks.length === 0) {
      return "This week had no completed activities. Consider organizing your time better next week to improve productivity and achieve your goals."
    }
    
    if (completedTasks.length > 10) {
      return `Excellent week! You completed ${completedTasks.length} activities, showing great dedication and time management. Keep up the fantastic work and maintain this momentum.`
    }
    
    return `Good week! You completed ${completedTasks.length} activities. With a bit more planning, you could increase your productivity. Keep pushing forward!`
  }

  const getFrequency = () => {
    const activityCounts = {}
    tasks.forEach(task => {
      activityCounts[task.name] = (activityCounts[task.name] || 0) + 1
    })
    return Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getChartData = () => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
    
    tasks.forEach(task => {
      const date = new Date(task.date)
      const dayIndex = date.getDay()
      const dayName = dayNames[dayIndex === 0 ? 6 : dayIndex - 1]
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
    })
    
    return Object.entries(dayCounts).map(([day, value]) => ({ day, value }))
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical Menu */}
          <div className="lg:w-64 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <nav className="space-y-2">
              {[
                { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
                { id: 'performed', icon: Star, label: 'Performed More' },
                { id: 'overview', icon: BarChart3, label: 'Overview' },
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
                { id: 'reminder', icon: Bell, label: 'Reminder' },
                { id: 'report', icon: FileText, label: 'Report' }
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeSection === section.id
                        ? 'bg-dark-blue text-white'
                        : 'text-dark-blue hover:bg-blue-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeSection === 'tasks' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Tasks</h2>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => handleTaskComplete(task._id)}>
                          <Circle size={24} className="text-gray-400 hover:text-green-600" />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-dark-blue">{task.name}</p>
                          <p className="text-sm text-gray-600">
                            {task.date} at {task.time}
                          </p>
                          <p className="text-sm text-blue-600">{task.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTaskDelete(task._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No pending tasks</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'performed' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Performed More</h2>
                <div className="space-y-4">
                  {getFrequency().map(([activity, count], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                    >
                      <span className="font-semibold text-dark-blue">{activity}</span>
                      <span className="text-blue-600 font-bold">{count} times</span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No activities performed yet</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'overview' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Overview</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Scatter data={getChartData()} fill="#0A1A44">
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0A1A44" />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeSection === 'calendar' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Calendar</h2>
                <div className="flex justify-center">
                  <CalendarComponent className="w-full max-w-md" />
                </div>
              </div>
            )}

            {activeSection === 'reminder' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Reminder</h2>
                
                <form onSubmit={handleAddReminder} className="mb-8 space-y-4">
                  <input
                    type="text"
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                    placeholder="Reminder text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue outline-none"
                    />
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-blue outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-dark-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Add Reminder
                  </button>
                </form>

                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-dark-blue">{reminder.text}</p>
                        <p className="text-sm text-gray-600">
                          {reminder.date} at {reminder.time}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReminder(reminder._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {reminders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No reminders yet</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'report' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-dark-blue mb-6">Report</h2>
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition mb-8 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Weekly Report'}
                </button>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-dark-blue mb-2">Report Preview</h3>
                  <p className="text-gray-700">{generateSummary(completedTasks)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

