'use client'

import { useState } from 'react'
import { Upload, FileAudio, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { transcribeAudio } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'

export default function AudioTranscriptionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select an audio file',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await transcribeAudio(file)
      setTranscript(result)
    } catch (err) {
      toast({
        title: 'Transcription Failed',
        description: 'An error occurred during transcription. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Transcribe Audio</h2>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="audio-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, or M4A (MAX. 10MB)</p>
          </div>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {file && (
        <div className="flex items-center space-x-2">
          <FileAudio className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">{file.name}</span>
        </div>
      )}
      <Button type="submit" disabled={isLoading || !file} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Transcribing...
          </>
        ) : (
          'Transcribe Audio'
        )}
      </Button>
      {transcript && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Transcript:</h3>
          <Textarea
            value={transcript}
            readOnly
            className="w-full h-64 p-2 border rounded"
          />
        </div>
      )}
    </form>
  )
}

