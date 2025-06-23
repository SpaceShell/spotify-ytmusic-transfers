"use client"

import { SessionProvider } from "next-auth/react"
import { Transfer } from "./transfer";
import { Navbar } from "../navbar";

export default function TransferPage() {
  return (
    <>
        <SessionProvider>
            <Navbar></Navbar>
            <Transfer></Transfer>
        </SessionProvider>
    </>
  );
}