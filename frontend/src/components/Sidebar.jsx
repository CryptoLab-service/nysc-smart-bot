import { Plus, MessageSquare, Settings, Moon, Sun, X, LogIn, User, LogOut, LayoutDashboard, BookOpen, Briefcase, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, onClose, onNewChat, theme, toggleTheme, user, onLoginClick, currentView, setView }) => {
    const { logout } = useAuth()
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
        fixed md:relative z-30
        h-full bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-72 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        flex flex-col
      `}>

                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-2 bg-gray-200 dark:bg-[#2c2d2e] hover:bg-gray-300 dark:hover:bg-[#3c3d3e] text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex-1 mr-2"
                    >
                        <Plus size={16} />
                        <span>New Chat</span>
                    </button>

                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${currentView === 'dashboard'
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Home</span>
                    </button>

                    <button
                        onClick={() => setView('chat')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${currentView === 'chat'
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <MessageSquare size={20} />
                        <span>AI Assistant</span>
                    </button>

                    <button
                        onClick={() => setView('resources')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${currentView === 'resources'
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <BookOpen size={20} />
                        <span>Resources</span>
                    </button>

                    <button
                        onClick={() => setView('tools')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${currentView === 'tools'
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <Briefcase size={20} />
                        <span>Tools</span>
                    </button>

                    <button
                        onClick={() => setView('community')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${currentView === 'community'
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <Users size={20} />
                        <span>Community</span>
                    </button>

                    <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

                    {/* Chat History Header - Keeping mock for now or can be conditioned */}
                    {currentView === 'chat' && (
                        <>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</div>
                            {["Camp Dates 2025", "Lagos PPA Issue", "Travel Letter"].map((item, i) => (
                                <button key={i} className="flex items-center gap-3 w-full p-2.5 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-lg text-xs text-gray-500 dark:text-gray-400 transition-colors text-left group mb-1">
                                    <MessageSquare size={14} />
                                    <span className="truncate">{item}</span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                    <button
                        onClick={toggleTheme}
                        className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                    {user ? (
                        <button
                            onClick={logout}
                            className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <LogIn size={18} />
                            <span className="text-sm font-medium">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar
