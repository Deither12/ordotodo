import { useState } from 'react'
import { Card, RedBtn, OutlineBtn, Label, FormGroup, Input, RedDivider, SectionTitle } from './ui'
import { useToast } from './Toast'

export function AccountInfo({ user, setUser }) {
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({
    firstName: user?.firstName || 'Acolyte',
    lastName:  user?.lastName  || 'Prime',
    email:     user?.email     || 'acolyte@order.org',
    location:  user?.location  || 'The Sanctum, Undisclosed',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim())     e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  const save = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setUser({ ...user, ...form })
    setEditing(false)
    toast('Identity record sealed', 'success')
  }

  const cancel = () => {
    setForm({
      firstName: user?.firstName || 'Acolyte',
      lastName:  user?.lastName  || 'Prime',
      email:     user?.email     || 'acolyte@order.org',
      location:  user?.location  || 'The Sanctum, Undisclosed',
    })
    setErrors({})
    setEditing(false)
  }

  const initial = form.firstName?.[0]?.toUpperCase() || 'A'

  return (
    <div className="animate-fade-in" style={{ maxWidth: 540 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
          <SectionTitle>Identity Record</SectionTitle>
          {!editing
            ? <OutlineBtn onClick={() => setEditing(true)} style={{ padding: '6px 14px', fontSize: 10 }}>Alter</OutlineBtn>
            : <div style={{ display: 'flex', gap: 8 }}>
                <RedBtn onClick={save} style={{ padding: '6px 14px', fontSize: 10 }}>Seal Record</RedBtn>
                <OutlineBtn onClick={cancel} style={{ padding: '6px 14px', fontSize: 10 }}>Cancel</OutlineBtn>
              </div>
          }
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, padding: 14, background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: 4 }}>
          <div
            className="animate-glow-pulse"
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(192,0,12,0.1)', border: '2px solid #8b0000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 22, color: '#ff2222', flexShrink: 0,
            }}
          >{initial}</div>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 15, color: '#f0e8e8' }}>
              {form.firstName} {form.lastName}
            </div>
            <div style={{ color: '#555', fontSize: 13 }}>{form.email}</div>
            {!editing && <div style={{ color: '#444', fontSize: 12, marginTop: 2 }}>⛧ {form.location}</div>}
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup>
            <Label required>First Name</Label>
            <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} disabled={!editing} error={errors.firstName} />
          </FormGroup>
          <FormGroup>
            <Label required>Last Name</Label>
            <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} disabled={!editing} error={errors.lastName} />
          </FormGroup>
        </div>
        <FormGroup>
          <Label required>Email Address</Label>
          <Input value={form.email} onChange={e => set('email', e.target.value)} disabled={!editing} error={errors.email} />
        </FormGroup>
        <FormGroup>
          <Label>Location</Label>
          <Input value={form.location} onChange={e => set('location', e.target.value)} disabled={!editing} placeholder="Undisclosed location..." />
        </FormGroup>
      </Card>
    </div>
  )
}

export function ChangePassword() {
  const toast = useToast()
  const [form, setForm]     = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.current)              e.current = 'Current passphrase is required'
    if (!form.next)                 e.next    = 'New passphrase is required'
    else if (form.next.length < 6)  e.next    = 'Minimum 6 characters'
    if (!form.confirm)              e.confirm = 'Please confirm your passphrase'
    else if (form.confirm !== form.next) e.confirm = 'Passphrases do not match'
    if (form.current && form.next && form.current === form.next)
      e.next = 'New passphrase must differ from current'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setForm({ current: '', next: '', confirm: '' })
      toast('Secret key bound successfully', 'success')
    }, 800)
  }

  const fields = [
    { key: 'current', label: 'Current Passphrase' },
    { key: 'next',    label: 'New Passphrase' },
    { key: 'confirm', label: 'Confirm New Passphrase' },
  ]

  return (
    <div className="animate-fade-in" style={{ maxWidth: 480 }}>
      <Card>
        <SectionTitle>Alter Secret Key</SectionTitle>
        {fields.map(({ key, label }) => (
          <FormGroup key={key}>
            <Label required>{label}</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              error={errors[key]}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </FormGroup>
        ))}
        <RedDivider />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <OutlineBtn onClick={() => { setForm({ current: '', next: '', confirm: '' }); setErrors({}) }}>
            Abandon
          </OutlineBtn>
          <RedBtn onClick={handleSubmit} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Binding...' : 'Bind New Key'}
          </RedBtn>
        </div>
      </Card>
    </div>
  )
}
