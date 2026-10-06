import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, Check, Flame, Sparkles, Zap } from 'lucide-react'

const FEATURES = [
  { icon:Flame, label:'Build your streak', desc:'Make consistency feel rewarding.', color:'#f97316', tint:'#fff3e8' },
  { icon:Zap, label:'Grow with every action', desc:'Turn small wins into real momentum.', color:'#0d9488', tint:'#e8faf5' },
  { icon:BarChart2, label:'See what works', desc:'Find patterns in your progress.', color:'#6366f1', tint:'#f0efff' },
]

const PREVIEW_TASKS = [
  { label:'Read 10 pages', done:true },
  { label:'Take a mindful break', done:true },
  { label:'Plan tomorrow', done:false },
]

function ProductPreview() {
  return (
    <motion.div
      className="home-preview-wrap"
      initial={{ opacity:0, y:18, rotate:1 }} animate={{ opacity:1, y:0, rotate:0 }}
      transition={{ duration:0.55, delay:0.12 }}
    >
      <div className="home-preview-glow" />
      <div className="home-preview-card">
        <div className="home-preview-topline">
          <div className="home-preview-brand"><span /> QuestMind</div>
          <span className="home-preview-demo">PRODUCT PREVIEW</span>
        </div>
        <div className="home-preview-title-row">
          <div><small>YOUR DAY, IN FOCUS</small><h2>A little progress goes a long way.</h2></div>
          <div className="home-preview-ring"><strong>67%</strong></div>
        </div>
        <div className="home-preview-streak">
          <div className="home-preview-flame"><Flame size={16} /></div>
          <div><strong>7 day streak</strong><small>You're showing up for yourself.</small></div>
          <Sparkles size={16} className="home-preview-spark" />
        </div>
        <div className="home-preview-list-heading"><span>Today's actions</span><span>2 of 3 done</span></div>
        <div className="home-preview-tasks">
          {PREVIEW_TASKS.map(task => (
            <div key={task.label} className={`home-preview-task ${task.done ? 'is-done' : ''}`}>
              <span className="home-preview-check">{task.done && <Check size={12} />}</span>
              <span>{task.label}</span>
              {task.done && <small>DONE</small>}
            </div>
          ))}
        </div>
        <div className="home-preview-footer"><span>Small steps. Stronger you.</span><span className="home-preview-footer-dot" /></div>
      </div>
      <div className="home-float-chip"><span><Zap size={13} /></span><strong>+20 XP</strong><small>earned today</small></div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="qm-home">
      <nav className="home-nav">
        <Link to="/" className="home-wordmark"><span className="home-mark"><Sparkles size={15} /></span><span>QuestMind</span></Link>
        <div className="home-nav-actions">
          <Link to="/auth" className="home-signin">Sign in</Link>
          <Link to="/auth" className="home-nav-cta">Get started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="home-hero">
          <motion.div
            className="home-copy"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
          >
            <div className="home-eyebrow"><span className="home-eyebrow-pulse" /> A calmer way to grow</div>
            <h1>Build habits that<br /><em>actually stick.</em></h1>
            <p className="home-lede">Make your daily actions count. Build a rhythm that fits your life, celebrate the small wins, and see how far they take you.</p>
            <div className="home-ctas">
              <Link to="/auth" className="home-primary-cta">Start your journey <ArrowRight size={16} /></Link>
              <Link to="/dashboard" className="home-secondary-cta">View dashboard <span>↗</span></Link>
            </div>
            <div className="home-proof"><span className="home-proof-dots"><i /><i /><i /></span><span>One thoughtful step at a time</span></div>
          </motion.div>
          <ProductPreview />
        </section>

        <section className="home-features" aria-label="QuestMind features">
          <div className="home-section-intro"><span>MADE FOR REAL LIFE</span><p>Less pressure. More progress.</p></div>
          <div className="home-feature-grid">
            {FEATURES.map(({ icon:Icon, label, desc, color, tint }, index) => (
              <motion.article
                key={label} className="home-feature-card"
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 + index * 0.08 }}
              >
                <span className="home-feature-icon" style={{ background:tint, color }}><Icon size={17} /></span>
                <div><h3>{label}</h3><p>{desc}</p></div>
                <ArrowRight size={15} className="home-feature-arrow" />
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer"><span>QuestMind</span><span>Small steps, lasting change.</span></footer>
    </div>
  )
}
