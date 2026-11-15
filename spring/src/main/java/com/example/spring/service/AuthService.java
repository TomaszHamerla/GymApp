package com.example.spring.service;

import com.example.spring.dto.AuthResponse;
import com.example.spring.dto.ForgotPasswordRequest;
import com.example.spring.dto.LoginRequest;
import com.example.spring.dto.RegisterRequest;
import com.example.spring.dto.ResetPasswordRequest;
import com.example.spring.model.User;
import com.example.spring.repository.UserRepository;
import com.example.spring.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Użytkownik o podanym adresie email już istnieje");
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(false)
                .build();
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        emailService.sendActivationEmail(user.getEmail(), jwtToken);
    }

    public void activate(String token) {
        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Nieprawidłowy token lub nie odnaleziono użytkownika"));

        if (user.isEnabled()) {
            throw new IllegalArgumentException("Konto zostało już wcześniej aktywowane");
        }

        if (jwtService.isTokenValid(token, user)) {
            user.setEnabled(true);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Nieprawidłowy lub wygasły token aktywacyjny");
        }
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Nieprawidłowy adres email lub hasło"));

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("Konto nie zostało jeszcze aktywowane. Sprawdź swoją skrzynkę e-mail.");
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Adres e-mail jest wymagany");
        }

        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new IllegalArgumentException("Użytkownik o podanym adresie e-mail nie istnieje"));

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (request.getToken() == null || request.getToken().isBlank()) {
            throw new IllegalArgumentException("Token resetowania hasła jest wymagany");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("Nowe hasło nie może być puste");
        }
        if (request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("Nowe hasło musi mieć co najmniej 6 znaków");
        }

        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Nieprawidłowy lub przedawniony token do resetowania hasła"));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Link do resetowania hasła wygasł. Poproś o nowy link.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }
}
