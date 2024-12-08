import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const apiKey = cookieStore.get('gemini-api-key')?.value

    return NextResponse.json({ hasKey: !!apiKey })
  } catch (error) {
    return NextResponse.json({ hasKey: false })
  }
} 