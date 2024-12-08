import AudioTranscriptionForm from '@/components/AudioTranscriptionForm'
import ApiKeyForm from '@/components/ApiKeyForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Audio Transcription
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Convert your audio files to text with high accuracy
          </p>
        </div>
        <div className="space-y-8">
          <ApiKeyForm />
          <AudioTranscriptionForm />
        </div>
      </main>
    </div>
  )
}

