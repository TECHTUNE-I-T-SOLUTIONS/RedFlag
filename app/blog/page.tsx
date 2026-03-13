import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

// Import blog posts data directly
import blogPosts from '@/public/blog-posts.json'

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Header */}
        <section className="px-4 py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">RedFlag Blog</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn about online security, scam detection, and how to stay safe in the digital world. Expert insights and practical guides to protect you and your family.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              {blogPosts && blogPosts.length > 0 ? (
                blogPosts.map((post: any, idx: number) => (
                  <Card key={idx} className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">By {post.author}</p>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:underline inline-flex items-center gap-2 font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6">
                  <p className="text-muted-foreground">No blog posts available at the moment.</p>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
