import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CalendarDays, Check, Flame, Plus, Sparkles, Target, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../../hooks/useAuth'
import { useTasks } from '../../hooks/useTasks'
import TaskCard from '../tasks/TaskCard'
import TaskModal from '../tasks/TaskModal'
import { levelProgress, xpToNextLevel, getLevelTitle, xpToLevel } from '../../utils/xpCalculator'

const AREA_COLORS = {
  deepWork:'#14b8a6', health:'#10b981', learning:'#8b5cf6',
  relationships:'#f59e0b', creativity:'#ec4899', finance:'#3b82f6',
}

const INSIGHT_MSGS = [
  'Completing a health task first boosts your learning completion — based on your pattern data.',
  "You're most consistent in the morning. Protect that window today.",
  'Your streak is your strongest asset right now. One task at a time.',
  'Tasks with clear descriptions get completed 2× more often.',
]

const card = {
  background:'#ffffff', border:'1px solid #e8eeec',
  borderRadius:18, boxShadow:'0 3px 12px rgba(15, 23, 42, 0.035)',
}

function ProgressRing({ percent, completed, total }) {
  const radius = 43
  const circumference = 2 * Math.PI * radius

  return (
    <div className="today-ring-wrap" aria-label={`${completed} of ${total} tasks complete`}>
      <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#d8f2eb" strokeWidth="8" />
        <motion.circle
          cx="56" cy="56" r={radius} fill="none" stroke="#14b8a6" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset:circumference }}
          animate={{ strokeDashoffset:circumference * (1 - percent / 100) }}
          transition={{ duration:0.9, ease:'easeOut' }}
          transform="rotate(-90 56 56)"
        />
      </svg>
      <div className="today-ring-label">
        <strong>{percent}%</strong>
        <span>complete</span>
      </div>
    </div>
  )
}

export default function TodayView() {
  const { profile } = useAuth()
  const { todayTasks, todayCompleted, todayActive, loading, finishTask, removeTask } = useTasks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [xpFlash, setXpFlash] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.displayName?.split(' ')[0] || 'there'
  const xp = profile?.xp || 0
  const level = xpToLevel(xp)
  const levelPct = levelProgress(xp)
  const toNext = xpToNextLevel(xp)
  const streak = profile?.currentStreak || 0
  const totalToday = todayTasks.length
  const completedCount = todayCompleted.length
  const pct = totalToday > 0 ? Math.min((completedCount / totalToday) * 100, 100) : 0
  const insight = INSIGHT_MSGS[new Date().getDate() % INSIGHT_MSGS.length]

  const handleComplete = async (taskId) => {
    const earned = await finishTask(taskId)
    if (earned > 0) {
      setXpFlash(`+${earned} XP`)
      setTimeout(() => setXpFlash(null), 2000)
    }
  }

  const handleEdit = (task) => { setEditingTask(task); setModalOpen(true) }
  const handleModalClose = () => { setModalOpen(false); setEditingTask(null) }
  const openNewTask = () => { setEditingTask(null); setModalOpen(true) }

  const stats = [
    {
      label:'Current streak', value:streak > 0 ? `${streak} days` : 'Start today',
      detail:streak > 0 ? 'Keep your rhythm going' : 'Your next streak starts here',
      icon:Flame, color:'#f97316', tint:'#fff4e9',
    },
    {
      label:'Total XP', value:xp.toLocaleString(), detail:'Every action adds up',
      icon:Zap, color:'#0d9488', tint:'#e9faf6',
    },
    {
      label:`Level ${level} · ${getLevelTitle(level)}`, value:`${toNext} XP to go`,
      detail:`${xp.toLocaleString()} XP earned so far`, icon:Award, color:'#6366f1', tint:'#f1f0ff',
      progress:levelPct,
    },
  ]

  return (
    <div className="today-shell">
      <motion.section
        className="today-hero"
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
      >
        <div className="today-hero-copy">
          <div className="today-date-pill"><CalendarDays size={13} /> {format(new Date(), 'EEEE, MMMM d')}</div>
          <h2>
            {greeting}, <em>{firstName}</em>
          </h2>
          <p className="today-hero-subtitle">
            Small steps make a strong streak. Pick one priority and get your momentum going.
          </p>
          <div className="today-momentum">
            <span className="today-momentum-icon"><Target size={15} /></span>
            <span>
              <strong>{totalToday === 0 ? 'A fresh start' : `${totalToday - completedCount} ${totalToday - completedCount === 1 ? 'priority' : 'priorities'} left`}</strong>
              <small>{totalToday === 0 ? 'Add a task to shape your day' : 'You have this — one step at a time'}</small>
            </span>
          </div>
        </div>
        <div className="today-hero-progress">
          <ProgressRing percent={pct} completed={completedCount} total={totalToday} />
          <span className="today-progress-caption">
            <strong>{completedCount}/{totalToday}</strong> priorities done
          </span>
        </div>
        <div className="today-hero-glow" aria-hidden="true" />
      </motion.section>

      <section className="today-stats" aria-label="Your progress">
        {stats.map(({ label, value, detail, icon:Icon, color, tint, progress }, index) => (
          <motion.article
            key={label} className="today-stat-card"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 + index * 0.07 }}
          >
            <div className="today-stat-top">
              <span className="today-stat-icon" style={{ background:tint, color }}><Icon size={17} /></span>
              {index === 0 && streak > 0 && <span className="today-stat-note">Best: {profile?.longestStreak || streak}d</span>}
            </div>
            <strong className="today-stat-value">{value}</strong>
            <span className="today-stat-label">{label}</span>
            <span className="today-stat-detail">{detail}</span>
            {progress !== undefined && (
              <div className="today-level-track" aria-label={`${progress}% to next level`}>
                <motion.div initial={{ width:0 }} animate={{ width:`${progress}%` }} transition={{ duration:0.7 }} />
              </div>
            )}
          </motion.article>
        ))}
      </section>

      <section className="today-priorities">
        <div className="today-section-heading">
          <div>
            <p className="today-eyebrow">YOUR DAILY PLAN</p>
            <h3>Today's priorities</h3>
            <p className="today-section-subtitle">Make progress at your own pace.</p>
          </div>
          <div className="today-plan-actions">
            <span className="today-agent-pill"><Sparkles size={13} /> Planning Agent</span>
            <button className="today-add-button" onClick={openNewTask}><Plus size={15} /> Add task</button>
          </div>
        </div>

        {loading ? (
          <div className="today-loading-list">
            {[1,2,3].map(i => <div key={i} className="today-skeleton" />)}
          </div>
        ) : totalToday === 0 ? (
          <div className="today-empty-card">
            <div className="today-empty-icon"><Target size={22} /></div>
            <h4>Your day is a blank canvas</h4>
            <p>Add a small, doable action and give your momentum somewhere to begin.</p>
            <button className="today-add-button" onClick={openNewTask}><Plus size={15} /> Add your first task</button>
          </div>
        ) : (
          <>
            {todayActive.length > 0 && (
              <div className="today-task-list">
                <AnimatePresence>
                  {todayActive.map(task => (
                    <div key={task.id} className="today-task-row">
                      <TaskCard task={task} onComplete={handleComplete} onEdit={handleEdit} onDelete={removeTask} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            {todayCompleted.length > 0 && (
              <div className="today-completed-group">
                <div className="today-completed-heading"><Check size={14} /> Completed today <span>{todayCompleted.length}</span></div>
                <div className="today-task-list">
                  <AnimatePresence>
                    {todayCompleted.map(task => (
                      <div key={task.id} className="today-task-row">
                        <TaskCard task={task} onComplete={handleComplete} onEdit={handleEdit} onDelete={removeTask} />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {(profile?.focusAreas || []).length > 0 && (
        <div className="today-focus-row">
          <span>Building consistency in</span>
          {profile.focusAreas.map(area => (
            <span key={area} className="today-focus-chip" style={{
              background:`${AREA_COLORS[area] || '#14b8a6'}14`,
              color:AREA_COLORS[area] || '#14b8a6',
            }}>
              {area.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          ))}
        </div>
      )}

      <aside className="today-insight-card">
        <div className="today-insight-icon"><Sparkles size={17} /></div>
        <div>
          <p className="today-eyebrow">A NOTE FROM YOUR INSIGHTS AGENT</p>
          <p className="today-insight-text">{insight}</p>
        </div>
      </aside>

      <AnimatePresence>
        {xpFlash && (
          <motion.div
            initial={{ opacity:0, y:-10, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, scale:0.9 }}
            className="today-xp-flash"
          >{xpFlash}</motion.div>
        )}
      </AnimatePresence>

      <TaskModal open={modalOpen} onClose={handleModalClose} task={editingTask} />

      <style>{`
        .today-shell { max-width:1020px; width:100%; margin:0 auto; padding:30px clamp(18px, 3.5vw, 40px) 40px; color:#0f172a; }
        .today-hero { position:relative; overflow:hidden; display:flex; align-items:center; justify-content:space-between; gap:24px; min-height:224px; padding:30px 34px; margin-bottom:18px; border:1px solid #cceee5; border-radius:24px; background:linear-gradient(115deg,#effbf7 0%,#f7fcfa 58%,#ffffff 100%); box-shadow:0 8px 24px rgba(13,148,136,.055); }
        .today-hero-copy { position:relative; z-index:1; max-width:590px; }
        .today-date-pill { display:inline-flex; align-items:center; gap:7px; padding:6px 10px; color:#0f766e; background:rgba(255,255,255,.78); border:1px solid #d7f2ea; border-radius:99px; font-size:11px; font-weight:600; letter-spacing:.01em; }
        .today-hero h2 { margin:14px 0 6px; font-family:Fraunces, Georgia, serif; font-size:clamp(27px,3vw,36px); line-height:1.16; font-weight:400; letter-spacing:-.04em; color:#142d2a; }
        .today-hero h2 em { color:#0d9488; font-weight:400; }
        .today-hero-subtitle { max-width:470px; margin:0; color:#647b77; font-size:13px; line-height:1.7; }
        .today-momentum { display:flex; align-items:center; gap:10px; margin-top:21px; }
        .today-momentum-icon { display:grid; place-items:center; width:32px; height:32px; border-radius:10px; background:#d8f4eb; color:#0d9488; }
        .today-momentum strong, .today-momentum small { display:block; }
        .today-momentum strong { color:#24423e; font-size:12px; font-weight:650; }
        .today-momentum small { margin-top:2px; color:#80948f; font-size:11px; }
        .today-hero-progress { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; gap:7px; flex-shrink:0; padding:15px 18px; border:1px solid rgba(204,238,229,.85); border-radius:20px; background:rgba(255,255,255,.68); }
        .today-ring-wrap { position:relative; width:112px; height:112px; }
        .today-ring-label { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .today-ring-label strong { color:#173d37; font-size:23px; line-height:1.1; letter-spacing:-.04em; }
        .today-ring-label span { margin-top:3px; color:#8aa09b; font-size:10px; }
        .today-progress-caption { color:#819590; font-size:10px; }
        .today-progress-caption strong { color:#0f766e; font-weight:700; }
        .today-hero-glow { position:absolute; width:300px; height:300px; right:10%; top:-220px; border-radius:50%; background:rgba(45,212,191,.09); filter:blur(1px); }
        .today-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:13px; margin-bottom:33px; }
        .today-stat-card { min-width:0; padding:16px 17px 14px; border:1px solid #e8eeec; border-radius:17px; background:#fff; box-shadow:0 3px 12px rgba(15,23,42,.03); }
        .today-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:11px; }
        .today-stat-icon { display:grid; place-items:center; width:32px; height:32px; border-radius:10px; }
        .today-stat-note { padding:4px 7px; border-radius:99px; background:#fff7ed; color:#c2410c; font-size:9px; font-weight:600; }
        .today-stat-value { display:block; overflow:hidden; color:#172b28; font-size:19px; font-weight:650; letter-spacing:-.035em; text-overflow:ellipsis; white-space:nowrap; }
        .today-stat-label { display:block; margin-top:2px; color:#536864; font-size:11px; font-weight:600; }
        .today-stat-detail { display:block; margin-top:4px; color:#9aa9a5; font-size:10px; }
        .today-level-track { height:4px; margin-top:11px; overflow:hidden; border-radius:99px; background:#edf2f0; }
        .today-level-track div { height:100%; border-radius:99px; background:linear-gradient(90deg,#14b8a6,#5eead4); }
        .today-priorities { margin-bottom:20px; }
        .today-section-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:15px; }
        .today-eyebrow { margin:0 0 5px; color:#91a19d; font-size:9px; font-weight:750; letter-spacing:.14em; }
        .today-section-heading h3 { margin:0; color:#1a302c; font-family:Fraunces, Georgia, serif; font-size:24px; font-weight:400; letter-spacing:-.025em; }
        .today-section-subtitle { margin:3px 0 0; color:#9aa9a5; font-size:11px; }
        .today-plan-actions { display:flex; align-items:center; gap:8px; }
        .today-agent-pill { display:inline-flex; align-items:center; gap:5px; padding:7px 10px; border:1px solid #d8f2eb; border-radius:99px; background:#f0fbf7; color:#0f8b7e; font-size:10px; font-weight:600; white-space:nowrap; }
        .today-add-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 13px; border:0; border-radius:10px; background:#0d9488; color:#fff; box-shadow:0 3px 9px rgba(13,148,136,.16); font-family:inherit; font-size:11px; font-weight:600; cursor:pointer; transition:background .15s, transform .15s; white-space:nowrap; }
        .today-add-button:hover { background:#0f766e; transform:translateY(-1px); }
        .today-task-list { display:flex; flex-direction:column; gap:9px; }
        .today-task-row { position:relative; }
        .today-task-row > div { border-radius:15px !important; box-shadow:0 3px 12px rgba(15,23,42,.035) !important; transition:transform .18s, box-shadow .18s !important; }
        .today-task-row > div:hover { transform:translateY(-1px); box-shadow:0 8px 18px rgba(15,23,42,.07) !important; }
        .today-completed-group { margin-top:22px; }
        .today-completed-heading { display:flex; align-items:center; gap:7px; margin-bottom:9px; color:#7d918c; font-size:11px; font-weight:650; }
        .today-completed-heading svg { color:#14b8a6; }
        .today-completed-heading span { display:grid; place-items:center; min-width:19px; height:19px; margin-left:1px; padding:0 5px; border-radius:99px; background:#e8f8f3; color:#0f766e; font-size:9px; }
        .today-empty-card { padding:33px 20px; border:1px dashed #b8e7da; border-radius:18px; background:linear-gradient(130deg,#f4fcf9,#fff); text-align:center; }
        .today-empty-icon { display:grid; place-items:center; width:48px; height:48px; margin:0 auto 12px; border-radius:15px; background:#ddf6ee; color:#0d9488; }
        .today-empty-card h4 { margin:0 0 5px; color:#1a302c; font-family:Fraunces, Georgia, serif; font-size:20px; font-weight:450; }
        .today-empty-card p { max-width:340px; margin:0 auto 16px; color:#8a9b97; font-size:12px; line-height:1.6; }
        .today-focus-row { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin:20px 0; color:#94a3a0; font-size:10px; }
        .today-focus-chip { padding:5px 9px; border-radius:99px; font-size:10px; font-weight:600; }
        .today-insight-card { display:flex; align-items:flex-start; gap:12px; padding:16px 18px; border:1px solid #e2eafb; border-radius:16px; background:linear-gradient(110deg,#f6f8ff,#fff 75%); }
        .today-insight-icon { display:grid; place-items:center; width:32px; height:32px; flex-shrink:0; border-radius:10px; background:#e9efff; color:#5276d7; }
        .today-insight-card .today-eyebrow { color:#8292bc; }
        .today-insight-text { margin:0; color:#53627c; font-size:12px; line-height:1.65; }
        .today-loading-list { display:flex; flex-direction:column; gap:9px; }
        .today-skeleton { height:72px; border-radius:15px; background:linear-gradient(90deg,#f0f4f2 25%,#e7eeeb 50%,#f0f4f2 75%); background-size:200% 100%; animation:today-shimmer 1.5s infinite; }
        .today-xp-flash { position:fixed; top:70px; right:24px; z-index:100; padding:9px 17px; border-radius:12px; background:#0d9488; color:#fff; box-shadow:0 6px 20px rgba(13,148,136,.25); font-size:13px; font-weight:700; }
        @keyframes today-shimmer { from { background-position:-200% 0; } to { background-position:200% 0; } }
        @media (max-width:700px) {
          .today-shell { padding-top:20px; }
          .today-hero { min-height:0; padding:23px 20px; }
          .today-hero-progress { padding:10px; }
          .today-ring-wrap, .today-ring-wrap svg { width:90px; height:90px; }
          .today-ring-label strong { font-size:20px; }
        }
        @media (max-width:520px) {
          .today-hero { align-items:flex-start; gap:8px; padding:20px 17px; }
          .today-hero-progress { margin-top:8px; padding:8px 6px; }
          .today-ring-wrap, .today-ring-wrap svg { width:76px; height:76px; }
          .today-progress-caption { font-size:9px; }
          .today-hero-subtitle { font-size:12px; }
          .today-momentum { margin-top:15px; }
          .today-stats { gap:8px; }
          .today-stat-card { padding:12px 10px; }
          .today-stat-value { font-size:16px; }
          .today-stat-label { font-size:10px; }
          .today-stat-detail { font-size:9px; }
          .today-section-heading { align-items:flex-start; flex-direction:column; }
          .today-plan-actions { width:100%; justify-content:space-between; }
          .today-agent-pill { font-size:9px; }
        }
      `}</style>
    </div>
  )
}
