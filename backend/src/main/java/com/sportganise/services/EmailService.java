package com.sportganise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/** Service for sending emails to users. */
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
   * Send an email to an email.
   *
   * @param toEmail email to send to
   * @param code verification code
   */
  public void sendVerificationCode(String toEmail, int code) {
    String text = "Your verification code is: " + code + " . It will expire in 10 minutes.";
    String sender = "Sportganise";
    sendEmail(sender, toEmail, "Your Sportganise Verification Code", text);
  }

  /**
   * Send an email.
   *
   * @param toEmail email to send to
   * @param subject email subject
   * @param text email text
   */
  public void sendEmail(String sender, String toEmail, String subject, String text) {
    String footer = "\n\n" + sender + ",\nSportganise\nwww.sportganise.com";
    String messageText = text + footer;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(senderEmail);
    message.setTo(toEmail);
    message.setSubject(subject);
    message.setText(messageText);
    mailSender.send(message);
  }
}
