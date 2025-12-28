import { useState, useEffect } from 'react'
import { Calendar, MessageSquare, BookOpen, CheckCircle, Clock, LogOut, Settings, User as UserIcon, X, ExternalLink, Bell, Activity } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import SettingsModal from './SettingsModal'

const Dashboard = ({ user, onViewChange }) => {
    const [greeting, setGreeting] = useState('')
    const [news, setNews] = useState([])
    const [timeline, setTimeline] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null) // For News Modal
    const { logout } = useAuth()

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')

        // Fallback if Env Var is missing (Common Vercel issue)
        const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"

        const fetchData = async () => {
            try {
                const [newsRes, timelineRes] = await Promise.all([
                    axios.get(`${API_URL}/api/news`),
                    axios.get(`${API_URL}/api/timeline`) // Auth header handled by context
                ])
                setNews(newsRes.data)
                setTimeline(timelineRes.data)
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Poll for updates every 30 seconds
        const intervalId = setInterval(fetchData, 30000)

        return () => clearInterval(intervalId)
    }, [])

    const isCorpsMember = user?.role === 'Corps Member';
    const displayTitle = isCorpsMember ? 'Corps Member Display' : 'Prospective Corps Member Display';

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#131314] p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {greeting}, <span className="text-green-600 dark:text-green-500">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here's what's happening with your NYSC journey today.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                        {/* Date Widget */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2c2d2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Calendar size={18} className="text-green-600" />
                            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Notification Bell */}
                        <button
                            onClick={() => toast("You have 1 unread notification from Admin.", { icon: '🔔' })}
                            className="p-2 bg-white dark:bg-[#2c2d2e] rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#2c2d2e]"></span>
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-white dark:bg-[#2c2d2e] rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            title="Profile Settings"
                        >
                            <Settings size={20} />
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Service Timeline Widget */}
                <section className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Activity className="text-green-200" />
                                Service Timeline
                            </h2>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                {displayTitle}
                            </span>
                        </div>

                        {/* Dynamic Progress Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-green-100 mb-1 font-medium">
                                <span>Progress</span>
                                <span>{isCorpsMember ? "35% (Month 4 of 12)" : "10% (Registration)"}</span>
                            </div>
                            <div className="bg-black/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-white/90 rounded-full shadow-lg transition-all duration-1000" style={{ width: isCorpsMember ? '35%' : '10%' }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
                            {isCorpsMember ? (
                                <>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                        <span className="block text-xl font-bold mb-1 pt-1 truncate">{user?.state || 'Not Assigned'}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">Deployment</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                        <span className="block text-xl font-bold mb-1 pt-1 truncate">
                                            {user?.pop_date ? new Date(user.pop_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '--'}
                                        </span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">POP Date</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-80">
                                        <span className="block text-xl font-bold mb-1 pt-1 truncate">{user?.cds_group || '--'}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">CDS Group</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-80">
                                        <span className="block text-xl font-bold mb-1 pt-1 truncate">{user?.lga || '--'}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">LGA</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                        <span className="block text-3xl font-bold mb-1">{timeline?.days_to_camp ?? '--'}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">Days to Camp</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                        <span className="block text-3xl font-bold mb-1">{timeline?.registration_status === "Open" ? "ON" : "--"}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">Registration</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-80">
                                        <span className="block text-xl font-bold mb-1 pt-1 truncate">{user?.state_code || '--'}</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">Callup No</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-80">
                                        <span className="block text-3xl font-bold mb-1">--</span>
                                        <span className="text-xs text-green-100 uppercase tracking-wider">Senate List</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Auxiliary Widgets for Corps Members */}
                {isCorpsMember && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                        {/* Monthly Clearance Status */}
                        <div className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Monthly Clearance</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">Pending</p>
                                <p className="text-xs text-orange-500 font-medium mt-1">Due: Jan 5th, 2026</p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full text-orange-600 dark:text-orange-400">
                                <Clock size={24} />
                            </div>
                        </div>

                        {/* PPA Details */}
                        <div className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Place of Primary Assignment</h3>
                                <p className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[180px]">
                                    {user?.ppa || "Not Assigned"}
                                </p>
                                <p className="text-xs text-gray-400 font-medium mt-1">{user?.lga || "LGA Not Set"}</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                <BookOpen size={24} />
                            </div>
                        </div>
                    </div>
                )}


                {/* Quick Actions & Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Action Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => onViewChange('chat')}
                            className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left flex items-start gap-4"
                        >
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ask Assistant</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get instant answers about NYSC.</p>
                            </div>
                        </button>

                        <div
                            onClick={() => onViewChange('tools')}
                            className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer text-left flex items-start gap-4"
                        >
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tools & Clearance</h3>
                                <div className="mt-1">
                                    <p className="text-xs font-semibold text-green-600 mb-0.5">Next Clearance: Jan 5th, 2026</p>
                                    <p className="text-xs text-gray-400">Monthly biometrics due soon.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onViewChange('resources')}
                            className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left flex items-start gap-4"
                        >
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resource Library</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download official handbooks.</p>
                            </div>
                        </button>
                    </div>

                    {/* Quick Links Widget */}
                    <div className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ExternalLink size={18} className="text-gray-400" /> Quick Links
                        </h3>
                        <div className="space-y-3">
                            <a href="https://portal.nysc.org.ng/nysc1/VerifySenateLists.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#2c2d2e] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verify Senate List</span>
                                <ExternalLink size={14} className="text-gray-400 group-hover:text-green-600" />
                            </a>
                            <a href="https://nysc.gov.ng/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#2c2d2e] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Official Website</span>
                                <ExternalLink size={14} className="text-gray-400 group-hover:text-green-600" />
                            </a>
                            <a href="https://nyscselfservice.com.ng/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#2c2d2e] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Self Service Portal</span>
                                <ExternalLink size={14} className="text-gray-400 group-hover:text-green-600" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* News Feed */}
                <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
                        <a href="https://nysc.gov.ng/news-and-events" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 font-medium hover:underline">View All</a>
                    </div>

                    <div className="bg-white dark:bg-[#1e1f20] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                        {news.length > 0 ? news.map(newsItem => (
                            <div
                                key={newsItem.id}
                                onClick={() => setSelectedNews(newsItem)}
                                className="block p-5 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${newsItem.type === 'Mobilization' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        newsItem.type === 'Official' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {newsItem.type}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{newsItem.date}</span>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                                    {newsItem.title}
                                </h3>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm">Loading updates...</div>
                        )}
                    </div>
                </section>

            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />

            {/* News Modal */}
            {selectedNews && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e1f20] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedNews(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="mb-4">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${selectedNews.type === 'Mobilization' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                {selectedNews.type}
                            </span>
                            <span className="ml-3 text-xs text-gray-400">{selectedNews.date}</span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {selectedNews.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            This update highlights key information regarding upcoming NYSC events. Please verify all details on the official portals linked below before taking action.
                        </p>

                        <a
                            href={selectedNews.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
                        >
                            Read Full Update <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
