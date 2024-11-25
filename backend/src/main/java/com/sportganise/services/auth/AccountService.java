package com.sportganise.services.auth;

import com.sportganise.dto.auth.AccountDTO;
import com.sportganise.dto.auth.Auth0AccountDTO;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;

import java.util.Optional;

import org.springframework.stereotype.Service;

/** Implementation of AccountService. */
@Service
public class AccountService {

  private final AccountRepository accountRepository;
  private final Auth0ApiService auth0ApiService;

  public AccountService(AccountRepository accountRepository, Auth0ApiService auth0ApiService) {
    this.accountRepository = accountRepository;
    this.auth0ApiService = auth0ApiService;
  }

  /**
   * Creates an account in the database and in Auth0.
   *
   * @param accountDTO Account data.
   * @return Auth0 ID of the created account.
   */
  public String createAccount(AccountDTO accountDTO) {
    try {
      Auth0AccountDTO auth0AccountDTO = new Auth0AccountDTO(
              accountDTO.getEmail(),
              accountDTO.getPassword(),
              "Username-Password-Authentication"
      );
      String auth0Id = auth0ApiService.createUserInAuth0(auth0AccountDTO);

      Account account = new Account();
      account.setAuth0Id(auth0Id);
      account.setEmail(accountDTO.getEmail());
      account.setFirstName(accountDTO.getFirstName());
      account.setLastName(accountDTO.getLastName());
      account.setPhone(accountDTO.getPhone());
      account.setAddress(accountDTO.getAddress());
      account.setType(accountDTO.getType());
      accountRepository.save(account);

      return auth0Id;
    } catch (Exception e) {
      throw new RuntimeException("Failed to create account: " + e.getMessage(), e);
    }
  }

  /**
   * Authenticates an account in Auth0.
   *
   * @param auth0AccountDTO Account data.
   * @return True if the account is authenticated, false otherwise.
   */
  public boolean authenticateAccount(Auth0AccountDTO auth0AccountDTO) {
    return auth0ApiService.verifyPassword(auth0AccountDTO);
  }

  public Optional<Account> getAccount(Integer id) {
    return accountRepository.findById(id);
  }

}
