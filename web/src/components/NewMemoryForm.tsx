'use client'

import { Paperclip } from 'lucide-react'
import MediaPicker from './MediaPicker'
import { FormEvent } from 'react'
import { api } from '@/lib/api'
import cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function NewMemoryForm() {
  const router = useRouter()

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const content = formData.get('content')
    const isPublic = formData.get('isPublic')
    const mediaFile = formData.get('mediaFile')

    let coverUrl = ''
    if (mediaFile) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', mediaFile as File)
      const uploadResponse = await api.post('/upload', uploadFormData)
      coverUrl = uploadResponse.data.fileUrl
    }

    const token = cookie.get('token')

    await api.post(
      '/memories',
      { content, isPublic, coverUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="mediaFile"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Paperclip size={14} /> Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 transition-all"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />

      <textarea
        name="content"
        spellCheck={false}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="placeholder-text-gray-400 flex-1 resize-none rounded-xl border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 focus:ring-0"
      />

      <button className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
        Criar memória
      </button>
    </form>
  )
}
