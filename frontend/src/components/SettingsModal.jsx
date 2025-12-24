import { useState, useEffect } from 'react'
import { X, Save, User, MapPin, Briefcase } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { nigeriaData } from '../utils/nigeria-data'

const SettingsModal = ({ isOpen, onClose, user }) => {
    const { updateProfile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        role: 'Corps Member',
        state: '', // Deployment State
        cds_group: '',
        lga: '', // PPA LGA
        address: '', // Residence Address
        state_residence: '',
        lga_residence: '',
        phone: '',
        pop_date: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                role: user.role || 'Corps Member',
                state: user.state || '',
                cds_group: user.cds_group || '',
                lga: user.lga || '',
                address: user.address || '',
                state_residence: user.state_residence || '',
                lga_residence: user.lga_residence || '',
                phone: user.phone || '',
                pop_date: user.pop_date || ''
            })
        }
    }, [user, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        // If state changes, reset PPA LGA
        if (name === 'state') {
            setFormData(prev => ({ ...prev, state: value, lga: '' }))
        }
        // If residential state changes, reset residential LGA
        else if (name === 'state_residence') {
            setFormData(prev => ({ ...prev, state_residence: value, lga_residence: '' }))
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
        const token = localStorage.getItem('nysc_token')

        try {
            const res = await axios.put(
                `${API_URL}/auth/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            updateProfile(res.data)
            toast.success("Profile updated successfully!")
            onClose()
        } catch (error) {
            console.error("Update failed", error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const states = Object.keys(nigeriaData).sort();
    const ppaLgas = formData.state ? nigeriaData[formData.state]?.sort() || [] : [];
    const resLgas = formData.state_residence ? nigeriaData[formData.state_residence]?.sort() || [] : [];

    const isCorpsMember = formData.role === 'Corps Member';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e1f20] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e1f20] z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="text-green-600" size={24} />
                        Profile Settings
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Role Selection */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Role & Status</label>
                        <div className="flex gap-4">
                            {['Corps Member', 'PCM', 'Official'].map(role => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={formData.role === role}
                                        onChange={handleChange}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal & Residence Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Personal & Residence
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State of Residence</label>
                                <select
                                    name="state_residence"
                                    value={formData.state_residence}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                >
                                    <option value="">Select State</option>
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LGA of Residence</label>
                                <select
                                    name="lga_residence"
                                    value={formData.lga_residence}
                                    onChange={handleChange}
                                    disabled={!formData.state_residence}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white disabled:opacity-50"
                                >
                                    <option value="">Select LGA</option>
                                    {resLgas.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Service Details (Only for CM) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={14} /> Service Details {isCorpsMember ? "(PPA)" : ""}
                            </h3>

                            {isCorpsMember ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State of Deployment (PPA State)</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LGA of PPA</label>
                                        <select
                                            name="lga"
                                            value={formData.lga}
                                            onChange={handleChange}
                                            disabled={!formData.state}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white disabled:opacity-50"
                                        >
                                            <option value="">Select LGA</option>
                                            {ppaLgas.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CDS Group</label>
                                        <input
                                            type="text"
                                            name="cds_group"
                                            value={formData.cds_group}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">POP Date (Expected)</label>
                                        <input
                                            type="date"
                                            name="pop_date"
                                            value={formData.pop_date}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2d2e] dark:text-white"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-500 text-center">
                                    Service details are only applicable for serving Corps Members.
                                    PCMs usually just need to update Residence info.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsModal
