"use client"

import { Button } from "@/components/ui/button";
import { autoDiscover, createClient } from "@solana/client";
import { Address, address } from "@solana/kit";
import { SolanaProvider, useProgramAccounts, useSendTransaction, useSolTransfer, useWalletConnection } from "@solana/react-hooks";
import { ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS, getInitializeAssetInstructionDataEncoder, getInitializeAssetInstruction, InitializeAssetInstructionDataArgs, AssetType } from "../programs/rwa/client"
import { BN } from "@coral-xyz/anchor";
import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// Create a client pointing to Solana devnet
const client = createClient({
    endpoint: "https://api.devnet.solana.com",
    walletConnectors: autoDiscover(), // Finds installed wallet extensions
});

export function WalletButtons() {
    // This hook gives you everything you need for wallet connection
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

    // const walletAddress = wallet?.account.address;
    // if (!walletAddress) return
    // const faangAssets = [
    //     // 1. Facebook (Meta Platforms)
    //     {
    //         id: new BN(Date.now()),
    //         assetName: "Meta Platforms Inc. Tokenized",
    //         assetSymbol: "WMETA",
    //         assetIsin: "US30303M1027", // ISIN Real
    //         legalDocUri: "https://red-junior-hookworm-237.mypinata.cloud/ipfs/bafkreifhtpftpsozdrox4ihxyfunlrdoflmgpan7ttrgyqnj5vw6ro77ya",
    //         assetType: AssetType["Equity"],
    //         metadata: {
    //             name: "Meta Platforms RWA",
    //             symbol: "WMETA",
    //             uri: "",
    //             decimals: 8,
    //         },
    //     },
    //     // 2. Amazon
    //     {
    //         id: new BN(Date.now() + 1),
    //         assetName: "Amazon.com Inc. Tokenized",
    //         assetSymbol: "WAMZN",
    //         assetIsin: "US0231351067", // ISIN Real
    //         legalDocUri: "https://red-junior-hookworm-237.mypinata.cloud/ipfs/bafkreifhtpftpsozdrox4ihxyfunlrdoflmgpan7ttrgyqnj5vw6ro77ya",
    //         assetType: AssetType["Equity"],
    //         metadata: {
    //             name: "Amazon RWA",
    //             symbol: "WAMZN",
    //             uri: "",
    //             decimals: 8,
    //         },
    //     },
    //     // 3. Apple
    //     {
    //         id: new BN(Date.now() + 2),
    //         assetName: "Apple Inc. Tokenized",
    //         assetSymbol: "WAAPL",
    //         assetIsin: "US0378331005", // ISIN Real
    //         legalDocUri: "https://red-junior-hookworm-237.mypinata.cloud/ipfs/bafkreifhtpftpsozdrox4ihxyfunlrdoflmgpan7ttrgyqnj5vw6ro77ya",
    //         assetType: AssetType["Equity"],
    //         metadata: {
    //             name: "Apple Inc. RWA",
    //             symbol: "WAAPL",
    //             uri: "",
    //             decimals: 8,
    //         },
    //     },
    //     // 4. Netflix
    //     {
    //         id: new BN(Date.now() + 3),
    //         assetName: "Netflix Inc. Tokenized",
    //         assetSymbol: "WNFLX",
    //         assetIsin: "US64110L1061", // ISIN Real
    //         legalDocUri: "https://red-junior-hookworm-237.mypinata.cloud/ipfs/bafkreifhtpftpsozdrox4ihxyfunlrdoflmgpan7ttrgyqnj5vw6ro77ya",
    //         assetType: AssetType["Equity"],
    //         metadata: {
    //             name: "Netflix RWA",
    //             symbol: "WNFLX",
    //             uri: "",
    //             decimals: 8,
    //         },
    //     },
    //     // 5. Google (Alphabet Class A)
    //     {
    //         id: new BN(Date.now() + 4),
    //         assetName: "Alphabet Inc. Class A Tokenized",
    //         assetSymbol: "WGOOGL",
    //         assetIsin: "US02079K3059", // ISIN Real
    //         legalDocUri: "https://red-junior-hookworm-237.mypinata.cloud/ipfs/bafkreifhtpftpsozdrox4ihxyfunlrdoflmgpan7ttrgyqnj5vw6ro77ya",
    //         assetType: AssetType["Equity"],
    //         metadata: {
    //             name: "Alphabet Inc. RWA",
    //             symbol: "WGOOGL",
    //             uri: "",
    //             decimals: 8,
    //         },
    //     },
    // ];
    // const assetRegistry = faangAssets[0]

    // const uniqueIdBuffer = assetRegistry.id.toArrayLike(Buffer, "le", 8);

    // const [assetRegistryPda] = PublicKey.findProgramAddressSync(
    //     [
    //         Buffer.from("asset_registry"),
    //         new PublicKey(walletAddress.toString()).toBuffer(),
    //         uniqueIdBuffer,
    //     ],
    //     new PublicKey(ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS.toString())
    // );
    // const [mint] = PublicKey.findProgramAddressSync(
    //     [Buffer.from("mint"), uniqueIdBuffer],
    //     new PublicKey(ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS.toString())
    // );
    // const SYSTEM_PROGRAM_ADDRESS = "11111111111111111111111111111111" as Address;
    // const METADATA_SEED = "metadata";

    // const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    //     "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    // );

    // const [metadataAddress] = PublicKey.findProgramAddressSync(
    //     [
    //         Buffer.from(METADATA_SEED),
    //         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    //         mint.toBuffer(),
    //     ],
    //     TOKEN_METADATA_PROGRAM_ID
    // );

    // console.log(AssetType["Equity"]);

    // const instruction = {
    //     programAddress: ANCHOR_RWA_TEMPLATE_PROGRAM_ADDRESS,
    //     accounts: [
    //         { address: address(assetRegistryPda.toString()), role: 1 }, // Asset
    //         { address: address(mint.toString()), role: 1 }, // Writable
    //         { address: address(metadataAddress.toString()), role: 1 },
    //         { address: address(walletAddress.toString()), role: 3 }, // WritableSigner
    //         { address: address(SYSTEM_PROGRAM_ADDRESS.toString()), role: 0 }, // Readonly
    //         { address: address(TOKEN_PROGRAM_ID.toString()), role: 0 }, // Token Program
    //         { address: address(TOKEN_METADATA_PROGRAM_ID.toString()), role: 0 }, // Token Metadata Program
    //         { address: address(SYSVAR_RENT_PUBKEY.toString()), role: 0 }, // Rent Program

    //     ],
    //     data: getInitializeAssetInstructionDataEncoder().encode(
    //         {
    //             id: assetRegistry.id,
    //             assetIsin: assetRegistry.assetIsin,
    //             assetSymbol: assetRegistry.assetSymbol,
    //             assetType: assetRegistry.assetType,
    //             legalDocUri: assetRegistry.legalDocUri,
    //             name: assetRegistry.metadata.name,
    //             decimals: assetRegistry.metadata.decimals,
    //             symbol: assetRegistry.metadata.symbol,
    //             uri: assetRegistry.metadata.uri
    //         })

    // }

    return (
        <>
            <div>
                {
                    status == "disconnected" && connectors.map((connector) => (
                        <Button
                            key={connector.id}
                            disabled={connecting}
                            onClick={() => connect(connector.id)}
                        >
                            Connect Wallet
                        </Button>
                    ))

                }
                {
                    status == "connected" &&
                    <div>
                        <Button onClick={disconnect}>Disconnect</Button>
                    </div>

                }

            </div >
        </>
    );
}

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SolanaProvider client={client}>
            {children}
        </SolanaProvider>
    );
}