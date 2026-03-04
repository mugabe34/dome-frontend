import { useState } from 'react'

const initialState = {
  title: '',
  description: '',
  priority: 'medium',
  deadline: '',
  reminderTime: '',
  alarmEnabled: false
}

const TaskComposer = ({ onCreateTask, creating }) => {
  const [form, setForm] = useState(initialState)

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const success = await onCreateTask(form)
    if (success) {
      setForm(initialState)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-3 p-4 lg:grid-cols-6">
      <input
        value={form.title}
        onChange={(event) => onChange('title', event.target.value)}
        required
        className="input lg:col-span-2"
        placeholder="Task title"
      />
      <input
        value={form.description}
        onChange={(event) => onChange('description', event.target.value)}
        className="input lg:col-span-2"
        placeholder="Description"
      />
      <select
        value={form.priority}
        onChange={(event) => onChange('priority', event.target.value)}
        className="input"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="datetime-local"
        value={form.deadline}
        onChange={(event) => onChange('deadline', event.target.value)}
        required
        className="input"
      />
      <input
        type="datetime-local"
        value={form.reminderTime}
        onChange={(event) => onChange('reminderTime', event.target.value)}
        className="input lg:col-span-2"
      />
      <label className="card flex items-center gap-2 px-3 py-2 text-sm font-medium lg:col-span-1">
        <input
          type="checkbox"
          checked={form.alarmEnabled}
          onChange={(event) => onChange('alarmEnabled', event.target.checked)}
        />
        Alarm
      </label>
      <button type="submit" className="btn-primary lg:col-span-3" disabled={creating}>
        {creating ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskComposer
