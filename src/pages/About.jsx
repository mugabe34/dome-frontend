import { CheckCircle2, HelpCircle, Target, ShieldCheck, BarChart3, BellRing } from 'lucide-react'

const faqs = [
  {
    question: 'How do I add a new task?',
    answer: 'Open Tasks, fill title and deadline, then tap Add Task.'
  },
  {
    question: 'Can I track progress weekly?',
    answer: 'Yes. Analytics and Reports are grouped by week and preserved.'
  },
  {
    question: 'How do reminders work?',
    answer: 'Set reminder time when creating a task. In-app notifications trigger automatically.'
  },
  {
    question: 'Can I share my performance?',
    answer: 'Yes. Reports can be shared via WhatsApp and email, and downloaded as PDF.'
  }
]

const About = () => {
  return (
    <div className="page-shell">
      <div className="container-shell py-6 md:py-8 pb-24 md:pb-8 space-y-4">
        <section className="card p-5">
          <h1 className="text-2xl md:text-3xl font-bold">About doME</h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            A professional single-user productivity tracker focused on execution, analytics, and weekly reporting.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="card p-4">
            <Target size={20} />
            <h3 className="mt-2 font-semibold">Task Execution</h3>
            <p className="text-sm opacity-75 mt-1">Organize tasks with priority, deadlines, and weekly day grouping.</p>
          </article>
          <article className="card p-4">
            <BellRing size={20} />
            <h3 className="mt-2 font-semibold">Reminder System</h3>
            <p className="text-sm opacity-75 mt-1">In-app reminders with optional alarm for better follow-through.</p>
          </article>
          <article className="card p-4">
            <BarChart3 size={20} />
            <h3 className="mt-2 font-semibold">Analytics</h3>
            <p className="text-sm opacity-75 mt-1">Completion rate, overdue tracking, daily/weekly comparison and score.</p>
          </article>
          <article className="card p-4">
            <ShieldCheck size={20} />
            <h3 className="mt-2 font-semibold">Private by Account</h3>
            <p className="text-sm opacity-75 mt-1">Each user only accesses their own tasks and reports.</p>
          </article>
        </section>

        <section className="card p-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <HelpCircle size={18} /> Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="border-b border-[var(--border)] pb-3 last:border-b-0">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm opacity-80 mt-1">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-xl font-semibold">Current Improvements</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Modular task, analytics and report pages</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Mobile-first navigation and layout</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Dark/light mode support on all pages including About</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Styled downloadable PDF reports</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default About
