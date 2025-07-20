"use client"

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { YouTubeTransfer } from "./youtube-section";
import { SpotifyTransfer } from "./spotify-section";
import { ToFromContext, ItemsTransferContext } from './transfer-contexts';
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { EmptyTransfer } from './empty-section';

export function Transfer() {
    const router = useRouter()
    const {} = useSession({
            required: true,
            onUnauthenticated() {
                if (sessionStorage.getItem("playlists") == undefined) {
                    router.push('/?authentication=false');
                }
            }
    });
    const {toFromContext} = useContext(ToFromContext);
    const {transferContext} = useContext(ItemsTransferContext)

    useEffect(() => {
        console.log(toFromContext)
    }, [toFromContext])

    const transferToOtherPlatform = () => {
        console.log("Transfer Context", transferContext);
    }

    return (
        <div className="mt-5 mx-10">
            <div className="flex justify-around gap-4 mb-10">
                {
                    toFromContext.from == "Spotify" ?
                        <SpotifyTransfer></SpotifyTransfer>
                    : (
                        toFromContext.from == "YouTube" ?
                            <YouTubeTransfer></YouTubeTransfer>
                        :
                            <EmptyTransfer></EmptyTransfer>
                    )
                }
                <PiArrowFatLinesRightFill className='w-13 h-13 self-center'/>
                {
                    toFromContext.to == "Spotify" ?
                        <SpotifyTransfer></SpotifyTransfer>
                    : (
                        toFromContext.to == "YouTube" ?
                            <YouTubeTransfer></YouTubeTransfer>
                        :
                            <EmptyTransfer></EmptyTransfer>
                    )
                }
            </div>
            <button className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block" onClick={transferToOtherPlatform}>Transfer</button>
        </div>
    );
}