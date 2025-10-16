'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function FilesPage() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function loadFiles() {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setFiles(data)
    }
    loadFiles()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>자료 목록</h1>
      {files.length === 0 ? (
        <p>아직 업로드된 자료가 없습니다.</p>
      ) : (
        <ul>
          {files.map((f) => (
            <li key={f.id}>
              <strong>{f.filename}</strong> —{' '}
              <a href={f.url} target="_blank">다운로드</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
