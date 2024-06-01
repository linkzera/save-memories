'use client'

import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const DeleteMemory = ({ id }: { id: string }) => {
  const token = Cookies.get('token')
  const router = useRouter()

  async function deleteMemory() {
    try {
      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <button
      className="flex items-center gap-1.5 self-end text-sm text-red-400 hover:text-red-500"
      onClick={deleteMemory}
    >
      <Trash size={14} /> Excluir memória
    </button>
  )
}
