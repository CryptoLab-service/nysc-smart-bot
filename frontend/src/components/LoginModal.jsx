import { useState } from 'react'
import { X, Github, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LoginModal = ({ isOpen, onClose }) => {
    const { login, signup } = useAuth()
    const [step, setStep] = useState('login') // 'login', 'onboarding'
    const [tempAuth, setTempAuth] = useState(null) // store auth provider info before creating profile

    // Form States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Onboarding States
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('PCM') // PCM, Corps Member, Staff
    const [location, setLocation] = useState('')
    const [stateCode, setStateCode] = useState('')
    const [lga, setLga] = useState('')
    const [cdsGroup, setCdsGroup] = useState('')

    // Validation State
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSocialLogin = (provider) => {
        // Real implementation would involve OAuth redirects here
        // e.g. window.location.href = `${API_URL}/auth/${provider.toLowerCase()}`

        // For MVP, show unavailable
        // toast.error(`${provider} login is coming soon!`)
        // note: we need to import toast first or just console.log for now if not imported
        console.log(`${provider} login clicked`)
        alert(`${provider} login is currently disabled in this version. Please use Email/Password.`)
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        const res = await login(email, password)
        if (res.success) {
            onClose()
        }
    }

    const finishOnboarding = async (e) => {
        e.preventDefault()
        if (!fullName) {
            setError('Full Name is required')
            return
        }
        // If not social login, we need email/password in this step if they weren't collected
        if (!tempAuth && (!email || !password)) {
            setError('Email and Password are required')
            return
        }

        const userData = {
            email: tempAuth ? tempAuth.email : email,
            password: tempAuth ? 'social-login-placeholder' : password, // In real social auth, we handle this differently
            name: fullName,
            role: role,
            state: location,
            state_code: stateCode,
            lga: lga,
            cds_group: cdsGroup,
            // provider: tempAuth?.provider
        }

        const res = await signup(userData)
        if (res.success) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#1e1f20] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-transparent">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {step === 'login' ? 'Welcome Back' : 'Complete Profile'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {step === 'login' ? 'Login to save your chat history' : 'Tell us a bit about yourself'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    {step === 'login' ? (
                        <div className="flex flex-col gap-4">
                            {/* Social Buttons */}
                            <button
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center gap-3 w-full bg-white dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#3c3d3e] text-gray-700 dark:text-gray-200 py-2.5 rounded-xl font-medium transition-all"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span>Continue with Google</span>
                            </button>

                            <button
                                onClick={() => handleSocialLogin('Facebook')}
                                className="flex items-center justify-center gap-3 w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 rounded-xl font-medium transition-all"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                <span>Continue with Facebook</span>
                            </button>

                            <button
                                onClick={() => handleSocialLogin('GitHub')}
                                className="flex items-center justify-center gap-3 w-full bg-[#24292e] hover:bg-[#2f363d] text-white py-2.5 rounded-xl font-medium transition-all"
                            >
                                <Github size={20} />
                                <span>Continue with GitHub</span>
                            </button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-[#1e1f20] text-gray-500">Or continue with email</span>
                                </div>
                            </div>

                            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition-colors">
                                    Login with Email
                                </button>
                                <div className="text-center mt-2">
                                    <span className="text-sm text-gray-500">Don't have an account? </span>
                                    <button
                                        type="button"
                                        onClick={() => setStep('onboarding')}
                                        className="text-sm text-green-600 font-medium hover:underline"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={finishOnboarding} className="flex flex-col gap-4">
                            {!tempAuth && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    placeholder="e.g. Adewale Chukwu"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Status</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                >
                                    <option value="PCM">Prospective Corps Member (PCM)</option>
                                    <option value="Corps Member">Corps Member</option>
                                    <option value="Official">NYSC Official / Staff</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State of Deployment</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    placeholder="e.g. Lagos"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                            </div>

                            {role === 'Corps Member' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State Code</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                            placeholder="e.g. LA/24A/1234"
                                            value={stateCode}
                                            onChange={e => setStateCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LGA</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                                placeholder="e.g. Ikeja"
                                                value={lga}
                                                onChange={e => setLga(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CDS Group</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                                placeholder="e.g. ICT"
                                                value={cdsGroup}
                                                onChange={e => setCdsGroup(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-2 flex flex-col gap-2">
                                <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-green-900/20 active:scale-95">
                                    {tempAuth ? 'Complete Setup' : 'Create Account'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('login');
                                        setTempAuth(null);
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LoginModal
