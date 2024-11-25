package com.sportganise.services.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
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
}
