package com.sportganise.controllers.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.entities.Account;
import com.sportganise.services.programsessions.ProgramService;
import com.sportganise.services.auth.AccountService;
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
 * REST Controller for managing 'Program' Entities. Handles HTTP request and routes them to
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
   * @param programId Id of program
   * @return HTTP Response
   */
  @GetMapping("/{accountId}/{sessionId}/details")
  public ResponseEntity<ProgramDetailsParticipantsDto> getProgramDetails(
      @PathVariable Integer programId, @PathVariable Integer accountId) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = accountService.getAccount(accountId);

    // Check if the value of getAccount is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual Account value of this user
    Account user = userOptional.get();

    // Fetch program details
    ProgramDto programDto = programService.getProgramDetails(programId);

    // Initialize the participants list as null
    List<ProgramParticipantDto> participants = null;

    // Check if this user has permissions to see training sessions attendees
    // (i.e. if the user is of type COACH or ADMIN)
    // If they have permission, then they can see the list of participants
    if (accountService.hasPermissions(user.getType())) {
      participants = programService.getParticipants(programId);
    }

    // Wrap program details and participants into the ProgramDetailsParticipantsDto response DTO
    ProgramDetailsParticipantsDto response = new ProgramDetailsParticipantsDto(programDto, participants);

    return ResponseEntity.ok(response);
  }
}

