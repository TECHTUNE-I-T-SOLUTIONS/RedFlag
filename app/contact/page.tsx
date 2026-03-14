'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, Loader2, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Thanks for reaching out! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl">
      <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 sm:p-12 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">support@redflag.ai</p>
                <p className="text-muted-foreground text-xs mt-2">For general inquiries and support</p>
              </div>

              <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Response Time</h3>
                <p className="text-muted-foreground text-sm">24-48 hours</p>
                <p className="text-muted-foreground text-xs mt-2">We respond to all inquiries promptly</p>
              </div>

              <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Company</h3>
                <p className="text-muted-foreground text-sm">RedFlag Inc.</p>
                <p className="text-muted-foreground text-xs mt-2">AI-Powered Fraud Detection</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Other Ways to Get Help</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Security Issues</h4>
                  <p>If you've discovered a security vulnerability, please email security@redflag.ai</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Partnership Inquiries</h4>
                  <p>Interested in working with us? Contact partnerships@redflag.ai</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Bug Reports</h4>
                  <p>Help us improve! Report bugs and issues through our feedback form above</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Feature Requests</h4>
                  <p>Have an idea? Use the form above with subject line starting with "Feature:"</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
