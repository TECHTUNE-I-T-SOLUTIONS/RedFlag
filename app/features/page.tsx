import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Zap, Shield, Search, AlertTriangle } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Comprehensive <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scam Detection</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI and machine learning to identify and analyze every type of scam attempt
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Search,
                  title: 'Text Message Analysis',
                  description: 'Analyze SMS, WhatsApp, email, and social media messages for phishing, impersonation, social engineering, and credential harvesting attempts.',
                  highlights: [
                    'Urgency/threat language detection',
                    'Credential request identification',
                    'Impersonation and spoofing detection',
                    'Emotional manipulation analysis',
                    'Common phishing phrase recognition'
                  ],
                },
                {
                  icon: Shield,
                  title: 'URL & Link Scanning',
                  description: 'Advanced domain analysis, SSL certificate validation, design consistency checks, and comprehensive threat assessment for suspicious links.',
                  highlights: [
                    'Typosquatting detection (amazom.com vs amazon.com)',
                    'SSL/TLS certificate validation',
                    'Domain age and reputation analysis',
                    'Page design vs brand consistency',
                    'Security headers validation'
                  ],
                },
                {
                  icon: AlertTriangle,
                  title: 'Screenshot & Image Analysis',
                  description: 'Advanced OCR and image analysis to detect fraudulent screenshots, fake login forms, logo spoofing, and manipulated content.',
                  highlights: [
                    'Fake login form detection',
                    'Deepfake and manipulation detection',
                    'Credential field identification',
                    'Logo and branding spoofing',
                    'Design quality assessment'
                  ],
                },
                {
                  icon: Zap,
                  title: 'Instant Risk Scoring',
                  description: 'Real-time risk assessment with 0-100 scoring, confidence levels (70-100%), and detailed threat breakdowns with actionable recommendations.',
                  highlights: [
                    'Multi-factor risk calculation',
                    'Confidence scoring (70-100%)',
                    'Specific threat identification',
                    'Actionable recommendations',
                    'Risk level categorization'
                  ],
                },
              ].map((feature, idx) => (
                <Card key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:border-primary/50 transition-colors">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12">Powered by Advanced Technology</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
              {[
                {
                  title: 'Google Gemini AI',
                  description: 'State-of-the-art language model for natural language understanding and pattern recognition',
                },
                {
                  title: 'Machine Learning',
                  description: 'Continuously trained models that improve accuracy with each analysis',
                },
                {
                  title: 'Real-time Processing',
                  description: 'Sub-2 second analysis time for instant feedback and protection',
                },
              ].map((tech, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground text-sm">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Detection Methodology */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Advanced Detection Methodology</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Content Quality Analysis',
                  description: 'We analyze writing patterns, grammar, tone, and consistency to identify indicators of fraudulent content versus legitimate communications.',
                  items: ['Professional language assessment', 'Tone and sentiment analysis', 'Consistency checking', 'Authenticity scoring']
                },
                {
                  title: 'Design & Layout Evaluation',
                  description: 'Our system evaluates visual design quality, branding consistency, and layout patterns to detect amateur or cloned websites.',
                  items: ['Professional design standards', 'Brand consistency', 'User experience assessment', 'Visual hierarchy analysis']
                },
                {
                  title: 'Domain & Security Analysis',
                  description: 'Comprehensive domain analysis including age, reputation, registration details, HTTPS validity, and SSL certificate verification.',
                  items: ['Domain age assessment', 'Typosquatting detection', 'SSL/TLS validation', 'Registration authenticity']
                },
                {
                  title: 'Behavioral Pattern Detection',
                  description: 'We identify manipulation tactics, urgency patterns, credential requests, and social engineering indicators.',
                  items: ['Urgency detection', 'Manipulation tactics', 'Credential harvesting', 'Social engineering patterns']
                },
                {
                  title: 'Attack Vector Identification',
                  description: 'Recognition of 10+ common attack types including phishing, credential harvesting, malware, and identity theft.',
                  items: ['Phishing techniques', 'Tech support scams', 'Romance fraud', 'Advance-fee schemes']
                },
                {
                  title: 'Multi-Factor Risk Scoring',
                  description: 'Combined analysis of all factors to produce accurate 0-100 risk scores with confidence levels 70-100%.',
                  items: ['Weighted analysis', 'Confidence scoring', 'Risk categorization', 'Actionable recommendations']
                },
              ].map((section, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
                  <h3 className="font-bold text-xl mb-3 text-primary">{section.title}</h3>
                  <p className="text-muted-foreground mb-4">{section.description}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
