'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { toast } from 'sonner'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  readTime: string
  image: string
  content: string
}

interface RelatedPost {
  slug: string
  title: string
}

export default function BlogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/blog-posts.json')
        if (!response.ok) throw new Error('Failed to fetch blog posts')
        
        const posts: BlogPost[] = await response.json()
        const currentPost = posts.find(p => p.slug === slug)
        
        if (!currentPost) {
          toast.error('Blog post not found')
          router.push('/blog')
          return
        }
        
        setPost(currentPost)
        
        // Get related posts from the same category (exclude current post)
        const related = posts
          .filter(p => p.category === currentPost.category && p.slug !== slug)
          .slice(0, 3)
          .map(p => ({ slug: p.slug, title: p.title }))
        
        setRelatedPosts(related)
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast.error('Failed to load blog post')
        router.push('/blog')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug, router])

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading blog post...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-8">
            <p className="text-muted-foreground mb-4">Blog post not found</p>
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90">Back to Blog</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Back Button */}
        <section className="px-4 py-6 border-b border-white/10">
          <div className="container mx-auto max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
            
            {/* Article Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-3xl">
            <article className="prose prose-invert max-w-none">
              <div 
                className="space-y-6 text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  '--tw-prose-body': 'var(--foreground)',
                  '--tw-prose-headings': 'var(--foreground)',
                  '--tw-prose-links': 'var(--primary)',
                  '--tw-prose-bullets': 'var(--primary)',
                } as React.CSSProperties}
              />
            </article>

            {/* Author Bio */}
            <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold mb-2">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    Security expert and writer at RedFlag, dedicated to helping people understand and avoid online scams and fraud.
                  </p>
                </div>
              </div>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-4">
                  {relatedPosts.map((relPost, idx) => (
                    <Link key={idx} href={`/blog/${relPost.slug}`}>
                      <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-4 hover:bg-white/15 dark:hover:bg-gray-900/40 transition-colors cursor-pointer">
                        <p className="font-medium text-foreground">{relPost.title}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <Card className="backdrop-blur-sm bg-gradient-to-r from-primary/10 to-primary/5 dark:bg-gray-900/30 border border-primary/20 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-3">Protect Yourself with RedFlag</h3>
              <p className="text-muted-foreground mb-6">
                Use our AI-powered scam detection tool to analyze suspicious messages, URLs, and images instantly.
              </p>
              <Link href="/dashboard/analyze" className="inline-block">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Analyzing
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
