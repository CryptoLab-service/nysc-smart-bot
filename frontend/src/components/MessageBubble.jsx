import { User, Sparkles } from 'lucide-react'

const MessageBubble = ({ msg }) => {
    const isUser = msg.type === 'user'

    return (
        <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Bot Icon */}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-600 to-emerald-800 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-green-900/20">
                    <Sparkles size={16} className="text-white" />
                </div>
            )}

            {/* Message Bubble */}
            <div className={`max-w-[85%] md:max-w-[75%] leading-relaxed text-sm md:text-base ${isUser
                    ? 'bg-[#e7f0fe] dark:bg-[#2a2b2d] text-gray-800 dark:text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm'
                    : 'text-gray-800 dark:text-gray-200 px-2 py-1'
                }`}>
                {msg.text}
            </div>

            {/* User Icon */}
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2b2d] flex items-center justify-center shrink-0 mt-1 border border-gray-100 dark:border-gray-700">
                    <User size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
            )}
        </div>
    )
}

export default MessageBubble
