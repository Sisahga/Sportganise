package com.sportganise.controllers.auth;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.services.auth.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

  public AuthController(AccountService accountService) {
    this.accountService = accountService;
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
}
