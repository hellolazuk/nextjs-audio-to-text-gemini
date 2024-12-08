'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { saveApiKey } from '@/app/actions'
import { KeyRound, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <KeyRound className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Gemini API Key</CardTitle>
            <CardDescription>Enter your API key to start using the transcription service</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="pr-36 font-mono"
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="absolute right-0 top-0 rounded-l-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Key'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

