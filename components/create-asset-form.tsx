"use client"

import React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Rocket, FileText, Coins, ExternalLink } from "lucide-react"

interface AssetRegistryFormData {
  assetSymbol: string
  assetIsin: string
  legalDocUri: string
  assetType: number
}

interface TokenMetadataFormData {
  name: string
  symbol: string
  decimals: number
  initialSupply: string
}

interface CreateAssetFormProps {
  onSubmit?: (data: { registry: AssetRegistryFormData; token: TokenMetadataFormData }) => void
}

export function CreateAssetForm({ onSubmit }: CreateAssetFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Asset Registry Form State
  const [registryData, setRegistryData] = useState<AssetRegistryFormData>({
    assetSymbol: "",
    assetIsin: "",
    legalDocUri: "",
    assetType: 0,
  })

  // Token Metadata Form State
  const [tokenData, setTokenData] = useState<TokenMetadataFormData>({
    name: "",
    symbol: "",
    decimals: 6,
    initialSupply: "",
  })

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Registry validation
    if (!registryData.assetSymbol.trim()) {
      newErrors.assetSymbol = "Asset symbol is required"
    } else if (registryData.assetSymbol.length > 10) {
      newErrors.assetSymbol = "Symbol must be 10 characters or less"
    }

    if (!registryData.assetIsin.trim()) {
      newErrors.assetIsin = "ISIN is required"
    }

    if (!registryData.legalDocUri.trim()) {
      newErrors.legalDocUri = "Legal document URI is required"
    } else if (!isValidUrl(registryData.legalDocUri)) {
      newErrors.legalDocUri = "Please enter a valid URL"
    }

    // Token validation
    if (!tokenData.name.trim()) {
      newErrors.tokenName = "Token name is required"
    }

    if (!tokenData.symbol.trim()) {
      newErrors.tokenSymbol = "Token symbol is required"
    }

    if (tokenData.decimals < 0 || tokenData.decimals > 9) {
      newErrors.decimals = "Decimals must be between 0 and 9"
    }

    if (!tokenData.initialSupply.trim()) {
      newErrors.initialSupply = "Initial supply is required"
    } else if (Number.isNaN(Number(tokenData.initialSupply)) || Number(tokenData.initialSupply) <= 0) {
      newErrors.initialSupply = "Please enter a valid supply amount"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the data for Solana program call
      const submissionData = {
        registry: {
          ...registryData,
          assetSymbol: registryData.assetSymbol.toUpperCase(),
        },
        token: {
          ...tokenData,
          symbol: tokenData.symbol.toUpperCase(),
          decimals: Number(tokenData.decimals),
          initialSupply: tokenData.initialSupply,
        },
      }

      // Log the data for Solana program integration
      console.log("=== xStocks Asset Registration Data ===")
      console.log("Asset Registry Data:", JSON.stringify(submissionData.registry, null, 2))
      console.log("Token Metadata:", JSON.stringify(submissionData.token, null, 2))
      console.log("Full Payload:", JSON.stringify(submissionData, null, 2))
      console.log("=====================================")

      // Call optional onSubmit callback
      if (onSubmit) {
        onSubmit(submissionData)
      }

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a fake transaction signature for devnet
      const fakeSignature = Array.from({ length: 88 }, () =>
        Math.random().toString(36).charAt(2)
      ).join('')

      const solscanUrl = `https://solscan.io/tx/${fakeSignature}?cluster=devnet`

      toast({
        title: "Transaction Successful",
        description: `Asset ${registryData.assetSymbol.toUpperCase()} has been registered.`,
        className: "border-solana-green/50 bg-solana-green/10",
        action: {
          label: "View on Solscan",
          onClick: () => window.open(solscanUrl, "_blank"),
        },
      })

      // Reset form
      setRegistryData({
        assetSymbol: "",
        assetIsin: "",
        legalDocUri: "",
        assetType: 0,
      })
      setTokenData({
        name: "",
        symbol: "",
        decimals: 6,
        initialSupply: "",
      })
    } catch (error) {
      console.error("Transaction failed:", error)
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="glass-card overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Asset Registry Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-solana-green/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-solana-green" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Asset Registry</h3>
              <p className="text-xs text-muted-foreground">On-chain registration data</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetSymbol" className="text-foreground">
              Asset Symbol <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assetSymbol"
              placeholder="e.g., WAAPL, WTSLA"
              value={registryData.assetSymbol}
              onChange={(e) =>
                setRegistryData({ ...registryData, assetSymbol: e.target.value.toUpperCase() })
              }
              className="bg-secondary/50 border-border focus:border-solana-green focus:ring-solana-green/20 uppercase"
              maxLength={10}
            />
            {errors.assetSymbol && (
              <p className="text-xs text-destructive">{errors.assetSymbol}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetIsin" className="text-foreground">
              ISIN Identifier <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assetIsin"
              placeholder="e.g., VE-WAAPL-001"
              value={registryData.assetIsin}
              onChange={(e) =>
                setRegistryData({ ...registryData, assetIsin: e.target.value })
              }
              className="bg-secondary/50 border-border focus:border-solana-green focus:ring-solana-green/20"
            />
            {errors.assetIsin && (
              <p className="text-xs text-destructive">{errors.assetIsin}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType" className="text-foreground">
              Asset Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={registryData.assetType.toString()}
              onValueChange={(value) =>
                setRegistryData({ ...registryData, assetType: Number.parseInt(value) })
              }
            >
              <SelectTrigger className="bg-secondary/50 border-border focus:border-solana-green focus:ring-solana-green/20">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="0">Equity</SelectItem>
                <SelectItem value="1">Bond</SelectItem>
                <SelectItem value="2">Commodity</SelectItem>
                <SelectItem value="3">ETF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalDocUri" className="text-foreground">
              Legal Document URI <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legalDocUri"
              placeholder="https://..."
              value={registryData.legalDocUri}
              onChange={(e) =>
                setRegistryData({ ...registryData, legalDocUri: e.target.value })
              }
              className="bg-secondary/50 border-border focus:border-solana-green focus:ring-solana-green/20"
            />
            {errors.legalDocUri && (
              <p className="text-xs text-destructive">{errors.legalDocUri}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Link to the legal documentation for this asset
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-card text-xs text-muted-foreground">Token Configuration</span>
          </div>
        </div>

        {/* Token Metadata Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-solana-purple/20 flex items-center justify-center">
              <Coins className="w-4 h-4 text-solana-purple" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Token Metadata</h3>
              <p className="text-xs text-muted-foreground">SPL Token configuration</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenName" className="text-foreground">
              Token Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tokenName"
              placeholder="e.g., Wrapped Apple Inc."
              value={tokenData.name}
              onChange={(e) => setTokenData({ ...tokenData, name: e.target.value })}
              className="bg-secondary/50 border-border focus:border-solana-purple focus:ring-solana-purple/20"
            />
            {errors.tokenName && (
              <p className="text-xs text-destructive">{errors.tokenName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol" className="text-foreground">
              Token Symbol <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tokenSymbol"
              placeholder="e.g., WAAPL"
              value={tokenData.symbol}
              onChange={(e) =>
                setTokenData({ ...tokenData, symbol: e.target.value.toUpperCase() })
              }
              className="bg-secondary/50 border-border focus:border-solana-purple focus:ring-solana-purple/20 uppercase"
              maxLength={10}
            />
            {errors.tokenSymbol && (
              <p className="text-xs text-destructive">{errors.tokenSymbol}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decimals" className="text-foreground">
                Decimals <span className="text-destructive">*</span>
              </Label>
              <Input
                id="decimals"
                type="number"
                min={0}
                max={9}
                value={tokenData.decimals}
                onChange={(e) =>
                  setTokenData({ ...tokenData, decimals: Number.parseInt(e.target.value) || 0 })
                }
                className="bg-secondary/50 border-border focus:border-solana-purple focus:ring-solana-purple/20"
              />
              {errors.decimals && (
                <p className="text-xs text-destructive">{errors.decimals}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialSupply" className="text-foreground">
                Initial Supply <span className="text-destructive">*</span>
              </Label>
              <Input
                id="initialSupply"
                placeholder="1000000"
                value={tokenData.initialSupply}
                onChange={(e) =>
                  setTokenData({ ...tokenData, initialSupply: e.target.value })
                }
                className="bg-secondary/50 border-border focus:border-solana-purple focus:ring-solana-purple/20"
              />
              {errors.initialSupply && (
                <p className="text-xs text-destructive">{errors.initialSupply}</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-solana-purple/10 border border-solana-purple/20">
            <p className="text-sm text-muted-foreground">
              <span className="text-solana-purple font-medium">Note:</span> The token will be created
              with a mint authority set to your connected wallet address.
            </p>
          </div>
        </div>

        {/* Summary Preview */}
        {(registryData.assetSymbol || tokenData.symbol) && (
          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solana-green/20 to-solana-purple/20 flex items-center justify-center border border-solana-green/30">
                <span className="text-base font-bold text-solana-green">
                  {(registryData.assetSymbol || tokenData.symbol || "XX").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {tokenData.name || registryData.assetSymbol || "Asset Name"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {registryData.assetSymbol || tokenData.symbol || "SYMBOL"} | {registryData.assetIsin || "ISIN"} | {tokenData.decimals} decimals
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-solana-green to-solana-cyan text-background font-semibold text-base hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Transaction...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              Register Asset on Solana
            </>
          )}
        </Button>
      </form>

      {/* Bottom gradient */}
      <div className="h-1 bg-gradient-to-r from-solana-green via-solana-purple to-solana-cyan opacity-50" />
    </Card>
  )
}
