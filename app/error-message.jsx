"use client"

import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Error({error}) {
    const [closed, setClosed] = useState(false)

    return (
        closed == false &&
        <div className="h-27 w-70 px-6 flex flex-col justify-center absolute rounded-xl border-2 border-red-900 bg-red-200 left-1/2 -translate-x-1/2 top-8">
                <button onClick={() => {setClosed(true)}}>
                    <IoClose className="w-5 h-5 absolute top-3 right-3 fill-red-900"/>
                </button>
                <p className="font-bold">Authentication Error</p>
                <p>{error == "authentication" && "Unable to authenticate account. Please try again."}</p>
        </div>
    );
}
