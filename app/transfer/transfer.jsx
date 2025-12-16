"use client"

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { YouTubeTransfer } from "./youtube-section";
import { SpotifyTransfer } from "./spotify-section";
import { ToFromContext, ItemsTransferContext } from './transfer-contexts';
import { CreatePlaylistPopup } from './create-playlist-popup';
import { CgSpinner } from "react-icons/cg";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { EmptyTransfer } from './empty-section';

export function Transfer() {
    const router = useRouter()
    const {} = useSession({
            required: true,
            onUnauthenticated() {
                if (localStorage.getItem("playlists") == undefined || localStorage.getItem("playlists") == null) {
                    router.push('/?authentication=false');
                }
            }
    });
    const {toFromContext} = useContext(ToFromContext);
    const {transferContext} = useContext(ItemsTransferContext)
    const [transferProgress, setTransferProgess] = useState("")
    const [creatingPlaylist, setCreatingPlaylist] = useState(-1)

    const transferToOtherPlatform = async () => {
        if (transferContext.items.length == 0) {
            return
        }

        const createIndex = transferContext.to.findIndex(playlist => playlist[0] = 'create');
        console.log(createIndex, transferContext.to)
        if (createIndex != -1 && transferContext.to[createIndex].length != 4) {
            setCreatingPlaylist(createIndex)
            return
        }
        setCreatingPlaylist(-1)

        console.log("Transfer Context", transferContext);
        console.log("To From Context", toFromContext);
        setTransferProgess("Transferring, please wait...")

        for (let itemFrom of transferContext.items) {
            const indexFrom = itemFrom[0];
            const getTracksFuncFrom = itemFrom[1];
            const tracksListFrom = await getTracksFuncFrom(indexFrom);
            
            console.log(tracksListFrom, transferContext.to)

            if (toFromContext.to == "YouTube") {
                const updates = await fetch('/api/youtube', {
                    method: "POST",
                    body: JSON.stringify({action: "transferTracks", tracks: tracksListFrom, toPlaylists: transferContext.to}),
                })

                const reader = updates.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                let currentPlaylistTo;
                let currentToIndex = -1;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    let lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (line.trim()) {
                            let transferResponse = JSON.parse(line)
                            
                            console.log('Got video result:', transferResponse);
                            if (transferResponse.playlistIndex != undefined) {
                                currentPlaylistTo = transferResponse.playlistIndex
                                currentToIndex += 1
                            } else if (transferResponse.create == true) {
                                await transferContext.to[currentToIndex][1](transferResponse.newPlaylist)
                                transferContext.to[createIndex].pop()
                            } else if (transferResponse.kind == "youtube#playlistItem") {
                                await transferContext.to[currentToIndex][2](currentPlaylistTo[0], transferResponse)
                                setTransferProgess(`Transferred ${transferResponse.snippet.title} in playlist ${currentPlaylistTo[1].snippet.title}...`)
                            }
                        }
                    }
                }


            }
        }
        setTransferProgess("Transfer complete")
        setTimeout(() => {setTransferProgess("")}, 1500)
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
            <div className={`${transferProgress ? "flex justify-center align-center" : "hidden"}`}>
                <CgSpinner className='w-5 h-full animate-spin mr-3'/>
                <p className="font-md">{transferProgress}</p>
            </div>
            <button className={`${transferProgress ? "hidden" : "bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block"}`} onClick={transferToOtherPlatform}>Transfer</button>
            {
                creatingPlaylist != -1 && 
                <CreatePlaylistPopup 
                createIndex={creatingPlaylist}
                transferToOtherPlatform={transferToOtherPlatform}
                transferContext={transferContext}
                ></CreatePlaylistPopup>
            }
        </div>
    );
}