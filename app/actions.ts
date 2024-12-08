'use server'

import { cookies } from 'next/headers'

export async function saveApiKey(apiKey: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('gemini-api-key', apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  })
}

export async function transcribeAudio(file: File): Promise<string> {
  try {
    const cookieStore = await cookies()
    const apiKey = cookieStore.get('gemini-api-key')?.value
    if (!apiKey) {
      throw new Error('API key not found')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('apiKey', apiKey)

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Transcription failed')
    }

    const data = await response.json()
    return data.transcript
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to process audio file')
  }
}

