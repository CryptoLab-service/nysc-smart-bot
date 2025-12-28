import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, FileText, User } from 'lucide-react'

const OfficialClearanceDashboard = ({ isOpen, onClose }) => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        if (isOpen) fetchRequests()
    }, [isOpen])

    const fetchRequests = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
            const res = await axios.get(`${API_URL}/clearance/pending`)
            setRequests(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load requests")
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id, status) => {
        setProcessingId(id)
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
            await axios.put(`${API_URL}/clearance/${id}/action`, {
                status: status,
                comment: status === 'Approved' ? 'Cleared' : 'Invalid document'
            })
            toast.success(`Request ${status}`)
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== id))
        } catch (error) {
            toast.error("Action failed")
        } finally {
            setProcessingId(null)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e1f20] rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clearance Support</h2>
                        <p className="text-gray-500 dark:text-gray-400">Review pending clearance requests from Corps Members.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <XCircle size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-[#2c2d2e] rounded-2xl flex flex-col items-center">
                            <CheckCircle size={48} className="text-green-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Caught Up!</h3>
                            <p className="text-gray-500 mt-1">No pending clearance requests.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map(req => (
                                <div key={req.id} className="bg-gray-50 dark:bg-[#2c2d2e] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white dark:bg-[#3c3d3e] rounded-full">
                                            <User size={20} className="text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{req.user_name}</h4>
                                            <p className="text-sm text-gray-500">{req.state_code} • {req.month}</p>
                                            <p className="text-xs text-gray-400 mt-1">Submitted: {req.date_submitted}</p>
                                            {req.file_url && (
                                                <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                                                    <FileText size={12} /> View Letter
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'Rejected')}
                                            disabled={processingId === req.id}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'Approved')}
                                            disabled={processingId === req.id}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OfficialClearanceDashboard
