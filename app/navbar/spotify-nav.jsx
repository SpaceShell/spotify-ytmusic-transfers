import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { CiLogout } from "react-icons/ci";
import { signOut } from "next-auth/react"

export function SpotifyOptionsNavbar({transferDirection}) {
    const [showSpotifySignOut, setShowSpotifySignOut] = useState(false)
    const signOutSpotify = useRef(undefined)

    useEffect(() => {
        const hideSpotifySignOut = (e) => {
            if (
                signOutSpotify.current &&
                showSpotifySignOut == true &&
                e.target != signOutSpotify.current &&
                e.target != document.getElementById("spotifyOptions") &&
                !document.getElementById("spotifyOptions").contains(e.target)
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
       <div className="relative" id="spotifyOptions">
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
                    className="w-35 py-3 pl-5 pr-6 top-12 right-0 absolute rounded-xl outline-2 outline-neutral-200 flex justify-between items-center bg-white hover:bg-neutral-100 cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem("transfer-" + transferDirection);
                        signOut({ callbackUrl: '/' })
                    }}
                    ref={signOutSpotify}
                >
                    <CiLogout className="w-5 h-5" />
                    <p className="text-left">Sign Out</p>
                </button>
            }
        </div>
    )
}