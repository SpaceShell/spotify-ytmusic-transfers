"use client"

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export function CreatePlaylistPopup({createIndex, transferToOtherPlatform, transferContext, setCreatingPlaylist}) {
    const createPlaylist = (formData) => {
        console.log(transferContext)
        transferContext.to[createIndex]= [...transferContext.to[createIndex], formData.get("title")];
        transferToOtherPlatform();
    }

    const closePopup = () => {
        setCreatingPlaylist(-1);
    }

    return (
        <div className="w-100 h-max py-7 px-10 bg-white shadow-md absolute left-0 right-0 m-auto top-1/2 bottom-1/2 flex flex-col z-5">
            <button onClick={closePopup}>
                <IoClose className="w-5 h-5 absolute top-3 right-3 fill-black"/>
            </button>
            <p className="w-full font-bold mb-4 text-lg">Create New Playlist</p>
            <form action={createPlaylist} className="flex flex-col">
                <label htmlFor="title" className="text-stone-500 text-sm">Title</label>
                <input id="title" name="title" placeholder="" className="border border-gray-300 mb-7"/>
                <button type="submit" className="bg-stone-800 text-white font-bold px-6 py-3 rounded-md ml-auto mr-auto block">Confirm</button>
            </form>
        </div>
    );
}