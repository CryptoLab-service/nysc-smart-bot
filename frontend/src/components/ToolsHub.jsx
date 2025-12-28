import { useState, useEffect, useRef } from 'react'
import { CheckSquare, Calendar, Users, ArrowLeft, Plus, Trash2, Save, Download, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ToolsHub = ({ onBack }) => {
    const { user } = useAuth()
    const [activeTool, setActiveTool] = useState('checklist') // 'checklist', 'clearance', 'cds'

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#131314] p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">

                {/* Header */}
                <header className="flex items-center gap-4 animate-fade-in">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interactive Tools</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your service year effectively.</p>
                    </div>
                </header>

                {/* Tool Navigation Tabs */}
                <div className="flex gap-2 p-1 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-gray-800 animate-slide-up sticky top-0 z-10 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTool('checklist')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTool === 'checklist'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <CheckSquare size={18} />
                        Orientation Prep
                    </button>

                    {user?.role !== 'PCM' && (
                        <>
                            <button
                                onClick={() => setActiveTool('clearance')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTool === 'clearance'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                                    }`}
                            >
                                <Calendar size={18} />
                                Clearance Tracker
                            </button>
                            <button
                                onClick={() => setActiveTool('cds')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTool === 'cds'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                                    }`}
                            >
                                <Users size={18} />
                                CDS Manager
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setActiveTool('id-card')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTool === 'id-card'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2d2e]'
                            }`}
                    >
                        <CreditCard size={18} />
                        ID Generator
                    </button>
                </div>

                {/* Tool Content Area */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {activeTool === 'checklist' && <CampChecklist />}
                    {activeTool === 'clearance' && <ClearanceTracker />}
                    {activeTool === 'cds' && <CDSManager />}
                    {activeTool === 'id-card' && <IDCardGenerator />}
                </div>

            </div>
        </div>
    )
}

// --- Sub-Components ---

const CampChecklist = () => {
    // Initial State with standard items
    const [items, setItems] = useState([
        { id: 1, text: 'Call-up Letter (Original & Photocopies)', category: 'Documents', checked: false },
        { id: 2, text: 'Green Card (Original & Photocopies)', category: 'Documents', checked: false },
        { id: 3, text: 'Medical Certificate of Fitness', category: 'Documents', checked: false },
        { id: 4, text: 'Statement of Result / Certificate', category: 'Documents', checked: false },
        { id: 5, text: 'Passport Photographs (White Background)', category: 'Documents', checked: false },
        { id: 6, text: 'White Round-neck T-shirts (x4)', category: 'Clothing', checked: false },
        { id: 7, text: 'White Shorts (x4)', category: 'Clothing', checked: false },
        { id: 8, text: 'White Tennis Shoes & Socks', category: 'Clothing', checked: false },
        { id: 9, text: 'Mosquito Net & Repellant', category: 'Provisions', checked: false },
        { id: 10, text: 'Waist Pouch', category: 'Accessories', checked: false },
    ])

    const toggleCheck = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ))
    }

    const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100)

    return (
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pack for Camp</h2>
                    <span className="text-sm font-semibold text-green-600">{progress}% Ready</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-3">
                {items.map(item => (
                    <label key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${item.checked
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                        : 'bg-white dark:bg-[#1e1f20] border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}>
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500'
                            }`}>
                            {item.checked && <CheckSquare size={14} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={item.checked}
                            onChange={() => toggleCheck(item.id)}
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium block ${item.checked ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                {item.text}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                    </label>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => alert("Checklist saved (Mock)!")}
                    className="flex items-center gap-2 text-green-600 font-medium hover:underline text-sm"
                >
                    <Save size={16} /> Save Progress
                </button>
            </div>
        </div>
    )
}

const ClearanceTracker = () => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    // 0: Pending, 1: Cleared, 2: Issue
    const [status, setStatus] = useState(Array(12).fill(0))

    const cycleStatus = (index) => {
        const newStatus = [...status]
        newStatus[index] = (newStatus[index] + 1) % 3
        setStatus(newStatus)
    }

    const getStatusInfo = (s) => {
        switch (s) {
            case 1: return { label: 'Cleared', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200' }
            case 2: return { label: 'Issue', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200' }
            default: return { label: 'Pending', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200' }
        }
    }

    return (
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">LGA Monthly Clearance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {months.map((month, i) => {
                    const info = getStatusInfo(status[i])
                    return (
                        <div
                            key={month}
                            onClick={() => cycleStatus(i)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${info.color.replace('bg-', 'border-')}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{month}</span>
                                <div className={`w-3 h-3 rounded-full ${status[i] === 1 ? 'bg-green-500' : status[i] === 2 ? 'bg-red-500' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${info.color}`}>
                                {info.label}
                            </span>
                        </div>
                    )
                })}
            </div>
            <p className="text-xs text-center text-gray-400 mt-6">Click on a month to toggle status (Pending → Cleared → Issue)</p>
        </div>
    )
}

