import { LayoutDashboard, MessageSquare, BookOpen, Briefcase, Users } from 'lucide-react'

const BottomNav = ({ currentView, setView }) => {
    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={24} />, label: 'Home' },
        { id: 'chat', icon: <MessageSquare size={24} />, label: 'Chat' },
        { id: 'resources', icon: <BookOpen size={24} />, label: 'Library' },
        { id: 'tools', icon: <Briefcase size={24} />, label: 'Tools' },
        { id: 'community', icon: <Users size={24} />, label: 'Social' },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-50 pb-safe">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentView === item.id
                            ? 'text-green-600 dark:text-green-500'
                            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                >
                    {item.icon}
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    )
}

export default BottomNav
