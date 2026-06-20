"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  FileText,
  Calendar,
  Hash,
  Shield,
  DeleteIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useSendTransaction, useWalletConnection } from "@solana/react-hooks";
import {
  ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS,
  getCloseAssetInstructionDataEncoder,
} from "@/solana/programs/rwa/client";
import { Address, address } from "@solana/kit";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AssetRegistryData {
  address: string;
  programAddress: string;
  data: {
    id: number;
    authority: string;
    mint: string;
    assetName: string;
    assetSymbol: string;
    assetIsin: string;
    legalDocUri: string;
    creationDate: number;
    assetType: number;
    bump: number;
  };
}

interface AssetRegistryCardProps {
  asset: AssetRegistryData;
}

const assetTypeLabels: Record<number, string> = {
  0: "Equity",
  1: "Bond",
  2: "Commodity",
  3: "ETF",
};

export function AssetRegistryCard({ asset }: AssetRegistryCardProps) {
  const queryClient = useQueryClient();

  const {
    wallet, // Current wallet session
  } = useWalletConnection();

  const { send, status: statusTransaction } = useSendTransaction();

  const walletAddress = wallet?.account.address;

  const creationDate = new Date(Number(asset.data.creationDate) * 1000);

  const onDelete = async () => {
    console.log("asset: ", { asset });
    try {
      if (!walletAddress) return;

      try {
        // Prepare the CloseAsset instruction to close the on-chain asset registry account
        const instruction = {
          programAddress: ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS,
          accounts: [
            // The asset registry account PDA to be closed/deleted (role 1 = Writable)
            { address: address(asset.address), role: 1 }, 
            // The authority (wallet owner) signing the transaction to approve deletion and receive recovered rent lamports (role 3 = WritableSigner)
            { address: address(walletAddress.toString()), role: 3 }, 
          ],
          data: getCloseAssetInstructionDataEncoder().encode({}),
        };

        // Send the instruction as a transaction using the connected wallet provider
        const signature = await send({
          instructions: [instruction],
        });

        console.log("Tx signature: ", signature);

        const solscanUrl = `https://solscan.io/tx/${signature}?cluster=devnet`;

        console.log("Tx signature: ", solscanUrl);

        // Invalidate query to trigger refetching of the updated assets list
        await queryClient.invalidateQueries({ queryKey: ["assets"] });

        toast("Transaction Successful", {
          description: `Asset ${asset.data.assetName} account has been closed.`,
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
  };
  return (
    <Card className="glass-card overflow-hidden group hover:border-solana-green/50 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solana-green/20 to-solana-purple/20 flex items-center justify-center border border-solana-green/30">
              <span className="text-lg font-bold text-solana-green">
                {asset.data.assetSymbol.slice(0, 2)}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">
                {asset.data.assetName}
              </h3>
              <h4 className="text-lg font-bold text-foreground">
                {asset.data.assetSymbol}
              </h4>
              <p className="text-sm text-muted-foreground">
                {asset.data.assetIsin}
              </p>
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
              <p className="text-foreground font-mono truncate">
                {asset.data.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Shield className="w-4 h-4 text-solana-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Authority</p>
              <p className="text-foreground font-mono w-full truncate">
                {asset.data.authority}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4 text-solana-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Creation Date</p>
              <p className="text-foreground">
                {creationDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 justify-between">
            <div className="text-xs text-muted-foreground truncate">
              <span className="font-mono">{asset.address}</span>
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

          <Button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 w-full py-5 rounded-xl bg-gradient-to-r to-solana-green/20 from-solana-purple/20 border border-solana-green/30 text-foreground hover:border-solana-green/60 transition-all group/link"
          >
            <span className="text-sm font-medium">Delete Asset Registry</span>
            <DeleteIcon className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Gradient accent */}
      <div className="h-1 bg-gradient-to-r from-solana-green via-solana-purple to-solana-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
