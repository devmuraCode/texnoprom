import axios from "axios";

export const API_BASE_URL = "https://back-texnoprom.uz";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});
