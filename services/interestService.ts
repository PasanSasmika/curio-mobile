import { api } from "./api";
import { Interest } from "../types/interest";

export const getInterests = async (): Promise<Interest[]> => {
  const response = await api.get("/interests");

  return response.data.data || [];
};

export const searchInterests = async (
  query: string
): Promise<Interest[]> => {
  const response = await api.get("/interests/search", {
    params: {
      q: query,
    },
  });

  return response.data.data || [];
};