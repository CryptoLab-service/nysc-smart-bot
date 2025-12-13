import { useState } from 'react'
import axios from 'axios'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: 'Hello! I am your NYSC Assistant. Ask me anything about the Bye-Laws or Service Year.' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    // 1. Add User Question to Chat
    const userMessage = { type: 'user', text: question }
    setChatHistory(prev => [...prev, userMessage])
    setIsLoading(true)
    setQuestion('') // Clear input

    try {
      // 2. Send to Python Backend
      const response = await axios.post('https://nysc-bot-api.onrender.com/ask', {
        question: question
      })

      // 3. Add Bot Answer to Chat
      const botMessage = { type: 'bot', text: response.data.answer }
      setChatHistory(prev => [...prev, botMessage])

    } catch (error) {
      console.error("Error:", error)
      const errorMessage = { type: 'bot', text: "Sorry, I couldn't reach the server. Is the backend running?" }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
          NY
        </div>
        <h1 className="text-xl font-bold text-gray-800">NYSC Smart Assistant</h1>
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden h-[600px]">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                  ${msg.type === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>

                {/* Text Bubble */}
                <div className={`p-3 rounded-lg text-sm leading-relaxed 
                  ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                <Loader2 size={16} className="animate-spin text-green-600" />
                <span className="text-gray-500 text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask about travel, ppa, or camp..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              onClick={handleAsk}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50">
              <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
