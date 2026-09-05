import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Calendar, Clock, Tag, BookOpen, ArrowRight, X } from 'lucide-react';
import { BlogPost } from '@/config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from './ui/dialog';
import { formatDate } from '@/lib/utils';

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Engineering Notes & Blog
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Articles, architecture patterns, and technical notes on frontend and backend engineering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="flex flex-col justify-between hover:border-primary/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatDate(post.date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm line-clamp-3 mt-2">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] font-mono">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-3 border-t border-border/50 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Read Article <ArrowRight className="w-3.5 h-3.5" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Full Article Reader Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onClose={() => setSelectedPost(null)}>
          <DialogHeader onClose={() => setSelectedPost(null)}>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formatDate(selectedPost.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedPost.readTime}
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {selectedPost.title}
            </DialogTitle>
          </DialogHeader>

          <DialogContent className="max-w-4xl mx-auto py-6">
            <div className="flex flex-wrap gap-1.5 mb-6 pb-4 border-b border-border/60">
              {selectedPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-mono">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
