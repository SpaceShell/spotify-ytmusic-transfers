"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signIn, useSession } from "next-auth/react"

export function SpotifyLoginButton() {
    const { data: sessionSpotify } = useSession()
    const router = useRouter()

    let login = () => {
        if (sessionSpotify) {
            router.push('/transfer')
        } else {
            if (sessionStorage.getItem("transfer-to") != "Spotify" && sessionStorage.getItem("transfer-from") != undefined) {
                sessionStorage.setItem("transfer-from", "Spotify")
            } else if (sessionStorage.getItem("transfer-from") != "Spotify" && sessionStorage.getItem("transfer-to") != undefined) {
                sessionStorage.setItem("transfer-to", "Spotify")
            }
            signIn("spotify", { callbackUrl: '/transfer' })
        }
    }

    return (
        <button type="button" className="w-50 h-20 px-6 py-3 bg-neutral-800 transition duration-200 outline-4 outline-transparent outline-offset-2 hover:outline-neutral-800 rounded-md font-bold text-white flex items-center cursor-pointer" onClick={login}>
            <Image src="/SpotifyLogo.svg" className='w-14 h-14' width={150} height={150} alt="Spotify logo" priority={false}></Image>
            <span className='ml-5 font-bold leading-5 text-left'>Login to <span className='text-[#1ED760]'>Spotify</span></span>
        </button>
    );
}