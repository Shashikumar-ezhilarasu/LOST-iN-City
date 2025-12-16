package com.lostcity.service;

import com.lostcity.dto.request.LoginRequest;
import com.lostcity.dto.request.RegisterRequest;
import com.lostcity.dto.response.AuthResponse;
import com.lostcity.model.User;
import com.lostcity.repository.UserRepository;
import com.lostcity.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider jwtTokenProvider;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                User user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .displayName(request.getDisplayName())
                                .role(User.Role.USER)
                                .build();

                user = userRepository.save(user);

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String token = jwtTokenProvider.generateToken(userDetails);

                return AuthResponse.builder()
                                .accessToken(token)
                                .expiresIn(jwtTokenProvider.getExpirationTime())
                                .user(AuthResponse.UserSummary.builder()
                                                .id(user.getId())
                                                .displayName(user.getDisplayName())
                                                .avatarUrl(user.getAvatarUrl())
                                                .build())
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with email: " + request.getEmail()));

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String token = jwtTokenProvider.generateToken(userDetails);

                return AuthResponse.builder()
                                .accessToken(token)
                                .expiresIn(jwtTokenProvider.getExpirationTime())
                                .user(AuthResponse.UserSummary.builder()
                                                .id(user.getId())
                                                .displayName(user.getDisplayName())
                                                .avatarUrl(user.getAvatarUrl())
                                                .build())
                                .build();
        }
}
