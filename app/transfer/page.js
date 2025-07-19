"use client"

import { SessionProvider } from "next-auth/react"
import { Transfer } from "./transfer";
import { Navbar } from "../navbar";
import { useState } from "react";
import { ToFromContext } from "./transfer-contexts";

export default function TransferPage() {
    const [toFromContext, setToFromContext] = useState({from: undefined, to: undefined});

    return (
        <ToFromContext value={{toFromContext, setToFromContext}}>
            <SessionProvider>
                <Navbar></Navbar>
                <Transfer></Transfer>
            </SessionProvider>
        </ToFromContext>
    );
}