import { useState } from 'react'
import { Github, Mail, ArrowRight, UserPlus, LogIn, ChevronRight, Lock, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AuthPage = ({ theme, toggleTheme }) => {
    const { login, signup, socialLogin } = useAuth()
    const [view, setView] = useState('login')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetSuccess, setResetSuccess] = useState(false)

    // Login State
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Signup State
    const [signupEmail, setSignupEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Role & Location Logic
    const [role, setRole] = useState('Corps Member')
    const [location, setLocation] = useState('')
    const [gender, setGender] = useState('')

    // Additional Fields
    const [stateCode, setStateCode] = useState('')
    const [mobilizationDate, setMobilizationDate] = useState('')
    const [popDate, setPopDate] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!loginEmail || !loginPassword) {
            setError('Please fill in all fields')
            return
        }
        setIsSubmitting(true)
        setError('')

        const result = await login(loginEmail, loginPassword)
        if (!result.success) {
            setError(typeof result.error === 'string' ? result.error : 'Login failed')
        }
        setIsSubmitting(false)
    }

    const handleSignupEmailNext = (e) => {
        e.preventDefault()
        if (!signupEmail || !signupEmail.includes('@')) {
            setError('Please enter a valid email address')
            return
        }
        setError('')
        setView('signup-details')
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!resetEmail || !resetEmail.includes('@')) {
            setError('Please enter a valid email address')
            return
        }
        setIsSubmitting(true)
        setError('')

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setResetSuccess(true)
        setIsSubmitting(false)
    }

    // State Lists
    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
        "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
        "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
        "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT - Abuja"
    ]

    const handleSignupFinal = async (e) => {
        e.preventDefault()
        setError('')

        if (!firstName || !lastName || !phone || !password || !confirmPassword) {
            setError('Please fill in all required fields')
            return
        }
        if (role === 'Corps Member' && !stateCode) {
            setError('Please provide State Code')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)
        const newUser = {
            email: signupEmail,
            password: password,
            name: `${firstName} ${lastName}`,
            role: role,
            state: location,
            gender: gender,
            phone: phone,
            state_code: stateCode,
            mobilization_date: mobilizationDate,
            pop_date: popDate
        }

        const result = await signup(newUser)
        if (!result.success) {
            setError(typeof result.error === 'string' ? result.error : 'Signup failed')
        }
        setIsSubmitting(false)
    }

    const getLocationLabel = () => {
        if (role === 'Corps Member') return 'State of Deployment'
        if (role === 'Official') return 'Post / Designation'
        return 'State of Residence'
    }

    const handleSocialLogin = async (provider) => {
        setIsSubmitting(true)
        await socialLogin(provider)
        setIsSubmitting(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f10] flex items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-[#2c2d2e] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3c3d3e] transition-all z-50"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Left Side: Hero / Context */}
                <div className="hidden md:flex flex-col gap-6 animate-fade-in items-center text-center justify-center">
                    <div className="w-40 h-40 mb-2 filter drop-shadow-xl hover:scale-105 transition-transform duration-300">
                        <img
                            src="/nysc-logo.png"
                            alt="NYSC Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                            Your Intelligent <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Service Companion</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-light max-w-md leading-relaxed mx-auto">
                            Whether you're a PCM, Corps Member, or Official, we're here to simplify your NYSC journey with instant, accurate guidance.
                        </p>
                    </div>

                    <div className="mt-8 flex gap-3 text-sm font-medium text-gray-400 justify-center">
                        <div className="px-3 py-1 bg-gray-100 dark:bg-[#1e1f20] rounded-full ring-1 ring-gray-200 dark:ring-gray-800">✨ Instant Answers</div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-[#1e1f20] rounded-full ring-1 ring-gray-200 dark:ring-gray-800">📱 Always Available</div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-[#1e1f20] rounded-full ring-1 ring-gray-200 dark:ring-gray-800">🔍 Verified Info</div>
                    </div>
                </div>

                {/* Right Side: Auth Card */}
                <div className="bg-white dark:bg-[#1e1f20] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-10 w-full max-w-md mx-auto animate-fade-in relative z-10">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {view === 'login' && 'Welcome Back'}
                            {view === 'signup-email' && 'Start your smart service year journey today.'}
                            {view === 'signup-details' && 'Complete your profile to get started.'}
                            {view === 'forgot-password' && 'Reset Password'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {view === 'login' && 'Enter your details to access your dashboard.'}
                            {view === 'signup-email' && 'Start your smart service year journey today.'}
                            {view === 'signup-details' && 'Complete your profile to get started.'}
                            {view === 'forgot-password' && 'Enter your email to receive a reset link.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                            />

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setView('forgot-password')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-green-900/20 active:scale-95 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {view === 'signup-email' && (
                        <form onSubmit={handleSignupEmailNext} className="flex flex-col gap-4">
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={signupEmail}
                                onChange={e => setSignupEmail(e.target.value)}
                            />

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-green-900/20 active:scale-95 mt-2 flex items-center justify-center gap-2">
                                <span>Proceed</span>
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {view === 'signup-details' && (
                        <form onSubmit={handleSignupFinal} className="flex flex-col gap-4 animate-slide-up">
                            {/* Locked Email */}
                            <div className="relative opacity-60">
                                <input
                                    type="email"
                                    disabled
                                    value={signupEmail}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-[#202122] border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                            </div>

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    required
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </div>

                            <input
                                type="tel"
                                required
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />

                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">▼</div>
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                >
                                    <option value="PCM">Prospective Corps Member (PCM)</option>
                                    <option value="Corps Member">Corps Member</option>
                                    <option value="Official">NYSC Official / Staff</option>
                                    <option value="General User">General User</option>
                                </select>
                                <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">▼</div>
                            </div>

                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all appearance-none"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    required
                                >
                                    <option value="">{getLocationLabel()}</option>
                                    {nigerianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">▼</div>
                            </div>

                            {
                                role === 'Corps Member' && (
                                    <>
                                        <div className="flex gap-4 animate-fade-in">
                                            <input
                                                type="text"
                                                required
                                                placeholder="State Code (e.g. LA/24A/1234)"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all uppercase"
                                                value={stateCode}
                                                onChange={e => setStateCode(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                        <div className="flex gap-4 animate-fade-in mt-4">
                                            <div className="w-1/2">
                                                <label className="block text-xs text-gray-400 mb-1 ml-1">Mobilization Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                                    value={mobilizationDate}
                                                    onChange={e => setMobilizationDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block text-xs text-gray-400 mb-1 ml-1">Probable P.O.P</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                                    value={popDate}
                                                    onChange={e => setPopDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                            <div className="flex flex-col gap-4 pt-2">
                                <input
                                    type="password"
                                    required
                                    placeholder="Create Password"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm Password"
                                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all ${confirmPassword && password !== confirmPassword
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 ml-1 animate-pulse">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-green-900/20 active:scale-95 mt-2">
                                Create Account
                            </button>

                            <button type="button" onClick={() => setView('signup-email')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-center">
                                Back to Email
                            </button>
                        </form >
                    )}

                    {view === 'forgot-password' && (
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 animate-fade-in">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                            />

                            {resetSuccess ? (
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-xl text-center">
                                    Check your email for instructions to reset your password.
                                </div>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-green-900/20 active:scale-95 mt-2 disabled:opacity-70">
                                    {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                                </button>
                            )}

                            <button type="button" onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-center">
                                Back to Login
                            </button>
                        </form>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                            <span className="px-3 bg-white dark:bg-[#1e1f20] text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSocialLogin('Google')}
                            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#2c2d2e] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#3c3d3e] text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium transition-all"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="hidden sm:inline">Google</span>
                        </button>
                        <button
                            onClick={() => handleSocialLogin('Facebook')}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] py-3 rounded-xl font-medium transition-all"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            <span className="hidden sm:inline">Facebook</span>
                        </button>
                        <button
                            onClick={() => handleSocialLogin('GitHub')}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 rounded-xl font-medium transition-all"
                        >
                            <Github size={20} />
                            <span className="hidden sm:inline">GitHub</span>
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        {view === 'login' ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                New here?{' '}
                                <button onClick={() => setView('signup-email')} className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Already have an account?{' '}
                                <button onClick={() => setView('login')} className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </div >
            </div >
        </div >
    )
}

export default AuthPage
