"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function YouTubeSigningInPage() {
    const router = useRouter();

    useEffect(() => {
        const getYouTubeData = async () => {
            try {
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.href);
                const code = params.get("code");

                await fetch('/api/youtube', {
                    method: "POST",
                    body: JSON.stringify({ code: code, action: "signIn" }),
                }).then(async (response) => {
                    const jsonPlaylists = await response.json();

                    if ("error" in jsonPlaylists) {
                        router.push("/?authentication=false");
                    } else {
                        sessionStorage.setItem("playlists", JSON.stringify(jsonPlaylists));
                        sessionStorage.setItem("yt-authentication", "true");
                        router.push("/transfer");
                    }
                });
            } catch {
                router.push("/?authentication=false");
            }
        }

        getYouTubeData();
    }, [])


    return (
        <div className="w-full h-fill flex items-center text-center">
            <p>Signing in to YouTube Music...</p>
        </div>
    )
}