import { useState } from 'react'
import { EyeIcon, RedDivider, Card, RedBtn, Label, FormGroup, Input } from './ui'
import { useToast } from './Toast'
import bgImage from '../assets/bg.png'

function AuthWrap({ children, title, sub, switchText, switchLabel, onSwitch }) {
  return (
    <div className="auth-bg" style={{ '--bg-image': `url(${bgImage})` }}>
      <div className="auth-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <EyeIcon size={38} />
            <span
              className="animate-flicker"
              style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 30, color: '#f0e8e8', letterSpacing: '3px' }}
            >
              ORD<span style={{ color: '#c0000c' }}>O</span>
            </span>
          </div>
          <div style={{ color: '#555', fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase' }}>
            {title}
          </div>
        </div>

        <Card>
          <p style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 22 }}>{sub}</p>
          {children}
          <RedDivider />
          <p style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
            {switchText}{' '}
            <span style={{ color: '#ff2222', cursor: 'pointer', fontWeight: 600 }} onClick={onSwitch}>
              {switchLabel}
            </span>
          </p>
        </Card>
      </div>
    </div>
  )
}

export function LoginScreen({ onLogin, goRegister }) {
  const toast = useToast()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password.trim()) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  const handleLogin = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast('Welcome to the Sanctum', 'success')
      onLogin()
    }, 800)
  }

  const set = (k, v) => {
    setForm({ ...form, [k]: v })
    if (errors[k]) setErrors({ ...errors, [k]: '' })
  }

  return (
    <AuthWrap title="Enter the Order" sub="Prove your allegiance to continue."
      switchText="Not yet initiated?" switchLabel="Request Access" onSwitch={goRegister}>
      <FormGroup>
        <Label required>Email Address</Label>
        <Input
          placeholder="acolyte@order.org"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          error={errors.email}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
      </FormGroup>
      <FormGroup>
        <Label required>Password / Passphrase</Label>
        <Input
          type="password"
          placeholder="••••••••••••"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          error={errors.password}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
      </FormGroup>
      <div style={{ textAlign: 'right', marginBottom: 22 }}>
        <span style={{ color: '#8b0000', fontSize: 13, cursor: 'pointer' }}>Forgot passphrase?</span>
      </div>
      <RedBtn full onClick={handleLogin} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Entering...' : 'Enter the Sanctum'}
      </RedBtn>
    </AuthWrap>
  )
}

export function RegisterScreen({ onRegister, goLogin }) {
  const toast = useToast()
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim())     e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)         e.password  = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (!form.confirm)          e.confirm   = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleRegister = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast('Initiation complete. Welcome, Acolyte.', 'success')
      onRegister()
    }, 800)
  }

  const set = (k, v) => {
    setForm({ ...form, [k]: v })
    if (errors[k]) setErrors({ ...errors, [k]: '' })
  }

  return (
    <AuthWrap title="Initiation Rite" sub="Complete the ritual to join the Order."
      switchText="Already initiated?" switchLabel="Sign In" onSwitch={goLogin}>
      <div style={{ display: 'flex', gap: 12 }}>
        <FormGroup style={{ flex: 1 }}>
          <Label required>First Name</Label>
          <Input placeholder="Aleister" value={form.firstName} onChange={e => set('firstName', e.target.value)} error={errors.firstName} />
        </FormGroup>
        <FormGroup style={{ flex: 1 }}>
          <Label required>Last Name</Label>
          <Input placeholder="Crowley" value={form.lastName} onChange={e => set('lastName', e.target.value)} error={errors.lastName} />
        </FormGroup>
      </div>
      <FormGroup>
        <Label required>Email Address</Label>
        <Input placeholder="acolyte@order.org" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
      </FormGroup>
      <FormGroup>
        <Label required>Password</Label>
        <Input type="password" placeholder="••••••••••••" value={form.password} onChange={e => set('password', e.target.value)} error={errors.password} />
      </FormGroup>
      <FormGroup>
        <Label required>Confirm Password</Label>
        <Input type="password" placeholder="••••••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} error={errors.confirm} />
      </FormGroup>
      <RedBtn full onClick={handleRegister} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Initiating...' : 'Complete Initiation'}
      </RedBtn>
    </AuthWrap>
  )
}
