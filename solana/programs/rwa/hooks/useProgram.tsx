"use client";

import * as anchor from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";

import { AnchorRwaTemplate } from "../client/anchor/types/anchor_rwa_template";
import Idl from "../client/anchor/idl/anchor_rwa_template.json";
import { useEffect, useState } from "react";

interface UseProgramReturn {
    program: anchor.Program<AnchorRwaTemplate>;
    publicKey: PublicKey | null;
    connected: boolean;
    connection: anchor.web3.Connection;
}

export function useProgram(): UseProgramReturn {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();


    // Program initialization - conditionally create with provider if wallet connected
    let program;
    if (wallet) {
        // Create a provider with the wallet for transaction signing
        const provider = new anchor.AnchorProvider(connection, wallet, {
            preflightCommitment: "confirmed",
        });
        program = new anchor.Program<AnchorRwaTemplate>(Idl, provider);
    } else {
        // Create program with just connection for read-only operations
        program = new anchor.Program<AnchorRwaTemplate>(Idl, { connection });
    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo se ejecuta una vez al montar

    return {
        program,
        publicKey,
        connected,
        connection,
    };
}