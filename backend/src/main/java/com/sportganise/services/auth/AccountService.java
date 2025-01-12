package com.sportganise.services.auth;

import com.sportganise.dto.accounts.UpdateAccountDto;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.ResourceNotFoundException;
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
   * @param accountDto Account data.
   * @return Auth0 ID of the created account.
   */
  public String createAccount(AccountDto accountDto) {
    try {
      Auth0AccountDto auth0AccountDto =
          new Auth0AccountDto(
              accountDto.getEmail(), accountDto.getPassword(), "Username-Password-Authentication");
      String auth0Id = auth0ApiService.createUserInAuth0(auth0AccountDto);

      Account account = new Account();
      account.setAuth0Id(auth0Id);
      account.setEmail(accountDto.getEmail());
      account.setFirstName(accountDto.getFirstName());
      account.setLastName(accountDto.getLastName());
      account.setPhone(accountDto.getPhone());
      account.setAddress(accountDto.getAddress());
      account.setType(accountDto.getType());
      accountRepository.save(account);

      return auth0Id;
    } catch (Exception e) {
      throw new RuntimeException("Failed to create account: " + e.getMessage(), e);
    }
  }

  /**
   * Updates an account in the database.
   *
   * @param accountId ID of the account.
   * @param updatedAccount The new account data.
   * @throws ResourceNotFoundException
   */
  public void updateAccount(Integer accountId, UpdateAccountDto updatedAccount)
      throws ResourceNotFoundException {
    Account previousAccount =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Failed to find account with id " + accountId));

    if (updatedAccount.getFirstName() != null)
      previousAccount.setFirstName(updatedAccount.getFirstName());
    if (updatedAccount.getLastName() != null)
      previousAccount.setLastName(updatedAccount.getLastName());
    if (updatedAccount.getPhone() != null) previousAccount.setPhone(updatedAccount.getPhone());
    if (updatedAccount.getEmail() != null) previousAccount.setEmail(updatedAccount.getEmail());

    accountRepository.save(previousAccount);
  }

  /**
   * Authenticates an account in Auth0.
   *
   * @param auth0AccountDto Account data.
   * @return True if the account is authenticated, false otherwise.
   */
  public boolean authenticateAccount(Auth0AccountDto auth0AccountDto) {
    return auth0ApiService.verifyPassword(auth0AccountDto);
  }

  public Optional<Account> getAccount(Integer id) {
    return accountRepository.findById(id);
  }

  /**
   * Method to check if user has role with permissions.
   *
   * @param roleType string
   * @return True if user is an ADMIN or COACH, false otherwise
   */
  public boolean hasPermissions(String roleType) {
    return roleType.equals("ADMIN") || roleType.equals("COACH");
  }
}
