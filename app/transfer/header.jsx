"use client"

import { LuRows3 } from "react-icons/lu";
import { MdOutlineGridView } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

export function PlatformHeader({all_playlist_text, view, setViewFunc, musicLayout, setMusicLayoutFunc, setSongsFunc}) {
    return (
        <>
            <div className="flex justify-between">
                <div className={view == null ? "mb-7" : ""}>
                <h2 className="font-bold text-3xl font-inter text-ellipsis overflow-hidden">
                    {view == null ? all_playlist_text : view}
                </h2>
                </div>
                {
                view == null ?
                    musicLayout == "grid" ?
                        <LuRows3 className="w-9 h-9 cursor-pointer" onClick={() => {setMusicLayoutFunc("row")}}/>
                    :
                        <MdOutlineGridView className="w-9 h-9 cursor-pointer" onClick={() => {setMusicLayoutFunc("grid")}}/>
                :
                    <IoMdArrowRoundBack className="w-9 h-9 cursor-pointer" onClick={() => {
                        setSongsFunc([])
                        setViewFunc(null)
                    }}></IoMdArrowRoundBack>
                }
            </div>
            {
            view !== null &&
            <div className="w-full my-1 grid overflow-y-auto px-8 grid-cols-1 gap-1 font-bold">
                    <div className="flex gap-5">
                        <p className="w-1/3 basis-1/3 text-sm">Track:</p>
                        <div className="w-13"></div>
                        <p className="basis-1/4 text-sm">Album:</p>
                        <p className="text-sm grow">Added on:</p>
                        <p className="text-sm text-right">Length:</p>
                    </div>
            </div>
            }
        </>
    )
}