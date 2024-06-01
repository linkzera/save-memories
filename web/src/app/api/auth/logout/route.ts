import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirect = new URL('/', req.url)

  return NextResponse.redirect(redirect, {
    headers: {
      'Set-cookie': `token=; Path=/; max-age=0;`,
    },
  })
}
