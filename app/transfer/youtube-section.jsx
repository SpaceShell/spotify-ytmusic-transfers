"use client"

export function YouTubeTransfer() {
    let playlists = JSON.parse(sessionStorage.getItem("playlists"))

    return (
        <section>
            <h2 className="font-bold text-3xl font-inter mb-7">All YouTube Music Playlists:</h2>
            <div className="gap-10 flex flex-wrap w-180 h-130 overflow-y-auto"></div>
        </section>
    )
}