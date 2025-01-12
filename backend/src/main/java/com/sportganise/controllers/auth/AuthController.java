package com.sportganise.controllers.auth;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.Verification;
import com.sportganise.services.auth.AccountService;
import com.sportganise.services.auth.EmailService;
import com.sportganise.services.auth.VerificationService;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Account' Entities. Handles HTTP request and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("api/auth")
public class AuthController {

  private final AccountService accountService;
  private final EmailService emailService;
  private final VerificationService verificationService;

  /**
   * Constructor for the AuthController.
   *
   * @param accountService AccountService object.
   * @param emailService EmailService object.
   * @param verificationService VerificationService object.
   */
  @Autowired
  public AuthController(
      AccountService accountService,
      EmailService emailService,
      VerificationService verificationService) {
    this.accountService = accountService;
    this.emailService = emailService;
    this.verificationService = verificationService;
  }

  /**
   * POST: Create a new Account.
   *
   * @param accountDto AccountDto object containing the account information.
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/signup")
  public ResponseEntity<ResponseDto<String>> signup(@Valid @RequestBody AccountDto accountDto) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    try {
      String auth0Id = accountService.createAccount(accountDto);

      responseDto.setData(auth0Id);
      responseDto.setMessage("User created with Auth0 ID: " + auth0Id);
      responseDto.setStatusCode(HttpStatus.CREATED.value());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    } catch (Exception e) {

      responseDto.setMessage("Error creating user:" + e.getMessage());
      responseDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
    }
  }

  /**
   * POST: Authenticate an Account.
   *
   * @param auth0AccountDto Auth0AccountDto object containing the account information.
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/login")
  public ResponseEntity<ResponseDto<String>> login(
      @Valid @RequestBody Auth0AccountDto auth0AccountDto) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    try {
      boolean isValid = accountService.authenticateAccount(auth0AccountDto);

      if (isValid) {
        responseDto.setMessage("Login successful");
        responseDto.setStatusCode(HttpStatus.OK.value());

        return ResponseEntity.ok(responseDto);
      } else {
        responseDto.setMessage("Invalid credentials");
        responseDto.setStatusCode(HttpStatus.UNAUTHORIZED.value());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseDto);
      }
    } catch (Exception e) {
      responseDto.setMessage("Error during login: " + e.getMessage());
      responseDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
    }
  }

  /**
   * POST: generate code to send to a user's email.
   *
   * @param requestBody email
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/send-code")
  public ResponseEntity<ResponseDto<String>> sendCode(
      @RequestBody Map<String, String> requestBody) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    String email = requestBody.get("email");
    Account account = accountService.getAccountByEmail(email);
    responseDto.setData(email);
    responseDto.setStatusCode(HttpStatus.CREATED.value());
    Verification verification = verificationService.createVerification(account);
    emailService.sendVerificationCode(email, verification.getCode());
    responseDto.setMessage("Verification Code created and sent to: " + email);

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * POST: verify a code given by an end user.
   *
   * @param requestBody email and code
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/verify-code")
  public ResponseEntity<ResponseDto<String>> validateCode(
      @RequestBody Map<String, String> requestBody) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    String email = requestBody.get("email");
    responseDto.setData(email);
    int code = Integer.parseInt(requestBody.get("code"));
    Account account = accountService.getAccountByEmail(email);
    Optional<Verification> verification =
        verificationService.validateCode(account.getAccountId(), code);
    if (verification.isPresent()) {
      responseDto.setStatusCode(HttpStatus.CREATED.value());
      responseDto.setMessage("Code verified successfully");
    } else {
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      responseDto.setMessage("Invalid or expired code");
    }
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * PATCH: reset forgotten password.
   *
   * @param requestBody email and new password
   * @return ResponseEntity containing the response message.
   */
  @PatchMapping("/reset-password")
  public ResponseEntity<ResponseDto<String>> resetPassword(
      @RequestBody Map<String, String> requestBody) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    String email = requestBody.get("email");
    responseDto.setData(email);
    String newPassword = requestBody.get("newPassword");
    try {
      accountService.resetPassword(email, newPassword);
      responseDto.setStatusCode(HttpStatus.OK.value());
      responseDto.setMessage("Password reset successfully");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      responseDto.setMessage(e.getMessage());
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }
  }

  /**
   * PATCH: Modify password.
   *
   * @param requestBody email, old password and new password
   * @return ResponseEntity containing the response message.
   */
  @PatchMapping("/modify-password")
  public ResponseEntity<ResponseDto<String>> modifyPassword(
      @RequestBody Map<String, String> requestBody) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    String email = requestBody.get("email");
    responseDto.setData(email);
    String oldPassword = requestBody.get("oldPassword");
    String newPassword = requestBody.get("newPassword");
    try {
      accountService.modifyPassword(email, oldPassword, newPassword);
      responseDto.setStatusCode(HttpStatus.OK.value());
      responseDto.setMessage("Password changed successfully");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      responseDto.setMessage(e.getMessage());
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }
  }
}
