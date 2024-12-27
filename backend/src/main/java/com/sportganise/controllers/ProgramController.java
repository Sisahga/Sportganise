package com.sportganise.controllers;

import com.sportganise.dto.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.services.AccountService;
import com.sportganise.services.ProgramService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Account' Entities. Handles HTTP request and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/programs")
@CrossOrigin(origins = "*")
public class ProgramController {
  private final ProgramService programService;
  private final AccountService accountService;

  public ProgramController(ProgramService programService, AccountService accountService) {
    this.programService = programService;
    this.accountService = accountService;
  }

  /**
   * Get mapping for program session details.
   *
   * @param accountId Id of account
   * @param sessionId Id of session
   * @return HTTP Response
   */
  @GetMapping("/{accountId}/{sessionId}/details")
  public ResponseEntity<List<ProgramParticipantDto>> getParticipantsInSession(
      @PathVariable Integer sessionId, Integer accountId) {
    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = accountService.getAccount(accountId);

    // Check if there is the value of getAccount is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual Account value of this user
    Account user = userOptional.get();

    // Check if this user has permissions to see training sessions attendees
    if (!accountService.hasPermissions(user.getType())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Retrieve the list of attendees of the training session
    List<ProgramParticipantDto> attendees = programService.getParticipants(sessionId);
    return ResponseEntity.ok(attendees);
  }
}
