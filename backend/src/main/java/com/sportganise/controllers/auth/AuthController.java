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

  @PostMapping("/signup")
  public ResponseEntity<ResponseDto<String>> signup(@Valid @RequestBody AccountDto accountDTO) {
    ResponseDto<String> responseDTO = new ResponseDto<>();
    try {
      String auth0Id = accountService.createAccount(accountDTO);

      responseDTO.setData(auth0Id);
      responseDTO.setMessage("User created with Auth0 ID: " + auth0Id);
      responseDTO.setStatusCode(HttpStatus.CREATED.value());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    } catch (Exception e) {

      responseDTO.setMessage("Error creating user:" + e.getMessage());
      responseDTO.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDTO);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<ResponseDto<String>> login(
      @Valid @RequestBody Auth0AccountDto auth0AccountDTO) {
    ResponseDto<String> responseDTO = new ResponseDto<>();
    try {
      boolean isValid = accountService.authenticateAccount(auth0AccountDTO);

      if (isValid) {
        responseDTO.setMessage("Login successful");
        responseDTO.setStatusCode(HttpStatus.OK.value());

        return ResponseEntity.ok(responseDTO);
      } else {
        responseDTO.setMessage("Invalid credentials");
        responseDTO.setStatusCode(HttpStatus.UNAUTHORIZED.value());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseDTO);
      }
    } catch (Exception e) {
      responseDTO.setMessage("Error during login: " + e.getMessage());
      responseDTO.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDTO);
    }
  }
}
