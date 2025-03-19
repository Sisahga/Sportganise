package com.sportganise.services;

import com.sportganise.entities.programsessions.Program;
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
   * Send a verification code to an email.
   *
   * @param toEmail email to send to
   * @param code verification code
   */
  public void sendVerificationCode(String toEmail, int code) {
    String text = "Your verification code is: " + code + " . It will expire in 10 minutes.";
    sendEmail(toEmail, "Your Sportganise Verification Code", text);
  }

  /**
   * Sends an invitation email.
   *
   * @param toEmail recipient of the email
   * @param program program the user was invited to
   */
  public void sendPrivateProgramInvitation(String toEmail, Program program) {
    // TODO: explain how to confirm one's place in an event
    String text = "You have been invited to the private event " + program.getTitle() + ".";
    /* + "Please navigate to ... to confirm your place in the program." */

    String subject = "Sportganise Program Invitation";
    sendEmail(toEmail, subject, text);
  }

  /**
   * Send an email.
   *
   * @param toEmail email to send to
   * @param subject email subject
   * @param text email text
   */
  public void sendEmail(String toEmail, String subject, String text) {
    this.sendEmail("Sportganise", toEmail, subject, text);
  }

  /**
   * Send an email.
   *
   * @param sender recipient of the email
   * @param toEmail email to send to
   * @param subject email subject
   * @param text email text
   */
  public void sendEmail(String sender, String toEmail, String subject, String text) {
    String footer = "\n\n" + sender + ",\nSportganise\nhttps://onibad.sportganise.com/";
    String messageText = text + footer;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(senderEmail);
    message.setTo(toEmail);
    message.setSubject(subject);
    message.setText(messageText);
    mailSender.send(message);
  }
}
