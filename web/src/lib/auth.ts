import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
  name: string
  avatarUrl: string
  sub: string
}

export function getUser(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('No token found')
  }

  const user: User = decode(token)

  return user
}
