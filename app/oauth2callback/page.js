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
        <div className="w-full h-screen flex flex-col justify-center items-center text-center relative pb-30">
            <p className="w-full text-center mb-15 text-xl font-bold">Signing in to YouTube Music...</p>
            <div className="flex gap-3">
                <div className="loadingDots"></div>
                <div className="loadingDots"></div>
                <div className="loadingDots"></div>
            </div>
        </div>
    )
}