"use client"

import { YouTubeTransfer } from "./youtube-section";
import { SpotifyTransfer } from "./spotify-section";

export function Transfer() {
  return (
    <div className="mt-5 mx-15">
        <div className="flex justify-around gap-10 mb-10">
            <SpotifyTransfer></SpotifyTransfer>
            <YouTubeTransfer></YouTubeTransfer>
        </div>
        <button className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block">Transfer</button>
    </div>
  );
}