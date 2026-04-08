(function () {
  const API_BASE = `${window.location.origin}/api`;

  function getToken() {
    return localStorage.getItem("token");
  }

  function setSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("student", JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
  }

  function logout() {
    clearSession();
    window.location.href = "index.html";
  }

  function authHeaders(includeContentType = true) {
    const headers = {};

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function parseResponse(response) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    return parseResponse(response);
  }

  async function authenticatedRequest(path, options = {}) {
    const token = getToken();
    if (!token) {
      logout();
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...authHeaders(false),
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      logout();
      throw new Error("Session expired");
    }

    return parseResponse(response);
  }

  async function verifySession() {
    if (!getToken()) {
      return false;
    }

    try {
      await authenticatedRequest("/auth/profile", { method: "GET" });
      return true;
    } catch {
      return false;
    }
  }

  window.AppSession = {
    API_BASE,
    getToken,
    setSession,
    clearSession,
    logout,
    authHeaders,
    request,
    authenticatedRequest,
    verifySession,
  };
})();