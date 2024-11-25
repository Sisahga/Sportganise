package com.sportganise.controllers.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.services.auth.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc
public class AuthControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  private ObjectMapper objectMapper;
  private AccountDto accountDto;
  private Auth0AccountDto auth0AccountDto;

  @BeforeEach
  public void setup() {
    objectMapper = new ObjectMapper();
    accountDto = new AccountDto();
    accountDto.setEmail("userx@example.com");
    accountDto.setPassword("password!123");
    accountDto.setFirstName("John");
    accountDto.setLastName("Doe");
    accountDto.setPhone("555-555-5555");
    accountDto.setAddress("maisonneuve");
    accountDto.setType("general");

    auth0AccountDto = new Auth0AccountDto("userx@example.com", "password!123", null);
  }

  @Test
  @Order(1)
  public void signup_shouldreturn_success() throws Exception {
    Mockito.when(accountService.createAccount(Mockito.any(AccountDto.class))).thenReturn("auth0Id");

    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(accountDto)))
        .andExpect(status().isCreated());
  }

  @Test
  @Order(2)
  public void login_shouldReturnSuccess() throws Exception {
    Mockito.when(accountService.authenticateAccount(Mockito.any(Auth0AccountDto.class)))
        .thenReturn(true);

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(auth0AccountDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Login successful"))
        .andExpect(jsonPath("$.statusCode").value(200));
  }

  @Test
  @Order(3)
  public void login_shouldReturnUnauthorized() throws Exception {
    Mockito.when(accountService.authenticateAccount(Mockito.any(Auth0AccountDto.class)))
        .thenReturn(false);

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(auth0AccountDto)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Invalid credentials"))
        .andExpect(jsonPath("$.statusCode").value(401));
  }

  @Test
  @Order(4)
  public void signup_shouldReturnGenericException() throws Exception {
    Mockito.when(accountService.createAccount(Mockito.any(AccountDto.class)))
        .thenThrow(new RuntimeException("Internal server error"));

    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(accountDto)))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.message").value("Error creating user:Internal server error"))
        .andExpect(jsonPath("$.statusCode").value(500));
  }

  @Test
  @Order(5)
  public void login_shouldReturnGenericException() throws Exception {
    Mockito.when(accountService.authenticateAccount(Mockito.any(Auth0AccountDto.class)))
        .thenThrow(new RuntimeException("Internal server error"));

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(auth0AccountDto)))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.message").value("Error during login: Internal server error"))
        .andExpect(jsonPath("$.statusCode").value(500));
  }
}
