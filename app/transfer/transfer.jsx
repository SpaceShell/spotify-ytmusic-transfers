"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { PlaylistBlock } from './playlist-block'

export function Transfer() {
  const { data: sessionSpotify } = useSession({
    required: true,
    onUnauthenticated() {
        router.push('/')
    }
  })
  const [playlists, setPlaylists] = useState([])
  const [likedTracks, setLikedTracks] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (sessionSpotify) {
        authOptions.callbacks.getProfile(sessionSpotify.accessToken).then((data) => {
            if (data.error && data.error.status == 401) {
                signOut()
                router.push('/')
            }
        })

        authOptions.callbacks.getPlaylists(sessionSpotify.accessToken).then((data) => {
            setPlaylists(data.items)
        })

        authOptions.callbacks.getLikedTracks(sessionSpotify.accessToken).then((data) => {
            setLikedTracks(data)
        })
    }
  }, [sessionSpotify])

  return (
    <div className="mt-5 mx-15">
        <div className="flex justify-around gap-10 mb-10">
            <section>
                <h2 className="font-bold text-3xl font-inter mb-7">All Spotify Playlists:</h2>
                <div className="w-175 h-130 gap-8 grid grid-cols-2 overflow-y-auto px-4 py-3">
                    {sessionSpotify && 
                    <PlaylistBlock 
                    playlistImage={"/LikeImage.png"}
                    playlistName={"Liked Songs"}
                    playlistOwner={sessionSpotify.user.name}
                    playlistTrackCount={likedTracks.total}
                    imageAlt={'Heart'}
                    ></PlaylistBlock>}
                    {playlists.map((playlist, index) => (
                    <PlaylistBlock
                        key={index}
                        playlistImage={playlist.images ? playlist.images[0].url : "/EmptyPlaylist.png"}
                        playlistName={playlist.name}
                        playlistOwner={playlist.owner.display_name}
                        playlistTrackCount={playlist.tracks.total}
                        imageAlt={'Image of album art in a playlist'}
                        index={index}
                    ></PlaylistBlock>
                    ))}
                </div>
            </section>
            <section>
                <h2 className="font-bold text-3xl font-inter mb-7">All YouTube Music Playlists:</h2>
                <div className="gap-10 flex flex-wrap w-180 h-130 overflow-y-auto"></div>
            </section>
        </div>
        <button className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block">Transfer</button>
    </div>
  );
}