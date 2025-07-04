"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { LuRows3 } from "react-icons/lu";
import { MdOutlineGridView } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PlaylistBlock } from './playlist-block';
import { TrackBlock } from "./track-block"

export function Transfer() {
  const { data: sessionSpotify } = useSession({
    required: true,
    onUnauthenticated() {
        router.push('/');
    }
  });
  const [playlists, setPlaylists] = useState([]);
  const [likedPlaylist, setLikedPlaylist] = useState([]);
  const [musicLayout, setMusicLayout] = useState("grid");
  const [view, setView] = useState(false)
  const [currentSongs, setSongs] = useState([])
  const router = useRouter();

  let playlistLoadData = useRef({})

  useEffect(() => {
    if (sessionSpotify) {
        authOptions.callbacks.getProfile(sessionSpotify.accessToken).then((data) => {
            if (data.error && data.error.status == 401) {
                signOut();
                router.push('/');
            }
        });
        authOptions.callbacks.getPlaylists(sessionSpotify.accessToken).then((data) => {
            setPlaylists(data.items);
        });

        authOptions.callbacks.getLikedPlaylist(sessionSpotify.accessToken).then((data) => {
            setLikedPlaylist(data);
        });
    }
  }, [sessionSpotify]);

  const viewTracks = (playlistIndex, playlistName) => {
        if (playlistIndex == "Like") {
            setSongs(likedPlaylist.items)
        } else {
            authOptions.callbacks.getPlaylistTracks(
                sessionSpotify.accessToken, playlists[playlistIndex].tracks.href
            ).then((data) => {
                setSongs(data.items)
                console.log(data)
            })
        }
        setView(playlistName)
  }


  return (
    <div className="mt-5 mx-15">
        <div className="flex justify-around gap-10 mb-10">
            <section>
                <div className="flex justify-between">
                    <h2 className="font-bold text-3xl font-inter mb-7 text-ellipsis overflow-hidden">
                        {view == false ? "All Spotify Playlists:" : view}
                    </h2>
                    {
                    view == false ?
                        musicLayout == "grid" ?
                            <LuRows3 className="w-9 h-9 cursor-pointer" onClick={() => {setMusicLayout("row")}}/>
                        :
                            <MdOutlineGridView className="w-9 h-9 cursor-pointer" onClick={() => {setMusicLayout("grid")}}/>
                    :
                        <IoMdArrowRoundBack className="w-9 h-9 cursor-pointer" onClick={() => {
                            setSongs([])
                            setView(false)
                        }}></IoMdArrowRoundBack>
                    }
                </div>
                {
                view == false ?
                    <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 gap-1"}`}>
                        {sessionSpotify && 
                        <PlaylistBlock 
                            playlistImage={"/LikeImage.png"}
                            playlistName={"Liked Songs"}
                            playlistOwner={sessionSpotify.user.name}
                            playlistTrackCount={likedPlaylist.total}
                            index={"Like"}
                            view={musicLayout}
                            viewTracksFunc={viewTracks}
                            loadData={playlistLoadData.current}
                        ></PlaylistBlock>}
                        {playlists.map((playlist, index) => (
                        <PlaylistBlock
                            key={index}
                            playlistImage={playlist.images ? playlist.images[0].url : "/EmptyPlaylist.png"}
                            playlistName={playlist.name}
                            playlistOwner={playlist.owner.display_name}
                            playlistTrackCount={playlist.tracks.total}
                            index={index}
                            view={musicLayout}
                            viewTracksFunc={viewTracks}
                            loadData = {playlistLoadData.current}
                        ></PlaylistBlock>
                        ))}
                    </div>
                :
                    <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 grid-cols-1 gap-1`}>
                        {currentSongs.map((track, index) => (
                        <TrackBlock
                            key={index}
                            track={track}
                        ></TrackBlock>
                        ))}
                    </div>
                }
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