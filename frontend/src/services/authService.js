import API from "../api/axios";

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await API.post("/auth/signup", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Registration failed" };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Login failed" };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await API.get("/users/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to get user" };
    }
  },

  // Logout
  logout: async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.setItem("loggedOut", "true");
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.setItem("loggedOut", "true");
    }
  },
};

export default authService;
