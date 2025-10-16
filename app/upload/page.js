'use client'  // 🔥 클라이언트 전용으로 강제 (빌드 중 실행 안 함)

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  // 🔹 업로드 함수: file이 있을 때만 실행
  const handleUpload = async () => {
    if (!file) {
      setMsg('파일을 선택하세요.')
      return
    }

    try {
      const filePath = `${Date.now()}-${file.name}`

      // 1️⃣ Supabase Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (uploadError) {
        setMsg('업로드 실패 ❌ ' + uploadError.message)
        return
      }

      // 2️⃣ 비공개 버킷용 signed URL 발급 (1시간 유효)
      const { data, error: urlError } = await supabase.storage
        .from('uploads')
        .createSignedUrl(filePath, 60 * 60)

      if (urlError) {
        setMsg('URL 생성 실패 ❌ ' + urlError.message)
        return
      }

      setUrl(data.signedUrl)
      setMsg('업로드 성공 ✅')
    } catch (err) {
      setMsg('오류 발생 ❌ ' + err.message)
      console.error(err)
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
