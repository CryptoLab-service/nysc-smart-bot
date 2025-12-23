import { useState, useEffect } from 'react'
import { Calendar, MessageSquare, BookOpen, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Dashboard = ({ user, onViewChange }) => {
    const [greeting, setGreeting] = useState('')
    const [news, setNews] = useState([])
    const [timeline, setTimeline] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')

        const fetchData = async () => {
            try {
                const [newsRes, timelineRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/timeline`) // Auth header handled by context
                ])
                setNews(newsRes.data)
                setTimeline(timelineRes.data)
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
                toast.error("Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

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
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2c2d2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Calendar size={18} className="text-green-600" />
                        <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </header>

                {/* Service Timeline Widget */}
                {/* Fallback specific values if timeline is loading */}
                <section className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Clock className="text-green-200" />
                                Service Timeline
                            </h2>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                {user?.role || 'PCM'} Display
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                <span className="block text-3xl font-bold mb-1">{timeline?.days_to_camp ?? '--'}</span>
                                <span className="text-xs text-green-100 uppercase tracking-wider">Days to Camp</span>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                                <span className="block text-3xl font-bold mb-1">{timeline?.registration_status === "Open" ? "ON" : "--"}</span>
                                <span className="text-xs text-green-100 uppercase tracking-wider">Registration</span>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-60">
                                <span className="block text-xl font-bold mb-1 pt-1 truncate">{user?.state || '--'}</span>
                                <span className="text-xs text-green-100 uppercase tracking-wider">Deployment</span>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm opacity-60">
                                <span className="block text-3xl font-bold mb-1">--</span>
                                <span className="text-xs text-green-100 uppercase tracking-wider">POP Date</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <button
                        onClick={() => onViewChange('chat')}
                        className="group bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask Assistant</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Have questions? Chat with our AI to get instant answers about NYSC protocols.
                        </p>
                    </button>

                    <button
                        onClick={() => onViewChange('resources')}
                        className="group bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Resource Library</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Access official Bye-Laws, Shop Guides, and Camp Handbooks directly.
                        </p>
                    </button>

                    <div
                        onClick={() => onViewChange('tools')}
                        className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-left hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tools & Clearance</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-orange-500 rounded-full"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">8/12</span>
                        </div>
                        <p className="text-xs text-gray-400">Next Clearance: Jan 5th, 2026</p>
                    </div>
                </section>

                {/* News Feed */}
                <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
                        <button className="text-sm text-green-600 font-medium hover:underline">View All</button>
                    </div>

                    <div className="bg-white dark:bg-[#1e1f20] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                        {news.length > 0 ? news.map(news => (
                            <div key={news.id} className="p-5 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${news.type === 'Mobilization' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        news.type === 'Official' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {news.type}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{news.date}</span>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                                    {news.title}
                                </h3>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm">Loading updates...</div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Dashboard
