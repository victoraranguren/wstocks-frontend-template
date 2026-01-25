"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Calendar, Hash, Shield } from "lucide-react"

interface AssetRegistryData {
  address: string
  programAddress: string
  data: {
    id: number
    authority: string
    mint: string
    assetSymbol: string
    assetIsin: string
    legalDocUri: string
    creationDate: number
    assetType: number
    bump: number
  }
}

interface AssetRegistryCardProps {
  asset: AssetRegistryData
}

const assetTypeLabels: Record<number, string> = {
  0: "Equity",
  1: "Bond",
  2: "Commodity",
  3: "ETF",
}

export function AssetRegistryCard({ asset }: AssetRegistryCardProps) {
  const creationDate = new Date(Number(asset.data.creationDate) * 1000)
  
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="glass-card overflow-hidden group hover:border-solana-green/50 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solana-green/20 to-solana-purple/20 flex items-center justify-center border border-solana-green/30">
              <span className="text-lg font-bold text-solana-green">
                {asset.data.assetSymbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{asset.data.assetSymbol}</h3>
              <p className="text-sm text-muted-foreground">{asset.data.assetIsin}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="border-solana-green/50 text-solana-green bg-solana-green/10"
          >
            {assetTypeLabels[asset.data.assetType] || "Unknown"}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Hash className="w-4 h-4 text-solana-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Registry ID</p>
              <p className="text-foreground font-mono truncate">{asset.data.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Shield className="w-4 h-4 text-solana-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Authority</p>
              <p className="text-foreground font-mono truncate">{truncateAddress(asset.data.authority)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4 text-solana-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Creation Date</p>
              <p className="text-foreground">{creationDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <span className="font-mono">{truncateAddress(asset.address)}</span>
            </div>
            <a 
              href={asset.data.legalDocUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-solana-green hover:text-solana-green/80 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Legal Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Gradient accent */}
      <div className="h-1 bg-gradient-to-r from-solana-green via-solana-purple to-solana-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
    </Card>
  )
}
