'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  const handleUpload = async () => {
    if (!file) return setMsg('파일을 선택하세요.')

    const filePath = `${Date.now()}-${file.name}`

    // 1. Supabase Storage에 업로드
    const { error } = await supabase.storage.from('uploads').upload(filePath, file)

    if (error) {
      setMsg('업로드 실패 ❌ ' + error.message)
      return
    }

    // 2. 다운로드 URL 발급
    const { data } = supabase.storage.from('uploads').getPublicUrl(filePath)

    setUrl(data.publicUrl)
    setMsg('업로드 성공 ✅')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>자료 업로드</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>업로드</button>
      <p>{msg}</p>
      {url && (
        <div>
          <p>다운로드 링크:</p>
          <a href={url} target="_blank">{url}</a>
        </div>
      )}
    </div>
  )
}