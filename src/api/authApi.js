import axiosInstance from "./axiosInstance";

// POST /auth/login
export const loginApi = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data; // { token }
};

// POST /auth/signup
export const signupApi = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/signup", { email, password });
  return data; // { token }
};

// Redirect browser to Google OAuth2
export const loginWithGoogle = () => {
  window.location.href =
    process.env.REACT_APP_GOOGLE_OAUTH2_URL ||
    "http://localhost:8080/oauth2/authorization/google";
};