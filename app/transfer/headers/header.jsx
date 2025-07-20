"use client"

import { LuRows3 } from "react-icons/lu";
import { MdOutlineGridView } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

export function PlatformHeader({allPlaylistText, view, setViewFunc, musicLayout, setMusicLayoutFunc, setSongsFunc}) {
    return (
        <div className="flex justify-between">
            <div className={view == null ? "mb-9" : ""}>
                <h2 className="font-bold text-3xl font-inter text-ellipsis overflow-hidden">
                    {view == null ? allPlaylistText : view}
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
    )
}