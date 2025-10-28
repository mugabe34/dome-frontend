import { CheckCircle, Calendar, BarChart3, Target, Users, HelpCircle } from 'lucide-react'

const About = () => {
  // Use a defined dark color for headings and a strong indigo for accents
  const darkHeadingColor = 'text-blue-900'
  const accentColor = 'text-indigo-600'
  const shadowStyle = 'shadow-xl shadow-gray-200/50 hover:shadow-2xl transition duration-300'

  const faqs = [
    {
      question: 'How do I add a new task?',
      answer: 'Go to the Tasks page, fill in the activity name, date, and time, then confirm it and click "Add Activity".'
    },
    {
      question: 'Can I edit or delete tasks?',
      answer: 'Yes! From the Dashboard, you can mark tasks as completed or delete them using the trash icon.'
    },
    {
      question: 'How does the report generation work?',
      answer: 'Click "Generate Weekly Report" in the Dashboard. It creates a PDF with all your completed activities and an auto-generated summary.'
    },
    {
      question: 'Can I set reminders?',
      answer: 'Absolutely! In the Reminder section of the Dashboard, add your reminder with date and time. The system will track them.'
    },
    {
      question: 'What features help me analyze my activities?',
      answer: 'The Dashboard includes: Performed More (shows frequent activities), Overview (scatter chart), and Calendar view for better visualization.'
    }
  ]

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-6xl font-extrabold ${darkHeadingColor} mb-4 tracking-tight`}>
            About doMe
          </h1>
          <p className="text-xl text-gray-500 font-light">Your Daily Activity Manager, Redefined.</p>
        </div>

        {/* What is doMe */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className={`bg-white rounded-2xl ${shadowStyle} p-10`}>
            <h2 className={`text-3xl font-bold ${darkHeadingColor} mb-6 flex items-center gap-4`}>
              <Target size={30} className={accentColor} />
              What is doMe?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 border-l-4 border-indigo-300 pl-4">
              doMe is a comprehensive daily activity management application designed to help you organize, 
              track, and analyze your everyday tasks. Whether you're managing work projects, personal goals, 
              or routine activities, doMe provides a clean, intuitive interface to keep you on track.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to help users improve their **productivity** by providing clear insights into their 
              activity patterns, making it easier to plan ahead and maintain consistency in achieving their goals.
            </p>
          </div>
        </div>

        {/* How It Helps */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className={`text-4xl font-bold ${darkHeadingColor} mb-10 text-center`}>
            Key Features to Boost Your Productivity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`bg-white rounded-xl ${shadowStyle} p-6 border-t-4 border-indigo-500`}>
              <CheckCircle className={`${accentColor} mb-4`} size={36} />
              <h3 className={`font-extrabold ${darkHeadingColor} mb-2`}>Task Management</h3>
              <p className="text-gray-600 text-sm">
                Easily add, organize, and track your daily activities with date and time management.
              </p>
            </div>

            <div className={`bg-white rounded-xl ${shadowStyle} p-6 border-t-4 border-indigo-500`}>
              <Calendar className={`${accentColor} mb-4`} size={36} />
              <h3 className={`font-extrabold ${darkHeadingColor} mb-2`}>Reminders</h3>
              <p className="text-gray-600 text-sm">
                Never miss important events with built-in reminder notifications and scheduling.
              </p>
            </div>

            <div className={`bg-white rounded-xl ${shadowStyle} p-6 border-t-4 border-indigo-500`}>
              <BarChart3 className={`${accentColor} mb-4`} size={36} />
              <h3 className={`font-extrabold ${darkHeadingColor} mb-2`}>Activity Analysis</h3>
              <p className="text-gray-600 text-sm">
                Visualize your activity patterns with interactive charts and reports.
              </p>
            </div>

            <div className={`bg-white rounded-xl ${shadowStyle} p-6 border-t-4 border-indigo-500`}>
              <Target className={`${accentColor} mb-4`} size={36} />
              <h3 className={`font-extrabold ${darkHeadingColor} mb-2`}>Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track completion rates and identify your most performed activities.
              </p>
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className={`bg-white rounded-2xl ${shadowStyle} p-10`}>
            <h2 className={`text-3xl font-bold ${darkHeadingColor} mb-8 flex items-center gap-4`}>
              <Users size={30} className={accentColor} />
              Recent Improvements
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className={`font-bold ${darkHeadingColor}`}>Enhanced Dashboard</p>
                  <p className="text-gray-600 text-sm">New sections for better activity visualization and analysis.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className={`font-bold ${darkHeadingColor}`}>PDF Report Generation</p>
                  <p className="text-gray-600 text-sm">Automated weekly reports with smart summaries.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className={`font-bold ${darkHeadingColor}`}>Interactive Calendar</p>
                  <p className="text-gray-600 text-sm">Real-time calendar view for better planning.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className={`font-bold ${darkHeadingColor}`}>Modern UI/UX</p>
                  <p className="text-gray-600 text-sm">Clean, responsive design with smooth animations.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition duration-200">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className={`font-bold ${darkHeadingColor}`}>Activity Insights</p>
                  <p className="text-gray-600 text-sm">Performed More section to identify patterns.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-2xl ${shadowStyle} p-10`}>
            <h2 className={`text-3xl font-bold ${darkHeadingColor} mb-8 flex items-center gap-4`}>
              <HelpCircle size={30} className={accentColor} />
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className={`font-extrabold ${darkHeadingColor} mb-2 text-xl cursor-pointer hover:text-indigo-600 transition duration-200`}>
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-4 border-l-2 border-indigo-200">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
