"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react"
import { useEffect, useState, useContext } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { SignInNavbar } from "./navbar/sign-in-nav";
import { YoutubeOptionsNavbar } from "./navbar/youtube-nav";
import { SpotifyOptionsNavbar } from "./navbar/spotify-nav";
import { ToFromContext } from "./transfer/transfer-contexts";

export function Navbar() {
    const { data: sessionSpotify } = useSession()
    const [sessionYouTube, setSessionYouTube] = useState(false)
    const {toFromContext, setToFromContext} = useContext(ToFromContext)

    useEffect(() => {
        const checkSession = async () => {
            await fetch('/api/youtube', {
                method: "POST",
                body: JSON.stringify({ action: "checkSession" }),
            }).then(async (response) => {
                const session = await response.json()

                setSessionYouTube(session.session)
            });
        }

        checkSession()
        if (!(toFromContext == undefined)) {
            setToFromContext(
                {
                    from: sessionStorage.getItem("transfer-from"),
                    to: sessionStorage.getItem("transfer-to")
                }
            )
        }
    }, [])

    const changeTransferOrder = () => {
        const toStreamingPlatform = sessionStorage.getItem("transfer-to"); 
        const fromStreamingPlatform = sessionStorage.getItem("transfer-from"); 

        sessionStorage.setItem("transfer-from", toStreamingPlatform),
        sessionStorage.setItem("transfer-to", fromStreamingPlatform)

        if (!(toFromContext == undefined)) {
            setToFromContext(
                {
                    from: sessionStorage.getItem("transfer-from"),
                    to: sessionStorage.getItem("transfer-to")
                }
            )
        }
    }

    return (
        <nav className="flex justify-between items-center py-5 px-10">
            <div>
                <Link href={"/"}>
                    <Image src="/MusiMoveFullLogo.png" height={50} width={200} alt="MusiMove Logo" unoptimized={true} priority={false}></Image>
                </Link>
            </div>
            <div className="flex gap-5 items-center">
                {
                    sessionSpotify && toFromContext != undefined && toFromContext.from == "Spotify" ?
                    <SpotifyOptionsNavbar></SpotifyOptionsNavbar>
                    :
                    (
                        sessionYouTube && toFromContext != undefined && toFromContext.from == "YouTube" ? 
                            <YoutubeOptionsNavbar setSessionYouTube={setSessionYouTube}></YoutubeOptionsNavbar>
                        :
                            <SignInNavbar
                            sessionSpotify={sessionSpotify}
                            sessionYouTube={sessionYouTube}
                            transferDirection={"from"}
                            ></SignInNavbar>
                    )
                }
                <FaArrowRightArrowLeft className="w-7 h-7" onClick={changeTransferOrder}/>
                {
                    sessionSpotify && toFromContext != undefined && toFromContext.to == "Spotify" ?
                    <SpotifyOptionsNavbar></SpotifyOptionsNavbar>
                    :
                    (
                        sessionYouTube && toFromContext != undefined && toFromContext.to == "YouTube" ? 
                            <YoutubeOptionsNavbar setSessionYouTube={setSessionYouTube}></YoutubeOptionsNavbar>
                        :
                            <SignInNavbar
                            sessionSpotify={sessionSpotify}
                            sessionYouTube={sessionYouTube}
                            transferDirection={"to"}
                            ></SignInNavbar>
                    )
                }
                <div className="h-12 w-[0.1rem] bg-neutral-300 rounded-xl"></div>
                <MdOutlineDarkMode className="w-10 h-10 cursor-pointer"/>
            </div>
        </nav>
    )
}