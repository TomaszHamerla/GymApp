package com.example.spring.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Async
    public void sendActivationEmail(String to, String token) {
        try {
            Context context = new Context();
            String activationLink = frontendUrl + "/activate?token=" + token;
            context.setVariable("token", token);
            context.setVariable("activationLink", activationLink);

            String process = templateEngine.process("activation-email", context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setText(process, true);
            helper.setTo(to);
            helper.setSubject("Aktywacja konta na siłowni");
            helper.setFrom("javaprojectmeil@gmail.com", "gymTrack-noreply");

            javaMailSender.send(mimeMessage);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new IllegalStateException("Failed to send email");
        }
    }
}
