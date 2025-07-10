"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function YouTubeSigningInPage() {
    const router = useRouter()

    useEffect(() => {
        const getYouTubeData = async () => {
            try {
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.hash);

                const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?access_token=${params.get("access_token")}&part=snippet&mine=true`);
                const jsonPlaylists = await response.json()

                if ("error" in jsonPlaylists) {
                    router.push("/?authentication=false")
                } else {
                    sessionStorage.setItem("playlists", JSON.stringify(jsonPlaylists));
                    router.push("/transfer")
                }

            } catch {
                router.push("/?authentication=false")
            }
        }

        getYouTubeData()
    }, [])


    return (
        <div>
            <p>Signing in to YouTube Music...</p>
        </div>
    )
}