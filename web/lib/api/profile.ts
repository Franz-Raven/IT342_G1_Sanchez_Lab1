import { apiRequest } from "../api";
import type { ProfileData, ProfileUpdateRequest, ProfileResponse } from "@/types/profile";

export async function getProfile(): Promise<ProfileData> {
  try {
    const response = await apiRequest<ProfileResponse>("/users/profile");
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch profile"
    );
  }
}

export async function updateProfile(
  data: ProfileUpdateRequest
): Promise<ProfileResponse> {
  try {
    const response = await apiRequest<ProfileResponse>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update profile"
    );
  }
}

export async function uploadProfileImage(
  file: File,
  type: "avatar" | "coverImage"
): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await apiRequest<{ url: string }>(
      "/users/profile/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    // Clear any local storage or context here if needed
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to logout"
    );
  }
}
