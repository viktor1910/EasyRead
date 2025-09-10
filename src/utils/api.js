// API utility functions
const API_BASE_URL = "http://localhost:8000/api";

// Get auth headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Generic API fetch function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token expired or invalid, clear storage but don't redirect automatically
      // Let the calling component handle the redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const errorData = await response.json();
      throw new Error(errorData.message || "Phiên đăng nhập đã hết hạn");
    }

    if (response.status === 403) {
      throw new Error("Bạn không có quyền truy cập");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Có lỗi xảy ra");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Book API functions
export const bookAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/books${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiRequest(`/books/${id}`),
  create: (data) =>
    apiRequest("/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/books/${id}`, {
      method: "DELETE",
    }),
};

// Author API functions
export const authorAPI = {
  getAll: () => apiRequest("/authors"),
  getById: (id) => apiRequest(`/authors/${id}`),
  create: (data) =>
    apiRequest("/authors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/authors/${id}`, {
      method: "DELETE",
    }),
};

// Category API functions
export const categoryAPI = {
  getAll: () => apiRequest("/categories"),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (data) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// Review API functions
export const reviewAPI = {
  getByBook: (bookId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/books/${bookId}/reviews${queryString ? `?${queryString}` : ""}`
    );
  },
  create: (bookId, data) =>
    apiRequest(`/books/${bookId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),
};

// Cart API functions
export const cartAPI = {
  get: () => apiRequest("/cart"),
  add: (bookId, quantity = 1) =>
    apiRequest("/cart/add", {
      method: "POST",
      body: JSON.stringify({ book_id: bookId, quantity }),
    }),
  update: (itemId, quantity) =>
    apiRequest(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  remove: (itemId) =>
    apiRequest(`/cart/remove/${itemId}`, {
      method: "DELETE",
    }),
  clear: () =>
    apiRequest("/cart/clear", {
      method: "DELETE",
    }),
};

// Order API functions
export const orderAPI = {
  getAll: () => apiRequest("/orders"),
  getById: (id) => apiRequest(`/orders/${id}`),
  checkout: (data) =>
    apiRequest("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/orders/${id}/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Auth API functions
export const authAPI = {
  login: (email, password) =>
    apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password, passwordConfirmation) =>
    apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    }),
  logout: () =>
    apiRequest("/logout", {
      method: "POST",
    }),
};
