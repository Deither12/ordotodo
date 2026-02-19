import { useState } from 'react'
import { Card, RedBtn, OutlineBtn, Input, Label, FormGroup, SectionTitle, RedDivider } from './ui'
import { useToast } from './Toast'

export default function TaskCategories({ categories, setCategories, tasks }) {
  const toast = useToast()
  const [newCat, setNewCat]   = useState('')
  const [editId, setEditId]   = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError]     = useState('')

  const validate = (name, excludeId = null) => {
    if (!name.trim()) return 'Coven name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== excludeId))
      return 'A coven with this name already exists'
    return ''
  }

  const add = () => {
    const err = validate(newCat)
    if (err) { setError(err); return }
    setCategories([...categories, { id: Date.now(), name: newCat.trim() }])
    setNewCat('')
    setError('')
    toast(`Coven "${newCat.trim()}" forged`, 'success')
  }

  const startEdit = (cat) => {
    setEditId(cat.id)
    setEditName(cat.name)
    setError('')
  }

  const saveEdit = () => {
    const err = validate(editName, editId)
    if (err) { setError(err); return }
    setCategories(categories.map(c => c.id === editId ? { ...c, name: editName.trim() } : c))
    setEditId(null)
    setEditName('')
    setError('')
    toast('Coven name updated', 'success')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditName('')
    setError('')
  }

  const dissolve = (cat) => {
    const taskCount = tasks.filter(t => t.category === cat.name).length
    if (taskCount > 0) {
      toast(`Cannot dissolve: ${taskCount} edict(s) still belong to this coven`, 'error')
      return
    }
    setCategories(categories.filter(c => c.id !== cat.id))
    toast(`Coven "${cat.name}" dissolved`, 'warn')
  }

  const getTaskCount = (catName) => tasks.filter(t => t.category === catName).length
  const getDoneCount = (catName) => tasks.filter(t => t.category === catName && t.done).length

  return (
    <div className="animate-fade-in">
      {/* Forge new */}
      <Card style={{ maxWidth: 560, marginBottom: 14 }}>
        <SectionTitle>Forge New Coven</SectionTitle>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Name the coven..."
              value={newCat}
              onChange={e => { setNewCat(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && add()}
              error={!editId ? error : ''}
            />
          </div>
          <RedBtn onClick={add}>⛧ Forge</RedBtn>
        </div>
      </Card>

      {/* All covens */}
      <Card style={{ maxWidth: 560 }}>
        <SectionTitle>All Covens ({categories.length})</SectionTitle>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#2a2a2a', fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '2px' }}>
            NO COVENS EXIST
          </div>
        ) : categories.map((c, i) => {
          const total = getTaskCount(c.name)
          const done  = getDoneCount(c.name)
          const pct   = total === 0 ? 0 : Math.round((done / total) * 100)
          const isEditing = editId === c.id

          return (
            <div
              key={c.id}
              style={{ padding: '14px 0', borderBottom: i < categories.length - 1 ? '1px solid #1e1e1e' : 'none' }}
            >
              {isEditing ? (
                <div>
                  <Input
                    value={editName}
                    onChange={e => { setEditName(e.target.value); setError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                    error={editId ? error : ''}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <RedBtn onClick={saveEdit} style={{ padding: '5px 14px', fontSize: 10 }}>Save</RedBtn>
                    <OutlineBtn onClick={cancelEdit} style={{ padding: '5px 14px', fontSize: 10 }}>Cancel</OutlineBtn>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 7, height: 7, background: '#8b0000', transform: 'rotate(45deg)', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Crimson Text',serif", fontSize: 16, color: '#f0e8e8', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: '#555', fontFamily: "'Cinzel',serif" }}>{done}/{total} edicts</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => startEdit(c)}
                        style={{ background: 'rgba(139,0,0,0.08)', border: '1px solid #2a2a2a', borderRadius: 2, color: '#888', fontSize: 10, fontFamily: "'Cinzel',serif", fontWeight: 700, cursor: 'pointer', padding: '4px 10px', letterSpacing: '1px', textTransform: 'uppercase' }}
                      >Edit</button>
                      <button
                        onClick={() => dissolve(c)}
                        style={{ background: 'rgba(139,0,0,0.08)', border: '1px solid #330000', borderRadius: 2, color: total > 0 ? '#553333' : '#ff4444', fontSize: 10, fontFamily: "'Cinzel',serif", fontWeight: 700, cursor: total > 0 ? 'not-allowed' : 'pointer', padding: '4px 10px', letterSpacing: '1px', textTransform: 'uppercase' }}
                        title={total > 0 ? `Cannot dissolve: ${total} edicts remain` : 'Dissolve coven'}
                      >Dissolve</button>
                    </div>
                  </div>
                  {/* Mini progress */}
                  <div style={{ height: 3, background: '#181818', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(to right,#8b0000,#c0000c)', width: `${pct}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )
}
