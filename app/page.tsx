import AudioTranscriptionForm from '@/components/AudioTranscriptionForm'
import ApiKeyForm from '@/components/ApiKeyForm'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Audio Transcription App</h1>
      <div className="space-y-8">
        <ApiKeyForm />
        <AudioTranscriptionForm />
      </div>
    </main>
  )
}

