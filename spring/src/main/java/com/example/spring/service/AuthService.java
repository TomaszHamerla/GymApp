package com.example.spring.service;

import com.example.spring.dto.AuthResponse;
import com.example.spring.dto.LoginRequest;
import com.example.spring.dto.RegisterRequest;
import com.example.spring.model.User;
import com.example.spring.repository.UserRepository;
import com.example.spring.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
