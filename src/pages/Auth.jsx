import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import Login         from '../components/auth/Login'
import Register      from '../components/auth/Register'
import PasswordReset from '../components/auth/PasswordReset'

export default function Auth() {
  const [view, setView] = useState('login') // 'login' | 'register' | 'reset'

  return (
    <div className="qm-auth-page min-h-screen bg-surface-alt flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-120px] right-[-80px] w-[480px] h-[480px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-40px] w-[320px] h-[320px] rounded-full bg-brand-600/5 blur-3xl pointer-events-none" />

      <div className="qm-auth-layout relative z-10">
        <section className="qm-auth-story">
          <Link to="/" className="qm-auth-wordmark"><span className="home-mark"><Sparkles size={15} /></span>QuestMind</Link>
          <span className="qm-auth-overline">A LITTLE BETTER, EVERY DAY</span>
          <h1>Build a rhythm<br />that feels like <em>you.</em></h1>
          <p>Turn everyday intentions into steady progress, with a plan that grows around your life.</p>
          <div className="qm-auth-points">
            <span><Check size={14} /> Gentle structure for your goals</span>
            <span><Check size={14} /> Progress you can actually feel</span>
            <span><Check size={14} /> Helpful insights, never more noise</span>
          </div>
          <div className="qm-auth-story-note"><Sparkles size={15} /><span>Start small. Keep showing up. Let it compound.</span></div>
        </section>

      <div className="qm-auth-form-wrap w-full max-w-[420px] relative z-10">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-modal p-9"
        >
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <Login
                key="login"
                onSwitchToRegister={() => setView('register')}
                onForgotPassword={() => setView('reset')}
              />
            )}
            {view === 'register' && (
              <Register
                key="register"
                onSwitchToLogin={() => setView('login')}
              />
            )}
            {view === 'reset' && (
              <PasswordReset
                key="reset"
                onBack={() => setView('login')}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
