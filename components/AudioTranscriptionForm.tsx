'use client'

import { useState } from 'react'
import { Upload, FileAudio, Loader2, Mic, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { transcribeAudio } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Audio Transcription</CardTitle>
            <CardDescription>Upload your audio file to convert it to text</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            {!file ? (
              <label
                htmlFor="audio-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
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
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading || !file} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
                <Progress value={30} className="h-1 w-full absolute bottom-0 left-0" />
              </>
            ) : (
              'Start Transcription'
            )}
          </Button>

          {transcript && (
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transcript</h3>
              <Textarea
                value={transcript}
                readOnly
                className="min-h-[200px] resize-y bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

