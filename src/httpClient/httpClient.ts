import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://back-texnoprom.uz",
});
