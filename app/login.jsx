"use client"

import { useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

export function Login() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
        console.log(session)
    }
  }, [session])
  return (
    <div>
      <button type="button" onClick={() => signIn("spotify")}>Click here {session ? session.user.name : ""}</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}