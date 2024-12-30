package com.sportganise.controllers.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.entities.Account;
import com.sportganise.services.programsessions.ProgramService;
import com.sportganise.services.auth.AccountService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for managing 'Program' Entities. Handles HTTP request and
 * routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/programs")
@CrossOrigin(origins = "*")
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
      @PathVariable Integer accountId,
      @PathVariable Integer programId) {

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

    // Initialize the participants list as null
    List<ProgramParticipantDto> participants = new ArrayList<>();

    // Check if this user has permissions to see training sessions attendees
    // (i.e. if the user is of type COACH or ADMIN)
    // If they have permission, then they can see the list of participants
    if (accountService.hasPermissions(user.getType())) {
      participants = programService.getParticipants(programId);
    }

    // Wrap program details and participants into the ProgramDetailsParticipantsDto
    // response DTO
    ProgramDetailsParticipantsDto response = new ProgramDetailsParticipantsDto(programDto, participants);

    return ResponseEntity.ok(response);
  }

  /**
   * Get mapping for creating new program.
   * 
   * @param accountId      Id of user who is making the request.
   * @param programType    Type of the program.
   * @param title          Title of the program.
   * @param description    Description of the program.
   * @param capacity       Participants capacity.
   * @param occurrenceDate Date of the program.
   * @param durationMins   Duration of the program/session in minutes.
   * @param isRecurring    Boolean for whether this program is recurring.
   * @param expiryDate     Expiry Date of the program i.e. when is the last
   *                       occurence.
   * @param frequency      Frequency of program/sessions.
   * @param location       Location of the program/session.
   * @param visibility     Visibility of the program i.e. is it only visible to
   *                       registered members or all members.
   * @param attachment     File paths of files attached to this program/session.
   * @return HTTP Response for newly created program.
   */
  @PostMapping("/{accountId}/create-program")
  public ResponseEntity<ProgramDto> createProgram(
      @PathVariable Integer accountId,
      @RequestParam("type") String programType,
      @RequestParam("title") String title,
      @RequestParam("description") String description,
      @RequestParam("capacity") Integer capacity,
      @RequestParam("occurrenceDate") LocalDateTime occurrenceDate,
      @RequestParam("durationMins") Integer durationMins,
      @RequestParam("isRecurring") Boolean isRecurring,
      @RequestParam("expiryDate") LocalDateTime expiryDate,
      @RequestParam("frequency") String frequency,
      @RequestParam("location") String location,
      @RequestParam("visibility") String visibility,
      @RequestParam("attachment") MultipartFile attachment) {

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
      ProgramDto programDto = programService.createProgramDto(programType, title, description, capacity,
          occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, attachment);
      return new ResponseEntity<>(programDto, HttpStatus.CREATED);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  /**
   * Put mapping for modifying/updating an existing program.
   * 
   * @param accountId      Id of user who is making the request.
   * @param programType    Type of the program.
   * @param title          Title of the program.
   * @param description    Description of the program.
   * @param capacity       Participants capacity.
   * @param occurrenceDate Date of the program.
   * @param durationMins   Duration of the program/session in minutes.
   * @param isRecurring    Boolean for whether this program is recurring.
   * @param expiryDate     Expiry Date of the program i.e. when is the last
   *                       occurence.
   * @param frequency      Frequency of program/sessions.
   * @param location       Location of the program/session.
   * @param visibility     Visibility of the program i.e. is it only visible to
   *                       registered members or all members.
   * @param attachment     File paths of files attached to this program/session.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{programId}/modify-program")
  ResponseEntity<ProgramDto> modifyProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestParam("type") String programType,
      @RequestParam("title") String title,
      @RequestParam("description") String description,
      @RequestParam("capacity") Integer capacity,
      @RequestParam("occurrenceDate") LocalDateTime occurrenceDate,
      @RequestParam("durationMins") Integer durationMins,
      @RequestParam("isRecurring") Boolean isRecurring,
      @RequestParam("expiryDate") LocalDateTime expiryDate,
      @RequestParam("frequency") String frequency,
      @RequestParam("location") String location,
      @RequestParam("visibility") String visibility,
      @RequestParam("attachment") MultipartFile attachment) {

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

    // Call the service modifyProgram method to handle program creation
    try {
      programService.modifyProgram(programDtoToModify, programType, title, description, capacity, occurrenceDate,
          durationMins, isRecurring, expiryDate, frequency, location, visibility, attachment);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
