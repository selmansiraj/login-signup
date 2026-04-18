import axios from "axios";

export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost/php";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";
const LEGACY_TOKEN_KEYS = ["jwt", "access_token", "accessToken", "authToken"];
const LEGACY_USER_KEYS = ["user"];

const sessionListeners = new Set();

function notifySessionListeners() {
  sessionListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-session-changed"));
  }
}

/** Same-tab updates (login/logout). Home and other components can subscribe. */
export function subscribeAuthSession(listener) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof responseData?.error === "string" && responseData.error.trim()) {
    return responseData.error;
  }

  if (typeof responseData?.msg === "string" && responseData.msg.trim()) {
    return responseData.msg;
  }

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  return fallbackMessage;
}

export function getAuthEndpointErrorMessage(error, endpointName, fallbackMessage) {
  if (error?.response?.status === 404) {
    return `The backend endpoint "${endpointName}" was not found at ${AUTH_API_BASE_URL}.`;
  }

  if (error?.request && !error?.response) {
    return `Cannot reach ${AUTH_API_BASE_URL}. Make sure your PHP server is running.`;
  }

  return getApiErrorMessage(error, fallbackMessage);
}

/**
 * Persists session. Accepts `token` or common aliases from APIs (`access_token`, `jwt`, …).
 */
export function storeAuthSession(payload = {}) {
  const token =
    payload.token ||
    payload.access_token ||
    payload.accessToken ||
    payload.jwt ||
    null;
  const user = payload.user || payload.profile || null;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  notifySessionListeners();
}

export function getStoredUser() {
  let rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    for (const alt of LEGACY_USER_KEYS) {
      const legacy = localStorage.getItem(alt);
      if (!legacy) {
        continue;
      }

      try {
        JSON.parse(legacy);
        localStorage.setItem(USER_KEY, legacy);
        localStorage.removeItem(alt);
        rawUser = legacy;
        break;
      } catch {
        /* ignore corrupt legacy */
      }
    }
  }

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

/** JWT / session token (normalizes legacy keys into `token`). */
export function getAuthToken() {
  let t = localStorage.getItem(TOKEN_KEY);
  if (t) {
    return t;
  }

  for (const alt of LEGACY_TOKEN_KEYS) {
    t = localStorage.getItem(alt);
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.removeItem(alt);
      return t;
    }
  }

  return null;
}

export function hasAuthSession() {
  return Boolean(getStoredUser() || getAuthToken());
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  LEGACY_TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
  LEGACY_USER_KEYS.forEach((k) => localStorage.removeItem(k));
  notifySessionListeners();
}

export function getUserAuthHeaders() {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
}

export async function fetchUserMyTickets() {
  return axios.get(`${AUTH_API_BASE_URL}/user_my_tickets.php`, {
    headers: {
      ...getUserAuthHeaders()
    }
  });
}

export function updateStoredUser(user) {
  const token = getAuthToken();
  storeAuthSession({ token, user });
}
