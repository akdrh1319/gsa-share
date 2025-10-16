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

    // 1️⃣ 업로드
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file)

    if (uploadError) {
      setMsg('업로드 실패 ❌ ' + uploadError.message)
      return
    }

    // 2️⃣ 비공개 버킷용 signed URL 발급
    const { data, error: urlError } = await supabase.storage
      .from('uploads')
      .createSignedUrl(filePath, 60 * 60)

    if (urlError) {
      setMsg('URL 생성 실패 ❌ ' + urlError.message)
      return
    }

    setUrl(data.signedUrl)
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

// 3️⃣ DB에 파일 메타데이터 저장
const { error: dbError } = await supabase.from('files').insert({
  user_id: (await supabase.auth.getUser()).data.user?.id,
  filename: file.name,
  url: data.signedUrl
})

if (dbError) {
  console.error(dbError)
  setMsg('DB 저장 실패 ❌ ' + dbError.message)
}
