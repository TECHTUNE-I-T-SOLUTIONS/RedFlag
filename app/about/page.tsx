import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Heart, Lightbulb, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RedFlag</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Building the future of digital safety, one scam prevention at a time
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 sm:p-12 shadow-lg">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At RedFlag, we believe that everyone deserves to feel safe online. Scams are becoming increasingly sophisticated, and most people lack the tools to protect themselves effectively. Our mission is to democratize scam detection by making AI-powered analysis accessible to everyone, regardless of technical knowledge or financial status.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're committed to building a world where users can confidently interact with digital content, knowing they have instant, reliable protection against fraud.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'User-Centric',
                  description: 'We put your security first and your privacy second in every decision we make',
                },
                {
                  icon: Lightbulb,
                  title: 'Innovation',
                  description: 'We continuously push the boundaries of what AI can do to protect users',
                },
                {
                  icon: Heart,
                  title: 'Trust',
                  description: 'We build transparency and trust in everything we do',
                },
              ].map((value, idx) => (
                <Card key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
                  <value.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { value: '80%+', label: 'Confidence Rating' },
                { value: '<2s', label: 'Analysis Time' },
                { value: '24h', label: 'Data Retention' },
                { value: '∞', label: 'Free Analyses' },
              ].map((stat, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Your Privacy & Security Matters</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: '24-Hour Data Retention',
                  description: 'We keep your analysis content for 24 hours so you can download reports and review results. After 24 hours, all data is permanently and automatically deleted from our servers.',
                  items: ['24-hour retention', 'No user profiling', 'No data selling', 'Auto-deletion']
                },
                {
                  title: 'End-to-End Encryption',
                  description: 'All communications between your device and our servers are encrypted using industry-standard protocols.',
                  items: ['HTTPS encryption', 'Secure transmission', 'No interception', 'Military-grade security']
                },
                {
                  title: 'Privacy First',
                  description: 'Your data belongs to you. We are transparent about how we operate and committed to protecting your privacy.',
                  items: ['Transparent policies', 'No tracking', 'No analytics on content', 'Full control of your data']
                },
                {
                  title: 'Continuously Audited',
                  description: 'Our security practices are regularly reviewed and updated to meet the highest standards.',
                  items: ['Regular audits', 'Security updates', 'Best practices', 'Compliance certified']
                },
              ].map((section, idx) => (
                <Card key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-3 text-primary">{section.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Company Background */}
        <section className="px-4 py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    RedFlag was founded by cybersecurity professionals and AI researchers who witnessed firsthand the rising tide of sophisticated scams targeting everyday people. Frustrated by the lack of accessible tools, we decided to build something better.
                  </p>
                  <p>
                    What started as a passion project has grown into a mission: democratizing scam detection through cutting-edge AI technology that's free and available to everyone.
                  </p>
                  <p>
                    Our team combines expertise in machine learning, cybersecurity, and product design to create intuitive tools that empower users without requiring technical knowledge.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-2 text-primary">Our Commitment</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Completely free for all users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>No hidden paywalls or limitations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Transparent about our capabilities and limitations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Regular updates and improvements</span>
                    </li>
                  </ul>
                </div>
                <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-2 text-primary">Technology</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our analysis engine leverages advanced machine learning models, pattern recognition, and threat intelligence databases. We achieve 80%+ confidence in detecting common scam patterns with sub-2-second analysis.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Note: Like all detection systems, RedFlag is a tool to assist users, not a guarantee. Always use your judgment and verify information through official channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How We're Making a Difference</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Protecting Vulnerable Users',
                  description: 'Seniors, students, and non-technical users are the most susceptible to scams. RedFlag empowers them with cutting-edge protection that requires no technical expertise.'
                },
                {
                  title: 'Real-Time Detection',
                  description: 'Our AI analyzes content instantly, identifying subtle red flags that humans might miss. Get protection in less than 2 seconds.'
                },
                {
                  title: 'Educational Impact',
                  description: 'Each analysis provides detailed explanations of what makes content suspicious, helping users understand scam tactics and become more aware.'
                },
                {
                  title: 'Community Protection',
                  description: 'By helping individuals avoid scams, we reduce the financial losses and emotional trauma experienced by thousands every year.'
                },
                {
                  title: 'Fighting Financial Crime',
                  description: 'Scams cost victims billions annually. By providing accessible detection tools, we help reduce fraud losses and crime rates.'
                },
                {
                  title: 'Staying Ahead of Threats',
                  description: 'Scammers constantly evolve their tactics. Our AI continuously learns and adapts to detect new attack patterns before they spread widely.'
                },
              ].map((item, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Us in the Fight Against Scams</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of a community making the internet safer for everyone
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started Now
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
