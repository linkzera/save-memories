import { DeleteMemory } from '@/components/DeleteMemory'
import MediaPicker from '@/components/MediaPicker'
import { api } from '@/lib/api'
import { ChevronLeft, ImageIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface Params {
  params: {
    id: string
  }
}

export default async function Memory({ params: { id } }: Params) {
  const token = cookies().get('token')?.value
  if (!token) {
    return <div>Not authorized</div>
  }

  const { data } = await api(`/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return (
    <div className="flex flex-1 flex-col space-y-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft />
        Voltar à timeline
      </Link>

      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor="mediaFile"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <ImageIcon size={14} /> Mudar foto ou vídeo de capa
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
        <DeleteMemory id={data.id} />
      </div>
      <MediaPicker imageUrl={data.coverUrl} />
      <p className="flex-1 text-lg leading-relaxed text-gray-100">
        {data.content}
      </p>
    </div>
  )
}
