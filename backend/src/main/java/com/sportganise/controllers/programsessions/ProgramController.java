package com.sportganise.controllers.programsessions;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramRequestDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
   * @return HTTP Response
   */
  @GetMapping("/{accountId}/details")
  public ResponseEntity<ResponseDto<List<ProgramDetailsParticipantsDto>>> getProgramDetails(
      @PathVariable Integer accountId) {

    ResponseDto<List<ProgramDetailsParticipantsDto>> responseDto = new ResponseDto<>();

    Optional<Account> userOptional = getAccount(accountId);

    if (userOptional.isEmpty()) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("User not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    Account user = userOptional.get();

    List<ProgramDto> programDtos = programService.getPrograms();

    if (programDtos.isEmpty()) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("No program found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    List<ProgramDetailsParticipantsDto> allPrograms = new ArrayList<>();

    Boolean canDisplayAttendees = false;

    if (hasPermissions(user)) {
      canDisplayAttendees = true;
    }

    allPrograms = programService.getProgramDetailsParticipantsDto(programDtos, canDisplayAttendees);

    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Programs successfully fetched.");
    responseDto.setData(allPrograms);
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Post mapping for creating new program.
   *
   * @param accountId Id of user who is making the request.
   * @param programRequestDto Dto for the request body.
   * @param attachments List of attachments.
   * @return HTTP Response for newly created program.
   */
  @PostMapping(
      value = "/{accountId}/create-program",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ResponseDto<ProgramDto>> createProgram(
      @PathVariable Integer accountId,
      @RequestPart("programData") ProgramRequestDto programRequestDto,
      @RequestParam("attachments") List<MultipartFile> attachments) {

    ResponseDto<ProgramDto> responseDto = new ResponseDto<>();

    Optional<Account> userOptional = getAccount(accountId);

    if (userOptional.isEmpty()) {

      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("User not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    Account user = userOptional.get();

    if (!hasPermissions(user)) {
      responseDto.setStatusCode(HttpStatus.FORBIDDEN.value());
      responseDto.setMessage("User does not have permission.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    try {
      ProgramDto newProgramDto =
          programService.createProgramDto(
              programRequestDto.getTitle(),
              programRequestDto.getType(),
              programRequestDto.getStartDate(),
              programRequestDto.getEndDate(),
              programRequestDto.getRecurring(),
              programRequestDto.getVisibility(),
              programRequestDto.getDescription(),
              programRequestDto.getCapacity(),
              programRequestDto.getStartTime(),
              programRequestDto.getEndTime(),
              programRequestDto.getLocation(),
              attachments,
              accountId);

      responseDto.setStatusCode(HttpStatus.CREATED.value());
      responseDto.setMessage("Created a new program successfully.");
      responseDto.setData(newProgramDto);
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      responseDto.setMessage("Could not create a new program successfully.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }
  }

  /**
   * POST mapping for modifying/updating an existing program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to modify.
   * @param programRequestDto Dto for the request body.
   * @param attachments List of attachments.
   * @return HTTP Response for modified/updated data
   */
  @PostMapping(
      value = "/{accountId}/{programId}/modify-program",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  ResponseEntity<ResponseDto<ProgramDto>> modifyProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestPart("programData") ProgramRequestDto programRequestDto,
      @RequestParam("attachments") List<MultipartFile> attachments) {

    ResponseDto<ProgramDto> responseDto = new ResponseDto<>();

    Optional<Account> userOptional = getAccount(accountId);

    if (userOptional.isEmpty()) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("User not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    Account user = userOptional.get();

    if (!hasPermissions(user)) {
      responseDto.setStatusCode(HttpStatus.FORBIDDEN.value());
      responseDto.setMessage("User does not have permission.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    ProgramDto programDtoToModify = programService.getProgramDetails(programId);

    if (programDtoToModify == null) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("Program not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    try {
      ProgramDto updatedProgramDto =
          programService.modifyProgram(
              programDtoToModify,
              programRequestDto.getTitle(),
              programRequestDto.getType(),
              programRequestDto.getStartDate(),
              programRequestDto.getEndDate(),
              programRequestDto.getRecurring(),
              programRequestDto.getVisibility(),
              programRequestDto.getDescription(),
              programRequestDto.getCapacity(),
              programRequestDto.getStartTime(),
              programRequestDto.getEndTime(),
              programRequestDto.getLocation(),
              attachments,
              programRequestDto.getAttachmentsToRemove(),
              accountId);

      responseDto.setStatusCode(HttpStatus.OK.value());
      responseDto.setMessage("Modified the program successfully.");
      responseDto.setData(updatedProgramDto);
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (EntityNotFoundException e) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("Program not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      responseDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
      responseDto.setMessage("Could not modify the program successfully.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }
  }

  /** Helper method to fetch and validate user account based on accountId. */
  private Optional<Account> getAccount(Integer accountId) {
    return accountService.getAccount(accountId);
  }

  /** Helper method to check user permissions. */
  private boolean hasPermissions(Account user) {
    return accountService.hasPermissions(user.getType());
  }
}
