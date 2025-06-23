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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
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
    async getLikedTracks(accessToken) {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
