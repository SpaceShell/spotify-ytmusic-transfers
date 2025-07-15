"use client"

import { useState } from 'react';
import { YouTubeTransfer } from "./youtube-section";
import { SpotifyTransfer } from "./spotify-section";
import { ItemsTransferContext } from "./transfer-context";

export function Transfer() {
    const [transferContext, setTransferContext] = useState({transfer: undefined, items: []});

    const transferToOtherPlatform = () => {
        console.log(transferContext)
    }

    return (
        <div className="mt-5 mx-15">
            <div className="flex justify-around gap-10 mb-10">
                <ItemsTransferContext value={{transferContext, setTransferContext}}>
                    <SpotifyTransfer></SpotifyTransfer>
                    <YouTubeTransfer></YouTubeTransfer>
                </ItemsTransferContext>
            </div>
            <button className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block" onClick={transferToOtherPlatform}>Transfer</button>
        </div>
    );
}