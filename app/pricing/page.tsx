import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transparent Pricing</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
              {/* Free Tier */}
              <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border-2 border-primary/20 dark:border-primary/20 rounded-2xl p-8 shadow-lg flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-muted-foreground mb-6">Perfect for getting started</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>

                <Link href="/auth/signup" className="mb-8">
                  <Button className="w-full">Get Started</Button>
                </Link>

                <div className="space-y-4 flex-1">
                  {[
                    'Up to 10 analyses/month',
                    'Text message analysis',
                    'URL scanning',
                    'Basic risk scoring',
                    'Email support',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Pro Tier (Coming Soon) */}
              <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border-2 border-accent/50 rounded-2xl p-8 shadow-lg flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  Coming Soon
                </div>

                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">For power users</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>

                <Button disabled className="w-full mb-8 opacity-50">
                  Available Soon
                </Button>

                <div className="space-y-4 flex-1 opacity-60">
                  {[
                    'Unlimited analyses',
                    'All Free features',
                    'Screenshot analysis',
                    'Advanced risk scoring',
                    'History & reports',
                    'Priority support',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Enterprise Tier (Coming Soon) */}
              <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-border/40 rounded-2xl p-8 shadow-lg flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full">
                  Coming Soon
                </div>

                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-muted-foreground mb-6">For organizations</p>

                <div className="mb-8">
                  <span className="text-2xl font-bold">Custom</span>
                  <span className="text-muted-foreground ml-2">pricing</span>
                </div>

                <Button disabled variant="outline" className="w-full mb-8 opacity-50">
                  Contact Sales
                </Button>

                <div className="space-y-4 flex-1 opacity-60">
                  {[
                    'All Pro features',
                    'Custom integrations',
                    'API access',
                    'Dedicated support',
                    'Team management',
                    'SLA guarantees',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  question: 'Can I upgrade my plan anytime?',
                  answer: 'Yes, you can upgrade your plan at any time. Changes take effect immediately and you only pay the difference.',
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Absolutely. All data is encrypted end-to-end and is never stored longer than necessary for analysis.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, PayPal, and other payment methods.',
                },
                {
                  question: 'Can I cancel anytime?',
                  answer: 'Yes, you can cancel your subscription anytime with no penalties or long-term commitments.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start for Free</h2>
            <p className="text-lg text-muted-foreground mb-8">
              No credit card required. Get instant access to scam detection
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Create Free Account
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
