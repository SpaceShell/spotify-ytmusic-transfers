"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
    const { data: sessionSpotify, status } = useSession()
    const [showSpotifySignOut, setShowSpotifySignOut] = useState(false)
    const signOutSpotify = useRef(undefined)

    useEffect(() => {
        const hideSpotifySignOut = (e) => {
            if (
                signOutSpotify.current &&
                showSpotifySignOut == true &&
                e.target != signOutSpotify.current &&
                e.target != document.getElementById("spotifyLogo")
            ) {
                setShowSpotifySignOut(false)
            }
        }

        document.addEventListener("mousedown", hideSpotifySignOut)
        return () => {
            document.removeEventListener('mousedown', hideSpotifySignOut);
        };
    }, [showSpotifySignOut])

    return (
        <nav className="flex justify-between items-center py-6 px-10">
            <div>
                <Link href={"/"}>
                    <Image src="/MusiMoveFullLogo.png" height={50} width={200} alt="MusiMove Logo" unoptimized={true} priority={false}></Image>
                </Link>
            </div>
            <div className="flex gap-5">
                {
                    sessionSpotify &&
                    <div className="relative">
                        <Image
                            id="spotifyLogo"
                            src="/SpotifyLogo.svg"
                            className='w-10 h-10'
                            width={150} height={150}
                            alt="Spotify logo"
                            priority={false}
                            onClick={() => {setShowSpotifySignOut(!showSpotifySignOut)}}
                        ></Image>
                        {
                            showSpotifySignOut &&
                            <button 
                                className="w-35 py-3 pl-6 pr-5 top-12 right-0 absolute rounded-xl shadow-md flex justify-between items-center hover:bg-neutral-100"
                                onClick={() => {signOut({ callbackUrl: '/' })}}
                                ref={signOutSpotify}
                            >
                                <p className="text-left">Sign Out</p>
                                <CiLogout className="w-5 h-5" />
                            </button>
                        }
                    </div>
                }
                <MdOutlineDarkMode className="w-10 h-10"/>
            </div>
        </nav>
    )
}