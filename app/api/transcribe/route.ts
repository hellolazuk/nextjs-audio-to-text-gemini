import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

async function fetchAudioFromUrl(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch audio from URL')
  }
  
  const contentType = response.headers.get('content-type') || 'audio/mpeg'
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  return { buffer, mimeType: contentType }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const apiKey = formData.get('apiKey') as string
    const file = formData.get('file') as File | null
    const audioUrl = formData.get('audioUrl') as string | null

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    if (!file && !audioUrl) {
      return NextResponse.json({ error: 'Either file or audio URL is required' }, { status: 400 })
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    let transcriptionResult: string

    if (file) {
      // Handle file upload transcription
      const arrayBuffer = await file.arrayBuffer()
      const base64Audio = Buffer.from(arrayBuffer).toString('base64')

      const result = await model.generateContent([
        'Transcribe the following audio file accurately:',
        {
          inlineData: {
            mimeType: file.type,
            data: base64Audio
          }
        }
      ])

      transcriptionResult = result.response.text()
    } else if (audioUrl) {
      // Handle URL-based transcription
      try {
        const { buffer, mimeType } = await fetchAudioFromUrl(audioUrl)
        const base64Audio = buffer.toString('base64')

        const result = await model.generateContent([
          'Transcribe the following audio file accurately:',
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          }
        ])

        transcriptionResult = result.response.text()
      } catch (error: any) {
        throw new Error(`Failed to process audio URL: ${error?.message || 'Unknown error'}`)
      }
    } else {
      throw new Error('Invalid input')
    }

    if (!transcriptionResult) {
      throw new Error('Failed to generate transcription')
    }

    return NextResponse.json({ transcript: transcriptionResult })
  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process audio' },
      { status: 500 }
    )
  }
}

