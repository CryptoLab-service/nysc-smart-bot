import { ArrowLeft, ExternalLink, Globe, MessageCircle } from 'lucide-react'

const Community = ({ onBack }) => {

    const officialChannels = [
        { name: 'Official Website', url: 'https://www.nysc.org.ng', icon: <Globe size={20} className="text-green-600" /> },
        { name: 'NYSC Twitter (X)', url: 'https://twitter.com/officialnyscng', icon: <ExternalLink size={20} className="text-black dark:text-white" /> },
        { name: 'NYSC Instagram', url: 'https://instagram.com/officialnyscng', icon: <ExternalLink size={20} className="text-pink-600" /> },
        { name: 'Facebook Page', url: 'https://facebook.com/officialnysc', icon: <ExternalLink size={20} className="text-blue-600" /> },
    ]

    const stateGroups = [
        { state: 'Lagos', link: '#' },
        { state: 'Abuja (FCT)', link: '#' },
        { state: 'Rivers', link: '#' },
        { state: 'Kano', link: '#' },
        { state: 'Oyo', link: '#' },
        { state: 'Enugu', link: '#' },
    ]

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#131314] p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">

                {/* Header */}
                <header className="flex items-center gap-4 animate-fade-in">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community & Support</h1>
                        <p className="text-gray-500 dark:text-gray-400">Connect with official channels and fellow Corps members.</p>
                    </div>
                </header>

                {/* Official Channels Grid */}
                <section className="animate-slide-up">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Official Channels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {officialChannels.map((channel, i) => (
                            <a
                                key={i}
                                href={channel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#2c2d2e] flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                                    {channel.icon}
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-green-600 transition-colors">
                                    {channel.name}
                                </span>
                                <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-green-500" />
                            </a>
                        ))}
                    </div>
                </section>

                {/* State Groups */}
                <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">State WhatsApp/Telegram Groups</h2>
                    <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2c2d2e]/30">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-bold text-orange-500">Disclaimer:</span> These are community-managed groups. Exercise caution and verify information independently.
                            </p>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {stateGroups.map((group, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#2c2d2e] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs">
                                            {group.state.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{group.state} PCM/Corpers</span>
                                    </div>
                                    <button className="px-3 py-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                                        <MessageCircle size={14} /> Join
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
                            <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">View All States</button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Community
