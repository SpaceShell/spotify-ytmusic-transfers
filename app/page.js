"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react"
import { Navbar } from "./navbar";
import Error from "./error-message";
import { SpotifyLoginButton } from "./spotify-login-button";
import { YTMusicLoginButton } from "./ytmusic-login-button";
import { ToFromContext } from "./transfer/transfer-contexts";

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
				<Navbar></Navbar>
			</ToFromContext>
			<div className="mb-40 mt-20 mx-60 flex gap-55 relative">
					<div>
						<h1 className="font-bold text-6xl font-inter">Welcome to <br></br><span className="text-blue-700">Musi</span>Move</h1>
						<p className="mt-5 text-2xl">Freely compare and transfer any <br></br>of your tracks or playlists</p>
						<p className="mt-25 mb-5"><span className="font-bold">Login</span> to a streaming platform to begin transferring</p>
						<div className="flex gap-10">
							<SpotifyLoginButton></SpotifyLoginButton>
							<YTMusicLoginButton></YTMusicLoginButton>
						</div>
					</div>
					<div>
						<Image className="fade-up" src="/MusicImage.png" width={380} height={380} alt="Two music notes and a music album with a headphones icon" priority={true}></Image>
					</div>
			</div>
		</SessionProvider>
	);
}
