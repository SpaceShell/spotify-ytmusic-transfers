"use client"
export function EmptyTransfer() {

    return (
        <section>
            <div className="flex justify-between">
                <div>
                <h2 className="font-bold text-3xl font-inter text-ellipsis overflow-hidden">
                    No Streaming Platform Loaded
                </h2>
                </div>
            </div>
            <div className={`w-172 h-130 flex items-center justify-center px-4 py-3`}>
                <p>Please sign in to a streaming platform</p>
            </div>
        </section>
    )
}