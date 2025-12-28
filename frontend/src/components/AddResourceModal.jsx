import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, Upload, Link, FileText, CheckCircle } from 'lucide-react'

const AddResourceModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Guide')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
            await axios.post(`${API_URL}/resources/`, {
                title,
                category,
                url
            })
            toast.success("Resource added successfully")
            onClose()
            // Reset form
            setTitle('')
            setUrl('')
        } catch (error) {
            console.error(error)
            toast.error("Failed to add resource")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e1f20] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="mb-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl w-fit text-purple-600 dark:text-purple-400 mb-4">
                        <Upload size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Notification</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Upload a document or link.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2024 Bye-Laws"
                            className="w-full px-4 py-3 bg-white dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white appearance-none"
                        >
                            <option value="Guide">Guide</option>
                            <option value="Form">Form</option>
                            <option value="Handbook">Handbook</option>
                            <option value="Timetable">Timetable</option>
                            <option value="News">News Letter</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link URL</label>
                        <div className="relative">
                            <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Adding...' : 'Add Resource'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddResourceModal
