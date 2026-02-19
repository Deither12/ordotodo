import { useState, useEffect } from 'react'
import bgImage from './assets/bg.png'

import { ToastProvider } from './components/Toast'
import { LoginScreen, RegisterScreen } from './components/Auth'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import { MyTasks, AddTask, ViewTask } from './components/Tasks'
import TaskCategories from './components/Categories'
import { AccountInfo, ChangePassword } from './components/Account'

/* ── Default data ─────────────────────────────────────────── */
const DEFAULT_TASKS = [
  { id:1, title:'Summon the morning stand-up',  category:'Work',     priority:'High',   due:'2026-02-20', done:false, desc:'Daily ritual with the dev coven at 9am.' },
  { id:2, title:'Acquire forbidden groceries',   category:'Personal', priority:'Low',    due:'2026-02-19', done:true,  desc:'Blood oranges, black salt, dark roast.' },
  { id:3, title:'Seal the React project',         category:'Work',     priority:'High',   due:'2026-02-22', done:false, desc:'Complete the illuminated To-Do grimoire.' },
  { id:4, title:'Read the ancient tome',          category:'Personal', priority:'Medium', due:'2026-02-25', done:false, desc:'Atomic Habits — chapters 5 through 8.' },
  { id:5, title:'Invoke the quarterly report',   category:'Work',     priority:'Medium', due:'2026-03-01', done:false, desc:'Prepare slides for the high council.' },
  { id:6, title:'Inscribe the health ritual',    category:'Health',   priority:'Low',    due:'2026-03-03', done:false, desc:'30 minutes of dark arts training.' },
]

const DEFAULT_CATS = [
  { id:1, name:'Work'     },
  { id:2, name:'Personal' },
  { id:3, name:'Health'   },
  { id:4, name:'Shopping' },
]

const PAGE_TITLES = {
  dashboard:  'Sanctum Overview',
  tasks:      'The Edicts',
  categories: 'Covens',
  account:    'Identity',
  password:   'Secret Key',
}

/* ── localStorage helpers ─────────────────────────────────── */
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

/* ── App ──────────────────────────────────────────────────── */
function AppInner() {
  const [screen, setScreen]     = useState(() => load('ordo_screen', 'login'))
  const [page, setPage]         = useState('dashboard')
  const [tasks, setTasksState]  = useState(() => load('ordo_tasks', DEFAULT_TASKS))
  const [categories, setCatsState] = useState(() => load('ordo_cats', DEFAULT_CATS))
  const [user, setUserState]    = useState(() => load('ordo_user', { firstName: 'Acolyte', lastName: 'Prime', email: 'acolyte@order.org', location: 'The Sanctum, Undisclosed' }))

  // Sub-view state
  const [viewTask, setViewTask] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [adding, setAdding]     = useState(false)

  // Persist whenever state changes
  const setTasks = (val) => { setTasksState(val); save('ordo_tasks', val) }
  const setCats  = (val) => { setCatsState(val);  save('ordo_cats', val)  }
  const setUser  = (val) => { setUserState(val);  save('ordo_user', val)  }

  // Navigation
  const navTo = (p) => {
    setPage(p)
    setViewTask(null)
    setEditTask(null)
    setAdding(false)
  }

  // Task handlers
  const saveTask = (form) => {
    if (editTask) {
      const updated = tasks.map(t => t.id === editTask.id ? { ...editTask, ...form } : t)
      setTasks(updated)
      // Update viewTask so the detail view reflects changes immediately
      setViewTask({ ...editTask, ...form })
      setEditTask(null)
    } else {
      setTasks([...tasks, { ...form, id: Date.now(), done: false }])
      setAdding(false)
      navTo('tasks')
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
    setViewTask(null)
  }

  const toggleDone = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    // If currently viewing this task, update the viewTask state too
    if (viewTask?.id === id) {
      setViewTask(prev => ({ ...prev, done: !prev.done }))
    }
  }

  // Login / logout
  const handleLogin  = (userData) => {
    if (userData) setUser(userData)
    setScreen('app')
    save('ordo_screen', 'app')
  }
  const handleLogout = () => {
    setScreen('login')
    save('ordo_screen', 'login')
    setPage('dashboard')
    setViewTask(null)
    setEditTask(null)
    setAdding(false)
  }

  // Auth screens
  if (screen === 'login')    return <LoginScreen    onLogin={handleLogin}  goRegister={() => setScreen('register')} />
  if (screen === 'register') return <RegisterScreen onRegister={handleLogin} goLogin={() => setScreen('login')} />

  const title = viewTask
    ? 'View Edict'
    : editTask
    ? 'Amend Edict'
    : adding
    ? 'New Edict'
    : PAGE_TITLES[page]

  const renderPage = () => {
    // Sub-views (override page)
    if (viewTask) return (
      <ViewTask
        task={viewTask}
        onBack={() => setViewTask(null)}
        onEdit={t => { setEditTask(t); setViewTask(null) }}
        onDelete={deleteTask}
        onToggleDone={toggleDone}
      />
    )
    if (editTask) return (
      <AddTask
        initial={editTask}
        onSave={saveTask}
        onCancel={() => setEditTask(null)}
        categories={categories}
      />
    )
    if (adding) return (
      <AddTask
        onSave={saveTask}
        onCancel={() => setAdding(false)}
        categories={categories}
      />
    )

    // Pages
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            categories={categories}
            onView={t => setViewTask(t)}
            onNavigate={navTo}
          />
        )
      case 'tasks':
        return (
          <MyTasks
            tasks={tasks}
            setTasks={setTasks}
            onView={t => setViewTask(t)}
            onAdd={() => setAdding(true)}
            categories={categories}
          />
        )
      case 'categories':
        return (
          <TaskCategories
            categories={categories}
            setCategories={setCats}
            tasks={tasks}
          />
        )
      case 'account':
        return <AccountInfo user={user} setUser={setUser} />
      case 'password':
        return <ChangePassword />
      default:
        return null
    }
  }

  return (
    <div className="app-bg" style={{ '--bg-image': `url(${bgImage})` }}>
      <div className="app-content">
        <Sidebar page={page} setPage={navTo} onLogout={handleLogout} user={user} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar title={title} user={user} />
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
