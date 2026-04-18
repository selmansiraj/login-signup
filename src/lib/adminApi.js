import axios from "axios";

export const ADMIN_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost/php";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export function getAdminApiErrorMessage(error, fallbackMessage) {
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

export function storeAdminSession({ token, admin }) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  if (admin) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
  }
}

export function getStoredAdmin() {
  const rawAdmin = localStorage.getItem(ADMIN_USER_KEY);

  if (!rawAdmin) {
    return null;
  }

  try {
    return JSON.parse(rawAdmin);
  } catch (error) {
    localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function updateStoredAdmin(admin) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  storeAdminSession({ token, admin });
}

export function getAdminAuthHeaders() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
}

export async function fetchAdminDashboard() {
  return axios.get(`${ADMIN_API_BASE_URL}/admin_dashboard.php`, {
    headers: getAdminAuthHeaders()
  });
}

export async function saveAdminPlace(payload) {
  return axios.post(`${ADMIN_API_BASE_URL}/admin_place_save.php`, payload, {
    headers: {
      ...getAdminAuthHeaders()
    }
  });
}

export async function deleteAdminPlace(placeId) {
  return axios.post(
    `${ADMIN_API_BASE_URL}/admin_place_delete.php`,
    { id: placeId },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders()
      }
    }
  );
}

export async function fetchTourismPlaces() {
  return axios.get(`${ADMIN_API_BASE_URL}/tourism_places.php`);
}

export async function updateAdminTicket(ticketId, status) {
  return axios.post(
    `${ADMIN_API_BASE_URL}/admin_ticket_update.php`,
    { id: ticketId, status },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders()
      }
    }
  );
}
