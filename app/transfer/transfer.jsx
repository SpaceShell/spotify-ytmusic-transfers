"use client"

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { YouTubeTransfer } from "./youtube-section";
import { SpotifyTransfer } from "./spotify-section";
import { ItemsTransferContext } from "./transfer-contexts";
import { ToFromContext } from './transfer-contexts';
import { PiArrowFatLinesRightFill } from "react-icons/pi";

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

    const [transferContext, setTransferContext] = useState({transfer: undefined, items: []});
     const {toFromContext, setToFromContext} = useContext(ToFromContext);

    const transferToOtherPlatform = () => {
        console.log("Transfer Context", transferContext);
    }

    return (
        <div className="mt-5 mx-10">
            <div className="flex justify-around gap-4 mb-10">
                <ItemsTransferContext value={{transferContext, setTransferContext}}>
                    {
                        toFromContext.from == "Spotify" ?
                            <SpotifyTransfer></SpotifyTransfer>
                        :
                            <YouTubeTransfer></YouTubeTransfer>
                    }
                    <PiArrowFatLinesRightFill className='w-13 h-13 self-center'/>
                    {
                        toFromContext.to == "Spotify" ?
                            <SpotifyTransfer></SpotifyTransfer>
                        :
                            <YouTubeTransfer></YouTubeTransfer>
                    }
                </ItemsTransferContext>
            </div>
            <button className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block" onClick={transferToOtherPlatform}>Transfer</button>
        </div>
    );
}