import { useState, useEffect } from 'react'
import { Users, Activity, Shield, LogOut } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = ({ onViewChange }) => {
    const { user, logout } = useAuth()
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
                const token = localStorage.getItem('nysc_token')
                const config = { headers: { Authorization: `Bearer ${token}` } }

                const [statsRes, usersRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/stats`, config),
                    axios.get(`${API_URL}/admin/users`, config)
                ])

                setStats(statsRes.data)
                setUsers(usersRes.data)
            } catch (error) {
                console.error("Admin Access Denied", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    const handlePostNews = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newsData = {
            title: formData.get('title'),
            type: formData.get('type'),
            content: formData.get('content'),
            url: formData.get('url')
        }

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || "https://nysc-bot-api.onrender.com"
            const token = localStorage.getItem('nysc_token')

            await axios.post(`${API_URL}/admin/news`, newsData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Update pushed successfully!")
            e.target.reset()
        } catch (error) {
            console.error(error)
            alert("Failed to push update.")
        }
    }

    if (loading) return <div className="p-10 text-center">Loading Admin Portal...</div>

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-900 p-6 text-white transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="text-red-500" /> Admin Portal
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Welcome Admin, {user?.name}</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">
                        <LogOut size={18} />
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Users size={24} /></div>
                            <span className="text-2xl font-bold">{stats?.total_users}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Total Accounts</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Users size={24} /></div>
                            <span className="text-2xl font-bold">{stats?.corps_members}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Corps Members</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400"><Users size={24} /></div>
                            <span className="text-2xl font-bold">{stats?.pcms}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Prospective (PCMs)</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Activity size={24} /></div>
                            <span className="text-2xl font-bold">{stats?.active_today}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Active Today (Mock)</p>
                    </div>
                </div>

                {/* News Management */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-lg font-bold">Push New Update</h2>
                    </div>
                    <form onSubmit={handlePostNews} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input
                                    name="title" required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                                    placeholder="e.g., 2025 Batch A Timetable Out"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Type</label>
                                <select
                                    name="type"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                                >
                                    <option value="Mobilization">Mobilization</option>
                                    <option value="Official">Official</option>
                                    <option value="Guide">Guide</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Summary / Content</label>
                            <textarea
                                name="content" required rows="2"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                                placeholder="Brief summary of the update..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Action URL (Optional)</label>
                            <input
                                name="url"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                                Post Update
                            </button>
                        </div>
                    </form>
                    </form>
                </div>

                {/* Resource Management */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Resource Library</h2>
                        <p className="text-gray-400 text-sm">Upload new guides, forms, or timetables.</p>
                    </div>
                    <button 
                        onClick={() => setIsResourceModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <FilePlus size={18} />
                        <span>Add Resource</span>
                    </button>
                </div>

                {/* User Table */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-lg font-bold">User Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">State</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'Official' ? 'bg-red-500/20 text-red-400' :
                                                u.role === 'Corps Member' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{u.state || '-'}</td>
                                        <td className="px-6 py-4 text-gray-500">Dec 2025</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            <AddResourceModal 
                isOpen={isResourceModalOpen} 
                onClose={() => setIsResourceModalOpen(false)} 
            />
        </div >
    )
}

export default AdminDashboard
