import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Send, Menu, Plus, User,
  MessageSquare, Settings, HelpCircle,
  Sparkles, ChevronRight, History
} from 'lucide-react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Default open on desktop
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleAsk = async (textToAsk) => {
    const input = textToAsk || question
    if (!input.trim()) return

    // 1. Add User Question
    const userMsg = { type: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setQuestion('')
    setIsLoading(true)

    try {
      // 2. Call API
      const response = await axios.post('https://nysc-bot-api.onrender.com/ask', {
        question: input
      })

      // 3. Add Bot Response
      setMessages(prev => [...prev, { type: 'bot', text: response.data.answer }])
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting. Please check your network." }])
    } finally {
      setIsLoading(false)
    }
  }

  // Suggestion Chips Data
  const suggestions = [
    { text: "When is the next camp?", icon: "📅" },
    { text: "Travel procedure steps", icon: "✈️" },
    { text: "Documentation requirements", icon: "📄" },
    { text: "Senate list updates", icon: "📜" }
  ]

  return (
    <div className="flex h-screen bg-[#131314] text-gray-200 font-sans overflow-hidden">

      {/* --- SIDEBAR (Gemini Style) --- */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#1e1f20] transition-all duration-300 ease-in-out flex flex-col border-r border-gray-800 md:relative absolute z-20 h-full`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-gray-300">
            <Menu size={20} className="cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>History</span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-3 bg-[#1a1a1c] hover:bg-[#28292a] text-gray-300 py-3 px-4 rounded-full text-sm w-full transition-colors border border-gray-700">
            <Plus size={18} />
            <span className="whitespace-nowrap">New chat</span>
          </button>
        </div>

        {/* Recent History (Static for now) */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-4 py-2 text-xs text-gray-500 font-medium">Recent</div>
          {["Camp Dates 2025", "Lagos PPA Issue", "Travel Letter"].map((item, i) => (
            <button key={i} className="flex items-center gap-3 w-full p-2 hover:bg-[#28292a] rounded-full text-sm text-gray-400">
              <MessageSquare size={16} />
              <span className="truncate">{item}</span>
            </button>
          ))}
        </div>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-white p-2">
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col relative">

        {/* Top Bar (Mobile Menu) */}
        <div className="p-4 flex justify-between items-center text-gray-400 md:hidden">
          <Menu onClick={() => setIsSidebarOpen(true)} />
          <span className="font-semibold text-white">NYSC AI</span>
          <User />
        </div>

        {/* CHAT CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-32">

            {/* WELCOME SCREEN (If no messages) */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <span className="text-3xl font-bold text-white">NY</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-200 bg-clip-text text-transparent mb-2">
                  Hello, PCM
                </h1>
                <p className="text-xl text-gray-500 mb-12">How can I help with your Service Year today?</p>

                {/* Suggestion Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleAsk(s.text)}
                      className="bg-[#1e1f20] hover:bg-[#2a2b2d] p-4 rounded-xl text-left border border-gray-800 hover:border-gray-600 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-gray-300">{s.text}</span>
                        <span className="bg-[#131314] p-2 rounded-full text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* MESSAGE STREAM */
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>

                  {/* Bot Icon */}
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={16} className="text-white" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] md:max-w-[75%] leading-relaxed ${msg.type === 'user'
                      ? 'bg-[#2a2b2d] text-white rounded-2xl rounded-tr-sm px-5 py-3'
                      : 'text-gray-200 px-2 py-1'
                    }`}>
                    {msg.text}
                  </div>

                  {/* User Icon */}
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                      <User size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* --- INPUT AREA (Floating Pill) --- */}
        <div className="p-4 bg-[#131314] absolute bottom-0 w-full">
          <div className="max-w-3xl mx-auto bg-[#1e1f20] rounded-full flex items-center p-2 pl-6 border border-gray-700 focus-within:border-gray-500 transition-colors shadow-lg">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask about NYSC..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className="p-3 bg-white text-black rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors ml-2"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            NYSC Bot can make mistakes. Verify important dates.
          </p>
        </div>

      </div>
    </div>
  )
}

export default App
