"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProfile, logout } from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";
import { LogOut, Mail, Calendar, Edit2 } from "lucide-react";
import BackgroundBlobs from "@/components/background-blobs";
import { updateProfile, uploadProfileImage } from "@/lib/api/profile";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const coverImageInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/login");
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Cancel edit mode - reset form
      setEditUsername(profile?.username || "");
      setEditBio(profile?.bio || "");
      setAvatarFile(null);
      setCoverImageFile(null);
      setAvatarPreview(null);
      setCoverImagePreview(null);
      setIsEditMode(false);
    } else {
      // Enter edit mode - initialize form with current data
      setEditUsername(profile?.username || "");
      setEditBio(profile?.bio || "");
      setAvatarFile(null);
      setCoverImageFile(null);
      setAvatarPreview(null);
      setCoverImagePreview(null);
      setIsEditMode(true);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      setIsSaving(true);
      const updates: any = {};
      
      // Update text fields if changed
      if (editUsername !== profile.username) {
        updates.username = editUsername;
      }
      if (editBio !== profile.bio) {
        updates.bio = editBio;
      }

      // Only call update if there are actual changes
      if (Object.keys(updates).length > 0 || avatarFile || coverImageFile) {
        const response = await updateProfile(updates, avatarFile || undefined, coverImageFile || undefined);
        
        // Update local profile with response from server
        setProfile(response);
        
        // Exit edit mode
        setIsEditMode(false);
        setAvatarFile(null);
        setCoverImageFile(null);
        setAvatarPreview(null);
        setCoverImagePreview(null);
      } else {
        // No changes, just exit edit mode
        setIsEditMode(false);
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
        <BackgroundBlobs />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <BackgroundBlobs />
        <div className="relative text-center">
          <p className="text-destructive mb-6">
            {error || "Failed to load profile"}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-primary hover:opacity-90 transition text-primary-foreground rounded-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-start gap-12 px-6 py-10 md:gap-16 lg:gap-24">
        <section className="mx-auto w-full max-w-3xl flex-1">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Profile</h1>
              {/* <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button> */}
            </div>

            {/* Cover Image */}
            <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 mb-6 group">
              {coverImagePreview ? (
                <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : profile.coverImage ? (
                <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-muted-foreground">No cover image</div>
                </div>
              )}
              {isEditMode && (
                <>
                  <button
                    onClick={() => coverImageInputRef.current?.click()}
                    className="absolute bottom-4 right-4 p-2 bg-primary hover:bg-primary/90 rounded-lg opacity-100 transition"
                  >
                    <Edit2 size={18} className="text-primary-foreground" />
                  </button>
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Card Body */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="rounded-full object-cover w-full h-full" />
                  ) : profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.username}
                      width={128}
                      height={128}
                      className="rounded-full object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        {editUsername.charAt(0).toUpperCase() || profile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-primary/90 rounded-full opacity-100 transition"
                    >
                      <Edit2 size={16} className="text-primary-foreground" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="mb-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="text-3xl font-bold bg-card border border-border rounded-lg px-2 py-1 w-full"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold">{profile.username}</h2>
                  )}
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                <div className="flex flex-wrap gap-6 mt-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="text-sm">Joined {createdDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Bio</h3>
              <div className="mt-2">
                {isEditMode ? (
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
                    rows={4}
                    placeholder="Add a bio..."
                  />
                ) : (
                  <div className="text-muted-foreground">
                    {profile.bio ? (
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{profile.bio}</p>
                    ) : (
                      <p className="italic">No bio added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={isEditMode ? handleSaveProfile : handleEditModeToggle}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : isEditMode ? "Save Profile" : "Edit Profile"}
              </button>
              {isEditMode && (
                <button
                  onClick={handleEditModeToggle}
                  className="flex-1 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-foreground transition hover:opacity-95"
                >
                  Cancel
                </button>
              )}
              {!isEditMode && (
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-foreground transition hover:opacity-95"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