const CDSManager = () => {
    const [projectType, setProjectType] = useState('personal') // 'personal', 'group'
    const [groupName, setGroupName] = useState('')
    const [meetingDay, setMeetingDay] = useState('')

    // Project State
    const [projectTitle, setProjectTitle] = useState('')
    const [projectObjectives, setProjectObjectives] = useState('')

    return (
        <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">CDS Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CDS Group Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Red Cross, EFCC, Medical"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Meeting Day</label>
                        <select
                            value={meetingDay}
                            onChange={(e) => setMeetingDay(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Project Planner */}
            <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Planner</h2>
                    <div className="bg-gray-100 dark:bg-[#131314] p-1 rounded-lg flex text-xs font-medium">
                        <button
                            onClick={() => setProjectType('personal')}
                            className={`px-3 py-1.5 rounded-md transition-all ${projectType === 'personal' ? 'bg-white dark:bg-[#2c2d2e] text-green-600 shadow-sm' : 'text-gray-500'}`}
                        >
                            Personal
                        </button>
                        <button
                            onClick={() => setProjectType('group')}
                            className={`px-3 py-1.5 rounded-md transition-all ${projectType === 'group' ? 'bg-white dark:bg-[#2c2d2e] text-green-600 shadow-sm' : 'text-gray-500'}`}
                        >
                            Group
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                            {projectType === 'personal' ? 'Personal CDS Project' : 'Group CDS Project'}
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            {projectType === 'personal'
                                ? "Plan your individual impact project (Personal Community Development Service)."
                                : "Collaborate and track tasks for your group's main project."}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Constructing a public toilet, Free Medical Checkup"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Objectives & Goals</label>
                        <textarea
                            rows="3"
                            placeholder="List the key objectives..."
                            value={projectObjectives}
                            onChange={(e) => setProjectObjectives(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none dark:text-white resize-none"
                        />
                    </div>

                    <button
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Save Project Plan
                    </button>
                </div>
            </div>
        </div>
    )
}

const IDCardGenerator = () => {
    const { user } = useAuth()
    const canvasRef = useRef(null)
    const [name, setName] = useState(user?.name || '')
    const [stateCode, setStateCode] = useState(user?.state_code || '')
    const [ppa, setPpa] = useState(user?.ppa || user?.lga || '')
    const [bloodGroup, setBloodGroup] = useState('O+')

    useEffect(() => {
        drawCard()
    }, [name, stateCode, ppa, bloodGroup])

    const drawCard = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 600, 378)
        grad.addColorStop(0, '#f0fdf4') // green-50
        grad.addColorStop(1, '#dcfce7') // green-100
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 600, 378)

        // Header Bar
        ctx.fillStyle = '#16a34a' // green-600
        ctx.fillRect(0, 0, 600, 60)

        // Header Text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('NATIONAL YOUTH SERVICE CORPS', 300, 38)

        // "TEMPORARY ID" Tag
        ctx.fillStyle = '#15803d' // green-700
        ctx.font = 'bold 14px Arial'
        ctx.fillText('TEMPORARY IDENTITY CARD', 300, 85)

        // Photo Placeholder
        ctx.fillStyle = '#cbd5e1' // gray-300
        ctx.fillRect(40, 110, 120, 140)
        ctx.strokeStyle = '#94a3b8'
        ctx.strokeRect(40, 110, 120, 140)

        ctx.fillStyle = '#64748b'
        ctx.font = '12px Arial'
        ctx.fillText('PHOTO', 100, 185)

        // User Details
        ctx.textAlign = 'left'
        ctx.fillStyle = '#1e293b' // slate-800

        const drawField = (label, value, y) => {
            ctx.font = 'bold 12px Arial'
            ctx.fillStyle = '#64748b' // slate-500
            ctx.fillText(label.toUpperCase(), 190, y)

            ctx.font = 'bold 18px Arial'
            ctx.fillStyle = '#0f172a' // slate-900
            ctx.fillText(value || '---', 190, y + 22)
        }

        drawField('Name', name, 130)
        drawField('State Code', stateCode, 190)
        drawField('Place of Assignment', ppa, 250)

        // Footer (Blood Group)
        ctx.fillStyle = '#ef4444' // red-500
        ctx.fillRect(190, 300, 40, 20)
        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(bloodGroup, 210, 314)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748b'
        ctx.fillText('Blood Group', 240, 314)

        // Footer Text
        ctx.fillStyle = '#16a34a'
        ctx.fillRect(0, 358, 600, 20)
        ctx.fillStyle = 'white'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Service and Humility', 300, 371)
    }

    const downloadCard = () => {
        const canvas = canvasRef.current
        const link = document.createElement('a')
        link.download = `NYSC_ID_${stateCode || 'Temp'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Card Details</h2>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">State Code</label>
                    <input
                        value={stateCode} onChange={(e) => setStateCode(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PPA (Place of Assignment)</label>
                    <input
                        value={ppa} onChange={(e) => setPpa(e.target.value)}
                        placeholder="e.g. Govt Sec School"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Blood Group</label>
                    <select
                        value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131314] rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    >
                        <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow-inner">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={378}
                        className="w-full max-w-[400px] h-auto rounded-lg shadow-xl bg-white"
                    />
                </div>

                <button
                    onClick={downloadCard}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-900/20 active:scale-[0.98]"
                >
                    <Download size={20} />
                    Download ID Card
                </button>
            </div>
        </div>
    )
}

export default ToolsHub
