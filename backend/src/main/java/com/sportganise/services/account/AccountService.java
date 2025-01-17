package com.sportganise.services.account;

import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.AccountPermissions;
import com.sportganise.dto.account.UpdateAccountDto;
import com.sportganise.dto.account.auth.AccountDto;
import com.sportganise.dto.account.auth.Auth0AccountDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import com.sportganise.exceptions.AccountAlreadyExistsInAuth0;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.PasswordTooWeakException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.organization.AccountOrganizationRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.auth.Auth0ApiService;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Implementation of AccountService. */
@Slf4j
@Service
public class AccountService {

  private final AccountRepository accountRepository;
  private final Auth0ApiService auth0ApiService;
  private final BlobService blobService;
  private final AccountOrganizationRepository accountOrganizationRepository;

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
      BlobService blobService,
      AccountOrganizationRepository accountOrganizationRepository) {
    this.accountRepository = accountRepository;
    this.auth0ApiService = auth0ApiService;
    this.blobService = blobService;
    this.accountOrganizationRepository = accountOrganizationRepository;
  }

  /**
   * Creates an account in the database and in Auth0.
   *
   * @param accountDto Account data.
   * @return Auth0 ID of the created account.
   */
  public String createAccount(AccountDto accountDto)
      throws AccountAlreadyExistsInAuth0, PasswordTooWeakException {

    log.debug("Creating account in AccountService with email: " + accountDto.getEmail());
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
  }

  /**
   * Updates an account in the database.
   *
   * @param accountId ID of the account.
   * @param updatedAccount The new account data.
   */
  public void updateAccount(Integer accountId, UpdateAccountDto updatedAccount)
      throws AccountNotFoundException {
    Account previousAccount =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new AccountNotFoundException("Failed to find account with id " + accountId));

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
    if (updatedAccount.getAddress() != null) {
      Address updatedAddress = updatedAccount.getAddress();
      Address previousAddress = previousAccount.getAddress();
      if (previousAddress == null) {
        previousAddress = new Address();
      }

      if (updatedAddress.getLine() != null) {
        previousAddress.setLine(updatedAddress.getLine());
      }
      if (updatedAddress.getCity() != null) {
        previousAddress.setCity(updatedAddress.getCity());
      }
      if (updatedAddress.getProvince() != null) {
        previousAddress.setProvince(updatedAddress.getLine());
      }
      if (updatedAddress.getCountry() != null) {
        previousAddress.setCountry(updatedAddress.getCountry());
      }
      if (updatedAddress.getPostalCode() != null) {
        previousAddress.setPostalCode(updatedAddress.getPostalCode());
      }

      previousAccount.setAddress(previousAddress);
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
      throws AccountNotFoundException, IOException {

    // Validate account exists
    Account account =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new AccountNotFoundException("Failed to find account with id " + accountId));

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
   * Lists all account with their permissions.
   *
   * @return A list of all accounts with their permissions.
   */
  public List<AccountPermissions> getAccountPermissions() {
    return accountRepository.findAccountPermissions();
  }

  /**
   * Method to check if user has role with permissions.
   *
   * @param roleType string
   * @return True if user is an ADMIN or COACH, false otherwise
   */
  public boolean hasPermissions(AccountType roleType) {
    return roleType.equals(AccountType.ADMIN) || roleType.equals(AccountType.COACH);
  }

  /**
   * Method used for password reset in case of loss.
   *
   * @param email email of the account
   * @param newPassword new password to be set
   * @return Map containing the response
   */
  public Map<String, Object> resetPassword(String email, String newPassword)
      throws AccountNotFoundException {
    Account account = getAccountByEmail(email);
    String auth0Id = account.getAuth0Id();
    return auth0ApiService.changePassword(auth0Id, newPassword);
  }

  /**
   * Method used for password modification.
   *
   * @param email email of the account
   * @param oldPassword old password
   * @param newPassword new password
   * @return Map containing the response
   */
  public Map<String, Object> modifyPassword(String email, String oldPassword, String newPassword)
      throws AccountNotFoundException {
    Auth0AccountDto auth0Account = new Auth0AccountDto(email, oldPassword, null);

    return auth0ApiService.changePasswordWithOldPassword(auth0Account, newPassword);
  }

  /**
   * Method used to retrieve an account by its email.
   *
   * @param email email of the account
   * @return Account object
   */
  public Account getAccountByEmail(String email) throws AccountNotFoundException {
    return accountRepository
        .findByEmail(email)
        .orElseThrow(() -> new AccountNotFoundException("Account not found"));
  }

  public List<AccountDetailsDirectMessaging> getAllNonBlockedAccountsByOrganizationId(
      int organizationId, int currentUserId) {
    return accountRepository.getAllNonBlockedAccountsByOrganization(organizationId, currentUserId);
  }

  public List<Integer> getOrganizationIdsByAccountId(int accountId) {
    return accountOrganizationRepository.getOrganizationIdsByAccountId(accountId);
  }
}
