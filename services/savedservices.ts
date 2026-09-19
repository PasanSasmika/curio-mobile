import { api } from "./api";
import { Content } from "../types/content";

export const getSavedContent = async (): Promise<Content[]> => {
  const response = await api.get("/saved");

  return response.data.data || [];
};

export const saveContent = async (
  content: Content
): Promise<Content> => {
  const response = await api.post("/saved", {
    videoId: content.videoId,
    title: content.title,
    description: content.description,
    thumbnail: content.thumbnail,
    channelTitle: content.channelTitle,
    publishedAt: content.publishedAt,
    duration: content.duration,
    interest: content.interest,
  });

  return response.data.data;
};

export const removeSavedContent = async (
  videoId: string
) => {
  await api.delete(`/saved/${videoId}`);
};

export const checkSavedContent = async (
  videoId: string
): Promise<boolean> => {
  const response = await api.get(
    `/saved/${videoId}/check`
  );

  return response.data.saved;
};