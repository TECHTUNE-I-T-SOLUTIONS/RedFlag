'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { RiskScoreDisplay } from '@/components/RiskScoreDisplay'
import { supabase } from '@/lib/supabase'
import { downloadPDF } from '@/lib/pdf-generator'
import { toast } from 'sonner'
import { FileText, FileImage, Link as LinkIcon, Loader2, AlertTriangle, CheckCircle2, Search, Download } from 'lucide-react'

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState('text')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<any>(null)

  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowResults(false)

    try {
      const content = activeTab === 'text' ? textInput : activeTab === 'url' ? urlInput : null

      if (!content && activeTab !== 'image') {
        toast.error('Please enter content to analyze')
        setIsLoading(false)
        return
      }

      if (activeTab === 'image' && !imageFile) {
        toast.error('Please select an image to analyze')
        setIsLoading(false)
        return
      }

      // Prepare request body
      const body: any = {
        type: activeTab,
        content: content || '',
      }

      // Handle image upload
      if (activeTab === 'image' && imageFile) {
        const reader = new FileReader()
        reader.onload = async () => {
          body.imageBase64 = reader.result
          await sendAnalysisRequest(body)
        }
        reader.readAsDataURL(imageFile)
        return
      }

      await sendAnalysisRequest(body)
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Analysis failed. Please try again.')
      setIsLoading(false)
    }
  }

  const sendAnalysisRequest = async (body: any) => {
    try {
      // Get the session to get auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No auth token available')
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Analysis failed')
      }

      const result = await response.json()
      setResult(result)
      setShowResults(true)
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('API error:', error)
      toast.error(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewAnalysis = () => {
    setShowResults(false)
    setResult(null)
    setTextInput('')
    setUrlInput('')
    setImageFile(null)
  }

  const handleDownloadPDF = async () => {
    if (!result) return

    try {
      setIsDownloading(true)
      const analysisData = {
        contentType: activeTab,
        contentPreview: activeTab === 'text' ? textInput : activeTab === 'url' ? urlInput : 'Image analysis',
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        confidence: result.confidence,
        redFlags: result.redFlags,
        explanation: result.explanation,
        recommendation: result.recommendation,
        createdAt: new Date().toISOString(),
      }

      await downloadPDF(analysisData)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Analyze Suspicious Content</h1>
          <p className="text-muted-foreground">Submit text, URL, or screenshot for AI analysis</p>
          <p className="text-sm text-muted-foreground mt-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            ℹ️ Your analysis will be available for 24 hours. After this period, it will be automatically deleted from our servers.
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <FileImage className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Paste suspicious message</Label>
                  <textarea
                    id="text-input"
                    placeholder="Paste a suspicious message, email, or text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    {textInput.length}/5000 characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">Enter suspicious URL</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://suspicious-website.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-input">Upload screenshot</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <FileImage className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm mb-2">Drag and drop your image or click to select</p>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.files?.[0] || null)}
                      disabled={isLoading}
                      className="hidden"
                    />
                    <label htmlFor="image-input" className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </label>
                  </div>
                </div>
              </TabsContent>

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze Now'}
              </Button>
            </form>
          </Tabs>
        </Card>
      </div>

      {/* Results Section */}
      <div>
        {showResults && result ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
            </div>

            {/* Risk Score */}
            <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg flex justify-center">
              <RiskScoreDisplay
                score={result.riskScore}
                confidence={result.confidence}
              />
            </div>

            {/* Red Flags */}
            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Red Flags Identified</h3>
              <div className="space-y-3">
                {result.redFlags.map((flag: string, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Explanation */}
            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">AI Explanation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {result.explanation}
              </p>
            </Card>

            {/* Recommendation */}
            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">What You Should Do</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {result.recommendation}
              </p>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleDownloadPDF} disabled={isDownloading} className="flex-1" variant="default">
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report (PDF)
                  </>
                )}
              </Button>
              <Button onClick={handleNewAnalysis} className="flex-1" variant="outline">
                Analyze Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Submit content to see analysis results</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
