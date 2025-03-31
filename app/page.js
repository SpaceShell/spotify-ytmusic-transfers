"use client"

import { Login } from "./login" 
import { SessionProvider } from "next-auth/react"

export default function Home() {
  return (
    <SessionProvider>
      <Login/>
    </SessionProvider>
  );
}
