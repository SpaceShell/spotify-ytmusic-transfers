"use client"

import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { LoginButton } from "./login-button"
import { PlaylistBlock } from './playlist-block'

export function Login() {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [likedTracks, setLikedTracks] = useState([])

  useEffect(() => {
    if (session) {
        console.log("sess", session)
        authOptions.callbacks.getProfile(session.accessToken).then((data) => {
          if (data.error && data.error.status == 401) {
            signOut()
          }
        })

        authOptions.callbacks.getPlaylists(session.accessToken).then((data) => {
          setPlaylists(data.items)
        })

        authOptions.callbacks.getLikedTracks(session.accessToken).then((data) => {
          setLikedTracks(data)
        })
    }
  }, [session])

  return (
    <div className="m-10">
      <h1 className="font-black">MusiTransfer</h1>
      <LoginButton clickFunc={session ? () => signOut() : () => signIn("spotify")} text={`${session ? "Sign Out" : "Sign in"}`}></LoginButton>

      <h2 className="font-bold text-2xl">All Spotify Playlists:</h2>
      <div className="gap-10 flex flex-wrap w-180">
        {session && 
        <PlaylistBlock 
          playlistImage={"/LikeImage.png"}
          playlistName={"Liked Songs"}
          playlistOwner={session.user.name}
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