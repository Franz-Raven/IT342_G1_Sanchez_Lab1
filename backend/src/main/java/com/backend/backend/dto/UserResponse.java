package com.backend.backend.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String avatar;
    private String bio;
    private String coverImage;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String username, String email, String avatar, String bio, String coverImage, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.bio = bio;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}