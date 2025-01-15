package com.sportganise.services.auth;

import static org.mockito.Mockito.*;

import com.sportganise.services.account.auth.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class) // Automatically initializes mocks
public class EmailServiceTest {

  @InjectMocks private EmailService emailService;

  @Mock private JavaMailSender mockMailSender; // Mocking JavaMailSender

  @BeforeEach
  public void setup() {
    SimpleMailMessage mockMessage = new SimpleMailMessage();
    mockMessage.setFrom("sender@example.com");
    mockMessage.setTo("recipient@example.com");
    mockMessage.setSubject("Your Sportganise Verification Code");
    mockMessage.setText("Your verification code is: 123456 . It will expire in 10 minutes.");
  }

  @Test
  public void sendVerificationCode_shouldSendEmail() {
    emailService.sendVerificationCode("recipient@example.com", 123456);

    verify(mockMailSender, times(1)).send(any(SimpleMailMessage.class));
  }
}
