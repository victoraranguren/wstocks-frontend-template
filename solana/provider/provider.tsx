"use client";

import { ConnectWalletButton } from "@/components/connect-button-wallet";
import { Button } from "@/components/ui/button";
import {
  autoDiscover,
  backpack,
  createClient,
  phantom,
  solflare,
} from "@solana/client";
import {
  SolanaProvider,
  useWalletConnection,
  useWalletModalState,
} from "@solana/react-hooks";

const client = createClient({
  endpoint: "https://api.devnet.solana.com",
  walletConnectors: autoDiscover(),
});
export function WalletButtons() {
  return <ConnectWalletButton />;
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <SolanaProvider client={client}>{children}</SolanaProvider>;
}
