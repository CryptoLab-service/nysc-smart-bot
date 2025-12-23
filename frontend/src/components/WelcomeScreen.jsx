import { HelpCircle } from 'lucide-react'

const WelcomeScreen = ({ onAsk, suggestions, user }) => {
    const firstName = user?.name?.split(' ')[0] || 'Friend'

    return (
        <div className="flex flex-col items-center justify-center mt-12 md:mt-20 text-center animate-fade-in max-w-4xl mx-auto px-4">
            {/* Logo/Hero */}
            {/* Logo/Hero */}
            <div className="mb-4 relative group">
                <div className="w-40 h-40 flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                    <img
                        src="/nysc-logo.png"
                        alt="NYSC Logo"
                        className="w-36 h-36 object-contain filter drop-shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                    />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 dark:from-[#E3E3E3] dark:to-[#C4C7C5] mb-2 tracking-tight">
                Hi {firstName},
            </h1>
            <p className="text-xl text-gray-500 dark:text-[#C4C7C5] mb-12 font-light">What should we dive into today?</p>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onAsk(s.text)}
                        className="bg-white dark:bg-[#1e1f20] hover:bg-gray-50 dark:hover:bg-[#2a2b2d] p-5 rounded-2xl text-left border border-transparent hover:border-gray-200 dark:border-[#2d2e2f] dark:hover:border-gray-600 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl grayscale grayscale-0">{s.icon}</span>
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{s.text}</span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs">Tap to ask</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default WelcomeScreen
