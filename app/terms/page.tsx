import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { FileText, AlertTriangle, CheckCircle2, Scale, Zap, Ban } from 'lucide-react'

const sections = [
  {
    icon: CheckCircle2,
    title: 'Acceptance of Terms',
    content: 'By accessing and using the RedFlag website and services (collectively, the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
  },
  {
    icon: Zap,
    title: 'Use License',
    subsections: [
      {
        subtitle: 'Grant of License',
        content: 'Permission is granted to temporarily download one copy of the materials (information or software) on RedFlag\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.',
      },
      {
        subtitle: 'Restrictions',
        items: [
          'You may not modify or copy the materials',
          'You may not use materials for any commercial purpose or for any public display',
          'You may not attempt to decompile or reverse engineer any software contained on RedFlag\'s website',
          'You may not remove any copyright or other proprietary notations from the materials',
          'You may not transfer the materials to another person or "mirror" the materials on any other server',
        ],
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimer of Warranties',
    content: 'The materials on RedFlag\'s website are provided on an "as is" basis. RedFlag makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
    highlight: 'RedFlag does not warrant that the functions contained in the Service will be uninterrupted or error-free, that defects will be corrected, or that the Service or servers are free of viruses or other harmful components.',
  },
  {
    icon: Scale,
    title: 'Limitation of Liability',
    subsections: [
      {
        subtitle: 'Limitation',
        content: 'In no event shall RedFlag or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RedFlag\'s website, even if RedFlag or an authorized representative has been notified orally or in writing of the possibility of such damage.',
      },
      {
        subtitle: 'Applicable Law',
        items: [
          'Because some jurisdictions do not allow limitations on implied warranties, the above limitation may not apply to you',
          'You assume all responsibility for selection of the Service to achieve your intended results',
          'You assume all risk associated with operation of the Service, including without limitation loss of data',
          'In no case shall RedFlag be liable for any indirect, special, or consequential damages',
        ],
      },
    ],
  },
  {
    icon: FileText,
    title: 'Accuracy of Materials',
    content: 'The materials appearing on RedFlag\'s website could include technical, typographical, or photographic errors. RedFlag does not warrant that any of the materials on its website are accurate, complete, or current. RedFlag may make changes to the materials contained on its website at any time without notice.',
  },
  {
    icon: Ban,
    title: 'Prohibited Conduct',
    subsections: [
      {
        subtitle: 'You Agree Not To:',
        items: [
          'Use RedFlag for any unlawful purposes or in violation of these Terms',
          'Harass, threaten, embarrass, or cause distress or discomfort to any individual',
          'Violate any laws, rules, or regulations applicable in any relevant jurisdiction',
          'Infringe on any intellectual property rights of others',
          'Submit false, misleading, or fraudulent information',
          'Attempt to gain unauthorized access to RedFlag systems',
          'Submit viruses, malware, or harmful code',
          'Spam, flood, or disrupt the normal flow of dialogue with other users or the Service',
        ],
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Analysis Accuracy & Limitations',
    content: 'While RedFlag uses advanced AI and machine learning to detect phishing and scams, no detection system is 100% accurate. RedFlag is provided to assist and inform your decision-making, but should not be the sole basis for any action. Always exercise caution and use your judgment when evaluating suspicious content.',
    highlight: 'You use RedFlag at your own risk. RedFlag assumes no liability for inaccurate analysis, missed threats, or false positives that may affect your decisions.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Scale className="w-12 h-12 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              Please read these terms carefully before using RedFlag
            </p>
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
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{section.highlight}</p>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, sidx) => (
                      <div key={sidx}>
                        <h3 className="text-lg font-semibold text-primary mb-4">{subsection.subtitle}</h3>
                        {subsection.content && (
                          <p className="text-muted-foreground leading-relaxed mb-4">{subsection.content}</p>
                        )}
                        {subsection.items && (
                          <ul className="space-y-2">
                            {subsection.items.map((item, iidx) => (
                              <li key={iidx} className="flex items-start gap-3 text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/20 to-accent/10 dark:from-primary/10 dark:to-accent/5 border border-primary/30 dark:border-primary/20 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service or need clarification on any provision, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">legal@redflag.app</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="font-medium">Within 5 business days</p>
                </div>
              </div>
            </Card>

            {/* Agreement Acknowledgment */}
            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
              <h3 className="font-bold text-lg mb-3 text-primary">By Using RedFlag</h3>
              <p className="text-muted-foreground">
                You acknowledge that you have read, understood, and agree to be bound by all the terms and conditions of this agreement. If you do not agree with any part of these terms, please do not use RedFlag. Your continued use of RedFlag following the posting of revised Terms means that you accept and agree to the changes.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
