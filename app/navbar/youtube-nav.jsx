import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CiLogout } from "react-icons/ci";

export function YoutubeOptionsNavbar({setSessionYouTube, transferDirection}) {
    const [showYouTubeSignOut, setShowYouTubeSignOut] = useState(false);
    const signOutYouTube = useRef(undefined);
    const router = useRouter();

    const signOutOfYouTube = async () => {
        try {
            await fetch('/api/youtube', {
                method: "POST",
                body: JSON.stringify({ action: "signOut" }),
            }).then(async (res) => {
                setSessionYouTube(false);
                router.push("/");
            });
        } catch {
            setSessionYouTube(false);
            localStorage.removeItem("transfer-" + transferDirection);
            router.push("/");
        }
    }

    useEffect(() => {
        const hideYouTubeSignOut = (e) => {
            if (
                signOutYouTube.current &&
                showYouTubeSignOut == true &&
                e.target != signOutYouTube.current &&
                e.target != document.getElementById("youtubeMusicOptions") &&
                !document.getElementById("youtubeMusicOptions").contains(e.target)
            ) {
                setShowYouTubeSignOut(false);
            }
        }

        document.addEventListener("mousedown", hideYouTubeSignOut)
        return () => {
            document.removeEventListener('mousedown', hideYouTubeSignOut);
        };
    }, [showYouTubeSignOut])

    return (
        <div className="relative" id="youtubeMusicOptions">
            <Image
                src="/YouTubeMusicLogo.png"
                className='w-9 h-9 mx-0.5 cursor-pointer'
                width={150} height={150}
                alt="YouTube Music logo"
                priority={true}
                onClick={() => {setShowYouTubeSignOut(!showYouTubeSignOut)}}
            ></Image>
            {
                showYouTubeSignOut &&
                <button 
                    className="w-35 py-3 pl-5 pr-6 top-12 right-0 absolute rounded-xl outline-2 outline-neutral-200 flex justify-between items-center bg-white hover:bg-neutral-100 cursor-pointer"
                    onClick={signOutOfYouTube}
                    ref={signOutYouTube}
                >
                    <CiLogout className="w-5 h-5" />
                    <p className="text-left">Sign Out</p>
                </button>
            }
        </div>
    )
}