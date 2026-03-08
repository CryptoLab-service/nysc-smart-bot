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
import BottomNav from './components/BottomNav'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {
  const { user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768)
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'chat', 'resources'

  // Auto-redirect Admin
  useEffect(() => {
    if (user?.role === 'Admin' || user?.email === 'admin@nysc.gov.ng') {
      setCurrentView('admin')
    }
  }, [user])

  // Handle Resize for Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
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

    // Add empty bot message to append chunks to
    setMessages(prev => [...prev, { type: 'bot', text: '' }])

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          session_id: user?.email || 'default_session_id'
        }),
      });

      if (!response.ok) {
        const isRateLimited = response.status === 429;
        throw new Error(isRateLimited ? "Rate limit exceeded" : `HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Append chunk to the last message (which is the bot message)
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });
      }
    } catch (error) {
      console.warn("Chat API Error", error)
      const errorMessage = error.message.includes("Rate limit")
        ? "You are sending too many requests. Please slow down."
        : "I'm having trouble connecting to the server. Please check your internet connection."

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = errorMessage;
        return newMessages;
      })
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

  // Auto-redirect Admin


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
        showAdmin={user?.role === 'Admin' || user?.email === 'admin@nysc.gov.ng'}
        onAdminClick={() => setCurrentView('admin')}
      />

      {currentView === 'dashboard' && (
        <div className="flex-1 h-full pb-16 md:pb-0">
          <Dashboard
            user={user}
            onViewChange={setCurrentView}
          />
        </div>
      )}

      {currentView === 'resources' && (
        <div className="flex-1 h-full pb-16 md:pb-0">
          <ResourceLibrary onBack={() => setCurrentView('dashboard')} />
        </div>
      )}

      {currentView === 'tools' && (
        <div className="flex-1 h-full pb-16 md:pb-0">
          <ToolsHub onBack={() => setCurrentView('dashboard')} />
        </div>
      )}

      {currentView === 'community' && (
        <div className="flex-1 h-full pb-16 md:pb-0">
          <Community onBack={() => setCurrentView('dashboard')} />
        </div>
      )}

      {currentView === 'checklist' && (
        <div className="flex-1 h-full pb-16 md:pb-0">
          <Checklist onBack={() => setCurrentView('tools')} />
        </div>
      )}

      {currentView === 'admin' && (
        <AdminDashboard onViewChange={setCurrentView} />
      )}

      <div className={currentView === 'chat' ? 'flex-1 h-full pb-16 md:pb-0' : 'hidden'}>
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

      <BottomNav currentView={currentView} setView={setCurrentView} />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
