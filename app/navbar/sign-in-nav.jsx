import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export function SignInNavbar({sessionSpotify, sessionYouTube, transferDirection}) {
    const [showSignIn, setShowSignIn] = useState(false);
    const signInNav = useRef(undefined);
    const router = useRouter();

    useEffect(() => {
        const showYouTubeSignIn = (e) => {
            if (e.target != signInNav.current && !signInNav.current.contains(e.target)) {
                setShowSignIn(false);
            }
        }

        document.addEventListener("mousedown", showYouTubeSignIn);
        return () => {
            document.removeEventListener('mousedown', showYouTubeSignIn);
        };
    }, [showSignIn])

    const YouTubeSignIn = async () => {
        await fetch('/api/youtube', {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json();
            router.push(json.url);
        });
    }

    const signInTransfer = async (signInMethod) => {
        localStorage.setItem("transfer-" + transferDirection, signInMethod);

        if (signInMethod == "Spotify") {
            signIn("spotify", { callbackUrl: '/transfer' });
        } else {
            YouTubeSignIn();
        }
    }

    return (
        <div className="relative" ref={signInNav}>
            <button
            className="w-10 h-10 bg-neutral-100 rounded-full text-3xl"
            onClick={() => {setShowSignIn(!showSignIn)}}
            >+</button>
            {
                showSignIn &&
                <div className="w-max h-min absolute right-0 top-12 rounded-xl outline-2 outline-neutral-200">  
                {    
                    (!sessionSpotify ||
                    (localStorage.getItem("transfer-from") != "Spotify" &&
                    localStorage.getItem("transfer-to") != "Spotify")) &&    
                    <button 
                    className="w-full py-3 pl-5 pr-6 flex gap-3 items-center bg-white hover:bg-neutral-100 cursor-pointer"
                    onClick={() => {signInTransfer("Spotify")}}
                    >
                        <Image src="/SpotifyLogo.svg" className='w-7 h-7' width={150} height={150} alt="Spotify logo" priority={false}></Image>
                        <p className="text-left">Spotify</p>
                    </button>
                }
                {
                    (!sessionYouTube ||
                    (localStorage.getItem("transfer-from") != "YouTube" &&
                    localStorage.getItem("transfer-to") != "YouTube")) &&
                    <button 
                    className="w-full py-3 pl-5 pr-5 flex gap-3 items-center bg-white hover:bg-neutral-100 cursor-pointer"
                    onClick={() => {signInTransfer("YouTube")}}
                    >
                        <Image src="/YouTubeMusicLogo.png" className='w-7 h-7' width={150} height={150} alt="YouTube Music logo" priority={false}></Image>
                        <p className="text-left">YouTube Music</p>
                    </button>
                }
                </div> 
            }
    </div>
    )
}