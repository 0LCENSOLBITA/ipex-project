export const API_URL = import.meta.env.VITE_API_URL as string;
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

if (!UPLOADS_URL) {
  throw new Error("VITE_UPLOADS_URL is not defined");
}
