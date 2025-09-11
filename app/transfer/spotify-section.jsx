"use client"

import { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PlatformHeader } from "./headers/header";
import { TrackSubHeader } from "./headers/subheader-track-details";
import { PlaylistBlock } from "./playlist-block";
import { TrackBlock } from "./track-block";
import { ItemsTransferContext } from "./transfer-contexts";
import { ToFromContext } from "./transfer-contexts";
import { IoIosAddCircleOutline } from "react-icons/io";


export function SpotifyTransfer() {
    const { data: sessionSpotify } = useSession();

    const [playlists, setPlaylists] = useState([]);
    const [likedPlaylist, setLikedPlaylist] = useState([]);
    const [musicLayout, setMusicLayout] = useState("grid");
    const [view, setView] = useState(null);
    const [currentSongs, setSongs] = useState([]);
    const [createPlaylist, setCreatePlaylist] = useState(false)

    const router = useRouter();

    let playlistLoadData = useRef({});
    let playlistTrackData = useRef({});
    let scrollSection = useRef()

    const {toFromContext} = useContext(ToFromContext);
    const {transferContext, setTransferContext} = useContext(ItemsTransferContext)

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

    useEffect(() => {
		if (transferContext.transfer != "playlists") {
			transferContext.items = [];
		}
		
		if (createPlaylist == true) {
			setTransferContext({
                ...transferContext,  
                transfer: "playlists",
                items: [...transferContext.items],
                to: [...transferContext.to, ["create", getTracks]]
            });
		} else if (createPlaylist == false && transferContext.items != []) {
			setTransferContext({
                ...transferContext, 
                transfer: "playlists",
                items: [...transferContext.items],
                to: transferContext.to.filter((elem) => elem[0] != "create")
            });
		}
	}, [createPlaylist])

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

    const getTracks = async (playlistIndex) => {
        if (playlistIndex == "Like") {
            return likedPlaylist.items
        } else if (playlists[playlistIndex].id in playlistTrackData.current) {
			return playlistTrackData.current[playlists[playlistIndex].id];
		} else {
			const data = await authOptions.callbacks.getPlaylistTracks(
                sessionSpotify.accessToken, playlists[playlistIndex].tracks.href
            )
            playlistTrackData.current[playlists[playlistIndex].id] = data.items;
            return data.items;
		}
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
                <div className={`w-172 h-130 grid overflow-y-auto px-4 py-3 auto-rows-min ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 gap-1"}`} ref={scrollSection}>
                    {sessionSpotify && 
                    <PlaylistBlock 
                        index={"Like"}
                        getTracksFunc={getTracks}
                        likedPlaylistData={likedPlaylist}
                        platform={"Spotify"}
                        playlistImage={"/LikeImage.png"}
                        playlistName={"Liked Songs"}
                        playlistOwner={sessionSpotify.user.name}
                        playlistTrackCount={likedPlaylist.total}
                        playlistsData = {{
                            "playlists": playlists,
                            "tracks": playlistTrackData.current,
                            "load": playlistLoadData.current
                        }}
                        view={musicLayout}
                        viewTracksFunc={viewTracks}
                    ></PlaylistBlock>}
                    {playlists.map((playlist, index) => (
                    <PlaylistBlock
                        key={index}
                        index={index}
                        getTracksFunc={getTracks}
                        likedPlaylistData={likedPlaylist}
                        platform={"Spotify"}
                        playlistImage={playlist.images ? playlist.images[0].url : "/EmptyPlaylist.png"}
                        playlistName={playlist.name}
                        playlistOwner={playlist.owner.display_name}
                        playlistTrackCount={playlist.tracks.total}
                        playlistsData = {{
                            "playlists": playlists,
                            "tracks": playlistTrackData.current,
                            "load": playlistLoadData.current
                        }}
                        view={musicLayout}
                        viewTracksFunc={viewTracks}
                    ></PlaylistBlock>
                    ))}
                    {toFromContext.to == "Spotify" ?
                        musicLayout == "grid" ?
                            <div 
                            className={`h-max min-w-40 py-6 px-6 flex items-center justify-center transition shadow-md rounded-sm outline-neutral-500 hover:bg-[#656565]/[0.04] hover:outline-[#656565] ${createPlaylist ? `outline-4 bg-[#656565]/[0.07]` : ''}`}
                            onClick={() => {setCreatePlaylist(!createPlaylist)}}
                            >
                                {/* Layout spacer for equal heights among playlist elements */}
                                <div className="w-0 h-30" aria-hidden="true"></div>
                                <IoIosAddCircleOutline className="w-8 h-8 mr-2"></IoIosAddCircleOutline>
                                <p className="font-bold text-lg">Transfer to New Playlist</p>
                            </div>
                        :
                            <div 
                            className={`w-full h-max py-2 px-4 flex items-center transition shadow-md rounded-sm outline-neutral-500 hover:bg-[#656565]/[0.04] hover:outline-[#656565] ${createPlaylist ? `outline-3 bg-[#656565]/[0.07]` : ''}`}
                            onClick={() => {setCreatePlaylist(!createPlaylist)}}
                            >
                                    <div className="w-0 h-15" aria-hidden="true"></div>
                                    <IoIosAddCircleOutline className="w-8 h-8 mr-2"></IoIosAddCircleOutline>
                                    <p className="font-bold text-lg">Transfer to New Playlist</p>
                            </div>
                    :
                        <></>
                    }
                </div>
            :
                <div className={`w-172 h-130 grid overflow-y-auto pb-2 px-4 my-3 grid-cols-1 auto-rows-max gap-1 relative`}>
                    <TrackSubHeader></TrackSubHeader>
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
                        viewOnly={toFromContext.to ? true : false}
                    ></TrackBlock>
                    ))}
                </div>
            }
        </section>
    )
}