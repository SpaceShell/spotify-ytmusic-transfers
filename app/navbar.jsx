"use client"

import { MdOutlineDarkMode } from "react-icons/md";
import Image from "next/image";

export function Navbar() {
    return (
        <nav className="flex justify-between items-center py-6 px-10">
            <div>
                <Image src="/MusiMoveFullLogo.png" height={50} width={200} alt="MusiMove Logo" unoptimized={true} priority={false}></Image>
            </div>
            <div>
                <MdOutlineDarkMode className="w-10 h-10"/>
            </div>
        </nav>
    )
}