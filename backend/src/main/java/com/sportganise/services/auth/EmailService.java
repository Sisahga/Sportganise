package com.sportganise.services.auth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Email service used for communication
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send an email to an email
     * @param toEmail email to send to
     * @param code verification code
     */
    public void sendVerificationCode(String toEmail, int code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Your Sportganise Verification Code");
        message.setText("Your verification code is: " + code + " . It will expire in 10 minutes.");
        mailSender.send(message);
    }

}
