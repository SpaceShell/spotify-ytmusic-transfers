import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Spotify credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;


export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId,
      clientSecret,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-read-email user-read-private playlist-read-private user-library-read",
          prompt: "consent",
          show_dialog: "true", 
        },
      }
    }),
  ],
  pages: {
    error: '/?authentication=false',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expire = account.expires_at * 1000;
        token.refreshToken = account.refresh_token;
        return token;
      }

      if (Date.now() < token.expire) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async getProfile(accessToken) {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    
      const data = await response.json();
      return data
    },
    async getPlaylists(accessToken) {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    
      const data = await response.json();
      return data
    },
    async getLikedPlaylist(accessToken) {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    
      const data = await response.json();
      return data
    },
    async getPlaylistTracks(accessToken, playlistRef) {
      const response = await fetch(playlistRef, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    
      const data = await response.json();
      return data
    }
    },
  secret: process.env.NEXTAUTH_SECRET,
};


async function refreshAccessToken(token) {
  try {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      }),
    }
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();

    return {
      ...token,
      accessToken: response.access_token,
      expire: response.expires_at * 1000,
      refreshToken: response.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
