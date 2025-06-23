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
    <div className="m-10">
      <h1 className="font-black">MusiTransfer</h1>
      <h2 className="font-bold text-2xl">All Spotify Playlists:</h2>
      <div className="gap-10 flex flex-wrap w-180">
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
            playlistImage={playlist.images[0].url}
            playlistName={playlist.name}
            playlistOwner={playlist.owner.display_name}
            playlistTrackCount={playlist.tracks.total}
            imageAlt={'Mosaic image of album art from four songs in the playlist'}
          ></PlaylistBlock>
        ))}
      </div>
    </div>
  );
}