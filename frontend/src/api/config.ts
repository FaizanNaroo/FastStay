const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';
export const FASTSTAY_APP_URL: string = `${API_BASE_URL}/faststay_app`;
export default API_BASE_URL;
