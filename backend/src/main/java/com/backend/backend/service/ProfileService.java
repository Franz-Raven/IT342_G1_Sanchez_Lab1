package com.backend.backend.service;

import com.backend.backend.dto.ProfileUpdateRequest;
import com.backend.backend.entity.User;
import com.backend.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, 
                          CloudinaryService cloudinaryService, 
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User updateProfile(Long userId, ProfileUpdateRequest request, 
                              MultipartFile avatarFile, MultipartFile coverFile) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (!request.getUsername().equals(user.getUsername()) && 
                userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (avatarFile != null && !avatarFile.isEmpty()) {
            if (user.getAvatar() != null) {
                cloudinaryService.deleteImage(user.getAvatar());
            }
            String avatarUrl = cloudinaryService.uploadImage(avatarFile, "avatars");
            user.setAvatar(avatarUrl);
        }

        if (coverFile != null && !coverFile.isEmpty()) {
            if (user.getCoverImage() != null) {
                cloudinaryService.deleteImage(user.getCoverImage());
            }
            String coverUrl = cloudinaryService.uploadImage(coverFile, "covers");
            user.setCoverImage(coverUrl);
        }

        return userRepository.save(user);
    }
}