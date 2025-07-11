package com.sportganise.controllers.account.auth;

import com.sportganise.config.UserAuthProvider;
import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.account.CookiesDto;
import com.sportganise.dto.account.auth.AccountDto;
import com.sportganise.dto.account.auth.Auth0AccountDto;
import com.sportganise.dto.account.auth.VerificationDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.Verification;
import com.sportganise.exceptions.AccountAlreadyExistsInAuth0;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.InvalidCredentialsException;
import com.sportganise.exceptions.PasswordTooWeakException;
import com.sportganise.services.EmailService;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.account.CookiesService;
import com.sportganise.services.account.auth.VerificationService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
@RestController
@RequestMapping("api/auth")
public class AuthController {

  private final AccountService accountService;
  private final EmailService emailService;
  private final VerificationService verificationService;
  private final CookiesService cookiesService;
  private final UserAuthProvider userAuthProvider;

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
      VerificationService verificationService,
      CookiesService cookiesService,
      UserAuthProvider userAuthProvider) {
    this.accountService = accountService;
    this.emailService = emailService;
    this.verificationService = verificationService;
    this.cookiesService = cookiesService;
    this.userAuthProvider = userAuthProvider;
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
      log.debug("Creating user with email: " + accountDto.getEmail());
      String auth0Id = accountService.createAccount(accountDto);
      log.debug("User created in Auth0 with ID: " + auth0Id);
      responseDto.setData(accountDto.getEmail());
      responseDto.setMessage("User created");
      log.debug("User created with Auth0 ID: " + auth0Id);
      responseDto.setStatusCode(HttpStatus.CREATED.value());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    } catch (AccountAlreadyExistsInAuth0 e) {
      log.debug("Account already exists with email: " + accountDto.getEmail());
      responseDto.setMessage("Account already exists");
      responseDto.setStatusCode(HttpStatus.CONFLICT.value());

      return ResponseEntity.status(HttpStatus.CONFLICT).body(responseDto);
    } catch (PasswordTooWeakException e) {
      log.debug("Password too weak for user with email: " + accountDto.getEmail());
      responseDto.setMessage("Password too weak");
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      log.debug("Unexpected error for user with email: " + accountDto.getEmail(), e);
      responseDto.setMessage("Error creating user:" + e.getMessage());
      responseDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * POST: Authenticate an Account.
   *
   * @param auth0AccountDto Auth0AccountDto object containing the account information.
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/login")
  public ResponseEntity<ResponseDto<CookiesDto>> login(
      @Valid @RequestBody Auth0AccountDto auth0AccountDto) {
    ResponseDto<CookiesDto> responseDto = new ResponseDto<>();
    boolean isValid = accountService.authenticateAccount(auth0AccountDto);

    if (isValid) {
      log.debug("User logged in with email: " + auth0AccountDto.getEmail());
      responseDto.setMessage("Login successful");
      responseDto.setStatusCode(HttpStatus.OK.value());
      log.debug("Cookies created for user: " + auth0AccountDto.getEmail());
      CookiesDto cookiesDto = cookiesService.createCookiesDto(auth0AccountDto.getEmail());
      cookiesDto.setJwtToken(userAuthProvider.createToken(auth0AccountDto.getEmail()));
      responseDto.setData(cookiesDto);

      return ResponseEntity.ok(responseDto);
    } else {
      log.debug("Invalid credentials for user with email: " + auth0AccountDto.getEmail());
      throw new InvalidCredentialsException("Invalid credentials");
    }
  }

  /**
   * POST: generate code to send to a user's email.
   *
   * @param requestBody email
   * @return ResponseEntity containing the response message.
   */
  @PostMapping("/send-code")
  public ResponseEntity<ResponseDto<String>> sendCode(@RequestBody Map<String, String> requestBody)
      throws AccountNotFoundException {
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
  public ResponseEntity<ResponseDto<CookiesDto>> validateCode(
      @RequestBody VerificationDto requestBody) {
    ResponseDto<CookiesDto> responseDto = new ResponseDto<>();
    String email = requestBody.getEmail();
    int code = requestBody.getCode();
    Account account = accountService.getAccountByEmail(email);
    verificationService.validateCode(account.getAccountId(), code);
    responseDto.setStatusCode(HttpStatus.CREATED.value());
    responseDto.setMessage("Code verified successfully");

    CookiesDto cookiesDto = cookiesService.createCookiesDto(email);
    cookiesDto.setJwtToken(userAuthProvider.createToken(email));

    responseDto.setData(cookiesDto);

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
