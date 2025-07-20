"use client"

export function TrackSubHeader() {
    return (
        <div className="w-full h-min py-3 px-4 my-1 grid grid-cols-1 gap-1 font-bold sticky top-0 backdrop-blur-lg bg-neutral-600/5">
            <div className="flex gap-5">
                <p className="w-1/3 basis-1/3 text-sm">Track:</p>
                <div className="w-15"></div>
                <p className="basis-1/4 text-sm">Album:</p>
                <p className="text-sm grow">Added:</p>
                <p className="text-sm text-right">Length:</p>
            </div>
        </div>
    )
}