import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, BookOpen, Download, Search, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const ResourceLibrary = ({ onBack }) => {
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    useEffect(() => {
        fetchResources()
    }, [])

    const fetchResources = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
            const res = await axios.get(`${API_URL}/resources/`)
            setResources(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Using offline mode (Resources unavailable)")
            // Fallback for demo/offline
            setResources([
                { id: 1, title: 'NYSC By-Laws (Revised 2023)', category: 'Handbooks', url: '#', date_added: '2023-01-01' },
                { id: 2, title: 'Medical Certificate Format', category: 'Forms', url: '#', date_added: '2023-05-15' },
                { id: 3, title: 'Camp Registration Guide', category: 'Guides', url: '#', date_added: '2023-06-20' }
            ])
        } finally {
            setLoading(false)
        }
    }

    const categories = ['All', ...new Set(resources.map(r => r.category))]

    const filteredResources = resources.filter(r =>
        (activeCategory === 'All' || r.category === activeCategory) &&
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0f0f10] overflow-y-auto animate-fade-in relative z-20">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Resource Library</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Official Downloads & Guides</p>
                </div>
            </div>

            <div className="p-6 max-w-5xl mx-auto w-full">
                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                        : 'bg-white dark:bg-[#1e1f20] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading library...</div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResources.map(res => (
                            <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white dark:bg-[#1e1f20] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl transition-all group flex items-start gap-4"
                            >
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">
                                        {res.category}
                                    </span>
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-green-600 transition-colors">
                                        {res.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Added: {res.date_added}</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-green-600 transition-colors">
                                    <Download size={20} />
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 dark:bg-[#1e1f20] p-4 rounded-full w-fit mx-auto mb-4">
                            <BookOpen size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResourceLibrary
