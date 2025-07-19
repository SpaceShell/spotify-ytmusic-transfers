"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function signInFallback() {
    const router = useRouter()
          
    useEffect(() => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (params.get("error") != null) {
            router.push("/?authentication=false")
        } else {
            const youtubeSignIn = async () => {
                await fetch('/api/youtube', {
                    method: "GET",
                }).then(async (response) => {
                    const json = await response.json()
                    router.push(json.url);
                });
            }
            youtubeSignIn()
        }
    }, [])

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center text-center relative pb-30">
            <p className="w-full text-center mb-15 text-xl font-bold">Redirecting...</p>
            <div className="flex gap-3">
                <div className="loadingDots"></div>
                <div className="loadingDots"></div>
                <div className="loadingDots"></div>
            </div>
        </div>
    );
}