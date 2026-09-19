import { api } from "./api";
import { Content } from "../types/content";

export const getContent = async (
  interest?: string
): Promise<Content[]> => {
  const response = await api.get("/content", {
    params: interest ? { interest } : {},
  });

  return response.data.data || [];
};

export const discoverContent = async (
  interest: string
): Promise<Content[]> => {
  const response = await api.post("/content/discover", {
    interest,
  });

  return response.data.data || [];
};