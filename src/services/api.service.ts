import axios from "axios";
import { formatISO, isDate } from "date-fns";

export abstract class ApiService {
  protected apiVersion = 'v1';
  static readonly api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API}/api`,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  static setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  formatDate(date: string | Date) {
    const dateInstance = isDate(date) ? date : new Date(date);
    return formatISO(dateInstance);
  }
}