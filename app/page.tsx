"use client";

import { Header } from "@/components/header";
import { AssetRegistryCard } from "@/components/asset-registry-card";
import { TokenMetadataCard } from "@/components/token-metadata-card";
import { CreateAssetForm } from "@/components/create-asset-form";
import { Badge } from "@/components/ui/badge";
import { Database, Coins, ArrowRight, PlusCircle } from "lucide-react";
import * as programClient from "../solana/programs/rwa/client";
import {
  AssetRegistryData,
  AssetRegistryUI,
  transformAssetAccount,
} from "@/solana/programs/rwa/types/asset-registry";
import {
  getTokenMetadataByAssetRegistryCollection,
  TokenMetadataUI,
} from "@/solana/programs/rwa/types/tokens";
import { address } from "@solana/kit";
import { autoDiscover, createClient } from "@solana/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // const [assetRegistryData, setAssetRegistryData] =
  //   useState<AssetRegistryUI[]>();
  // const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataUI[]>();
  const client = createClient({
    endpoint: "https://api.devnet.solana.com",
    walletConnectors: autoDiscover(),
  });

  const setData = async () => {
    const getAssetRegistrysAccountsRaw = await client.runtime.rpc
      .getProgramAccounts(
        address("jEXgKE9NWJihHqLVAoXZ4e2TSZ7KkV7kub8j4ojcmZC"),
        {
          encoding: "base64",
        },
      )
      .send();

    console.log("getAssetRegistrysAccountsRaw: ", getAssetRegistrysAccountsRaw);

    const getProgramAccounts = getAssetRegistrysAccountsRaw.filter(
      (account) => Number(account.account.space) === 320,
    );

    const accountsRaw = getProgramAccounts.map((account) =>
      address(account.pubkey.toString()),
    );

    const accounts: any = await programClient.fetchAllAssetRegistry(
      client.runtime.rpc,
      accountsRaw,
    );

    const assetRegistryAccounts: AssetRegistryData[] = accounts;

    const assetRegistryData = assetRegistryAccounts.map((assetregistry) => {
      return transformAssetAccount(assetregistry);
    });

    //setAssetRegistryData(assetRegistryData);

    const tokenMetadata = await getTokenMetadataByAssetRegistryCollection(
      assetRegistryAccounts,
    );

    //setTokenMetadata(tokenMetadata);
    return {
      assetRegistryData,
      tokenMetadata,
    };
  };

  const { data } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      return await setData();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-solana-green/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-solana-green/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-solana-purple/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <Badge className="mb-6 bg-solana-purple/20 text-solana-purple border-solana-purple/30 hover:bg-solana-purple/30">
              Built on Solana
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Tokenized Securities
              <span className="block bg-gradient-to-r from-solana-green via-solana-cyan to-solana-purple bg-clip-text text-transparent">
                On-Chain Asset Registry
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Explore the wStocks asset registry - bringing traditional equities
              to the Solana blockchain with full transparency and instant
              settlement.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-solana-green to-solana-cyan text-background font-semibold hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="w-4 h-4" />
                Create Asset
              </a>
              <a
                href="#registry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-secondary/50 text-foreground font-medium hover:border-solana-green/50 transition-colors"
              >
                View Registry
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Create Asset Section */}
      <section
        id="create"
        className="py-16 sm:py-24 bg-gradient-to-b from-solana-purple/5 via-transparent to-transparent"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solana-green to-solana-purple p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-solana-green" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Register New Asset
              </h2>

              <p className="text-muted-foreground">
                Create a new tokenized security on Solana
              </p>
            </div>
          </div>

          <CreateAssetForm />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-solana-green">
                {data && data?.assetRegistryData.length}
              </p>
              <p className="text-sm text-muted-foreground">Registered Assets</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-solana-purple">$1.5M+</p>
              <p className="text-sm text-muted-foreground">
                Total Value Locked
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-solana-cyan">400ms</p>
              <p className="text-sm text-muted-foreground">Block Time</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{"< $0.01"}</p>
              <p className="text-sm text-muted-foreground">Transaction Cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Registry Section */}
      <section id="registry" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-solana-green/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-solana-green" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Asset Registry
              </h2>
              <p className="text-muted-foreground">
                On-chain registration records for tokenized securities
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data &&
              data?.assetRegistryData &&
              data?.assetRegistryData.map((asset) => (
                <AssetRegistryCard key={asset.address} asset={asset} />
              ))}
          </div>
        </div>
      </section>

      {/* Tokens Section */}
      <section id="tokens" className="py-16 sm:py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-solana-purple/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-solana-purple" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Token Metadata
              </h2>
              <p className="text-muted-foreground">
                SPL token details and on-chain metadata
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data &&
              data?.tokenMetadata &&
              data?.tokenMetadata.map((token) => (
                <TokenMetadataCard key={token.mint} token={token} />
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solana-green to-solana-purple flex items-center justify-center">
                <span className="text-sm font-black text-background">wS</span>
              </div>
              <span className="font-semibold text-foreground">wStocks</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Solana. Built for the future of finance.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-solana-green transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-solana-green transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-solana-green transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
