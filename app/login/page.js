'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // login or signup
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage('회원가입 실패 ❌ ' + error.message)
      else setMessage('회원가입 성공 ✅')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('로그인 실패 ❌ ' + error.message)
      else setMessage('로그인 성공 ✅')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{mode === 'signup' ? '회원가입' : '로그인'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">
          {mode === 'signup' ? '회원가입' : '로그인'}
        </button>
      </form>
      <p>{message}</p>
      <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
        {mode === 'signup' ? '로그인으로' : '회원가입으로'}
      </button>
    </div>
  )
}
