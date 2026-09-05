import React from 'react';
import { Layers, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function AboutSection() {
  return (
    <section className="py-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Terminal className="w-6 h-6 text-primary" />
          Technical Stack & Expertise
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Technologies, frameworks, and engineering tools used across production projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {siteConfig.skills.map((skillGroup) => (
          <Card key={skillGroup.category} className="border-border/80 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                {skillGroup.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="font-mono text-xs py-1 px-2.5 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Philosophy & Developer Setup */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-6">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Engineering Philosophy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Type Safety First:</strong> End-to-end typed contracts between frontend, APIs, and state systems.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Performance Centric:</strong> Sub-second bundle loads, code splitting, edge caching, and lightweight dependencies.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Developer Ergonomics:</strong> Clean directory conventions, automated CI/CD pipelines, and expressive component boundaries.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Open Source by Default:</strong> Modular packages, extensive documentation, and transparent architecture notes.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
