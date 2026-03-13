import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Shield, Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: 'Introduction',
    content: 'RedFlag ("we", "us", "our", or "Company") operates the RedFlag website and service. This Privacy Policy explains how we collect, use, disclose, and otherwise process your information in connection with our websites, mobile applications, and other online services that link to this Privacy Policy (collectively, the "Service").',
  },
  {
    icon: Lock,
    title: 'Information We Collect',
    subsections: [
      {
        subtitle: 'Information You Provide',
        items: [
          'Account registration information (email, password)',
          'Analysis submissions (text, URLs, screenshots)',
          'Communication preferences and feedback',
          'Support requests and inquiries',
        ],
      },
      {
        subtitle: 'Information Collected Automatically',
        items: [
          'Device information (OS, browser type)',
          'Usage analytics (pages visited, features used)',
          'Log files (IP address, access times)',
          'Cookies and similar technologies',
        ],
      },
    ],
  },
  {
    icon: Shield,
    title: 'How We Use Your Information',
    subsections: [
      {
        subtitle: 'Primary Uses',
        items: [
          'Provide and improve our scam detection services',
          'Analyze phishing and fraud patterns',
          'Send service-related announcements and updates',
          'Respond to your support requests',
          'Comply with legal obligations and regulations',
          'Prevent fraud and enhance security',
        ],
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security & Protection',
    content: 'We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure authentication, regular security audits, and restricted access to personal data. However, no method of transmission over the internet is 100% secure.',
    highlight: '24-Hour Data Retention: We keep your analysis content for 24 hours to allow you to download reports and review results. After 24 hours, all data is permanently and automatically deleted from our servers.',
  },
  {
    icon: CheckCircle2,
    title: 'Your Privacy Rights',
    subsections: [
      {
        subtitle: 'You Have the Right To:',
        items: [
          'Access the personal information we hold about you',
          'Correct inaccurate or incomplete information',
          'Request deletion of your personal data',
          'Opt-out of marketing communications',
          'Export your data in a portable format',
          'Object to data processing for certain purposes',
        ],
      },
      {
        subtitle: 'How to Exercise Your Rights',
        items: [
          'Contact us at privacy@redflag.app with your request',
          'Include "PRIVACY REQUEST" in the subject line',
          'Provide sufficient information to identify your account',
          'Responses typically provided within 30 days',
        ],
      },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Third-Party Services',
    content: 'RedFlag uses Google Generative AI (Gemini) for analysis processing. Analysis content is sent to Google\'s servers for AI processing only. We have data processing agreements in place to ensure your data is protected. Content is not stored by Google or RedFlag after analysis completion.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-12 h-12 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-2">Your privacy is our responsibility</p>
            <p className="text-sm text-muted-foreground">Last updated: March 13, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl space-y-8">
            {sections.map((section, idx) => (
              <Card
                key={idx}
                className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:border-primary/30 transition-colors"
              >
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-6">
                  <section.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {idx + 1}. {section.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                {section.content && <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>}

                {/* Highlight Box */}
                {section.highlight && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-primary">{section.highlight}</p>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, sidx) => (
                      <div key={sidx}>
                        <h3 className="text-lg font-semibold text-primary mb-4">{subsection.subtitle}</h3>
                        <ul className="space-y-2">
                          {subsection.items.map((item, iidx) => (
                            <li key={iidx} className="flex items-start gap-3 text-muted-foreground">
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/20 to-accent/10 dark:from-primary/10 dark:to-accent/5 border border-primary/30 dark:border-primary/20 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
              <p className="text-muted-foreground mb-6">
                We're committed to protecting your privacy and being transparent about how we handle your data. If you have any questions, concerns, or requests related to this Privacy Policy, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">privacy@redflag.app</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="font-medium">Within 30 days</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
