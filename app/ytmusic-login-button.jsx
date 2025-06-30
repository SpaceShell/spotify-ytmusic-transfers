"use client"

import Image from 'next/image'

export function YTMusicLoginButton() {
  return (
    <button type="button" className="w-50 h-20 px-6 py-3 bg-neutral-800 rounded-md font-bold text-white flex items-center cursor-pointer">
        <Image src="/YouTubeMusicLogo.png" className='w-14 h-14' width={150} height={150} alt="YouTube Music logo" priority={false}></Image>
        <span className='ml-5 font-bold leading-5 text-left'>Login to YouTube <span className='text-[#FF0000]'>Music</span></span>
    </button>
  );
}