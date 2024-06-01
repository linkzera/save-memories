import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  const redirectTo = req.cookies.get('redirect')?.value || '/'

  const registerResponse = await api.post('/auth/register', {
    code,
  })

  const { token } = registerResponse.data

  const redirect = new URL(redirectTo, req.url)
  const cookieExpiresInSeconds = 60 * 60 * 24 * 7 // 7 days

  return NextResponse.redirect(redirect, {
    headers: {
      'Set-cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
    },
  })
}
