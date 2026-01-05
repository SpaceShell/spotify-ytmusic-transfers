"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react"
import { Navbar } from "./navbar";
import Error from "./error-message";
import { SpotifyLoginButton } from "./spotify-login-button";
import { YTMusicLoginButton } from "./ytmusic-login-button";
import { ToFromContext } from "./transfer/transfer-contexts";
import { TransferStep } from "./transfer-step";

export default function Home() {
	const [query, setQuery] = useState(new Set([]));
	const [toFromContext, setToFromContext] = useState({from: undefined, to: undefined});
	  
	useEffect(() => {
		const url = new URL(window.location.href);
    	const params = new URLSearchParams(url.search);

		setQuery(params)
	}, [])

	return (
		<SessionProvider>
			{
				query.has("authentication") && 
				<Error error={"authentication"}></Error>
			}
			<ToFromContext value={{toFromContext, setToFromContext}}>
				<Navbar isHome={true}></Navbar>
			</ToFromContext>
			<video autoPlay loop muted className="w-full h-lvh absolute top-0 object-cover brightness-40">
				<source src="MusicDiscVideo.mp4" type="video/mp4"></source>
			</video>
			<div className="mb-40 mt-12 mx-60 relative flex items-center flex-col">
						<Image src="/logos/MusiMoveFullLogo_Dark.png" width={300} height={500} alt="MusiMove Logo" priority={true}></Image>
						<h1 className="mt-5 font-bold text-7xl text-white font-inter text-center">All Your Music.<br></br>Wherever You Want.</h1>
						<p className="mt-7 font-semibold text-2xl text-white text-center">Freely compare and transfer any track or playlist</p>
						<p className="mt-25 mb-7 text-lg text-white text-center"><span className="font-bold">Login</span> to a streaming platform to begin transferring</p>
						<div className="flex gap-10">
							<SpotifyLoginButton></SpotifyLoginButton>
							<YTMusicLoginButton></YTMusicLoginButton>
						</div>
					{/* <div>
						<Image className="fade-up" src="/MusicImage.png" width={380} height={380} alt="Two music notes and a music album with a headphones icon" priority={true}></Image>
					</div> */}
			</div>
			<div className="py-30 text-center">
					<h2 className="engagingH2">Transferring Simplified</h2>
					<p className="mt-5 text-xl">No more spending hours adding every track one by one.<br></br>Save time, listen more.</p>
					<ol className="mt-12 flex justify-center items-center gap-10">
						<TransferStep
							step={"Connect Your Music"}
							imageSrc={"/graphics/Step1Image.png"}
							details={"Login to both your Spotify and YouTube Music accounts"}
						></TransferStep>
						<Image src="/graphics/Arrow.png" width={100} height={70} className="h-fit" alt="Arrow"></Image>
						<TransferStep
							step={"Choose Your Songs"}
							imageSrc={"/graphics/Step2Image.png"}
							details={"Select any number of playlists or tracks and the desired location of the transfer"}
						></TransferStep>
						<Image src="/graphics/Arrow.png" width={100} height={70} className="h-fit" alt="Arrow"></Image>
						<TransferStep
							step={"Transfer & Enjoy"}
							imageSrc={"/graphics/Step3Image.png"}
							details={"Confirm your transfer and done! All your music will be automatically moved"}
						></TransferStep>
					</ol>
			</div>
			<div className="py-30 text-center bg-neutral-200/20 relative">
				<div className="bg-[url(/headphones.jpg)] bg-cover bg-[center_35%] w-full h-full absolute top-0 -z-1 opacity-15"></div>
				
				<h2 className="engagingH2">Current Features</h2>
				<div className="flex justify-center gap-50 mt-12 mb-28">
					<div className="bg-white rounded-md py-10 px-12 border-2 border-gray-200 border-solid">
						<h3 className="text-2xl font-bold font-inter">Spotify</h3>
						<ul className="text-left mt-5">
							<li className="list-image-[url(/graphics/Note.svg)]">Displays playlist & tracks</li>
							<li className="list-image-[url(/graphics/Note.svg)] mt-5">Transfers playlist to existing playlist</li>
							<li className="list-image-[url(/graphics/Note.svg)] mt-5">Transfers playlist to new playlist</li>
							<li className="list-image-[url(/graphics/Note.svg)] mt-5">Transfers multiple playlists at once</li>
						</ul>
					</div>
					<div className="bg-white rounded-md py-10 px-12 border-2 border-gray-200 border-solid">
						<h3 className="text-2xl font-bold font-inter">YouTube Music</h3>
						<ul className="text-left mt-5">
							<li className="list-image-[url(/graphics/Note.svg)]">Displays playlist & tracks</li>
							<li className="list-image-[url(/graphics/X.svg)] mt-5">Transfers playlist to existing playlist</li>
							<li className="list-image-[url(/graphics/X.svg)] mt-5">Transfers playlist to new playlist</li>
							<li className="list-image-[url(/graphics/X.svg)] mt-5">Transfers multiple playlists at once</li>
						</ul>
					</div>
				</div>
			</div>
			<footer className="w-full h-70 py-5 px-10 bg-neutral-900 flex justify-between items-end text-white relative">
				<Image src="/graphics/MusicDisc.png" width={300} height={300} className="h-fit absolute left-[50%] translate-x-[-50%] top-[-50%]" alt="Music disc"></Image>
				<p className="text-sm">Copyright © 2026 MusiMove - Built by a music lover</p>
				<p className="text-sm">Privacy and Terms</p>
			</footer>
		</SessionProvider>
	);
}
