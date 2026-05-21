"use client";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  Method,
} from "axios";
import toast from "react-hot-toast";
import { store } from "@store/store";
import { logout } from "@store/slice/AuthSlice";

// ==============================
// AXIOS INSTANCES
// ==============================

// Main API instance (used everywhere)
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true, // 🔥 required for cookie auth
});

// Separate instance for refresh (NO interceptors)
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
});

// ==============================
// TYPES
// ==============================

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type FailedQueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

// ==============================
// REFRESH TOKEN HANDLING
// ==============================

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// ==============================
// RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("API error:", error);
    const originalRequest = error.config as CustomAxiosRequestConfig;
    // ❗ Only handle 401
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    // ❗ Prevent infinite loop
    originalRequest._retry = true;
    // 🔁 If already refreshing → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }
    isRefreshing = true;
    try {
      console.log("Attempting token refresh...");
      // 🔥 Call refresh endpoint (cookies auto-sent)
      await refreshApi.post("/api/auth?type=refresh");
      // ✅ Retry all queued requests
      processQueue(null);
      // ✅ Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      // 🔥 SESSION EXPIRED → FORCE LOGOUT
      if (typeof window !== "undefined") {
        // Clear persisted auth state so AuthenticationLayout doesn't
        // redirect back to /chat, which would cause an infinite loop.
        store.dispatch(logout());
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ==============================
// AXIOS WRAPPER FUNCTION
// ==============================

interface RequestOptions {
  method: Method;
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
  isFormData?: boolean;
  showError?: boolean; // control toast per request
}

const axiosWrapper = async <T = unknown>({
  method,
  url,
  data,
  config,
  isFormData = false,
  showError = true,
}: RequestOptions): Promise<T> => {
  try {
    const headers = {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...(config?.headers || {}),
    } as Record<string, string>;

    const response = await api({
      method,
      url,
      data,
      headers,
      ...config,
    });

    return response?.data as T;
  } catch (err: unknown) {
    const error = err as AxiosError<any>;

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data?.desc ||
      error.response?.data?.validation?.body?.message ||
      error.message ||
      "Something went wrong";

    if (showError) {
      toast.error(message);
    }

    throw new Error(message);
  }
};

export default axiosWrapper;

// ==============================
// SHARED REFRESH TOKEN FUNCTION
// ==============================

export const refreshToken = async (): Promise<void> => {
  try {
    await refreshApi.post("/api/auth?type=refresh");
  } catch {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }
};
