"use client"

import Image from 'next/image'
import {signIn} from "next-auth/react"

export function SpotifyLoginButton() {
  return (
    <button type="button" className="px-6 py-3 bg-neutral-800 rounded-md font-bold text-white flex items-center w-50" onClick={() => signIn()}>
      <Image src="/SpotifyLogo.svg" className='w-14 h-14' width={150} height={150} alt="Spotify logo" priority={false}></Image>
      <span className='ml-5 font-bold leading-5 text-left'>Login to <span className='text-[#1ED760]'>Spotify</span></span>
    </button>
  );
}