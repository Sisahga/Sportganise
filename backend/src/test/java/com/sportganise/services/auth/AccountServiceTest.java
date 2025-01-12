package com.sportganise.services.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.sportganise.dto.accounts.UpdateAccountDto;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.AccountRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
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

  @Nested
  class AuthTests {

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

  @Nested
  class UpdateAccount {
    Account originalAccount;

    @BeforeEach
    public void setup() {
      originalAccount =
          new Account(
              1,
              "general",
              "john@email.com",
              "auth0|6743f6a0f0ab0e76ba3d7ceb",
              "lorem",
              "1231231234",
              "John",
              "Doe",
              null);
    }

    @Test
    public void updateAccountTest_SuccessPartialUpdate() {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount = new UpdateAccountDto();
      newAccount.setFirstName("John2");

      accountService.updateAccount(accountId, newAccount);

      originalAccount.setFirstName("John2");
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_SuccessFullUpdate() {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount =
          new UpdateAccountDto("John2", "Doe2", "john2@email.com", "2222222222", "lorem2");

      accountService.updateAccount(accountId, newAccount);

      originalAccount.setFirstName("John2");
      originalAccount.setLastName("Doe2");
      originalAccount.setEmail("john2@email.com");
      originalAccount.setPhone("2222222222");
      originalAccount.setAddress("lorem2");
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_SuccessNoUpdate() {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount = new UpdateAccountDto(null, null, null, null, null);

      accountService.updateAccount(accountId, newAccount);

      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_NotFound() {
      given(accountRepository.findById(anyInt())).willReturn(Optional.empty());

      int notAccountId = 2;
      UpdateAccountDto newAccount =
          new UpdateAccountDto("John", "Doe", "john@email.com", "1231231234", "lorem");

      assertThrows(
          ResourceNotFoundException.class,
          () -> accountService.updateAccount(notAccountId, newAccount));

      verify(accountRepository, times(1)).findById(notAccountId);
      verify(accountRepository, times(0)).save(any());
    }
  }
}
