"use client"

import Image from 'next/image'
import { getRelativeLuminance } from './color-formula';
import { useEffect, useState } from 'react';
import { CgSpinner } from "react-icons/cg";

export function PlaylistBlock({playlistImage, playlistName, playlistOwner, playlistTrackCount, imageAlt, index, view}) {
	const [mainColorBackground, setMainColorBackground] = useState("rgb(65, 65, 65)")
	const [playlistButtonClass, setPlaylistButtonClass] = useState("")
	const [clicked, setClicked] = useState(false)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const getImageColor = async () => {
			try {
				const response = await fetch("/api/color", {
					method: "POST",
					body: JSON.stringify({ image: playlistImage }),
				});

				const json = await response.json();

				const context = document.createElement("canvas").getContext("2d");
				let img = document.createElement("img")
				img.setAttribute('crossOrigin', ''); 
				img.src = json.image;
				img.onload = () => {
					let rgb = getMainColorFromCanvas(img);
					let relativeLuminance = getRelativeLuminance(rgb[0], rgb[1], rgb[2])

					if (relativeLuminance > 0.75) {
						setMainColorBackground(`rgb(${rgb[0] * 0.2},${rgb[1] * 0.2},${rgb[2] * 0.2})`);
					}

					setLoaded(true)
				}

				let getMainColorFromCanvas = (imageObject) => {
					context.drawImage(imageObject, 0, 0, 1, 1);
				
					const imageData = context.getImageData(0, 0, 1, 1).data;
					setMainColorBackground(`rgb(${imageData[0]},${imageData[1]},${imageData[2]})`);
					return imageData
				}
			} catch (error) {
				throw error
			}
		}

		if (playlistImage == "/LikeImage.png") {
			setMainColorBackground('rgb(126, 36, 36)')
			setLoaded(true)
		} else if (playlistImage == "/EmptyPlaylist.png") {
			setLoaded(true)
		} else {
			getImageColor()
		}
	}, [])

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
						<Image src={playlistImage} className='w-30 h-30' width={150} height={150} alt={imageAlt} priority={true} unoptimized></Image>
						<div className='w-30'>
							<p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-lg'>{playlistName}</p>
							<p className='mt-1 text-sm'>{playlistOwner}</p>
							<p className='text-sm'>{playlistTrackCount} {playlistTrackCount == 1 ? "song" : "songs"}</p>
							<button className={`${playlistButtonClass} mt-3 font-semibold border-3 rounded-lg py-1 px-3 text-sm cursor-pointer bg-transparent border-stone-800 text-stone-800 transition-colors`}>View Songs</button>
						</div>
					</div>
				:
					<div 
					className={`playlist${index} w-full py-2 px-4 flex justify-between items-center transition shadow-md rounded-sm outline-neutral-500 ${clicked ? `outline-3 playlist${index}Clicked` : ''}`}
					onMouseEnter={() => {setPlaylistButtonClass(`playlist${index}Button`)}}
					onMouseLeave={() => {setPlaylistButtonClass("")}}
					onClick={() => {setClicked(!clicked)}}
					>
						<div className='contents flex gap-5 items-center'>
							<Image src={playlistImage} className='w-15 h-15' width={150} height={150} alt={imageAlt} priority={true} unoptimized></Image>
							<div className='w-full'>
								<p className='font-bold whitespace-nowrap text-ellipsis overflow-hidden text-md'>{playlistName}</p>
								<p className='text-sm'>{playlistOwner}</p>
								<p className='text-sm'>{playlistTrackCount} {playlistTrackCount == 1 ? "song" : "songs"}</p>
							</div>
						</div>
						<button className={`${playlistButtonClass} font-semibold border-3 rounded-lg py-2 px-3 text-sm cursor-pointer bg-transparent border-stone-800 text-stone-800 transition-colors`}>View Songs</button>
					</div>
			: 
				view == "grid" ?
					<div className={`w-full py-6 px-6 border border-neutral-100 flex justify-center items-center transition shadow-md rounded-sm outline-neutral-400`}>
						<CgSpinner className='w-5 h-5 animate-spin'/>
						{/* Layout spacer for equal heights among playlist elements */}
						<div className='w-0 h-30 invisible' aria-hidden="true"></div>
					</div>
				:
					<div 
					className={`w-full py-2 px-4 flex justify-center items-center transition shadow-md rounded-sm outline-neutral-500`}>
						<div className='w-0 h-15 invisible' aria-hidden="true"></div>
						<CgSpinner className='w-5 h-5 animate-spin'/>
					</div>
			}
		</>
	);
}