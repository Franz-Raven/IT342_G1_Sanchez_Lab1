import { apiRequest } from "../api";
import type { ProfileData, ProfileUpdateRequest, ProfileResponse } from "@/types/profile";

export async function getProfile(): Promise<ProfileData> {
  try {
    const response = await apiRequest<ProfileResponse>("/profile/me");
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch profile"
    );
  }
}

export async function updateProfile(
  data: ProfileUpdateRequest,
  avatarFile?: File,
  coverImageFile?: File
): Promise<ProfileResponse> {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (coverImageFile) {
      formData.append("coverImage", coverImageFile);
    }

    const response = await apiRequest<ProfileResponse>("/profile/update", {
      method: "PUT",
      body: formData,
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
): Promise<ProfileResponse> {
  try {
    const formData = new FormData();
    formData.append(type, file);

    const response = await apiRequest<ProfileResponse>("/profile/update", {
      method: "PUT",
      body: formData,
    });

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
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to logout"
    );
  }
}
