"use client"

import React, { createContext, useContext, useMemo } from 'react';
import { connect } from "solana-kite"; // Tu librería

// 1. Definimos la forma de nuestro contexto (para TypeScript)
interface KiteContextType {
    connection: any; // O el tipo que devuelva 'connect'
}

// 2. Creamos el contexto
const KiteContext = createContext<KiteContextType | null>(null);

// 3. El Componente Provider
export const KiteProvider = ({ children }: { children: React.ReactNode }) => {

    // Usamos useMemo para que 'connect' solo se ejecute 1 vez al iniciar
    const connection = useMemo(() => {
        return connect("devnet");
    }, []);

    return (
        <KiteContext.Provider value={{ connection }}>
            {children}
        </KiteContext.Provider>
    );
};

// 4. Hook personalizado para que los hijos accedan fácil
export const useKite = () => {
    const context = useContext(KiteContext);
    if (!context) {
        throw new Error("useKite debe usarse dentro de un KiteProvider");
    }
    return context;
};