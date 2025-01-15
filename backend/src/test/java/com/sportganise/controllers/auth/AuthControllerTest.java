package com.sportganise.controllers.auth;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.Address;
import com.sportganise.entities.Verification;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.account.auth.EmailService;
import com.sportganise.services.account.auth.VerificationService;
import java.util.Optional;
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc
public class AuthControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  @MockBean private EmailService emailService;

  @MockBean private VerificationService verificationService;

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
    accountDto.setAddress(
        Address.builder()
            .line("123 Something St")
            .city("Montreal")
            .province("Quebec")
            .country("Canada")
            .postalCode("H1I 2J3")
            .build());
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

  @Test
  @Order(6)
  public void sendCode_shouldCallServices() throws Exception {
    Mockito.when(accountService.getAccountByEmail(anyString())).thenReturn(mock(Account.class));
    Mockito.when(verificationService.createVerification(Mockito.any(Account.class)))
        .thenReturn(mock(Verification.class));
    mockMvc
        .perform(
            post("/api/auth/send-code")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"userx@example.com\"}"))
        .andExpect(status().isCreated());

    Mockito.verify(accountService).getAccountByEmail("userx@example.com");
    Mockito.verify(verificationService).createVerification(Mockito.any(Account.class));
    Mockito.verify(emailService).sendVerificationCode(anyString(), Mockito.anyInt());
  }

  @Test
  @Order(7)
  public void verifyCode_shouldCallServices() throws Exception {
    Mockito.when(accountService.getAccountByEmail(anyString())).thenReturn(mock(Account.class));
    Mockito.when(verificationService.validateCode(Mockito.anyInt(), Mockito.anyInt()))
        .thenReturn(Optional.ofNullable(mock(Verification.class)));
    mockMvc
        .perform(
            post("/api/auth/verify-code")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"userx@example.com\",\"code\":\"123456\"}"))
        .andExpect(status().isCreated());

    Mockito.verify(accountService).getAccountByEmail("userx@example.com");
    Mockito.verify(verificationService).validateCode(Mockito.anyInt(), Mockito.anyInt());
  }

  @Test
  @Order(8)
  public void resetPassword_shouldCallAccountService() throws Exception {
    String requestBody = "{\"email\":\"userx@example.com\",\"newPassword\":\"newPassword123\"}";

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isOk());

    Mockito.verify(accountService).resetPassword("userx@example.com", "newPassword123");
  }

  @Test
  @Order(9)
  public void modifyPassword_shouldCallAccountService() throws Exception {
    String requestBody =
        "{\"email\":\"userx@example.com\",\"oldPassword\":\"oldPassword123\",\"newPassword\":\"newPassword123\"}";

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/auth/modify-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isOk());

    Mockito.verify(accountService)
        .modifyPassword("userx@example.com", "oldPassword123", "newPassword123");
  }
}
