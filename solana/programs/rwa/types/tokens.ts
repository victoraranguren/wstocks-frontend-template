"use server";

import { AssetRegistryData } from "./asset-registry";
import { env } from "process";

export interface TokenMetadataUI {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  supply: number;
  authority: string;
  programId: string;
}
export const url = async () =>
  `https://devnet.helius-rpc.com/?api-key=${env.NEXT_PUBLIC_API}`;
export const getTokenMetadataByAssetRegistryCollection = async (
  assetRegistryAccounts: AssetRegistryData[],
) => {
  // Get a single asset by its ID

  const getAsset = async (id: string) => {
    const response = await fetch(await url(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-request-id",
        method: "getAsset",
        params: {
          id: id,
        },
      }),
    });

    const data = await response.json();
    return data.result;
  };

  const mintAccounts = Promise.all(
    assetRegistryAccounts.map(async (assetRegistryAccount) => {
      const asset = await getAsset(assetRegistryAccount.data.mint);

      const tokenWithMetadata = {
        mint: assetRegistryAccount.data.mint,
        symbol: asset.content.metadata.symbol,
        name: asset.content.metadata.name,
        decimals: asset.token_info.decimals,
        supply: asset.token_info.supply / 10 ** asset.token_info.decimals,
        authority: asset.token_info.mint_authority,
        programId: assetRegistryAccount.programAddress,
        assetRegistryId: assetRegistryAccount.data.id,
      };

      return tokenWithMetadata;
    }),
  );

  return mintAccounts;
};
