import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, Upload, CheckCircle, Fingerprint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const BiometricUploadModal = ({ isOpen, onClose }) => {
    const { user } = useAuth()
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
            toast.error("Please upload your biometric slip")
            return
        }

        setUploading(true)
        const formData = new FormData()
        // We reuse the 'month' field for metadata, or better, we create a specific endpoint. 
        // For MVP, using the same clearance endpoint but marking month as "Biometric_Registration" 
        // allows us to reuse the backend logic without new tables.
        formData.append('month', 'Biometric_Registration')
        formData.append('file', file)

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"

            await axios.post(`${API_URL}/clearance/request`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            toast.success("Biometric slip uploaded successfully!")
            onClose()
        } catch (error) {
            // If error is duplicate (already uploaded), tell user
            if (error.response?.status === 400) {
                toast.success("You have already uploaded your slip.")
                onClose()
            } else {
                toast.error("Upload failed. Try again.")
            }
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
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl w-fit text-indigo-600 dark:text-indigo-400 mb-4">
                        <Fingerprint size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Biometric Verification</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Upload your stamped biometric slip to proceed.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clearance Slip (Image/PDF)</label>
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
                                    <span className="text-sm text-gray-500">Tap to snap or upload</span>
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
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? 'Uploading...' : 'Submit Verification'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BiometricUploadModal
