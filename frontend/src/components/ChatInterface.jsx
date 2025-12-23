import { useRef, useEffect, useState } from 'react'
import { Menu, User, Sparkles, LogOut, Settings, ArrowLeft } from 'lucide-react'
import MessageBubble from './MessageBubble'
import WelcomeScreen from './WelcomeScreen'
import InputArea from './InputArea'
import ProfileModal from './ProfileModal'
import { useAuth } from '../context/AuthContext'

const ChatInterface = ({
    isSidebarOpen,
    onOpenSidebar,
    messages,
    isLoading,
    question,
    setQuestion,
    handleAsk,
    suggestions,
    user,
    onBack
}) => {
    const messagesEndRef = useRef(null)
    const { logout, updateProfile } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages, isLoading])

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#131314] relative min-w-0 transition-colors duration-300">

            {/* Header */}
            <header className="flex-shrink-0 h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c2d2e] rounded-lg text-gray-500 dark:text-gray-400 transition-colors mr-1"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    {!isSidebarOpen && (
                        <button
                            onClick={onOpenSidebar}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c2d2e] rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 tracking-tight text-lg">NYSC Assistant</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">Beta</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2c2d2e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:ring-2 hover:ring-green-500 transition-all"
                    >
                        <User size={18} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-[#1e1f20] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1 animate-fade-in z-50">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUserMenu(false)
                                    setIsProfileOpen(true)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] transition-colors"
                            >
                                <Settings size={16} />
                                <span>Profile Settings</span>
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
                <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-24">

                    {messages.length === 0 ? (
                        <WelcomeScreen onAsk={handleAsk} suggestions={suggestions} user={user} />
                    ) : (
                        <div className="flex flex-col gap-6 pt-4">
                            {messages.map((msg, i) => (
                                <MessageBubble key={i} msg={msg} />
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-4 animate-fade-in">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                                        <Sparkles size={16} className="text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 h-10 px-4 bg-gray-100 dark:bg-[#1e1f20] rounded-2xl rounded-tl-sm">
                                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </main>

            {/* Input Area (Fixed Bottom) */}
            <div className="flex-shrink-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-[#131314] dark:via-[#131314] absolute bottom-0 left-0 right-0 z-20">
                <div className="max-w-3xl mx-auto">
                    <InputArea
                        question={question}
                        setQuestion={setQuestion}
                        handleAsk={handleAsk}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                updateProfile={updateProfile}
            />
        </div>
    )
}

export default ChatInterface
