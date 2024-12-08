'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { saveApiKey } from '@/app/actions'
import { KeyRound, Loader2 } from 'lucide-react'

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!apiKey) return

    setIsLoading(true)
    try {
      await saveApiKey(apiKey)
      toast({
        title: 'Success',
        description: 'API key has been saved',
      })
      setApiKey('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Gemini API Key</h2>
            <p className="text-sm text-gray-500">Required for transcription service</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="pr-24 font-mono bg-[#F8F9FE] border-gray-200 rounded-xl"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white rounded-l-none rounded-r-xl"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

