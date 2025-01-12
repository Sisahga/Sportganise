package com.sportganise.services.auth;

import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.repositories.AccountRepository;
import java.util.Map;
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

  /**
   * Method used for password reset in case of loss
   *
   * @param email email of the account
   * @param newPassword new password to be set
   * @return Map containing the response
   */
  public Map<String, Object> resetPassword(String email, String newPassword) {
    Account account =
        accountRepository
            .findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    String auth0Id = account.getAuth0Id();
    return auth0ApiService.changePassword(auth0Id, newPassword);
  }

  /**
   * Method used for password modification
   *
   * @param email email of the account
   * @param oldPassword old password
   * @param newPassword new password
   * @return Map containing the response
   */
  public Map<String, Object> modifyPassword(String email, String oldPassword, String newPassword) {
    Auth0AccountDto auth0Account = new Auth0AccountDto(email, oldPassword, null);

    return auth0ApiService.changePasswordWithOldPassword(auth0Account, newPassword);
  }

  /**
   * Method used to retrieve an account by its email
   *
   * @param email email of the account
   * @return Account object
   */
  public Account getAccountByEmail(String email) {
    return accountRepository
        .findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Account not found"));
  }
}
