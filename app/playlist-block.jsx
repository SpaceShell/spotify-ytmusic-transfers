"use client"

import Image from 'next/image'

export function PlaylistBlock({playlistImage, playlistName, playlistOwner, playlistTrackCount, imageAlt}) {
  return (
    <div className='py-6 px-6 gap-5 shadow-md flex'>
        <Image src={playlistImage} className='w-30 h-30' width={150} height={150} alt={imageAlt} priority={false}></Image>
        <div className='w-30'>
            <p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-lg'>{playlistName}</p>
            <p className='mt-1 text-sm'>{playlistOwner}</p>
            <p className='text-sm'>{playlistTrackCount} {playlistTrackCount == 1 ? "song" : "songs"}</p>
            <button className='mt-3 font-semibold border-3 border-blue-950 rounded-lg py-1 px-3 text-blue-950 text-sm'>View Songs</button>
        </div>
    </div>
  );
}