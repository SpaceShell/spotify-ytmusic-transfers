export async function POST(req) {
    let body = await req.json()

    try {
        const response = await fetch(body.image);  
        return Response.json({ image: response.url })
    } catch (error) {
       throw error
    }
}