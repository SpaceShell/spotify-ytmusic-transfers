// YouTube credentials
const clientId = process.env.YOUTUBE_CLIENT_ID;
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;


export async function GET() {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        'client_id': clientId,
        'redirect_uri': 'http://localhost:3000/oauth2callback',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}?${queryString}`;

    return Response.json({ url })
}