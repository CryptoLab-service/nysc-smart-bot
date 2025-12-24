import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import ResourceLibrary from './components/ResourceLibrary'
import ToolsHub from './components/ToolsHub'
import Community from './components/Community'
import AdminDashboard from './components/AdminDashboard'
import Checklist from './components/Checklist'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {
  const { user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'chat', 'resources'
  const [theme, setTheme] = useState('light')

  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Theme Management
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark') // Default preference
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const suggestions = [
    { icon: "📅", text: "When is the next camp date?" },
    { icon: "📄", text: "What documents do I need for clearance?" },
    { icon: "📍", text: "How do I change my PPA?" },
    { icon: "💰", text: "How much is the current allowee?" }
  ]

  const handleAsk = async (input) => {
    if (!input.trim()) return

    // Add User Message
    setMessages(prev => [...prev, { type: 'user', text: input }])
    setQuestion('')
    setIsLoading(true)

    const getMockResponse = (q) => {
      const lower = q.toLowerCase()
      if (lower.includes('camp')) return "The next NYSC Orientation Camp is tentatively scheduled for next month. Please check the official NYSC dashboard for your Call-up Letter."
      if (lower.includes('ppa')) return "To change your PPA, you need a rejection letter from your current place of assignment and a request letter from the new organization."
      if (lower.includes('allowee')) return "The current federal allowance is ₦77,000 monthly."
      return "I'm currently in simulation mode because the server is unreachable, but I can tell you that NYSC service year is a mandatory one-year program for Nigerian graduates."
    }

    try {
      // Attempt API Call
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ask`, {
        question: input
      }, { timeout: 30000 }) // 30s timeout for Render cold start

      setMessages(prev => [...prev, { type: 'bot', text: response.data.answer }])
    } catch (error) {
      console.warn("API Failed/Slow, using Mock Response", error)
      // Fallback to Mock
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: getMockResponse(input)
        }])
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  // Waiting for Auth Load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f10]">
        <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // Not Logged In -> Show Landing Page
  if (!user) {
    return <AuthPage theme={theme} toggleTheme={toggleTheme} />
  }

  // Logged In -> Show Dashboard
  return (
    <div className={`flex h-screen bg-white dark:bg-[#0f0f10] transition-colors duration-300 overflow-hidden ${theme}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => setMessages([])}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLoginClick={() => { }} // No-op, already logged in
        currentView={currentView}
        setView={(view) => {
          if (view === 'tools-checklist') {
            setCurrentView('checklist')
          } else {
            setCurrentView(view)
          }
          if (window.innerWidth < 768) setIsSidebarOpen(false)
        }}
        showAdmin={user?.role === 'Official'}
        onAdminClick={() => setCurrentView('admin')}
      />

      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          onViewChange={setCurrentView}
        />
      )}

      {currentView === 'resources' && (
        <ResourceLibrary onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'tools' && (
        <ToolsHub onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'community' && (
        <Community onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'checklist' && (
        <Checklist onBack={() => setCurrentView('tools')} />
      )}

      {currentView === 'admin' && (
        <AdminDashboard onViewChange={setCurrentView} />
      )}

      <div className={currentView === 'chat' ? 'flex-1 h-full' : 'hidden'}>
        <ChatInterface
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          messages={messages}
          isLoading={isLoading}
          question={question}
          setQuestion={setQuestion}
          handleAsk={handleAsk}
          suggestions={suggestions}
          user={user}
          onBack={() => setCurrentView('dashboard')}
        />
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
