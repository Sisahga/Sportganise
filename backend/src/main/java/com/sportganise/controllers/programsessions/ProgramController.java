package com.sportganise.controllers.programsessions;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.programsessions.CancelProgramDto;
import com.sportganise.dto.programsessions.ProgramCreateRequestDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramModifyRequestDto;
import com.sportganise.entities.account.Account;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.programexceptions.ProgramCreationException;
import com.sportganise.exceptions.programexceptions.ProgramModificationException;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@Slf4j
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

    Account user = this.accountService.getAccount(accountId);
    log.debug("USER ID (details): {}", user.getAccountId());

    List<ProgramDto> programDtos = programService.getPrograms();
    log.debug("PROGRAMDTOS COUNT (details): {}", programDtos.size());

    if (programDtos.isEmpty()) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("No program found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    List<ProgramDetailsParticipantsDto> allPrograms;

    boolean canDisplayAttendees = hasPermissions(user);
    log.debug("HAS PERMISSION (details): {}", canDisplayAttendees);

    allPrograms = programService.getProgramDetailsParticipantsDto(programDtos, canDisplayAttendees);
    log.debug("ALL PROGRAMS COUNT (details): {}", allPrograms.size());

    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Programs successfully fetched.");
    responseDto.setData(allPrograms);
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Post mapping for creating new program.
   *
   * @param accountId Id of user who is making the request.
   * @param programCreateRequestDto Dto for the request body.
   * @param attachments List of attachments.
   * @return HTTP Response for newly created program.
   */
  @PostMapping(
      value = "/{accountId}/create-program",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ResponseDto<ProgramDto>> createProgram(
      @PathVariable Integer accountId,
      @RequestPart("programData") ProgramCreateRequestDto programCreateRequestDto,
      @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
      @RequestParam(required = false) Integer[] participantsId,
      @RequestParam(required = false) Integer[] waitlistsId,
      @RequestParam(required = false) Integer[] coachesId) {

    // log.debug("ATTACHMENTS COUNT: {}", attachments.size());

    Account user = getAccount(accountId);

    log.debug("USER ID (create-program): {}", user.getAccountId());

    if (!hasPermissions(user)) {
      throw new ForbiddenException(
          "User with id: " + accountId + " does not have permission to create a program.");
    }

    log.debug("HAS PERMISSION (create-program): {}", hasPermissions(user));

    try {
      ProgramDto newProgramDto =
          programService.createProgramDto(
              programCreateRequestDto.getTitle(),
              programCreateRequestDto.getType(),
              programCreateRequestDto.getStartDate(),
              programCreateRequestDto.getEndDate(),
              programCreateRequestDto.getVisibility(),
              programCreateRequestDto.getDescription(),
              programCreateRequestDto.getCapacity(),
              programCreateRequestDto.getStartTime(),
              programCreateRequestDto.getEndTime(),
              programCreateRequestDto.getLocation(),
              attachments,
              accountId,
              programCreateRequestDto.getFrequency(),
              participantsId,
              waitlistsId,
              coachesId);

      log.debug("NEW PROGRAMDTO ID: {}", newProgramDto.getProgramId());

      ResponseDto<ProgramDto> responseDto =
          ResponseDto.<ProgramDto>builder()
              .statusCode(HttpStatus.CREATED.value())
              .message("Created a new program successfully.")
              .data(newProgramDto)
              .build();
      return ResponseEntity.status(HttpStatus.CREATED.value()).body(responseDto);
    } catch (Exception e) {
      throw new ProgramCreationException("Failed to create program: " + e.getMessage());
    }
  }

  /**
   * POST mapping for modifying/updating an existing program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to modify.
   * @param programModifyRequestDto Dto for the request body.
   * @param attachments List of attachments.
   * @return HTTP Response for modified/updated data
   */
  @PostMapping(
      value = "/{accountId}/{programId}/modify-program",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  ResponseEntity<ResponseDto<ProgramDto>> modifyProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestPart("programData") ProgramModifyRequestDto programModifyRequestDto,
      @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
      @RequestParam(required = false) Integer[] waitlistsId) {

    Account user = getAccount(accountId);

    log.debug("USER ID (modify-program): {}", user.getAccountId());

    if (!hasPermissions(user)) {
      throw new ForbiddenException(
          "User with id: " + accountId + " does not have permission to create a program.");
    }

    log.debug("HAS PERMISSION (modify-program): {}", hasPermissions(user));

    ResponseDto<ProgramDto> responseDto = new ResponseDto<>();

    ProgramDto programDtoToModify = programService.getProgramDetails(programId);
    if (programDtoToModify == null) {
      responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
      responseDto.setMessage("Program not found.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }

    log.debug("PROGRAM ID OF PROGRAM TO MODIFY: {}", programDtoToModify.getProgramId());

    try {
      ProgramDto updatedProgramDto =
          programService.modifyProgram(
              programDtoToModify,
              programModifyRequestDto.getTitle(),
              programModifyRequestDto.getType(),
              programModifyRequestDto.getStartDate(),
              programModifyRequestDto.getEndDate(),
              programModifyRequestDto.getVisibility(),
              programModifyRequestDto.getDescription(),
              programModifyRequestDto.getCapacity(),
              programModifyRequestDto.getStartTime(),
              programModifyRequestDto.getEndTime(),
              programModifyRequestDto.getLocation(),
              attachments,
              programModifyRequestDto.getAttachmentsToRemove(),
              accountId,
              programModifyRequestDto.getFrequency(),
              waitlistsId);

      responseDto.setStatusCode(HttpStatus.OK.value());
      responseDto.setMessage("Modified the program successfully.");
      responseDto.setData(updatedProgramDto);
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } catch (Exception e) {
      throw new ProgramModificationException("Program modification failed: " + e.getMessage());
    }
  }

  /**
   * DELETE mapping for deleting a program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to delete.
   * @return HTTP Response for deleted program.
   */
  @DeleteMapping("/{accountId}/delete-program/{programId}")
  public ResponseEntity<ResponseDto<String>> deleteProgram(
      @PathVariable Integer accountId, @PathVariable Integer programId) {
    ResponseDto<String> responseDto = new ResponseDto<>();
    programService.deleteProgram(accountId, programId);
    responseDto.setStatusCode(HttpStatus.NO_CONTENT.value());
    responseDto.setMessage("Program deleted successfully.");
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Cancel a program.
   *
   * @param accountId Id of user who is making the request.
   * @param programId Id of the program that we wish to modify.
   * @param cancel boolean value to cancel or uncancel the program.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{programId}/cancel-program")
  ResponseEntity<ResponseDto<String>> cancelProgram(
      @PathVariable Integer accountId,
      @PathVariable Integer programId,
      @RequestBody CancelProgramDto cancel) {
    programService.cancel(programId, accountId, false, false, cancel.isCancel());
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Program cancellation status modified successfully.");
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Cancel a recurrence.
   *
   * @param accountId Id of user who is making the request.
   * @param recurrenceId Id of the recurrence that we wish to modify.
   * @param cancel boolean value to cancel or uncancel the recurrence.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{recurrenceId}/cancel-recurrence")
  ResponseEntity<ResponseDto<String>> cancelRecurrence(
      @PathVariable Integer accountId,
      @PathVariable Integer recurrenceId,
      @RequestBody CancelProgramDto cancel) {

    programService.cancel(recurrenceId, accountId, true, false, cancel.isCancel());
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Recurrence cancellation status modified successfully.");
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * Cancel all recurrences of a program.
   *
   * @param accountId Id of user who is making the request.
   * @param recurrenceId Id of the recurrence that we wish to modify.
   * @param cancel boolean value to cancel or uncancel the recurrences.
   * @return HTTP Response for modified/updated data
   */
  @PutMapping("/{accountId}/{recurrenceId}/cancel-all-recurrences")
  ResponseEntity<ResponseDto<String>> cancelAllRecurrences(
      @PathVariable Integer accountId,
      @PathVariable Integer recurrenceId,
      @RequestBody CancelProgramDto cancel) {

    programService.cancel(recurrenceId, accountId, true, true, cancel.isCancel());
    ResponseDto<String> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("All recurrences' cancellation status modified successfully.");
    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /** Helper method to fetch and validate user account based on accountId. */
  private Account getAccount(Integer accountId) {
    return accountService.getAccount(accountId);
  }

  /** Helper method to check user permissions. */
  private boolean hasPermissions(Account user) {
    return accountService.hasPermissions(user.getType());
  }
}
