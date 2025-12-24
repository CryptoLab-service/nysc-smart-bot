import { useState, useEffect } from 'react'
import { CheckSquare, Square, Save, ArrowLeft } from 'lucide-react'

const Checklist = ({ onBack }) => {
    const defaultItems = [
        "Call-up Letter (Original + 5 copies)",
        "Green Card (Original + 5 copies)",
        "School ID Card (Original + 5 copies)",
        "Statement of Result / Certificate",
        "Medical Fitness Certificate",
        "Passport Photographs (16 copies)",
        "White Round-neck T-shirts (4+)",
        "White Shorts (4+)",
        "White Tennis Shoes",
        "Mosquito Net",
        "Power Bank",
        "Toiletries (Soap, Dettol, etc.)"
    ]

    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('nysc_checklist')
        return saved ? JSON.parse(saved) : defaultItems.map(text => ({ text, checked: false }))
    })

    useEffect(() => {
        localStorage.setItem('nysc_checklist', JSON.stringify(items))
    }, [items])

    const toggleItem = (index) => {
        const newItems = [...items]
        newItems[index].checked = !newItems[index].checked
        setItems(newItems)
    }

    const resetChecklist = () => {
        if (confirm("Reset all items?")) {
            setItems(defaultItems.map(text => ({ text, checked: false })))
        }
    }

    const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100)

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#131314] p-6 transition-colors duration-300">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full">
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Camp Requirements Checklist</h1>
                </div>

                {/* Progress Bar */}
                <div className="bg-white dark:bg-[#1e1f20] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-gray-500">Preparedness</span>
                        <span className="text-2xl font-bold text-green-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-[#1e1f20] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => toggleItem(idx)}
                            className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] cursor-pointer transition-colors group"
                        >
                            <div className={`transition-colors ${item.checked ? 'text-green-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                            </div>
                            <span className={`flex-1 text-base ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-4">
                    <button onClick={resetChecklist} className="text-red-500 hover:text-red-600 text-sm font-medium">
                        Reset Checklist
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Checklist
