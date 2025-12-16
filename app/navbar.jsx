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
import { ToFromContext, ItemsTransferContext } from "./transfer/transfer-contexts";

export function Navbar() {
    const { data: sessionSpotify } = useSession()
    const [sessionYouTube, setSessionYouTube] = useState(false)
    const {toFromContext, setToFromContext} = useContext(ToFromContext)
    const {setTransferContext} = useContext(ItemsTransferContext)

    useEffect(() => {
        const checkSession = async () => {
            await fetch('/api/youtube', {
                method: "POST",
                body: JSON.stringify({ action: "checkSession" }),
            }).then(async (response) => {
                const session = await response.json()

                if (session.session == false) {
                    const transferContext = {
                        from: localStorage.getItem("transfer-from"),
                        to: localStorage.getItem("transfer-to")
                    }

                    localStorage.removeItem(
                        transferContext.from == "YouTube" ? "transfer-from" : "transfer-to"
                    );
                }
                setSessionYouTube(session.session)
            });
        }

        checkSession()
        setToFromContext(
            {
                from: localStorage.getItem("transfer-from"),
                to: localStorage.getItem("transfer-to")
            }
        )
    }, [])

    useEffect(() => {
        setToFromContext(
            {
                from: localStorage.getItem("transfer-from"),
                to: localStorage.getItem("transfer-to")
            }
        )
    }, [sessionYouTube, sessionSpotify])

    const changeTransferOrder = () => {
        const toStreamingPlatform = localStorage.getItem("transfer-to"); 
        const fromStreamingPlatform = localStorage.getItem("transfer-from"); 

        localStorage.setItem("transfer-from", toStreamingPlatform);
        localStorage.setItem("transfer-to", fromStreamingPlatform);

        setToFromContext(
            {
                from: localStorage.getItem("transfer-from"),
                to: localStorage.getItem("transfer-to")
            }
        )
        setTransferContext(
            {
                transfer: undefined,
                items: [],
                to: [], 
                status: "unstarted",
                response: undefined
            }
        )
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
                    sessionSpotify && toFromContext.from == "Spotify" ?
                    <SpotifyOptionsNavbar transferDirection={"from"}></SpotifyOptionsNavbar>
                    :
                    (
                        sessionYouTube && toFromContext.from == "YouTube" ? 
                            <YoutubeOptionsNavbar setSessionYouTube={setSessionYouTube} transferDirection={"from"}></YoutubeOptionsNavbar>
                        :
                            <SignInNavbar
                            sessionSpotify={sessionSpotify}
                            sessionYouTube={sessionYouTube}
                            transferDirection={"from"}
                            ></SignInNavbar>
                    )
                }
                <FaArrowRightArrowLeft className="w-7 h-7 cursor-pointer" onClick={changeTransferOrder}/>
                {
                    sessionSpotify && toFromContext.to == "Spotify" ?
                    <SpotifyOptionsNavbar transferDirection={"to"}></SpotifyOptionsNavbar>
                    :
                    (
                        sessionYouTube && toFromContext.to == "YouTube" ? 
                            <YoutubeOptionsNavbar setSessionYouTube={setSessionYouTube} transferDirection={"to"}></YoutubeOptionsNavbar>
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