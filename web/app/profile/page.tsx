"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProfile, logout } from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";
import { LogOut, Mail, Calendar, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-6">
            {error || "Failed to load profile"}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg"
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image Section */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 mb-6 group">
          {profile.coverImage ? (
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-slate-400">No cover image</div>
            </div>
          )}
          <button className="absolute bottom-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition">
            <Edit2 size={18} className="text-white" />
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
          {/* Avatar and Basic Info */}
          <div className="px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.username}
                      width={128}
                      height={128}
                      className="rounded-full object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-300">
                        {profile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <Edit2 size={16} className="text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-2">
                  <h2 className="text-3xl font-bold text-white">
                    {profile.username}
                  </h2>
                  <p className="text-slate-400">@{profile.username}</p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-4 text-slate-300">
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
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

          {/* Bio Section */}
          <div className="px-6 py-6">
            <div className="mb-4 flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">Bio</h3>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                <Edit2 size={18} className="text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="relative">
              {profile.bio ? (
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-slate-500 italic">No bio added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition transform hover:scale-105">
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
