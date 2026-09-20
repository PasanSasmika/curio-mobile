import { api } from "./api";
import { Content } from "../types/content";

export interface ContentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  maxPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ContentResponse {
  data: Content[];
  pagination: ContentPagination;
}

export const getContent = async (
  interest?: string,
  page: number = 1,
  limit: number = 10,
  refresh: boolean = false
): Promise<ContentResponse> => {
  const response = await api.get("/content", {
    params: {
      ...(interest ? { interest } : {}),
      page,
      limit,
      refresh,
    },
  });

  return {
    data: response.data.data || [],
    pagination: response.data.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 0,
      maxPages: 6,
      hasNextPage: false,
      hasPreviousPage: page > 1,
    },
  };
};

export const discoverContent = async (
  interest: string
): Promise<Content[]> => {
  const response = await api.post(
    "/content/discover",
    {
      interest,
    }
  );

  return response.data.data || [];
};

export const searchContent = async (
  query: string,
  pageToken?: string
): Promise<ContentResponse> => {
  const response = await api.get(
    "/content/search",
    {
      params: {
        q: query,
        limit: 10,
        order: "relevance",
        ...(pageToken
          ? { pageToken }
          : {}),
      },
    }
  );

  return {
    data: response.data.data || [],
    pagination:
      response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        maxPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
  };
};