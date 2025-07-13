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
    }, [])

    const viewTracks = async (playlistIndex, playlistName) => {
        await fetch('/api/youtube', {
            method: "POST",
            body: JSON.stringify({ playlistId: playlists[playlistIndex].id, action: "retrieveTracks" }),
        }).then(async (response) => {
            const jsonTracks = await response.json();
            setSongs(jsonTracks.items);
        });
        setView(playlistName);
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
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 auto-rows-min gap-1"}`}>
                    {playlists.map((playlist, index) => (
                    <PlaylistBlock
                        key={index}
                        playlistImage={playlist.snippet.thumbnails ? playlist.snippet.thumbnails.standard.url : "/EmptyPlaylist.png"}
                        playlistName={playlist.snippet.title}
                        playlistOwner={playlist.snippet.channelTitle}
                        playlistTrackCount={playlist.contentDetails.itemCount}
                        index={index}
                        view={musicLayout}
                        viewTracksFunc={viewTracks}
                        loadData={playlistLoadData.current}
                    ></PlaylistBlock>
                    ))}
                </div>
            :
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 grid-cols-1 auto-rows-max gap-1`}>
                    {currentSongs.map((track, index) => (
                    <TrackBlock
                        key={index}
                        albumImage={track.snippet.thumbnails.standard.url}
                        album={track.snippet.description.split("\n")[4]}
                        trackName={track.snippet.title}
                        artists={[track.snippet.videoOwnerChannelTitle.split("- Topic")[0]]}
                        date_added={track.snippet.publishedAt.substring(0, 10)}
                        duration={"---"}
                    ></TrackBlock>
                    ))}
                </div>
            }
        </section>
    )
}