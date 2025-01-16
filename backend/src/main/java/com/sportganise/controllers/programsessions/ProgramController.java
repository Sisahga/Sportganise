package com.sportganise.controllers.programsessions;

import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Program' Entities. Handles HTTP request and
 * routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/programs")
public class ProgramController {
  private final ProgramService programService;
  private final AccountService accountService;

  @Autowired
  public ProgramController(ProgramService programService, AccountService accountService) {
    this.programService = programService;
    this.accountService = accountService;
  }

  /** Helper method to fetch and validate user account based on accountId. */
  private Optional<Account> getAccount(Integer accountId) {
    return accountService.getAccount(accountId);
  }

  /** Helper method to check user permissions. */
  private boolean hasPermissions(Account user) {
    return accountService.hasPermissions(user.getType());
  }

  /** Helper method to extract fields from payload. */
  private Map<String, Object> extractPayloadFields(Map<String, Object> payload) {
    return payload;
  }

  /**
   * Get mapping for program session details.
   *
   * @param accountId Id of account
   * @return HTTP Response
   */
  @GetMapping("/{accountId}/details")
  public ResponseEntity<List<ProgramDetailsParticipantsDto>> getProgramDetails(
      @PathVariable Integer accountId) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // Fetch program details
    List<ProgramDto> programDtos = programService.getPrograms();

    // Check if the value of programDtoOptional is null
    if (programDtos.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Initialize a list of participants and a list of all programs as an empty/null
    // arraylist
    List<ProgramDetailsParticipantsDto> allPrograms = new ArrayList<>();

    Boolean canDisplayAttendees = false;

    // Check if this user has permissions to see training sessions attendees
    // (i.e. if the user is of type COACH or ADMIN)
    // If they have permission, then they can see the list of participants
    if (hasPermissions(user)) {
      canDisplayAttendees = true;
    }

    allPrograms = programService.getProgramDetailsParticipantsDto(programDtos, canDisplayAttendees);

    return ResponseEntity.ok(allPrograms);
  }

  /**
   * Post mapping for creating new program.
   *
   * @param accountId Id of user who is making the request.
   * @param payload   Json payload passed from frontend.
   * @return HTTP Response for newly created program.
   */
  @PostMapping("/{accountId}/create-program")
  public ResponseEntity<ProgramDto> createProgram(
      @PathVariable Integer accountId, @RequestBody Map<String, Object> payload) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // If user is not a COACH or ADMIN then they will get an error
    // as they are not allowed to access this feature
    if (!hasPermissions(user)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    try {
      Map<String, Object> fields = extractPayloadFields(payload);
      ProgramDto newProgramDto = programService.createProgramDto(
          (String) fields.get("title"),
          (String) fields.get("type"),
          (String) fields.get("start_date"),
          (String) fields.get("end_date"),
          (Boolean) fields.get("recurring"),
          (String) fields.get("visibility"),
          (String) fields.get("description"),
          (Integer) fields.get("capacity"),
          (Boolean) fields.get("notify"),
          (String) fields.get("start_time"),
          (String) fields.get("end_time"),
          (String) fields.get("location"),
          (List<Map<String, String>>) fields.get("attachment"));

      return new ResponseEntity<>(newProgramDto, HttpStatus.CREATED);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  /**
   * Put mapping for modifying/updating an existing program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to modify.
   * @param payload   Json payload passed from frontend.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{programId}/modify-program")
  ResponseEntity<ProgramDto> modifyProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestBody Map<String, Object> payload) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // If user is not a COACH or ADMIN then they will get an error
    // as they are not allowed to access this feature
    if (!hasPermissions(user)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Fetch program details
    ProgramDto programDtoToModify = programService.getProgramDetails(programId);

    // Check if the value of programDtoOptional is null
    if (programDtoToModify == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    try {
      Map<String, Object> fields = extractPayloadFields(payload);
      // We pass the programdto of the program to be modified along with the new
      // values
      ProgramDto updatedProgramDto = programService.modifyProgram(
          programDtoToModify,
          (String) fields.get("title"),
          (String) fields.get("type"),
          (String) fields.get("start_date"),
          (String) fields.get("end_date"),
          (Boolean) fields.get("recurring"),
          (String) fields.get("visibility"),
          (String) fields.get("description"),
          (Integer) fields.get("capacity"),
          (Boolean) fields.get("notify"),
          (String) fields.get("start_time"),
          (String) fields.get("end_time"),
          (String) fields.get("location"),
          (List<Map<String, String>>) fields.get("attachment"));
      return new ResponseEntity<>(updatedProgramDto, HttpStatus.OK);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
