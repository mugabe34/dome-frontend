import { CheckCircle2, Circle, Clock3, Trash2 } from 'lucide-react'

const priorityClasses = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high'
}

const formatDateTime = (value) => {
  if (!value) return 'No deadline'
  return new Date(value).toLocaleString()
}

const TaskDayBoard = ({ groupedByDay, onStatusChange, onDelete }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Object.entries(groupedByDay).map(([day, tasks]) => (
      <section key={day} className="card p-4">
        <h3 className="mb-3 text-lg font-semibold">{day}</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task._id} className="task-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.description || 'No description'}</p>
                </div>
                <span className={`priority-pill ${priorityClasses[task.priority]}`}>{task.priority}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 size={14} />
                {formatDateTime(task.deadline)}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => onStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                  {task.status === 'completed' ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                  {task.status}
                </button>
                <button onClick={() => onDelete(task._id)} className="text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
          {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks</p>}
        </div>
      </section>
    ))}
  </div>
)

export default TaskDayBoard
