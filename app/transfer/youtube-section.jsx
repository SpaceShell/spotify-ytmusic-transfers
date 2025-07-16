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
    let playlistTrackData = useRef({});
    let scrollSection = useRef()

    useEffect(() => {
        const playlistInfo = JSON.parse(sessionStorage.getItem("playlists"));

        if (playlistInfo) {
            setPlaylists(playlistInfo.items);
        }
    }, [])

    const viewTracks = async (playlistIndex, playlistName) => {
        scrollSection.current.scrollTo(0, 0);
        
        if (playlists[playlistIndex].id in playlistTrackData.current) {
            setSongs(playlistTrackData.current[playlists[playlistIndex].id]);
        } else {
            await fetch('/api/youtube', {
                method: "POST",
                body: JSON.stringify({ playlistId: playlists[playlistIndex].id, action: "retrieveTracks" }),
            }).then(async (response) => {
                const jsonTracks = await response.json();
                playlistTrackData.current[playlists[playlistIndex].id] = jsonTracks.items;
                setSongs(jsonTracks.items);
            });
        }
        setView(playlistName);
    }

    return (
        <section>
            <PlatformHeader
                allPlaylistText={"All YouTube Music Playlists:"}
                view={view} 
                setViewFunc={(view) => {setView(view)}}
                musicLayout={musicLayout} 
                setMusicLayoutFunc={(layout) => {setMusicLayout(layout)}} 
                setSongsFunc={(songs) => {setSongs(songs)}}
            ></PlatformHeader>
            {
            view == null ?
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 auto-rows-min gap-1"}`} ref={scrollSection}>
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
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 grid-cols-1 auto-rows-max gap-1 relative`}>
                     <div className="w-full h-min py-3 px-4 my-1 grid grid-cols-1 gap-1 font-bold sticky top-0 backdrop-blur-lg bg-neutral-600/5">
                            <div className="flex gap-5">
                                <p className="w-1/3 basis-1/3 text-sm">Track:</p>
                                <div className="w-15"></div>
                                <p className="basis-1/4 text-sm">Album:</p>
                                <p className="text-sm grow">Added:</p>
                                <p className="text-sm text-right">Length:</p>
                            </div>
                    </div>
                    {currentSongs.map((track, index) => (
                    <TrackBlock
                        key={index}
                        index={index}
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