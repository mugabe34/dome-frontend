import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts'

const COLORS = ['#111111', '#8a8a8a', '#cfcfcf', '#5a5a5a']

const AnalyticsCharts = ({ weekData, weeklyComparison }) => {
  const pieData = [
    { name: 'Completed', value: weekData.completed },
    { name: 'Pending/Overdue', value: Math.max(0, weekData.total - weekData.completed) }
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <section className="card p-4 xl:col-span-2">
        <h3 className="mb-2 text-lg font-semibold">Weekly Performance</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completionRate" fill="#111111" name="Completion %" />
              <Bar dataKey="productivityScore" fill="#7a7a7a" name="Productivity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-4">
        <h3 className="mb-2 text-lg font-semibold">Completion Mix</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-4 xl:col-span-3">
        <h3 className="mb-2 text-lg font-semibold">Daily Productivity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData.dayStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(day) => day.slice(0, 3)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="productivity" stroke="#111111" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default AnalyticsCharts
