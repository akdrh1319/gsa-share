'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // 로그인/로그아웃 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>메인 페이지</h1>
      {user ? (
        <div>
          <p>현재 로그인: {user.email}</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <p>로그인 안 됨</p>
      )}
    </div>
  )
}
