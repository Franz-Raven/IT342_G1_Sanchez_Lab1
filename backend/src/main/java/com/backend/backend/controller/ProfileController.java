package com.backend.backend.controller;

import com.backend.backend.dto.ProfileUpdateRequest;
import com.backend.backend.dto.UserResponse;
import com.backend.backend.entity.User;
import com.backend.backend.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    private final ProfileService profileService;
    private final ObjectMapper objectMapper;

    public ProfileController(ProfileService profileService, ObjectMapper objectMapper) {
        this.profileService = profileService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal String userId) {
        try {
            User user = profileService.getUserById(Long.parseLong(userId));
            return ResponseEntity.ok(convertToResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal String userId,
            @RequestPart(value = "data", required = false) String profileDataJson,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage) {
        
        try {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            if (profileDataJson != null) {
                request = objectMapper.readValue(profileDataJson, ProfileUpdateRequest.class);
            }

            User updatedUser = profileService.updateProfile(
                    Long.parseLong(userId), 
                    request, 
                    avatar, 
                    coverImage
            );

            return ResponseEntity.ok(convertToResponse(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private UserResponse convertToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatar(),
                user.getBio(),
                user.getCoverImage(),
                user.getCreatedAt()
        );
    }
}