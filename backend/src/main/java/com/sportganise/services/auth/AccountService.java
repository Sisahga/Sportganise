package com.sportganise.services.auth;

import com.sportganise.dto.accounts.UpdateAccountDto;
import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.BlobService;
import java.io.IOException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Implementation of AccountService. */
@Service
public class AccountService {

  private final AccountRepository accountRepository;
  private final Auth0ApiService auth0ApiService;
  private BlobService blobService;

  /**
   * Constructor for account service.
   *
   * @param accountRepository Account repository
   * @param auth0ApiService Authentication service
   * @param blobService File upload service
   */
  @Autowired
  public AccountService(
      AccountRepository accountRepository,
      Auth0ApiService auth0ApiService,
      BlobService blobService) {
    this.accountRepository = accountRepository;
    this.auth0ApiService = auth0ApiService;
    this.blobService = blobService;
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
   */
  public void updateAccount(Integer accountId, UpdateAccountDto updatedAccount)
      throws ResourceNotFoundException {
    Account previousAccount =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Failed to find account with id " + accountId));

    if (updatedAccount.getFirstName() != null) {
      previousAccount.setFirstName(updatedAccount.getFirstName());
    }
    if (updatedAccount.getLastName() != null) {
      previousAccount.setLastName(updatedAccount.getLastName());
    }
    if (updatedAccount.getPhone() != null) {
      previousAccount.setPhone(updatedAccount.getPhone());
    }
    if (updatedAccount.getEmail() != null) {
      previousAccount.setEmail(updatedAccount.getEmail());
    }

    accountRepository.save(previousAccount);
  }

  /**
   * Updates the picture URL of an account.
   *
   * @param accountId ID of the account.
   * @param file New profile picture of the account.
   */
  // TODO: clean-up unreferenced profile pictures from storage
  public void updateAccountPicture(Integer accountId, MultipartFile file)
      throws ResourceNotFoundException, IOException {

    // Validate account exists
    Account account =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Failed to find account with id " + accountId));

    // Upload file to data store
    String url = blobService.uploadFile(file);

    // Update account entity with new picture URL
    account.setPictureUrl(url);
    accountRepository.save(account);
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
