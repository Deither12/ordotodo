import { useState } from 'react'
import { Card, RedBtn, OutlineBtn, DangerBtn, Label, FormGroup, Input, Textarea, SelectInput, PriBadge, RedDivider, SectionTitle } from './ui'
import { useToast } from './Toast'

/* ── MY TASKS ──────────────────────────────────────────────── */
export function MyTasks({ tasks, setTasks, onView, onAdd, categories }) {
  const toast = useToast()
  const [filter, setFilter]   = useState('All')
  const [priFilter, setPri]   = useState('All')
  const [search, setSearch]   = useState('')
  const [sortBy, setSortBy]   = useState('default')

  const catNames = ['All', ...categories.map(c => c.name)]

  let visible = [...tasks]

  // Filter by category
  if (filter !== 'All') visible = visible.filter(t => t.category === filter)
  // Filter by priority
  if (priFilter !== 'All') visible = visible.filter(t => t.priority === priFilter)
  // Search
  if (search.trim()) {
    const q = search.toLowerCase()
    visible = visible.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.desc?.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }
  // Sort
  if (sortBy === 'priority') {
    const order = { High: 0, Medium: 1, Low: 2 }
    visible.sort((a, b) => order[a.priority] - order[b.priority])
  } else if (sortBy === 'name') {
    visible.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === 'status') {
    visible.sort((a, b) => Number(a.done) - Number(b.done))
  }

  const toggle = (id) => {
    const task = tasks.find(t => t.id === id)
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
    toast(task?.done ? 'Edict marked as pending' : 'Edict fulfilled!', task?.done ? 'warn' : 'success')
  }

  const deleteTask = (e, id) => {
    e.stopPropagation()
    setTasks(tasks.filter(t => t.id !== id))
    toast('Edict banished', 'warn')
  }

  return (
    <div className="animate-fade-in">
      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          className="occult-input"
          placeholder="⚿  Search edicts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {catNames.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : 'inactive'}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
        <RedBtn onClick={onAdd} style={{ marginLeft: 'auto' }}>⛧ New Edict</RedBtn>
      </div>

      {/* Priority filter + sort */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <span style={{ color: '#444', fontSize: 11, fontFamily: "'Cinzel',serif", letterSpacing: '1px' }}>SEVERITY:</span>
        {['All', 'High', 'Medium', 'Low'].map(p => (
          <button
            key={p}
            className={`filter-btn ${priFilter === p ? 'active' : 'inactive'}`}
            onClick={() => setPri(p)}
            style={{ padding: '4px 10px', fontSize: 9 }}
          >{p}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#444', fontSize: 11, fontFamily: "'Cinzel',serif", letterSpacing: '1px' }}>SORT:</span>
          <select
            className="occult-input"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '4px 10px', fontSize: 11, width: 'auto' }}
          >
            <option value="default">Default</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map(t => (
          <div
            key={t.id}
            className="task-card"
            onClick={() => onView(t)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', cursor: 'pointer' }}
          >
            {/* Diamond checkbox */}
            <div
              onClick={e => { e.stopPropagation(); toggle(t.id) }}
              style={{
                width: 18, height: 18, flexShrink: 0, cursor: 'pointer',
                border: `1px solid ${t.done ? '#c0000c' : '#2a2a2a'}`,
                transform: 'rotate(45deg)',
                background: t.done ? 'rgba(192,0,12,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {t.done && <span style={{ transform: 'rotate(-45deg)', color: '#ff2222', fontSize: 11, display: 'block', lineHeight: 1 }}>✓</span>}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 15, fontFamily: "'Crimson Text',serif", fontWeight: 600,
                color: t.done ? '#444' : '#f0e8e8',
                textDecoration: t.done ? 'line-through' : 'none',
                opacity: t.done ? 0.5 : 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{t.title}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{t.category} · Due {t.due || 'No deadline'}</div>
            </div>

            <PriBadge priority={t.priority} />

            {/* Quick delete */}
            <span
              onClick={e => deleteTask(e, t.id)}
              style={{ color: '#550000', fontSize: 16, cursor: 'pointer', padding: '0 4px', flexShrink: 0, transition: 'color 0.2s' }}
              title="Banish"
              onMouseEnter={e => e.target.style.color = '#ff2222'}
              onMouseLeave={e => e.target.style.color = '#550000'}
            >✕</span>
          </div>
        ))}

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#2a2a2a', fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '3px' }}>
            {search ? 'NO EDICTS MATCH YOUR SEARCH' : 'NO EDICTS IN THIS COVEN'}
          </div>
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(192,0,12,0.04)', border: '1px solid rgba(139,0,0,0.12)', borderRadius: 3, display: 'flex', gap: 20 }}>
          {[
            ['Total', tasks.length],
            ['Pending', tasks.filter(t => !t.done).length],
            ['Fulfilled', tasks.filter(t => t.done).length],
          ].map(([l, v]) => (
            <span key={l} style={{ fontSize: 11, color: '#555', fontFamily: "'Cinzel',serif", letterSpacing: '1px' }}>
              {l}: <span style={{ color: '#c0000c', fontWeight: 700 }}>{v}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── ADD / EDIT TASK ────────────────────────────────────────── */
export function AddTask({ onSave, onCancel, initial, categories }) {
  const toast = useToast()
  const [f, setF]         = useState(initial ? { ...initial } : { title: '', category: 'Work', priority: 'Medium', due: '', desc: '' })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setF(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!f.title.trim()) e.title = 'Edict title is required'
    else if (f.title.trim().length < 3) e.title = 'Title must be at least 3 characters'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...f, title: f.title.trim(), desc: f.desc?.trim() || '' })
    toast(initial ? 'Edict amended successfully' : 'New edict sealed!', 'success')
  }

  const catOptions = categories.length ? categories.map(c => c.name) : ['Work', 'Personal', 'Health', 'Shopping']

  return (
    <div className="animate-fade-in" style={{ maxWidth: 580 }}>
      <Card>
        <SectionTitle>{initial ? 'Amend the Edict' : 'Inscribe New Edict'}</SectionTitle>

        <FormGroup>
          <Label required>Title of Edict</Label>
          <Input
            placeholder="What must be done..."
            value={f.title}
            onChange={e => set('title', e.target.value)}
            error={errors.title}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup>
            <Label>Coven</Label>
            <SelectInput value={f.category} onChange={e => set('category', e.target.value)}>
              {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectInput>
          </FormGroup>
          <FormGroup>
            <Label>Severity</Label>
            <SelectInput value={f.priority} onChange={e => set('priority', e.target.value)}>
              {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
            </SelectInput>
          </FormGroup>
        </div>

        <FormGroup>
          <Label>Deadline</Label>
          <Input type="date" value={f.due} onChange={e => set('due', e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label>Incantation / Details</Label>
          <Textarea
            placeholder="Describe the edict in full..."
            value={f.desc}
            onChange={e => set('desc', e.target.value)}
          />
        </FormGroup>

        <RedDivider />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <OutlineBtn onClick={onCancel}>Abandon</OutlineBtn>
          <RedBtn onClick={handleSave}>{initial ? 'Save Changes' : 'Seal Edict'}</RedBtn>
        </div>
      </Card>
    </div>
  )
}

/* ── VIEW TASK ──────────────────────────────────────────────── */
export function ViewTask({ task, onBack, onEdit, onDelete, onToggleDone }) {
  const toast = useToast()

  const handleDelete = () => {
    onDelete(task.id)
    toast('Edict has been banished', 'warn')
  }

  const handleToggle = () => {
    onToggleDone(task.id)
    toast(task.done ? 'Edict marked as pending' : 'Edict fulfilled!', task.done ? 'warn' : 'success')
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 580 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <OutlineBtn onClick={onBack} style={{ padding: '6px 14px', fontSize: 10 }}>← Return</OutlineBtn>
          <div style={{ display: 'flex', gap: 8 }}>
            <RedBtn onClick={() => onEdit(task)} style={{ padding: '6px 14px', fontSize: 10 }}>Amend</RedBtn>
            <DangerBtn onClick={handleDelete} style={{ padding: '6px 14px', fontSize: 10 }}>Banish</DangerBtn>
          </div>
        </div>

        {/* Title + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 18, color: '#f0e8e8', flex: 1, paddingRight: 14, lineHeight: 1.5 }}>
            {task.title}
          </h2>
          <PriBadge priority={task.priority} />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#666' }}>⛧ {task.category}</span>
          <span style={{ fontSize: 12, color: '#666' }}>☽ Due: {task.due || 'No deadline'}</span>
          <span
            onClick={handleToggle}
            style={{ fontSize: 12, color: task.done ? '#882200' : '#555', cursor: 'pointer', textDecoration: 'underline' }}
            title="Click to toggle"
          >
            {task.done ? '✦ Fulfilled — mark pending?' : '◈ Pending — mark fulfilled?'}
          </span>
        </div>

        {/* Description */}
        <div style={{
          background: '#0e0e0e', border: '1px solid #1a1a1a', borderLeft: '2px solid #8b0000',
          borderRadius: 3, padding: 16, marginBottom: 22,
          fontSize: 15, color: '#c8b8b8', lineHeight: 1.75, fontFamily: "'Crimson Text',serif",
          minHeight: 80,
        }}>
          {task.desc || <span style={{ color: '#333', fontStyle: 'italic' }}>No incantation provided.</span>}
        </div>

        {/* Status toggle button */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={handleToggle}
            style={{
              padding: '8px 18px', borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase',
              background: task.done ? 'rgba(139,0,0,0.1)' : 'rgba(192,0,12,0.08)',
              border: `1px solid ${task.done ? '#550000' : '#8b0000'}`,
              color: task.done ? '#882200' : '#ff2222',
            }}
          >
            {task.done ? '↩ Mark as Pending' : '✓ Mark as Fulfilled'}
          </button>
        </div>
      </Card>
    </div>
  )
}
