"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signIn, useSession } from "next-auth/react"

export function SpotifyLoginButton() {
    const { data: sessionSpotify } = useSession()
    const router = useRouter()

    let login = () => {
        if (sessionSpotify) {
            if (localStorage.getItem("transfer-from") != "Spotify" && localStorage.getItem("transfer-to") != "Spotify") {
                localStorage.setItem("transfer-from", "Spotify")
            }
            router.push('/transfer')
        } else {
            if (localStorage.getItem("transfer-to") != "Spotify" && localStorage.getItem("transfer-from") == null) {
                localStorage.setItem("transfer-from", "Spotify")
            } else if (localStorage.getItem("transfer-from") != "Spotify" && localStorage.getItem("transfer-to") == null) {
                localStorage.setItem("transfer-to", "Spotify")
            }
            signIn("spotify", { callbackUrl: '/transfer' })
        }
    }

    return (
        <button type="button" className="loginButton" onClick={login}>
            <Image src="/SpotifyLogo.svg" className='w-14 h-14' width={150} height={150} alt="Spotify logo" priority={false}></Image>
            <span className='ml-5 font-bold leading-5 text-left text-xl'><span className='text-[#1ED760]'>Spotify</span></span>
        </button>
    );
}