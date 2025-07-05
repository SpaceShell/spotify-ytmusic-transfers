"use client"

import Image from 'next/image'

export function TrackBlock({track}) {
    const albumImage = track.track.album.images ? track.track.album.images[0].url : "/Unavailable.png";
    const album = track.track.album.name;
    const trackName = track.track.name;
    const artists = [];
    const date_added = track.added_at.substring(0, 10)
    const duration = (track.track.duration_ms / 60000 ).toFixed(0) + ":" + ((track.track.duration_ms / 1000) % 60).toFixed(0)

    track.track.artists.forEach((artist, index) => {
        artists.push(artist.name)
    })
    
    return (
        <>
            <div 
            className={`w-full h-min py-2 px-4 flex justify-between items-center transition shadow-md rounded-sm outline-neutral-500`}
            >
                <div className='w-full flex gap-5 items-center justify-between'>
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