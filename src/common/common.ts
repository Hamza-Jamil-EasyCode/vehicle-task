import { ChatCompletionChunk } from "groq-sdk/resources/chat/completions";
import Config from "@/utils/config";
import * as Yup from "yup";
import { ZodError } from "zod";
import { ValidationDetail } from "./types";

export const loggedIn = () => {
  return false;
};

export const cleanText = (string: string) => {
  return string
    .replaceAll("-", " ")
    .replaceAll("/", "")
    .replaceAll("_", " ")
    .replaceAll("(", "")
    .replaceAll(")", "");
};

export const cleanErrorMessage = (error: any) => {
  return cleanText(error.split("/")[1]);
};

export const getTitleFromPath = (path: any) => {
  const sanitizedPath = path.split("/")[1]?.replaceAll("-", " ");
  const capitalizedTitle = sanitizedPath
    ?.split(" ")
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return capitalizedTitle;
};

export const passwordValidation = () => {
  return Yup.string()
    .min(8, "Password should be minimum 8 characters long")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    )
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required");
};


export const firstLetterCapitalize = (string: string) => {
  if (!string) {
    return "";
  }
  const firstLetter = string?.charAt(0)?.toUpperCase();
  return `${firstLetter}${string.substr(1, string.length - 1).toLowerCase()}`;
};

export const camelCaseToText = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char: string) => char.toUpperCase());
};

export const throttle = <T extends (...args: any[]) => void>(fn: T, delay = 500): T => {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    fn(...args);
  } as T;
};

export const easeTransition = (
  theme: any,
  transitionElements: string[],
  isEntering = true,
) => {
  return {
    transition: theme.transitions.create(transitionElements, {
      easing: isEntering
        ? theme.transitions.easing.easeOut
        : theme.transitions.easing.sharp,
      duration: isEntering
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  };
};

export const formatDate = (date: Date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date provided to formatDate:", date);
    return "Invalid date";
  }
  const day = dateObj.toLocaleString("en-GB", { day: "2-digit" });
  const month = dateObj.toLocaleString("en-GB", { month: "short" });
  const year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const generateRandomNumber = (length: number): number => {
  if (length <= 0) throw new Error("Length must be greater than 0");

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getTimeDifference = (date: Date) => {
  const inputDate = new Date(date).getTime();
  const now = Date.now();

  const diffInSeconds = Math.floor((now - inputDate) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30; // approx
  const year = day * 365; // approx

  if (diffInSeconds < minute) {
    return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""}`;
  }

  if (diffInSeconds < hour) {
    const mins = Math.floor(diffInSeconds / minute);
    return `${mins} min${mins !== 1 ? "s" : ""}`;
  }

  if (diffInSeconds < day) {
    const hrs = Math.floor(diffInSeconds / hour);
    return `${hrs} hr${hrs !== 1 ? "s" : ""}`;
  }

  if (diffInSeconds < month) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  const years = Math.floor(diffInSeconds / year);
  return `${years} year${years !== 1 ? "s" : ""}`;
};

export const encrypt = (text: string, key: string) => {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);

    const encryptedChar = (textChar ^ keyChar) + 7;
    result += String.fromCharCode(encryptedChar);
  }

  return btoa(result);
};

export const decrypt = (
  encryptedText: string | null | undefined,
  key: string,
) => {
  const decoded = atob(encryptedText || "");
  let result = "";

  for (let i = 0; i < decoded.length; i++) {
    const encryptedChar = decoded.charCodeAt(i) - 7;
    const keyChar = key.charCodeAt(i % key.length);

    const originalChar = encryptedChar ^ keyChar;
    result += String.fromCharCode(originalChar);
  }

  return result;
};

// Cookie utility functions
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const setCookie = (
  name: string,
  value: string,
  days: number = 7,
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Remove 'secure' flag for development, add it back for production
  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? ";secure" : "";
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${secureFlag};httponly=false`;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error(`Embedding dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let dot = 0,
    magA = 0,
    magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denom = Math.sqrt(magA * magB);
  return denom < 1e-10 ? 0 : dot / denom;
};

export async function* createStream(
  text: string,
): AsyncGenerator<ChatCompletionChunk> {
  yield {
    id: "fake-id",
    object: "chat.completion.chunk",
    created: Date.now(),
    model: "fake-model",
    choices: [
      {
        index: 0,
        delta: {
          content: text,
        },
        finish_reason: "stop",
      },
    ],
  } as ChatCompletionChunk;
}

export function formatZodError(error: ZodError, namespace = "vehicle"): ValidationDetail[] {
  return error.issues.map((issue) => {
    // issue.path is an array of keys, e.g. ["vin"] or ["address", "city"]
    const fieldPath =
      issue.path.length > 0
        ? `${namespace}.${issue.path.join(".")}`
        : namespace;
 
    return { field: fieldPath, message: issue.message };
  });
}