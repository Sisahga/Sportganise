package com.sportganise.controllers.account;

import com.sportganise.dto.LabelDto;
import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.AccountPermissions;
import com.sportganise.dto.account.UpdateAccountDto;
import com.sportganise.dto.account.UpdateAccountTypeDto;
import com.sportganise.entities.account.Account;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.InvalidAccountTypeException;
import com.sportganise.services.account.AccountService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
import java.io.IOException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for managing 'Account' Entities.
 *
 * <p>Handles HTTP request and routes them to appropriate services.
 */
@Slf4j
@RestController
@RequestMapping("/api/account")
public class AccountController {

  private final AccountService accountService;
  private List<LabelDto> labelsByAccountIdAndOrgId;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/")
  public String index() {
    return "Welcome to Sportganise";
  }

  /**
   * Fetches an account by id.
   *
   * @param id ID of the account.
   * @return ResponseDto containing the fetched account.
   */
  @GetMapping("/{id}")
  public ResponseEntity<ResponseDto<Account>> getAccount(@PathVariable Integer id) {
    log.debug("Received request to get account.");
    Account account = this.accountService.getAccount(id);
    ResponseDto<Account> responseDto =
        ResponseDto.<Account>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Account fetched successfully")
            .data(account)
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Updates an accounts public-facing fields, except for the profile picture.
   *
   * @param accountId ID of the account.
   * @param body The updated fields of the account.
   * @return The status of the update, 204 No Content for successful updates and an error code
   *     otherwise.
   */
  @PutMapping("/{accountId}")
  public ResponseEntity<ResponseDto<Null>> updateAccount(
      @PathVariable Integer accountId, @RequestBody @Valid UpdateAccountDto body) {
    log.info("Received request to update account.");

    try {
      this.accountService.updateAccount(accountId, body);
    } catch (AccountNotFoundException e) {
      log.warn("Request failed for updating account (not found): {}", e.getMessage());
      throw new AccountNotFoundException(e.getMessage());
    }

    ResponseDto<Null> responseDto =
        ResponseDto.<Null>builder()
            .statusCode(HttpStatus.NO_CONTENT.value())
            .message("Account updated successfully")
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Updates the profile picture of an account.
   *
   * @param accountId ID of the account.
   * @param file The picture blob.
   * @return The status of the update.
   */
  @PutMapping("/{accountId}/picture")
  public ResponseEntity<ResponseDto<Void>> updateAccountPicture(
      @PathVariable Integer accountId, @RequestParam("file") MultipartFile file) {
    log.info("Received request to update account picture.");

    try {
      this.accountService.updateAccountPicture(accountId, file);
    } catch (AccountNotFoundException e) {
      log.warn("Account not found when updating picture: {}", e.getMessage());
      return ResponseDto.notFound(null, e.getMessage());
    } catch (IOException e) {
      log.warn("Failed to update profile picture: {}", e.getMessage());
      return ResponseDto.internalServerError(null, "Failed to upload file.");
    }

    ResponseDto<Void> responseDto =
        ResponseDto.<Void>builder()
            .statusCode(HttpStatus.NO_CONTENT.value())
            .message("Account picture updated successfully")
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Updates the permissions of an account.
   *
   * @param accountId ID of the account.
   * @param body Contains the new role of the account.
   * @return The status of the update.
   */
  @PutMapping("/{accountId}/type")
  public ResponseEntity<ResponseDto<Void>> updateAccountType(
      @PathVariable Integer accountId, @RequestBody @Valid UpdateAccountTypeDto body) {
    // TODO: only admin users should be authorized to this endpoint
    log.info("Received request to update account type.");

    String newType = body.getType();
    if (newType == null) {
      log.warn("Request failed: Missing 'type' to update account type.");
      return ResponseDto.badRequest(null, "Missing 'type' to update account type.");
    }

    try {
      this.accountService.updateAccountRole(accountId, newType);
    } catch (AccountNotFoundException e) {
      log.warn("Account Not Found: {}", e.getMessage());
      return ResponseDto.notFound(null, e.getMessage());
    } catch (InvalidAccountTypeException e) {
      log.warn("Invalid Account Type: {}", e.getMessage());
      return ResponseDto.badRequest(null, e.getMessage());
    }

    return ResponseEntity.noContent().build();
  }

  /**
   * Gets all users in an organization that aren't blocked by the user or vice-versa.
   *
   * @param organizationId The ID of the organization.
   * @param accountId The ID of the account.
   * @return A list of all users in the organization that aren't blocked by the user or vice-versa.
   */
  @GetMapping("/get-all-users/{organizationId}/{accountId}")
  public ResponseEntity<ResponseDto<List<AccountDetailsDirectMessaging>>> getAllUsers(
      @PathVariable int organizationId, @PathVariable int accountId) {
    log.info("Received request to list all users not blocked by account.");
    List<AccountDetailsDirectMessaging> users =
        this.accountService.getAllNonBlockedAccountsByOrganizationId(organizationId, accountId);
    ResponseDto<List<AccountDetailsDirectMessaging>> responseDto =
        ResponseDto.<List<AccountDetailsDirectMessaging>>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Users fetched successfully")
            .data(users)
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Gets all users and their role.
   *
   * @return The list of all users.
   */
  @GetMapping("/permissions")
  public ResponseEntity<ResponseDto<List<AccountPermissions>>> getAccountPermissions() {
    log.debug("Received request to list all accounts with permissions.");
    List<AccountPermissions> permissions = this.accountService.getAccountPermissions();
    ResponseDto<List<AccountPermissions>> responseDto =
        ResponseDto.<List<AccountPermissions>>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Permissions fetched successfully")
            .data(permissions)
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Fetches all labels by account ID and organization ID.
   *
   * @param accountId ID of the account.
   * @param orgId ID of the organization.
   * @return ResponseDto containing the fetched labels.
   */
  @GetMapping("/{accountId}/{orgId}/labels")
  public ResponseDto<List<LabelDto>> getLabelsByAccountIdAndOrgId(
      @PathVariable Integer accountId, @PathVariable Integer orgId) {
    List<LabelDto> labels = accountService.getLabelsByAccountIdAndOrgId(accountId, orgId);
    ResponseDto<List<LabelDto>> responseDto = new ResponseDto<>();
    responseDto.setData(labels);
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Labels fetched successfully");

    return responseDto;
  }
}
