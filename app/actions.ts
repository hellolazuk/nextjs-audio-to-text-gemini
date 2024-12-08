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

type TranscribeInput = File | { url: string }

export async function transcribeAudio(input: TranscribeInput): Promise<string> {
  try {
    const cookieStore = await cookies()
    const apiKey = cookieStore.get('gemini-api-key')?.value
    if (!apiKey) {
      throw new Error('API key not found')
    }

    const formData = new FormData()
    formData.append('apiKey', apiKey)

    if ('url' in input) {
      formData.append('audioUrl', input.url)
    } else {
      formData.append('file', input)
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Transcription failed')
    }

    const data = await response.json()
    return data.transcript
  } catch (error) {
    console.error('Transcription error:', error)
    throw error
  }
}

