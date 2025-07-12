"use client"

import Image from 'next/image'
import { useRouter } from "next/navigation";

export function YTMusicLoginButton() {
    const router = useRouter();

    const YouTubeSignIn = async () => {
        await fetch('/api/youtube?retrieve=playlists', {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json()
            router.push(json.url);
        });
    }

    return (
        <button type="button" className="w-50 h-20 px-6 py-3 bg-neutral-800 rounded-md font-bold text-white flex items-center cursor-pointer" onClick={YouTubeSignIn}>
            <Image src="/YouTubeMusicLogo.png" className='w-14 h-14' width={150} height={150} alt="YouTube Music logo" priority={false}></Image>
            <span className='ml-5 font-bold leading-5 text-left'>Login to YouTube <span className='text-[#FF0000]'>Music</span></span>
        </button>
    );
}