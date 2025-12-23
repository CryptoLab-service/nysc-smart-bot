import { Send } from 'lucide-react'

const InputArea = ({ question, setQuestion, handleAsk, isLoading }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-100 dark:bg-[#1e1f20] rounded-3xl flex items-center p-2 pl-5 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-all shadow-sm">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
          placeholder="Ask about NYSC..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-500 outline-none font-medium h-10"
        />
        <button
          onClick={() => handleAsk(question)}
          disabled={isLoading || !question.trim()}
          className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 disabled:opacity-30 disabled:hover:opacity-30 transition-all ml-2"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-center text-[10px] md:text-xs text-gray-400 dark:text-gray-600 mt-2.5">
        NYSC Bot may produce inaccurate information.
      </p>
    </div>
  )
}

export default InputArea
