import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function MFASetupPage() {
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { setupMFA } = useAuth()

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true)
      try {
        const response = await setupMFA()
        setQrCode(response.qr_code)
        setSecret(response.secret)
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to setup MFA'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    generateQR()
  }, [setupMFA])

  const handleNext = () => {
    navigate('/mfa-verify', { state: { secret } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Setup Multi-Factor Authentication</CardTitle>
            <CardDescription className="text-slate-400">
              Secure your account with 2FA
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600 ml-2">{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {qrCode && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg flex justify-center">
                      <img src={qrCode} alt="QR Code" className="h-64 w-64" />
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-xs text-slate-400 mb-2">Secret Key:</p>
                      <p className="text-sm font-mono text-slate-200 break-all">{secret}</p>
                    </div>

                    <div className="text-xs text-slate-400 space-y-2">
                      <p className="font-semibold text-slate-300">Setup Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Install Google Authenticator or Authy</li>
                        <li>Scan the QR code above</li>
                        <li>Save the secret key in a safe place</li>
                        <li>Click Next to verify</li>
                      </ol>
                    </div>

                    <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                      Next: Verify Code
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
