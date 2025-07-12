"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
    const { data: sessionSpotify } = useSession()
    const [showSpotifySignOut, setShowSpotifySignOut] = useState(false)
    const [showYouTubeSignOut, setShowYouTubeSignOut] = useState(false)
    const [sessionYouTube, setSessionYouTube] = useState(false)
    const signOutSpotify = useRef(undefined)
    const signOutYouTube = useRef(undefined)

    useEffect(() => {
        setSessionYouTube(sessionStorage.getItem("yt-authentication"))
    }, [])

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

    useEffect(() => {
        const hideYouTubeSignOut = (e) => {
            if (
                signOutYouTube.current &&
                showYouTubeSignOut == true &&
                e.target != signOutYouTube.current &&
                e.target != document.getElementById("spotifyLogo")
            ) {
                setShowYouTubeSignOut(false)
            }
        }

        document.addEventListener("mousedown", hideYouTubeSignOut)
        return () => {
            document.removeEventListener('mousedown', hideYouTubeSignOut);
        };
    }, [showYouTubeSignOut])

    return (
        <nav className="flex justify-between items-center py-5 px-10">
            <div>
                <Link href={"/"}>
                    <Image src="/MusiMoveFullLogo.png" height={50} width={200} alt="MusiMove Logo" unoptimized={true} priority={false}></Image>
                </Link>
            </div>
            <div className="flex gap-5 items-center">
                {
                    sessionSpotify &&
                    <div className="relative">
                        <Image
                            id="spotifyLogo"
                            src="/SpotifyLogo.svg"
                            className='w-10 h-10 cursor-pointer'
                            width={150} height={150}
                            alt="Spotify logo"
                            priority={true}
                            onClick={() => {setShowSpotifySignOut(!showSpotifySignOut)}}
                        ></Image>
                        {
                            showSpotifySignOut &&
                            <button 
                                className="w-35 py-3 pl-5 pr-6 top-12 right-0 absolute rounded-xl shadow-md border border-neutral-100 flex justify-between items-center bg-white hover:bg-neutral-100 cursor-pointer"
                                onClick={() => {signOut({ callbackUrl: '/' })}}
                                ref={signOutSpotify}
                            >
                                <CiLogout className="w-5 h-5" />
                                <p className="text-left">Sign Out</p>
                            </button>
                        }
                    </div>
                }
                {
                    sessionYouTube &&
                    <div className="relative">
                        <Image
                            id="youtubeMusicLogo"
                            src="/YouTubeMusicLogo.png"
                            className='w-10 h-10 cursor-pointer'
                            width={150} height={150}
                            alt="YouTube Music logo"
                            priority={true}
                            onClick={() => {setShowYouTubeSignOut(!showYouTubeSignOut)}}
                        ></Image>
                        {
                            showYouTubeSignOut &&
                            <button 
                                className="w-35 py-3 pl-5 pr-6 top-12 right-0 absolute rounded-xl shadow-md border border-neutral-100 flex justify-between items-center bg-white hover:bg-neutral-100 cursor-pointer"
                                onClick={() => {signOut({ callbackUrl: '/' })}}
                                ref={signOutYouTube}
                            >
                                <CiLogout className="w-5 h-5" />
                                <p className="text-left">Sign Out</p>
                            </button>
                        }
                    </div>
                }
                <MdOutlineDarkMode className="w-10 h-10 cursor-pointer"/>
            </div>
        </nav>
    )
}