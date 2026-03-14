import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Search,
  Brain,
  Lock,
} from 'lucide-react'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Protection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Spot scams</span> before they cost you
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Analyze suspicious messages, screenshots, and URLs with AI-powered detection. Get instant risk scores and actionable insights to protect yourself and your loved ones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Analyzing Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center text-sm">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">80%+</div>
                <p className="text-muted-foreground">Detection Rate</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">&lt;2s</div>
                <p className="text-muted-foreground">Analysis Time</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">∞</div>
                <p className="text-muted-foreground">Free Analyses</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-20 sm:py-28 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to protect yourself</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  step: '1',
                  title: 'Submit Content',
                  description: 'Paste text, upload a screenshot, or enter a suspicious URL',
                },
                {
                  icon: Brain,
                  step: '2',
                  title: 'AI Analysis',
                  description: 'Our AI instantly analyzes patterns and identifies red flags',
                },
                {
                  icon: CheckCircle2,
                  step: '3',
                  title: 'Get Results',
                  description: 'Receive a risk score and actionable recommendations',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg relative">
                    <div className="absolute -top-6 left-6 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="mt-6 mb-4">
                      <item.icon className="w-8 h-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-bold text-center mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground text-center">{item.description}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-muted-foreground">
                      <ArrowRight className="w-full h-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-20 sm:py-28">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Detection</h2>
              <p className="text-lg text-muted-foreground">Comprehensive analysis across multiple formats</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Text Analysis',
                  description: 'Detects phishing patterns, impersonation, and suspicious language in messages',
                },
                {
                  icon: Shield,
                  title: 'URL Scanner',
                  description: 'Checks domain legitimacy, SSL certificates, and known threat databases',
                },
                {
                  icon: BarChart3,
                  title: 'Screenshot Analysis',
                  description: 'OCR-powered detection of fraudulent screenshots and deepfakes',
                },
                {
                  icon: Lock,
                  title: 'Privacy First',
                  description: 'Your data is encrypted and never stored after analysis',
                },
              ].map((feature, idx) => (
                <Card key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to stay safe?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users protecting themselves from scams every day
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started for Free
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
