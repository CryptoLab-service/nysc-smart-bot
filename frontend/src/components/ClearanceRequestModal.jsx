import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, Upload, CheckCircle, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ClearanceRequestModal = ({ isOpen, onClose }) => {
    const { user } = useAuth()
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    if (!isOpen) return null

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFile(selected)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            toast.error("Please upload your clearance letter")
            return
        }

        setUploading(true)

        // Mock File Upload (In real app, upload to S3/Cloudinary first)
        // For MVP, we'll pretend the file URL is just the file name
        // because we don't have a real file storage backend set up yet.
        const mockFileUrl = `https://nysc-storage.s3.amazonaws.com/clearance/${user.id}/${file.name}`

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"

            await axios.post(`${API_URL}/clearance/request`, {
                month: month,
                file_url: mockFileUrl
            })

            toast.success("Clearance request submitted successfully!")
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.detail || "Submission failed")
        } finally {
            setUploading(false)
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
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl w-fit text-green-600 dark:text-green-400 mb-4">
                        <FileText size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Clearance</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Submit your PPA letter for {month}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clearance Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2c2d2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            {[0, 1, 2].map(i => {
                                const d = new Date();
                                d.setMonth(d.getMonth() + i);
                                return d.toLocaleString('default', { month: 'long', year: 'numeric' });
                            }).map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Letter (PDF/IMG)</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2c2d2e] transition-colors"
                        >
                            {file ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle size={24} />
                                    <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={24} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Tap to browse files</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? 'Checking...' : 'Submit Clearance'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ClearanceRequestModal
