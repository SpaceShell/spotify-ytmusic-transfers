"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PlatformHeader } from "./header";
import { PlaylistBlock } from "./playlist-block";
import { TrackBlock } from "./track-block";


export function SpotifyTransfer() {
    const { data: sessionSpotify } = useSession({
        required: true,
        onUnauthenticated() {
            if (sessionStorage.getItem("playlists") == undefined) {
                router.push('/?authentication=false');
            }
        }
    });
    const [playlists, setPlaylists] = useState([]);
    const [likedPlaylist, setLikedPlaylist] = useState([]);
    const [musicLayout, setMusicLayout] = useState("grid");
    const [view, setView] = useState(null);
    const [currentSongs, setSongs] = useState([]);
    const router = useRouter();

    let playlistLoadData = useRef({});

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
            setSongs(likedPlaylist.items);
        } else {
            authOptions.callbacks.getPlaylistTracks(
                sessionSpotify.accessToken, playlists[playlistIndex].tracks.href
            ).then((data) => {
                setSongs(data.items);
            })
        }
        setView(playlistName);
    }

    return (
        <section>
            <PlatformHeader
                all_playlist_text={"All Spotify Playlists:"}
                view={view} 
                setViewFunc={(view) => {setView(view)}}
                musicLayout={musicLayout} 
                setMusicLayoutFunc={(layout) => {setMusicLayout(layout)}} 
                setSongsFunc={(songs) => {setSongs(songs)}}
            ></PlatformHeader>
            {
            view == null ?
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 auto-rows-min gap-1"}`}>
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
                <div className={`w-175 h-130 grid overflow-y-auto px-4 py-3 grid-cols-1 auto-rows-max gap-1`}>
                    {currentSongs.map((track, index) => (
                    <TrackBlock
                        key={index}
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