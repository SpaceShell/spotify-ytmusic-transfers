"use client"

import { useEffect, useRef, useState, useContext } from "react";
import { ItemsTransferContext } from "./transfer-contexts";
import { ToFromContext } from "./transfer-contexts";
import { PlatformHeader } from "./headers/header";
import { PlaylistBlock } from "./playlist-block";
import { TrackBlock } from "./track-block";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TrackSubHeader } from "./headers/subheader-track-details";


export function YouTubeTransfer() {
    const [playlists, setPlaylists] = useState([]);
    const [musicLayout, setMusicLayout] = useState("grid");
    const [view, setView] = useState(null);
    const [currentSongs, setSongs] = useState([]);
    const [createPlaylist, setCreatePlaylist] = useState(false)

    let playlistLoadData = useRef({});
    let playlistTrackData = useRef({});
    let scrollSection = useRef()

    const {toFromContext} = useContext(ToFromContext);
    const {transferContext, setTransferContext} = useContext(ItemsTransferContext)

    useEffect(() => {
        const checkSession = async () => {
            await fetch('/api/youtube', {
                method: "POST",
                body: JSON.stringify({ action: "checkSession" }),
            }).then(async (response) => {
                const session = await response.json()

                if (session.session == true) {
                    const playlistInfo = JSON.parse(localStorage.getItem("playlists"));

                    if (playlistInfo) {
                        setPlaylists(playlistInfo.items);
                    }
                } else {
                    localStorage.removeItem("playlists");
                    setPlaylists([]);
                }
            });
        }

        checkSession()
    }, [])

    useEffect(() => {
		if (transferContext.transfer != "playlists") {
			transferContext.items = [];
		}

        console.log(transferContext)
		
		if (createPlaylist == true) {
			setTransferContext({
                ...transferContext, 
                transfer: "playlists",
                items: [...transferContext.items],
                to: [...transferContext.to, ["create", addNewPlaylist, editTracksWithNewPlaylist]]
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

    const getTracks = async (playlistIndex) => {
		if (playlists[playlistIndex].id in (playlistTrackData.current)) {
			return playlistTrackData.current[playlists[playlistIndex].id];
		} else {
			const response = await fetch('/api/youtube', {
				method: "POST",
				body: JSON.stringify({ playlistId: playlists[playlistIndex].id, action: "retrieveTracks" }),
			});
            
            const jsonTracks = await response.json();
            playlistTrackData.current[playlists[playlistIndex].id] = jsonTracks.items;
            return jsonTracks.items;
		}
	}

    const addNewPlaylist = async (newPlaylist) => {
        const newPlaylists = playlists.slice()
        newPlaylists.push(newPlaylist)
        console.log("NEW PLAYLISt", newPlaylist, newPlaylists)
        setPlaylists(newPlaylists)
    }

    const editTracksWithNewPlaylist = async (_, playlistItem) => {
        const newPlaylistID = playlists[playlists.length - 1].id

        if (!(newPlaylistID in playlistTrackData.current)) {
            playlistTrackData.current[playlists[playlists.length - 1].id] = [playlistItem]
        } else {
		    playlistTrackData.current[playlists[playlists.length - 1].id].push(playlistItem);
        }

		if (toFromContext.to == "YouTube") {
            console.log("adding 1 to", playlists[playlists.length - 1], playlists)
			playlists[playlists.length - 1].contentDetails.itemCount += 1
		}
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
                    <div className={`w-172 h-130 grid overflow-y-auto px-4 py-3 auto-rows-min ${musicLayout == "grid" ? "grid-cols-2 gap-8" : "grid-cols-1 gap-1"}`} ref={scrollSection}>
                        {playlists.map((playlist, index) => (
                        <PlaylistBlock
                            index={index}
                            getTracksFunc={getTracks}
                            key={index}
                            platform={"YouTube"}
                            playlistImage={
                                playlist.snippet.thumbnails ? 
                                    playlist.snippet.thumbnails.standard ?
                                    playlist.snippet.thumbnails.standard.url 
                                    :
                                    playlist.snippet.thumbnails.high.url 
                                :
                                "/EmptyPlaylist.png"}
                            playlistName={playlist.snippet.title}
                            playlistOwner={playlist.snippet.channelTitle}
                            playlistTrackCount={playlist.contentDetails.itemCount}
                            playlistsData = {{
                                "playlists": playlists,
                                "tracks": playlistTrackData.current,
                                "load": playlistLoadData.current
                            }}
                            view={musicLayout}
                            viewTracksFunc={viewTracks}
                        ></PlaylistBlock>
                        ))}
                        {toFromContext.to == "YouTube" ?
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
                    <div className={`w-172 h-130 grid overflow-y-auto px-4 my-3 pb-2 grid-cols-1 auto-rows-max gap-1 relative`}>
                        <TrackSubHeader></TrackSubHeader>
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
                            viewOnly={toFromContext.to ? true : false}
                        ></TrackBlock>
                        ))}
                    </div>
            }
        </section>
    )
}