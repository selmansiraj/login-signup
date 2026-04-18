/**
 * Google OAuth (Web client) — set REACT_APP_GOOGLE_CLIENT_ID in `.env` (see `.env.example`).
 * Console: https://console.cloud.google.com/apis/credentials
 * Authorized JavaScript origins: http://localhost:3000 (and your production origin)
 */

const DEFAULT_WEB_CLIENT_ID =
  "406339106625-1lv9ri4k3207q4agtju2arvfrbckp7la.apps.googleusercontent.com";

export const GOOGLE_CLIENT_ID =
  (typeof process !== "undefined" && process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim()) ||
  DEFAULT_WEB_CLIENT_ID;

export function isGoogleOAuthConfigured() {
  return GOOGLE_CLIENT_ID.length > 0;
}
