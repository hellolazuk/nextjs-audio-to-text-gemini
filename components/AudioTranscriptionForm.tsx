'use client'

import { useState } from 'react'
import { Upload, FileAudio, Loader2, X, Copy, Check, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { transcribeAudio } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AudioTranscriptionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAudioUrl('') // Clear URL when file is selected
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file && !audioUrl) {
      toast({
        title: 'Error',
        description: 'Please select an audio file or enter an audio URL',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const result = file 
        ? await transcribeAudio(file)
        : await transcribeAudio({ url: audioUrl })

      if (result) {
        setTranscript(result)
      }
    } catch (err) {
      console.error('Transcription error:', err)
      toast({
        title: 'Transcription Failed',
        description: err instanceof Error ? err.message : 'An error occurred during transcription. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: 'Copied!',
        description: 'Transcript copied to clipboard',
      })
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Audio URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="relative">
                {!file ? (
                  <label
                    htmlFor="audio-file"
                    className="flex flex-col items-center justify-center w-full h-[280px] border-2 border-dashed rounded-xl cursor-pointer bg-[#F8F9FE] hover:bg-gray-50 border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="mb-2 text-sm text-gray-900">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP3, WAV, or M4A (MAX. 10MB)</p>
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
                  <div className="flex items-center justify-between p-4 bg-[#F8F9FE] rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileAudio className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-0">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="Enter audio file URL (e.g., https://example.com/audio.mp3)"
                    value={audioUrl}
                    onChange={(e) => {
                      setAudioUrl(e.target.value)
                      setFile(null) // Clear file when URL is entered
                    }}
                    className="pr-24 bg-[#F8F9FE] border-gray-200 rounded-xl"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: MP3, WAV, M4A
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            type="submit" 
            disabled={isLoading || (!file && !audioUrl)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Converting...</span>
              </div>
            ) : (
              'Convert to Text'
            )}
          </Button>
        </form>

        {transcript && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Transcript</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea
              value={transcript}
              readOnly
              className="min-h-[200px] resize-y bg-[#F8F9FE] border-gray-200 rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  )
}

