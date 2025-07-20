"use client"

import { SessionProvider } from "next-auth/react"
import { Transfer } from "./transfer";
import { Navbar } from "../navbar";
import { useState } from "react";
import { ToFromContext, ItemsTransferContext } from "./transfer-contexts";

export default function TransferPage() {
    const [toFromContext, setToFromContext] = useState({from: undefined, to: undefined});
    const [transferContext, setTransferContext] = useState({transfer: undefined, items: [], to: []});

    return (
        <ToFromContext value={{toFromContext, setToFromContext}}>
            <ItemsTransferContext value={{transferContext, setTransferContext}}>
                <SessionProvider>
                    <Navbar></Navbar>
                    <Transfer></Transfer>
                </SessionProvider>
            </ItemsTransferContext>
        </ToFromContext>
    );
}