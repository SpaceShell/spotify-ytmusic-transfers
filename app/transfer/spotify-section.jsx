"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PlatformHeader } from "./header";
import { PlaylistBlock } from "./playlist-block";
import { TrackBlock } from "./track-block";

export function SpotifyTransfer() {
    const { data: sessionSpotify } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [likedPlaylist, setLikedPlaylist] = useState([]);
    const [musicLayout, setMusicLayout] = useState("grid");
    const [view, setView] = useState(null);
    const [currentSongs, setSongs] = useState([]);
    const router = useRouter();

    let playlistLoadData = useRef({});
    let playlistTrackData = useRef({});
    let scrollSection = useRef()

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
    } else {
        fetch("/api/auth/session");
    }
    }, [sessionSpotify]);

    const viewTracks = (playlistIndex, playlistName) => {
        scrollSection.current.scrollTo(0, 0);

        if (playlistIndex == "Like") {
            setSongs(likedPlaylist.items);
        } else {
            if (playlists[playlistIndex].id in playlistTrackData.current) {
                setSongs(playlistTrackData.current[playlists[playlistIndex].id]);
            } else {
                authOptions.callbacks.getPlaylistTracks(
                    sessionSpotify.accessToken, playlists[playlistIndex].tracks.href
                ).then((data) => {
                    playlistTrackData.current[playlists[playlistIndex].id] = data.items;
                    setSongs(data.items);
                })
            }
        }
        setView(playlistName);
    }

    return (
        <section>
            <PlatformHeader
                allPlaylistText={"All Spotify Playlists:"}
                view={view} 
                setViewFunc={(view) => {setView(view)}}
                musicLayout={musicLayout} 
                setMusicLayoutFunc={(layout) => {setMusicLayout(layout)}} 
                setSongsFunc={(songs) => {setSongs(songs)}}
            ></PlatformHeader>
            {
            view == null ?
                <div className={`w-172 h-130 grid overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 auto-rows-min gap-1"}`} ref={scrollSection}>
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
                <div className={`w-172 h-130 grid overflow-y-auto pb-2 px-4 my-3 grid-cols-1 auto-rows-max gap-1 relative`}>
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
                        albumImage={track.track.album.images ? track.track.album.images[0].url : "/Unavailable.png"}
                        album={track.track.album.name}
                        trackName={track.track.name}
                        artists={
                            track.track.artists.map((artist) => {
                                return artist.name
                            })
                        }
                        date_added={track.added_at.substring(0, 10)}
                        duration={
                            {
                                minutes: (track.track.duration_ms / 60000 ).toFixed(0),
                                seconds: ((track.track.duration_ms / 1000) % 60).toFixed(0)
                            }
                        }
                    ></TrackBlock>
                    ))}
                </div>
            }
        </section>
    )
}