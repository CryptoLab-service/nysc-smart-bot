import { Search, FileText, Download, ExternalLink, Book, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ResourceLibrary = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)

    const categories = ['All', 'Bye-Laws', 'Orientation', 'CDS', 'Forms']

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resources`) // Ensure this URL matches your backend
                setResources(res.data)
            } catch (error) {
                console.error("Failed to fetch resources", error)
                toast.error("Failed to fetch resources")
            } finally {
                setLoading(false)
            }
        }
        fetchResources()
    }, [])

    const filteredResources = resources.filter(res =>
        (activeCategory === 'All' || res.category === activeCategory) &&
        res.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#131314] p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">

                {/* Header */}
                <header className="animate-fade-in flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Resource Library</h1>
                        <p className="text-gray-500 dark:text-gray-400">Access official NYSC documents, guides, and forms instantly.</p>
                    </div>
                </header>

                {/* Search & Filter */}
                <div className="animate-slide-up sticky top-0 bg-gray-50 dark:bg-[#131314] z-10 py-2">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
                                    : 'bg-white dark:bg-[#1e1f20] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resource Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400 text-sm">Loading resources...</div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {filteredResources.map(res => (
                            <div key={res.id} className="group bg-white dark:bg-[#1e1f20] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-green-200 dark:hover:border-green-900 transition-all cursor-pointer flex gap-4">
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-green-600 transition-colors pr-2">
                                            {res.title}
                                        </h3>
                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">
                                            {res.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                        {res.description || 'No description available'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-gray-400">
                                        <span>{res.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        <span>{res.size}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-gray-400 hover:text-green-600 transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 animate-fade-in">
                        <Book size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No documents found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResourceLibrary
