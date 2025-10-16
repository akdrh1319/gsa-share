'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  const handleUpload = async () => {
    if (!file) {
      setMsg('파일을 선택하세요.')
      return
    }

    try {
      const filePath = `${Date.now()}-${file.name}`

      // 1️⃣ Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (uploadError) {
        setMsg('업로드 실패 ❌ ' + uploadError.message)
        return
      }

      // 2️⃣ 비공개 버킷용 signed URL 생성 (1시간 유효)
      const { data, error: urlError } = await supabase.storage
        .from('uploads')
        .createSignedUrl(filePath, 60 * 60)

      if (urlError) {
        setMsg('URL 생성 실패 ❌ ' + urlError.message)
        return
      }

      setUrl(data.signedUrl)

      // 3️⃣ 현재 로그인된 사용자 정보 가져오기
      const {
        data: userData,
        error: userError
      } = await supabase.auth.getUser()

      if (userError) {
        console.error(userError)
        setMsg('유저 정보 불러오기 실패 ❌')
        return
      }

      // 4️⃣ DB에 파일 정보 저장
      const { error: dbError } = await supabase.from('files').insert({
        user_id: userData.user.id,
        filename: file.name,
        url: data.signedUrl
      })

      if (dbError) {
        console.error(dbError)
        setMsg('DB 저장 실패 ❌ ' + dbError.message)
        return
      }

      setMsg('업로드 성공 ✅')
    } catch (err) {
      console.error(err)
      setMsg('오류 발생 ❌ ' + err.message)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>자료 업로드</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>업로드</button>

      <p>{msg}</p>

      {url && (
        <div>
          <p>다운로드 링크:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  )
}
