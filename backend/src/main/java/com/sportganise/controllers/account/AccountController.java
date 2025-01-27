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
import java.io.IOException;
import java.util.List;
import java.util.Optional;
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

  // GET: Account (1) by ID.
  @GetMapping("/{id}")
  public ResponseEntity<Optional<Account>> getAccount(@PathVariable Integer id) {
    log.info("Received request to get account.");
    return new ResponseEntity<>(this.accountService.getAccount(id), HttpStatus.OK);
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
  public ResponseEntity<Void> updateAccount(
      @PathVariable Integer accountId, @RequestBody @Valid UpdateAccountDto body) {
    log.info("Received request to update account.");

    try {
      this.accountService.updateAccount(accountId, body);
    } catch (AccountNotFoundException e) {
      log.warn("Request failed: " + e.getMessage());
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.noContent().build();
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
      log.warn("Request failed: " + e.getMessage());
      return ResponseDto.notFound(null, e.getMessage());
    } catch (IOException e) {
      log.warn("Request failed: " + e.getMessage());
      return ResponseDto.internalServerError(null, "Failed to upload file.");
    }

    return ResponseEntity.noContent().build();
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
      log.warn("Request failed: " + e.getMessage());
      return ResponseDto.notFound(null, e.getMessage());
    } catch (InvalidAccountTypeException e) {
      log.warn("Request failed: " + e.getMessage());
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
  public ResponseEntity<List<AccountDetailsDirectMessaging>> getAllUsers(
      @PathVariable int organizationId, @PathVariable int accountId) {
    log.info("Received request to list all users not blocked by account.");
    return new ResponseEntity<>(
        this.accountService.getAllNonBlockedAccountsByOrganizationId(organizationId, accountId),
        HttpStatus.OK);
  }

  /**
   * Gets all users and their role.
   *
   * @return The list of all users.
   */
  @GetMapping("/permissions")
  public ResponseEntity<List<AccountPermissions>> getAccountPermissions() {
    log.debug("Received request to list all accounts with permissions.");
    return ResponseEntity.ok(this.accountService.getAccountPermissions());
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
      @PathVariable Long accountId, @PathVariable Long orgId) {
    List<LabelDto> labels = accountService.getLabelsByAccountIdAndOrgId(accountId, orgId);
    ResponseDto<List<LabelDto>> responseDto = new ResponseDto<>();
    responseDto.setData(labels);
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Labels fetched successfully");

    return responseDto;
  }
}
