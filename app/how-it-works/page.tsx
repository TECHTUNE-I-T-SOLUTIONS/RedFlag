import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, Upload, Zap, Shield } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              How RedFlag <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Protects You</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to identify and protect yourself from scams
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: 'Submit Suspicious Content',
                  description: 'Share what you want to analyze',
                  icon: Upload,
                  details: [
                    'Paste a suspicious message or email',
                    'Upload a screenshot of a suspicious conversation',
                    'Enter a suspicious URL',
                  ],
                  color: 'primary',
                },
                {
                  step: 2,
                  title: 'AI Analysis Begins',
                  description: 'Our AI reviews your content',
                  icon: Zap,
                  details: [
                    'Analyzes language patterns and phishing indicators',
                    'Checks domain legitimacy and reputation',
                    'Identifies known scam signatures',
                  ],
                  color: 'primary',
                },
                {
                  step: 3,
                  title: 'Get Your Report',
                  description: 'Receive instant protection insights',
                  icon: Shield,
                  details: [
                    'Risk score from 0-100',
                    'Detailed red flags identified',
                    'Actionable safety recommendations',
                  ],
                  color: 'primary',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 md:gap-12">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 bg-${item.color} text-${item.color}-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4`}>
                      {item.step}
                    </div>
                    {idx < 2 && <div className="w-1 h-24 bg-muted" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <item.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {item.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Results */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Receive</h2>

            <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Risk Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-red-500 mb-2">78/100</div>
                    <div className="text-sm text-muted-foreground">High Risk</div>
                  </div>
                  <p className="text-muted-foreground">Your content receives a comprehensive risk assessment based on multiple factors</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Red Flags Identified</h3>
                <ul className="space-y-2">
                  {[
                    'Urgent language requesting immediate action',
                    'Suspicious sender claiming to be from legitimate bank',
                    'Request for personal financial information',
                    'Links to domain mimicking real bank (bankofamerica-verify.com)',
                  ].map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {[
                    'Do not click any links in this message',
                    'Do not provide personal or financial information',
                    'Report this message to your bank immediately',
                    'Delete the message after reporting',
                  ].map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start Protecting Yourself Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get instant analysis of suspicious content and protect yourself and your loved ones
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Analyze Now for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// Add AlertTriangle import
import { AlertTriangle } from 'lucide-react'
