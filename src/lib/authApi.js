export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost/php";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";

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

export function storeAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);

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

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function updateStoredUser(user) {
  const token = localStorage.getItem(TOKEN_KEY);
  storeAuthSession({ token, user });
}
