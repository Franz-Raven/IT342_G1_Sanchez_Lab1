package com.backend.backend.service;

import com.backend.backend.entity.User;
import com.backend.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserProfile(Long userId, User updateData) {
        User user = getUserById(userId);

        if (updateData.getUsername() != null && !updateData.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateData.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(updateData.getUsername());
        }

        if (updateData.getBio() != null) {
            user.setBio(updateData.getBio());
        }

        if (updateData.getAvatar() != null) {
            user.setAvatar(updateData.getAvatar());
        }

        if (updateData.getCoverImage() != null) {
            user.setCoverImage(updateData.getCoverImage());
        }

        return userRepository.save(user);
    }

    public void updateUserImage(Long userId, String type, String imageUrl) {
        User user = getUserById(userId);
        if ("avatar".equals(type)) {
            user.setAvatar(imageUrl);
        } else if ("cover".equals(type)) {
            user.setCoverImage(imageUrl);
        }
        userRepository.save(user);
    }
}