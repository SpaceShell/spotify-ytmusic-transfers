"use client"

import { useEffect, useRef, useState } from "react";
import { PlatformHeader } from "./header";
import { PlaylistBlock } from "./playlist-block";
import { TrackBlock } from "./track-block";

export function YouTubeTransfer() {
    const [playlists, setPlaylists] = useState([]);
    const [musicLayout, setMusicLayout] = useState("grid");
    const [view, setView] = useState(null);
    const [currentSongs, setSongs] = useState([]);
    let playlistLoadData = useRef({});

    useEffect(() => {
        const playlistInfo = JSON.parse(sessionStorage.getItem("playlists"));
        setPlaylists(playlistInfo.items);
    
        console.log(playlistInfo)
    }, [])

    const viewTracks = async (playlistIndex, playlistName) => {
        //In progress
    }

    return (
        <section>
            <PlatformHeader
                all_playlist_text={"All YouTube Music Playlists:"}
                view={view} 
                setViewFunc={(view) => {setView(view)}}
                musicLayout={musicLayout} 
                setMusicLayoutFunc={(layout) => {setMusicLayout(layout)}} 
                setSongsFunc={(songs) => {setSongs(songs)}}
            ></PlatformHeader>
            {
            view == null ?
                <div className={`w-175 h-130 grid gap-10 overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 gap-1"}`}>
                    {playlists.map((playlist, index) => (
                    <PlaylistBlock
                        key={index}
                        playlistImage={playlist.snippet.thumbnails ? playlist.snippet.thumbnails.default.url : "/EmptyPlaylist.png"}
                        playlistName={playlist.snippet.title}
                        playlistOwner={playlist.snippet.channelTitle}
                        playlistTrackCount={playlist.contentDetails.itemCount}
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
    )
}