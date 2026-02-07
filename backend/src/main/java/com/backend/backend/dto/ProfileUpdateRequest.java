package com.backend.backend.dto;

public class ProfileUpdateRequest {
    private String username;
    private String bio;
    private String password;

    public ProfileUpdateRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}