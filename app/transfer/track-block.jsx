"use client"

import Image from 'next/image'
import { useState } from 'react';

export function TrackBlock({track}) {
    const albumImage = track.track.album.images ? track.track.album.images[0].url : "/Unavailable.png";
    const album = track.track.album.name;
    const trackName = track.track.name;
    const artists = [];
    const date_added = track.added_at.substring(0, 10);

    const minutes = (track.track.duration_ms / 60000 ).toFixed(0);
    let seconds = ((track.track.duration_ms / 1000) % 60).toFixed(0);
    if (seconds.length < 2) {
        seconds = "0" + seconds;
    };
    const duration = minutes + ":" + seconds;

    track.track.artists.forEach((artist) => {
        artists.push(artist.name);
    });

    const [clicked, setClicked] = useState(false);
    
    return (
        <>
            <div 
            className={`w-full h-min py-2 px-4 flex items-center transition shadow-md rounded-sm outline-neutral-500 outline-neutral-500 hover:bg-neutral-100 ${clicked ? "outline-3 bg-[#414141]/8" : ""}`}
            onClick={() => {setClicked(!clicked)}}
            >
                <div className='w-full flex gap-5 items-center'>
                    <Image src={albumImage} className='w-15 h-15' width={150} height={150} alt={"Album cover image"} priority={true} unoptimized></Image>
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
                        {duration}
                    </p>
                </div>
            </div>
        </>
    );
}