import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function MFAVerifyPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { verifyMFA } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (code.length !== 6) {
        throw new Error('Code must be 6 digits')
      }

      await verifyMFA(code)
      navigate('/admin/blog')
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Verification failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Verify Code</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600 ml-2">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  6-Digit Code
                </label>
                <Input
                  placeholder="000000"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  disabled={isLoading}
                  className="text-center text-2xl tracking-[0.5em] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </form>

            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate('/login')}
              disabled={isLoading}
              className="w-full text-slate-400 hover:text-slate-300"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
