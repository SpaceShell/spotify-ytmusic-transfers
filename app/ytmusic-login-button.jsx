"use client"

import Image from 'next/image'
import { useRouter } from "next/navigation";

export function YTMusicLoginButton() {
    const router = useRouter();

    const youtubeSignIn = async () => {
        await fetch('/api/youtube', {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json()
            if (
                localStorage.getItem("transfer-to") != "YouTube"
                && localStorage.getItem("transfer-from") == null
            ) {
                localStorage.setItem("transfer-from", "YouTube")
            } else if (
                localStorage.getItem("transfer-from") != "YouTube"
                && localStorage.getItem("transfer-to") == null
            ) {
                localStorage.setItem("transfer-to", "YouTube")
            }
            router.push(json.url);
        });
    }

    return (
        <button type="button" className="loginButton" onClick={youtubeSignIn}>
            <Image src="/YouTubeMusicLogo.png" className='w-14 h-14' width={150} height={150} alt="YouTube Music logo" priority={false}></Image>
            <span className='ml-5 font-bold leading-5 text-left text-xl'>YouTube <span className='text-[#FF0000]'>Music</span></span>
        </button>
    );
}