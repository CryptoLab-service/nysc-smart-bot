import { useState, useEffect } from 'react'
import { X, Save, User, MapPin, Briefcase, Phone, UserCircle } from 'lucide-react'

const ProfileModal = ({ isOpen, onClose, user, updateProfile }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        role: 'Corps Member',
        location: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                gender: user.gender || '',
                role: user.role || 'Corps Member',
                location: user.location || ''
            })
        }
    }, [user, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        updateProfile(formData)
        setLoading(false)
        onClose()
    }

    const getLocationLabel = () => {
        if (formData.role === 'Corps Member') return 'State of Deployment / Service'
        if (formData.role === 'Official') return 'Post / Designation'
        return 'State of Residence'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#1e1f20] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#2c2d2e]/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserCircle className="text-green-600" />
                        Profile Settings
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c3d3e] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Gender & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Gender</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none text-xs">▼</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Current Role</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="PCM">PCM</option>
                                    <option value="Corps Member">Corps Member</option>
                                    <option value="Official">NYSC Official</option>
                                    <option value="General User">General User</option>
                                </select>
                                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none text-xs">▼</div>
                            </div>
                        </div>
                    </div>

                    {/* Location (Conditional) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{getLocationLabel()}</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                            <MapPin size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ProfileModal
