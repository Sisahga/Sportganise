package com.sportganise.services.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

  @Mock private AccountRepository accountRepository;

  @Mock private Auth0ApiService auth0ApiService;

  @InjectMocks private AccountService accountService;

  private AccountDto accountDto;
  private Auth0AccountDto auth0AccountDto;

  @BeforeEach
  public void setup() {
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
  public void authenticateAccount_shouldReturnTrue() {
    given(auth0ApiService.verifyPassword(any(Auth0AccountDto.class))).willReturn(true);

    boolean isAuthenticated = accountService.authenticateAccount(auth0AccountDto);
    assertTrue(isAuthenticated);

    verify(auth0ApiService, times(1)).verifyPassword(any(Auth0AccountDto.class));
  }

  @Test
  public void authenticateAccount_shouldReturnFalse() {
    given(auth0ApiService.verifyPassword(any(Auth0AccountDto.class))).willReturn(false);

    boolean isAuthenticated = accountService.authenticateAccount(auth0AccountDto);
    assertFalse(isAuthenticated);

    verify(auth0ApiService, times(1)).verifyPassword(any(Auth0AccountDto.class));
  }

  @Test
  public void createAccount_shouldThrowException() {
    given(accountRepository.save(any(Account.class)))
        .willThrow(new RuntimeException("Internal server error"));

    Exception exception =
        assertThrows(
            RuntimeException.class,
            () -> {
              accountService.createAccount(accountDto);
            });

    assertEquals("Failed to create account: Internal server error", exception.getMessage());

    verify(accountRepository, times(1)).save(any(Account.class));
  }

  @Test
  public void createAccount_shouldReturnAuth0Id() {
    Account account = new Account();
    account.setAuth0Id("auth0Id");
    given(accountRepository.save(any(Account.class))).willReturn(account);
    given(auth0ApiService.createUserInAuth0(any(Auth0AccountDto.class))).willReturn("auth0Id");

    String auth0Id = accountService.createAccount(accountDto);
    assertEquals("auth0Id", auth0Id);

    verify(accountRepository, times(1)).save(any(Account.class));
  }

  @Test
  public void resetPassword_shouldReturnSuccessMessage() {
    String email = "userx@example.com";
    String newPassword = "newPassword!123";
    Account mockAccount = new Account();
    mockAccount.setAuth0Id("mockAuth0Id");

    given(accountRepository.findByEmail(email)).willReturn(java.util.Optional.of(mockAccount));
    given(auth0ApiService.changePassword(anyString(), anyString()))
        .willReturn(Map.of("message", "Password updated successfully", "user", "mockUserDetails"));

    Map<String, Object> result = accountService.resetPassword(email, newPassword);

    assertEquals("Password updated successfully", result.get("message"));
    assertEquals("mockUserDetails", result.get("user"));

    verify(auth0ApiService, times(1)).changePassword("mockAuth0Id", newPassword);
    verify(accountRepository, times(1)).findByEmail(email);
  }

  @Test
  public void resetPassword_shouldThrowExceptionWhenAccountNotFound() {
    String email = "userx@example.com";
    String newPassword = "newPassword!123";

    given(accountRepository.findByEmail(email)).willReturn(java.util.Optional.empty());

    Exception exception =
        assertThrows(
            RuntimeException.class,
            () -> {
              accountService.resetPassword(email, newPassword);
            });

    assertEquals("Account not found", exception.getMessage());

    verify(accountRepository, times(1)).findByEmail(email);
  }

  @Test
  public void modifyPassword_shouldReturnSuccessMessage() {
    String email = "userx@example.com";
    String oldPassword = "oldPassword!123";
    String newPassword = "newPassword!123";
    Account mockAccount = new Account();
    mockAccount.setAuth0Id("mockAuth0Id");

    given(auth0ApiService.changePasswordWithOldPassword(any(Auth0AccountDto.class), anyString()))
        .willReturn(Map.of("message", "Password updated successfully", "user", "mockUserDetails"));

    Map<String, Object> result = accountService.modifyPassword(email, oldPassword, newPassword);

    assertEquals("Password updated successfully", result.get("message"));
    assertEquals("mockUserDetails", result.get("user"));

    verify(auth0ApiService, times(1))
        .changePasswordWithOldPassword(any(Auth0AccountDto.class), eq(newPassword));
  }

}
