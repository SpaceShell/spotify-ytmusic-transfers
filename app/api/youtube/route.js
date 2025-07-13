// YouTube credentials
import crypto from 'crypto';
import { cookies } from 'next/headers'

const clientId = process.env.YOUTUBE_CLIENT_ID;
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;


export async function GET() {
    const generateCodeChallenge = async (verifier) => {
        const hash = crypto.createHash('sha256').update(verifier).digest('base64');
        const base64 = hash
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        return base64;
    }

    const generateCodeVerifier = () => {
        const bytes = new Uint8Array(128);
        crypto.getRandomValues(bytes);
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        return Array.from(bytes).map(x => charset[x % charset.length]).join('');
    }

    const pkceVerifier = generateCodeVerifier();
    const cookieStore = await cookies()
    cookieStore.set('verifier', pkceVerifier, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 300
    })

    const pkceChallenge = await generateCodeChallenge(pkceVerifier);

    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        'client_id': clientId,
        'redirect_uri': 'http://localhost:3000/oauth2callback',
        'response_type': 'code',
        'code_challenge': pkceChallenge,
        'code_challenge_method': 'S256',
        'scope': 'https://www.googleapis.com/auth/youtube',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}?${queryString}`;

    return Response.json({ url });
}


export async function POST(req) {
    let reqBody = await req.json();

    if (reqBody.action === "signIn") {
        return await YouTubeSignIn(reqBody);
    }
    return new Response("Invalid action given", { status: 400 });
}


async function YouTubeSignIn(reqBody) {
    const cookieStore = await cookies()

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: reqBody.code,
        code_verifier: cookieStore.get('verifier').value,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/oauth2callback",
    });
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });
    const tokenData = await tokenResponse.json();

    const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true`, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`
        }
    });
    const playlistData = await playlistResponse.json();

    cookieStore.set('access_token', tokenData.access_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
        maxAge: tokenData.expires_in
    });

    return Response.json(playlistData);
}