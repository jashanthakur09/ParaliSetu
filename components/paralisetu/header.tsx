'use client'

import { RotateCcw, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LANGUAGES } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useParali } from './provider'

export function Header() {
  const { lang, setLang, reset } = useParali()

  return (
    <header className="bg-forest text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-verified/15 ring-1 ring-verified/40">
            <Sprout className="size-6 text-verified" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-tight">ParaliSetu</h1>
            <p className="text-xs text-white/70">Satellite-guided stubble aggregation for Punjab &amp; Haryana</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="Language" className="flex rounded-lg bg-white/10 p-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className={cn(
                  'rounded-md px-2.5 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-verified focus-visible:outline-none',
                  lang === l.code ? 'bg-white text-forest font-medium' : 'text-white/80 hover:bg-white/10',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void reset()}
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset Demo
          </Button>
        </div>
      </div>
    </header>
  )
}