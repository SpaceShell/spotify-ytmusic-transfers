"use client"

import Image from "next/image";

export function TransferStep({step, imageSrc, details}) {
    return (
        <div className="w-65 flex flex-col items-center self-start">
            <li className="py-10 px-12 bg-[#102672] rounded-2xl text-white text-left font-bold text-2xl list-decimal list-inside mb-15">{step}</li>
            <Image src={imageSrc} width={200} height={200} className="h-fit" alt="Arrow"></Image>
            <p className="mt-15 text-md">{details}</p>
        </div>
    )
}