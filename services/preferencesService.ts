import { api } from "./api";

export interface UserPreferences {
  _id?: string;
  interests: string[];
}

export const getPreferences =
  async (): Promise<UserPreferences> => {
    const response = await api.get("/preferences");

    return response.data.data;
  };

export const updatePreferences = async (
  interests: string[]
): Promise<UserPreferences> => {
  const response = await api.put("/preferences", {
    interests,
  });

  return response.data.data;
};