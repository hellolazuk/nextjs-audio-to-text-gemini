'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { saveApiKey } from '@/app/actions'
import { KeyRound, Loader2, CheckCircle2, XCircle, Power, ExternalLink } from 'lucide-react'

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  // Check if API key exists
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/check-api-key')
        const { hasKey } = await response.json()
        setIsConnected(hasKey)
      } catch (error) {
        setIsConnected(false)
      }
    }
    checkApiKey()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!apiKey) return

    setIsLoading(true)
    try {
      await saveApiKey(apiKey)
      setIsConnected(true)
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

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await saveApiKey('')  // Clear the API key
      setIsConnected(false)
      toast({
        title: 'Success',
        description: 'API key has been disconnected',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect API key',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Gemini API Key</h2>
              {!isConnected && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-500">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-500">Not Connected</span>
              </>
            )}
          </div>
        </div>
        {!isConnected ? (
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
                  'Connect'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <Button
              onClick={handleDisconnect}
              disabled={isLoading}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Power className="w-4 h-4 mr-2" />
                  Disconnect
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

