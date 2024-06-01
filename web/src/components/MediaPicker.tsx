'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

export default function MediaPicker({ imageUrl }: { imageUrl?: string }) {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <input
        type="file"
        name="mediaFile"
        id="mediaFile"
        className="invisible h-0 w-0"
        accept="image/*"
        onChange={onFileSelected}
      />
      {(preview || imageUrl) && (
        <Image
          src={preview || imageUrl || '/placeholder.png'}
          width={300}
          height={300}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
