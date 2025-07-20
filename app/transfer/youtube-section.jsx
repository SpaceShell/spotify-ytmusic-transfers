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
                    const playlistInfo = JSON.parse(sessionStorage.getItem("playlists"));

                    if (playlistInfo) {
                        setPlaylists(playlistInfo.items);
                    }
                } else {
                    sessionStorage.removeItem("playlists");
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
		
		if (createPlaylist == true) {
			setTransferContext({
                transfer: "playlists",
                items: [...transferContext.items],
                to: [...transferContext.to, "create"]
            });
		} else if (createPlaylist == false && transferContext.items != []) {
			setTransferContext({
                transfer: "playlists",
                items: [...transferContext.items],
                to: transferContext.to.filter((elem) => elem != "create")
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
                            key={index}
                            playlistImage={playlist.snippet.thumbnails ? playlist.snippet.thumbnails.standard.url : "/EmptyPlaylist.png"}
                            playlistName={playlist.snippet.title}
                            playlistOwner={playlist.snippet.channelTitle}
                            playlistTrackCount={playlist.contentDetails.itemCount}
                            index={index}
                            view={musicLayout}
                            viewTracksFunc={viewTracks}
                            loadData={playlistLoadData.current}
                            platform={"YouTube"}
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
                    <div className={`w-172 h-130 grid overflow-y-auto px-4 py-3 grid-cols-1 auto-rows-max gap-1 relative`}>
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