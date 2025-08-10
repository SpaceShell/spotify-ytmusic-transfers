"use client"

import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { CgSpinner } from "react-icons/cg";
import { getRelativeLuminance } from './color-formula';
import { ItemsTransferContext, ToFromContext } from "./transfer-contexts";

export function PlaylistBlock({
	playlistImage,
	playlistName,
	playlistOwner,
	playlistTrackCount,
	index,
	view,
	viewTracksFunc,
	loadData,
	playlistData,
	likedPlaylistData=undefined,
	getTracks,
	platform
}) {
	const [mainColorBackground, setMainColorBackground] = useState("rgb(65, 65, 65)");
	const [playlistButtonClass, setPlaylistButtonClass] = useState("");
	const [clicked, setClicked] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const {transferContext, setTransferContext} = useContext(ItemsTransferContext)
	const {toFromContext} = useContext(ToFromContext);

	useEffect(() => {
		const getImageColor = async () => {
			try {
				const response = await fetch("/api/color", {
					method: "POST",
					body: JSON.stringify({ image: playlistImage }),
				});

				const json = await response.json();

				const context = document.createElement("canvas").getContext("2d");
				let img = document.createElement("img");
				img.setAttribute('crossOrigin', ''); 
				img.src = json.image;
				img.onload = () => {
					let rgb = getMainColorFromCanvas(img);
					let relativeLuminance = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);

					if (relativeLuminance > 0.75) {
						let lighterBackground = `rgb(${rgb[0] * 0.2},${rgb[1] * 0.2},${rgb[2] * 0.2})`;
						setMainColorBackground(lighterBackground);
						loadData[index] = lighterBackground;
					} else {
						let background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
						setMainColorBackground(background);
						loadData[index] = background;
					}
					setLoaded(true);
				}

				let getMainColorFromCanvas = (imageObject) => {
					context.drawImage(imageObject, 0, 0, 1, 1);
				
					const imageData = context.getImageData(0, 0, 1, 1).data;
					return imageData;
				}
			} catch (error) {
				throw error;
			}
		}

		if (index in loadData) {
			setMainColorBackground(loadData[index]);
			setLoaded(true);
		} else {
			if (playlistImage == "/LikeImage.png") {
				setMainColorBackground('rgb(126, 36, 36)');
				setLoaded(true);
			} else if (playlistImage !== "/EmptyPlaylist.png") {
				getImageColor();
			} else {
				setLoaded(true);
			}
		}
	}, [])

	useEffect(() => {
		if (transferContext.transfer != "playlists") {
			transferContext.items = [];
		}
		
		if (toFromContext.from == platform) {
			if (clicked == true) {
				setTransferContext({
					...transferContext, 
					transfer: "playlists",
					items: [...transferContext.items, [index, getTracks]],
					to: [...transferContext.to]
				});
			} else if (clicked == false && transferContext.items != []) {
				setTransferContext({
					...transferContext, 
					transfer: "playlists",
					items: transferContext.items.filter((elem) => elem[0] != index),
					to: [...transferContext.to]
				});
			}
		} else {
			if (clicked == true) {
				setTransferContext({
					...transferContext, 
					transfer: transferContext.transfer,
					items: [...transferContext.items],
					to: [...transferContext.to, [index, index == "Like" ? likedPlaylistData : playlistData[index]]]
				});
			} else if (clicked == false && transferContext.items != []) {
				setTransferContext({
					...transferContext, 
					transfer: transferContext.transfer,
					items: [...transferContext.items],
					to: transferContext.to.filter((elem) => elem[0] != index)
				});
			}
		}
	}, [clicked])

	return (
		<>
			<style>
				{`
					.playlist${index}:hover {
						background-color: rgb(from ${mainColorBackground} r g b / 0.04);
					}
					.playlist${index}Clicked:hover {
						outline-color: rgb(from ${mainColorBackground} r g b / 0.8);
						z-index: 1;
					}
					.playlist${index}Clicked {
						background-color: rgba(65, 65, 65, 0.07);
					}
					.playlist${index}Button {
						color: ${mainColorBackground};
						border-color: ${mainColorBackground};
					}
					.playlist${index}Button:hover {
						background-color: ${mainColorBackground};
						color: white;
					}
				`}
			</style>

			{
			loaded ? 
				view == "grid" ?
					<div 
					className={`playlist${index} h-max min-w-40 py-6 px-6 gap-5 flex transition shadow-md rounded-sm outline-neutral-500 ${clicked ? `outline-4 playlist${index}Clicked` : ''}`}
					onMouseEnter={() => {setPlaylistButtonClass(`playlist${index}Button`)}}
					onMouseLeave={() => {setPlaylistButtonClass("")}}
					onClick={() => {setClicked(!clicked)}}
					>
						<Image src={playlistImage} className='w-30 h-30 object-cover' width={150} height={150} alt={'Image of album art in a playlist'} priority={true} unoptimized></Image>
						<div className='w-30'>
							<p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-lg'>{playlistName}</p>
							<p className='mt-1 text-sm'>{playlistOwner}</p>
							<p className='text-sm'>{playlistTrackCount} {playlistTrackCount == 1 ? "song" : "songs"}</p>
							<button 
							className={`${playlistButtonClass} mt-3 font-semibold border-3 rounded-lg py-1 px-3 text-sm cursor-pointer bg-transparent border-stone-800 text-stone-800 transition-colors`}
							onClick={(e) => {
								e.stopPropagation()
								viewTracksFunc(index, playlistName)
							}}
							>View Songs</button>
						</div>
					</div>
				:
					<div 
					className={`playlist${index} w-full h-min py-2 px-4 flex justify-between items-center transition shadow-md rounded-sm outline-neutral-500 ${clicked ? `outline-3 playlist${index}Clicked` : ''}`}
					onMouseEnter={() => {setPlaylistButtonClass(`playlist${index}Button`)}}
					onMouseLeave={() => {setPlaylistButtonClass("")}}
					onClick={() => {setClicked(!clicked)}}
					>
						<div className='contents flex gap-5 items-center'>
							<Image src={playlistImage} className='w-15 h-15 object-cover' width={150} height={150} alt={'Image of album art in a playlist'} priority={true} unoptimized></Image>

							<div className='w-full'>
								<p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-md'>{playlistName}</p>
								<p className='text-sm'>{playlistOwner}</p>
								<p className='text-sm'>{playlistTrackCount} {playlistTrackCount == 1 ? "song" : "songs"}</p>
							</div>
						</div>
						<button 
						className={`${playlistButtonClass} font-semibold border-3 rounded-lg py-2 px-3 text-sm cursor-pointer bg-transparent border-stone-800 text-stone-800 transition-colors`}
						onClick={(e) => {
							e.stopPropagation()
							viewTracksFunc(index, playlistName)
						}}
						>View Songs</button>
					</div>
			: 
				view == "grid" ?
					<div className={`w-full h-min py-6 px-6 border border-neutral-100 flex justify-center items-center transition shadow-md rounded-sm outline-neutral-400`}>
						<CgSpinner className='w-5 h-5 animate-spin'/>
						{/* Layout spacer for equal heights among playlist elements */}
						<div className='w-0 h-30 invisible' aria-hidden="true"></div>
					</div>
				:
					<div 
					className={`w-full h-min py-2 px-4 flex justify-center items-center transition shadow-md rounded-sm outline-neutral-500`}>
						<div className='w-0 h-15 invisible' aria-hidden="true"></div>
						{/* Layout spacer for equal heights among playlist elements */}
						<CgSpinner className='w-5 h-5 animate-spin'/>
					</div>
			}
		</>
	);
}