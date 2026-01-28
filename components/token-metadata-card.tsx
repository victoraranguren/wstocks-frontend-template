"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Check, Plus, PlusCircle } from "lucide-react"
import { MouseEvent, useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS, getMintAssetInstructionDataEncoder } from "@/solana/programs/rwa/client"
import { Address, address } from "@solana/kit"
import { useSendTransaction, useWalletConnection } from "@solana/react-hooks"
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token"
import BN from "bn.js"

type TokenMetadata = {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  supply?: number;
  authority: string;
  programId: string;
  assetRegistryId: number;
}

interface TokenMetadataCardProps {
  token: TokenMetadata
}

export function TokenMetadataCard({ token }: TokenMetadataCardProps) {
  const {
    connectors,      // Available wallet connectors
    connect,         // Connect to a wallet
    disconnect,      // Disconnect current wallet
    wallet,          // Current wallet session
    status,          // 'disconnected' | 'connecting' | 'connected'
    currentConnector, // Current connected wallet info,
    connecting,

  } = useWalletConnection();

  const { send, isSending, status: statusTransaction, signature, error, reset } = useSendTransaction();

  const walletAddress = wallet?.account.address;

  const [copiedField, setCopiedField] = useState<string | null>(null)

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const solscanUrl = `https://solscan.io/token/${token.mint}`

  const onIncrement = async (e: MouseEvent) => {
    console.log("e: ", { e });
    console.log("token: ", { token });
    try {
      if (!walletAddress) return

      try {
        const uniqueIdBuffer = new BN(token.assetRegistryId).toArrayLike(Buffer, "le", 8);

        const [assetRegistryPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("asset_registry"),
            new PublicKey(walletAddress.toString()).toBuffer(),
            uniqueIdBuffer,
          ],
          new PublicKey(ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS.toString())
        );
        const [mint] = PublicKey.findProgramAddressSync(
          [Buffer.from("mint"), uniqueIdBuffer],
          new PublicKey(ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS.toString())
        );
        const SYSTEM_PROGRAM_ADDRESS = "11111111111111111111111111111111" as Address;

        const destinyAssetTokenAccount = getAssociatedTokenAddressSync(new PublicKey(token.mint), new PublicKey(walletAddress))

        const instruction = {
          programAddress: ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS,
          accounts: [
            { address: address(assetRegistryPda.toString()), role: 1 }, // Asset
            { address: address(mint.toString()), role: 1 }, // Writable
            { address: address(walletAddress.toString()), role: 3 }, // WritableSigner
            { address: address(walletAddress.toString()), role: 0 }, // destiny
            { address: address(destinyAssetTokenAccount.toString()), role: 1 }, // ATA destiny
            { address: address(SYSTEM_PROGRAM_ADDRESS.toString()), role: 0 }, // Readonly
            { address: address(TOKEN_PROGRAM_ID.toString()), role: 0 }, // Token Program
            { address: address(ASSOCIATED_PROGRAM_ID.toString()), role: 0 }, // Associated Token Program
            { address: address(SYSVAR_RENT_PUBKEY.toString()), role: 0 }, // Rent Program

          ],
          data: getMintAssetInstructionDataEncoder().encode({ amountTokens: 1000000 })

        }

        const signature = await send({
          instructions: [instruction],
        });

        console.log("Tx signature: ", signature);
        const solscanUrl = `https://solscan.io/tx/${signature}?cluster=devnet`;

        toast("Transaction Successful", {
          description: `Asset ${token.name} has been supply minted.`,
          className: "border-solana-green/50 bg-solana-green/10",
          action: {
            label: "View on Solscan",
            onClick: () => window.open(solscanUrl, "_blank"),
          },
        });
      } catch (error) {
        console.log("Tx error: ", { error });

      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.warning("Transaction Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Card className="glass-card overflow-hidden group hover:border-solana-purple/50 transition-all duration-300">
      {/* Header with gradient */}
      <div className="relative p-6 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/10 via-transparent to-solana-green/5" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Token Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-solana-purple to-solana-green p-0.5">
                  <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-solana-green to-solana-purple bg-clip-text text-transparent">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-solana-green flex items-center justify-center">
                  <Check className="w-3 h-3 text-background" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">{token.symbol}</h3>
                <p className="text-muted-foreground">{token.name}</p>
              </div>
            </div>

            <Badge className="bg-solana-purple/20 text-solana-purple border-solana-purple/30 hover:bg-solana-purple/30">
              SPL Token
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Decimals</p>
            <p className="text-xl font-bold text-foreground">{token.decimals}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Supply</p>
            <p className="text-xl font-bold text-solana-green">{token.supply || "∞"}</p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="p-6 space-y-3">
        <AddressRow
          label="Mint Address"
          address={token.mint}
          truncated={truncateAddress(token.mint)}
          onCopy={() => copyToClipboard(token.mint, 'mint')}
          copied={copiedField === 'mint'}
          accentColor="solana-green"
        />
        <AddressRow
          label="Authority"
          address={token.authority}
          truncated={truncateAddress(token.authority)}
          onCopy={() => copyToClipboard(token.authority, 'authority')}
          copied={copiedField === 'authority'}
          accentColor="solana-purple"
        />
        <AddressRow
          label="Program ID"
          address={token.programId}
          truncated={truncateAddress(token.programId)}
          onCopy={() => copyToClipboard(token.programId, 'program')}
          copied={copiedField === 'program'}
          accentColor="solana-cyan"
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-6 pb-6">
        <a
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-solana-green/20 to-solana-purple/20 border border-solana-green/30 text-foreground hover:border-solana-green/60 transition-all group/link"
        >
          <span className="text-sm font-medium">View on Solscan</span>
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
        </a>

        <Button
          onClick={async (e) => await onIncrement(e)}
          className="flex items-center justify-center gap-2 w-full py-5 rounded-xl bg-gradient-to-r to-solana-green/20 from-solana-purple/20 border border-solana-green/30 text-foreground hover:border-solana-green/60 transition-all group/link"
        >
          <span className="text-sm font-medium">Increase supply (1M tokens)</span>
          <PlusCircle className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      {/* Bottom gradient accent */}
      <div className="h-1 bg-gradient-to-r from-solana-purple via-solana-cyan to-solana-green opacity-50 group-hover:opacity-100 transition-opacity" />
    </Card>
  )
}

interface AddressRowProps {
  label: string
  address: string
  truncated: string
  onCopy: () => void
  copied: boolean
  accentColor: string
}

function AddressRow({ label, truncated, onCopy, copied, accentColor }: AddressRowProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:border-border/80 transition-colors">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-mono text-sm text-${accentColor}`}>{truncated}</p>
      </div>
      <button
        onClick={onCopy}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label={copied ? "Copied" : "Copy address"}
      >
        {copied ? (
          <Check className={`w-4 h-4 text-${accentColor}`} />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  )
}
