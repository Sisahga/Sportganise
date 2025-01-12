package com.sportganise.controllers.programsessions;

import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.services.auth.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing 'Program' Entities. Handles HTTP request and routes them to
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

  /**
   * Get mapping for program session details.
   *
   * @param accountId Id of account
   * @param programId Id of program
   * @return HTTP Response
   */
  @GetMapping("/{accountId}/{programId}/details")
  public ResponseEntity<ProgramDetailsParticipantsDto> getProgramDetails(
      @PathVariable Integer accountId, @PathVariable Integer programId) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = accountService.getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // Fetch program details
    ProgramDto programDto = programService.getProgramDetails(programId);

    // Check if the value of programDtoOptional is null
    if (programDto == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Initialize a list of AccountDto as an empty/null arraylist
    List<ProgramParticipantDto> participants = new ArrayList<>();

    // Check if this user has permissions to see training sessions attendees
    // (i.e. if the user is of type COACH or ADMIN)
    // If they have permission, then they can see the list of participants
    if (accountService.hasPermissions(user.getType())) {
      participants = programService.getParticipants(programId);
    }

    // Wrap program details and participants into the ProgramDetailsParticipantsDto
    // response DTO
    ProgramDetailsParticipantsDto response =
        new ProgramDetailsParticipantsDto(programDto, participants);

    return ResponseEntity.ok(response);
  }

  /**
   * Get mapping for creating new program.
   *
   * @param accountId Id of user who is making the request.
   * @param payload Json payload passed from frontend.
   * @return HTTP Response for newly created program.
   */
  @PostMapping("/{accountId}/create-program")
  public ResponseEntity<ProgramDto> createProgram(
      @PathVariable Integer accountId, @RequestBody Map<String, Object> payload) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = accountService.getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // If user is not a COACH or ADMIN then they will get an error
    // as they are not allowed to access this feature
    if (!accountService.hasPermissions(user.getType())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Call the service createProgramDto method to handle program creation
    try {
      String title = (String) payload.get("title");
      String programType = (String) payload.get("type");
      String startDate = (String) payload.get("start_date");
      String endDate = (String) payload.get("end_date");
      Boolean isRecurring = (Boolean) payload.get("recurring");
      String visibility = (String) payload.get("visibility");
      String description = (String) payload.get("description");
      Integer capacity = (Integer) payload.get("capacity");
      Boolean notify = (Boolean) payload.get("notify");
      String startTime = (String) payload.get("start_time");
      String endTime = (String) payload.get("end_time");
      String location = (String) payload.get("location");

      // Extract and process attachments
      @SuppressWarnings("unchecked")
      List<Map<String, String>> attachments = (List<Map<String, String>>) payload.get("attachment");

      ProgramDto programDto =
          programService.createProgramDto(
              title,
              programType,
              startDate,
              endDate,
              isRecurring,
              visibility,
              description,
              capacity,
              notify,
              startTime,
              endTime,
              location,
              attachments);
      return new ResponseEntity<>(programDto, HttpStatus.CREATED);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  /**
   * Put mapping for modifying/updating an existing program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to modify.
   * @param payload Json payload passed from frontend.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{programId}/modify-program")
  ResponseEntity<ProgramDto> modifyProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestBody Map<String, Object> payload) {

    // Get account from accountId (this is a wrapper, not the actual)
    Optional<Account> userOptional = accountService.getAccount(accountId);

    // Check if the value of userOptional is empty
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // If not empty, then we go fetch the actual user value
    Account user = userOptional.get();

    // If user is not a COACH or ADMIN then they will get an error
    // as they are not allowed to access this feature
    if (!accountService.hasPermissions(user.getType())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Fetch program details
    ProgramDto programDtoToModify = programService.getProgramDetails(programId);

    // Check if the value of programDtoOptional is null
    if (programDtoToModify == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Extract the fields from the payload
    try {
      String title = (String) payload.get("title");
      String programType = (String) payload.get("type");
      String startDate = (String) payload.get("start_date");
      String endDate = (String) payload.get("end_date");
      Boolean isRecurring = (Boolean) payload.get("recurring");
      String visibility = (String) payload.get("visibility");
      String description = (String) payload.get("description");
      Integer capacity = (Integer) payload.get("capacity");
      Boolean notify = (Boolean) payload.get("notify");
      String startTime = (String) payload.get("start_time");
      String endTime = (String) payload.get("end_time");
      String location = (String) payload.get("location");

      // Extract and process attachments
      @SuppressWarnings("unchecked")
      List<Map<String, String>> attachments = (List<Map<String, String>>) payload.get("attachment");

      // Call the service modifyProgram method
      programService.modifyProgram(
          programDtoToModify,
          title,
          programType,
          startDate,
          endDate,
          isRecurring,
          visibility,
          description,
          capacity,
          notify,
          startTime,
          endTime,
          location,
          attachments);

      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
