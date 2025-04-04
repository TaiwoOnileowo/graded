import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export const baseURL = process.env.API_URL;

const http = axios.create({
  baseURL,
});

export default http;
