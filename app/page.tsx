import AudioTranscriptionForm from '@/components/AudioTranscriptionForm'
import ApiKeyForm from '@/components/ApiKeyForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Voice to Text</h1>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </a>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Audio Transcription</h2>
            </div>
            <div className="space-y-6">
              <ApiKeyForm />
              <AudioTranscriptionForm />
            </div>
          </div>
        </div>

        {/* History sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">History</h2>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Recent transcriptions will appear here</div>
          </div>
        </div>
      </div>
    </div>
  )
}

