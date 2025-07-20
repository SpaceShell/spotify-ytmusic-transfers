"use client"

import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import { ItemsTransferContext } from "./transfer-contexts";

export function TrackBlock({
    index,
    albumImage,
    album,
    trackName,
    artists,
    date_added,
    duration,
    viewOnly=false
}) {
    let timeDuration = "---";

    if (duration != "---") {
        if (duration.seconds.length < 2) {
            duration.seconds = "0" + duration.seconds;
        };
        timeDuration = duration.minutes + ":" + duration.seconds;
    }

    const [clicked, setClicked] = useState(false);
    const {transferContext, setTransferContext} = useContext(ItemsTransferContext);

    useEffect(() => {
        if (!viewOnly == true) {
            if (transferContext.transfer != "tracks") {
                transferContext.items = [];
            }
            
            if (clicked == true) {
                setTransferContext({
                    transfer: "tracks",
                    items: [...transferContext.items, index],
                    to: [...transferContext.to]
                });
            } else if (clicked == false && transferContext.items != []) {
                setTransferContext({
                    transfer: "tracks",
                    items: transferContext.items.filter((elem) => elem != index),
                    to: [...transferContext.to]
                });
            }
        }
    }, [clicked])
    
    return (
        <>
            <div 
            className={`w-full h-min py-2 px-4 flex items-center transition shadow-md rounded-sm outline-neutral-500 outline-neutral-500 hover:bg-neutral-100 ${clicked && !viewOnly ? "outline-3 bg-[#414141]/8" : ""}`}
            onClick={() => {setClicked(!clicked)}}
            >
                <div className='w-full flex gap-5 items-center'>
                    <Image src={albumImage} className='w-15 h-15 object-cover' width={150} height={150} alt={"Album cover image"} priority={true} unoptimized></Image>
                    <div className='w-1/3 basis-1/3'>
                        <p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-md'>{trackName}</p>
                        <p className='whitespace-nowrap text-ellipsis overflow-hidden text-sm'>{artists.join(", ")}</p>
                    </div>

                    <p className='text-sm text-ellipsis overflow-hidden basis-1/4'>
                        {album}
                    </p>
                    <p className='text-sm whitespace-nowrap'>
                        {date_added}
                    </p>
                    <p className='text-sm whitespace-nowrap text-right grow'>
                        {timeDuration}
                    </p>
                </div>
            </div>
        </>
    );
}