package com.sportganise.services.auth;

import com.sportganise.dto.auth.AccountDTO;
import com.sportganise.dto.auth.Auth0AccountDTO;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private Auth0ApiService auth0ApiService;

    @InjectMocks
    private AccountService accountService;

    private AccountDTO accountDTO;
    private Auth0AccountDTO auth0AccountDTO;

    @BeforeEach
    public void setup() {
        accountDTO = new AccountDTO();
        accountDTO.setEmail("userx@example.com");
        accountDTO.setPassword("password!123");
        accountDTO.setFirstName("John");
        accountDTO.setLastName("Doe");
        accountDTO.setPhone("555-555-5555");
        accountDTO.setAddress("maisonneuve");
        accountDTO.setType("general");

        auth0AccountDTO = new Auth0AccountDTO("userx@example.com", "password!123", null);
    }


    @Test
    public void authenticateAccount_shouldReturnTrue() {
        given(auth0ApiService.verifyPassword(any(Auth0AccountDTO.class))).willReturn(true);

        boolean isAuthenticated = accountService.authenticateAccount(auth0AccountDTO);
        assertTrue(isAuthenticated);

        verify(auth0ApiService, times(1)).verifyPassword(any(Auth0AccountDTO.class));
    }

    @Test
    public void authenticateAccount_shouldReturnFalse() {
        given(auth0ApiService.verifyPassword(any(Auth0AccountDTO.class))).willReturn(false);

        boolean isAuthenticated = accountService.authenticateAccount(auth0AccountDTO);
        assertFalse( isAuthenticated);

        verify(auth0ApiService, times(1)).verifyPassword(any(Auth0AccountDTO.class));
    }

    @Test
    public void createAccount_shouldThrowException() {
        given(accountRepository.save(any(Account.class))).willThrow(new RuntimeException("Internal server error"));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            accountService.createAccount(accountDTO);
        });

        assertEquals("Failed to create account: Internal server error", exception.getMessage());

        verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    public void createAccount_shouldReturnAuth0Id() {
        Account account = new Account();
        account.setAuth0Id("auth0Id");
        given(accountRepository.save(any(Account.class))).willReturn(account);
        given(auth0ApiService.createUserInAuth0(any(Auth0AccountDTO.class))).willReturn("auth0Id");


        String auth0Id = accountService.createAccount(accountDTO);
        assertEquals("auth0Id", auth0Id);

        verify(accountRepository, times(1)).save(any(Account.class));
    }
}