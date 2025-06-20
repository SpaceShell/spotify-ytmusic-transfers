"use client"

import { useEffect, useState } from "react"
import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { SpotifyLoginButton } from "./spotify-login-button"
import { YTMusicLoginButton } from "./ytmusic-login-button"
import { Navbar } from "./navbar"

export function Login() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
        console.log("sess", session)
        authOptions.callbacks.getProfile(session.accessToken).then((data) => {
          if (data.error && data.error.status == 401) {
            signOut()
          }
        })
    }
  }, [session])

  return (
    <div>
        <Navbar></Navbar>
        <div className="mb-40 mt-20 mx-60 flex gap-55 relative">
            <div>
                <h1 className="font-bold text-6xl font-inter">Welcome to <br></br><span className="text-blue-700">Musi</span>Move</h1>
                <p className="mt-5 text-2xl">Freely compare and transfer any <br></br>of your tracks or playlists</p>
                <p className="mt-25 mb-5"><span className="font-bold">Login</span> to a streaming platform to begin transferring</p>
                <div className="flex gap-10">
                    <SpotifyLoginButton></SpotifyLoginButton>
                    <YTMusicLoginButton></YTMusicLoginButton>
                </div>
            </div>
            <div>
                <Image className="fade-up" src="/MusicImage.png" width={380} height={380} alt="Two music notes and a music album with a headphones icon"></Image>
            </div>
        </div>
    </div>
  );
}