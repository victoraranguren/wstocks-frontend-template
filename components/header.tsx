"use client"

import { Badge } from "@/components/ui/badge"
import { WalletButtons } from "@/solana/provider/provider"

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solana-green to-solana-purple flex items-center justify-center">
              <span className="text-lg font-black text-background">xS</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">wStocks</span>
              <Badge variant="outline" className="ml-2 text-xs border-solana-cyan/50 text-solana-cyan">
                Solana
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#registry" className="text-sm text-muted-foreground hover:text-solana-green transition-colors">
              Asset Registry
            </a>
            <a href="#tokens" className="text-sm text-muted-foreground hover:text-solana-green transition-colors">
              Tokens
            </a>
            <a
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-solana-green transition-colors"
            >
              Docs
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-solana-green/10 border border-solana-green/30">
              <div className="w-2 h-2 rounded-full bg-solana-green animate-pulse" />
              <span className="text-xs text-solana-green font-medium">Devnet</span>
            </div>
            <WalletButtons />

          </div>
        </div>
      </div>
    </header>
  )
}
