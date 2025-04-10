package com.sportganise.controllers.programsessions;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.services.programsessions.WaitlistService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for managing program participants and their waitlist operations. */
@Slf4j
@RestController
@RequestMapping("/api/program-participant")
public class ProgramParticipantController {
  private final WaitlistService waitlistService;

  /**
   * Constructor for ProgramParticipantController.
   *
   * @param waitlistService Service for managing the waitlist and participant operations.
   */
  @Autowired
  public ProgramParticipantController(WaitlistService waitlistService) {
    this.waitlistService = waitlistService;
  }

  /**
   * Adds a participant to a program's waitlist and assigns them a rank.
   *
   * @param reccurenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return ResponseDto with status 200 OK along with the participant DTO.
   */
  @GetMapping("/get-participant")
  public ResponseEntity<ResponseDto<ProgramParticipantDto>> fetchProgramParticipant(
      @RequestParam Integer reccurenceId, @RequestParam Integer accountId) {
    log.info("Fetchin participant: reccurenceId: {}, accountId: {}", reccurenceId, accountId);
    try {
      ProgramParticipantDto participant = waitlistService.fetchParticipant(reccurenceId, accountId);
      log.info("Fetched participant. reccurenceId: {}, accountId: {}", reccurenceId, accountId);

      ResponseDto<ProgramParticipantDto> responseDto =
          ResponseDto.<ProgramParticipantDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Participant fetched successfully")
              .data(participant)
              .build();
      return ResponseEntity.ok(responseDto);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant not found for fetch. reccurenceId: {}, accountId: {}. Error: {}",
          reccurenceId,
          accountId,
          e.getMessage());
      throw new ResourceNotFoundException(e.getMessage());
    }
  }

  /**
   * Adds a participant to a program's waitlist and assigns them a rank.
   *
   * @param reccurenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return The rank assigned to the participant.
   */
  @PatchMapping("/opt-participant")
  public ResponseEntity<ResponseDto<Integer>> optProgramParticipant(
      @RequestParam Integer reccurenceId, @RequestParam Integer accountId) {
    log.info("Opting in participant: reccurenceId: {}, accountId: {}", reccurenceId, accountId);

    try {
      Integer rank = waitlistService.optProgramParticipantDto(reccurenceId, accountId);
      log.info(
          "Successfully opted in participant. reccurenceId: {}, accountId: {}, with rank: {}",
          reccurenceId,
          accountId,
          rank);
      ResponseDto<Integer> responseDto =
          ResponseDto.<Integer>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Participant opted in successfully")
              .data(rank)
              .build();
      return ResponseEntity.ok(responseDto);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant not found for opt-in. reccurenceId: {}, accountId: {}. Error: {}",
          reccurenceId,
          accountId,
          e.getMessage());
      throw new ResourceNotFoundException(e.getMessage());
    }
  }

  /**
   * Confirms a participant's spot in a program.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the confirmed participant.
   */
  @PatchMapping("/confirm-participant")
  public ResponseEntity<ResponseDto<ProgramParticipantDto>> confirmParticipant(
      @RequestParam Integer reccurenceId, @RequestParam Integer accountId) {
    log.info("Confirming participant. reccurenceId: {}, accountId: {}", reccurenceId, accountId);

    try {
      ProgramParticipantDto confirmedParticipant =
          waitlistService.confirmParticipant(reccurenceId, accountId);
      log.info(
          "Participant confirmed successfully. reccurenceId: {}, accountId: {}", reccurenceId, accountId);
      ResponseDto<ProgramParticipantDto> responseDto =
          ResponseDto.<ProgramParticipantDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Participant confirmed successfully")
              .data(confirmedParticipant)
              .build();
      return ResponseEntity.ok(responseDto);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant confirmation failed. reccurenceId: {}, accountId: {}. Error: {}",
          reccurenceId,
          accountId,
          e.getMessage());
      throw new ResourceNotFoundException(e.getMessage());
    }
  }

  /**
   * Removes a participant from a program's waitlist.
   *
   * @param accountId The ID of the participant's account.
   * @param reccurenceId The ID of the program.
   * @return A DTO representing the participant who opted out.
   */
  @PatchMapping("/out-participant")
  public ResponseEntity<ResponseDto<ProgramParticipantDto>> optOutParticipant(
      @RequestParam Integer accountId, @RequestParam Integer reccurenceId) {
    log.info("Opting out participant. reccurenceId: {}, accountId: {}", reccurenceId, accountId);

    try {
      ProgramParticipantDto outParticipant =
          waitlistService.optOutParticipant(reccurenceId, accountId);
      log.info(
          "Participant opted out successfully. reccurenceId: {}, accountId: {}", reccurenceId, accountId);
      ResponseDto<ProgramParticipantDto> responseDto =
          ResponseDto.<ProgramParticipantDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Participant opted out successfully")
              .data(outParticipant)
              .build();
      return ResponseEntity.ok(responseDto);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant opt-out failed. reccurenceId: {}, accountId: {}. Error: {}",
          reccurenceId,
          accountId,
          e.getMessage());
      throw new ResourceNotFoundException(e.getMessage());
    }
  }

  /**
   * Retrieves a list of all participants currently opted into a program.
   *
   * @param reccurenceId The ID of the program.
   * @return A list of DTOs representing the opted-in participants.
   */
  @GetMapping("/queue")
  public ResponseEntity<List<ProgramParticipantDto>> getOptedParticipants(
      @RequestParam Integer reccurenceId) {
    log.info("Fetching opted participants queue for reccurenceId: {}", reccurenceId);

    List<ProgramParticipantDto> optedInParticipants =
        waitlistService.allOptedParticipants(reccurenceId);
    log.info(
        "Retrieved {} opted participants for reccurenceId: {}", optedInParticipants.size(), reccurenceId);
    return ResponseEntity.ok(optedInParticipants);
  }

  /**
   * Marks a participant as absent for a program by setting isConfirmed to false.
   *
   * @param accountId The ID of the participant's account.
   * @param reccurenceId The ID of the program.
   * @return A DTO representing the participant who confirmed absent.
   */
  @PatchMapping("/mark-absent")
  public ResponseEntity<ResponseDto<ProgramParticipantDto>> markAbsent(
      @RequestParam Integer reccurenceId, @RequestParam Integer accountId) {
    log.info("Marking participant as absent. reccurenceId: {}, accountId: {}", reccurenceId, accountId);

    try {
      ProgramParticipantDto programParticipant = waitlistService.markAbsent(reccurenceId, accountId);
      log.info(
          "Successfully marked participant as absent. reccurenceId: {}, accountId: {}",
          reccurenceId,
          accountId);
      log.info("Program participant: {}", programParticipant);
      ResponseDto<ProgramParticipantDto> responseDto =
          ResponseDto.<ProgramParticipantDto>builder()
              .statusCode(HttpStatus.OK.value())
              .message("Participant marked as absent successfully")
              .data(programParticipant)
              .build();
      return ResponseEntity.ok(responseDto);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Mark absent failed. reccurenceId: {}, accountId: {}. Error: {}",
          reccurenceId,
          accountId,
          e.getMessage());
      throw new ResourceNotFoundException(e.getMessage());
    }
  }

  /**
   * Fetches all the training sessions missing a player, making waitlist players available to join.
   */
  @GetMapping("/waitlist-programs")
  public ResponseEntity<ResponseDto<List<ProgramDto>>> getWaitlistPrograms(
      @RequestParam Integer accountId) {
    List<ProgramDto> ppc = waitlistService.getWaitlistPrograms(accountId);
    log.info("Successfully fetched {} waitlist programs", ppc.size());
    ResponseDto<List<ProgramDto>> responseDto =
        ResponseDto.<List<ProgramDto>>builder()
            .statusCode(HttpStatus.OK.value())
            .message("Waitlist programs fetched successfully")
            .data(ppc)
            .build();
    return ResponseEntity.ok(responseDto);
  }

  /**
   * Invites a user to a private program.
   *
   * @param accountId The user to invite
   * @param programId The program to invite the user to
   * @return An empty ResponseDTO.
   */
  @PostMapping("/invite-private")
  public ResponseEntity<ResponseDto<Void>> inviteToPrivateEvent(
      @RequestParam Integer accountId, @RequestParam Integer programId) {
    log.info(
        "Inviting participant to private program: programId: {}, accountId: {}",
        programId,
        accountId);

    boolean isNewParticipant = this.waitlistService.inviteToPrivateEvent(accountId, programId);

    if (isNewParticipant) {
      return ResponseDto.created(null, "User successfully invited to event.");
    } else {
      return ResponseDto.ok(null, "User successfully re-invited to event.");
    }
  }

  /**
   * RSVPS a user to a program.
   *
   * @param accountId The user to invite
   * @param programId The program to invite the user to
   * @return A success boolean in the form of isConfirmed.
   */
  @PostMapping("/rsvp")
  public ResponseEntity<ResponseDto<Boolean>> rsvpParticipant(
      @RequestParam Integer programId, @RequestParam Integer accountId) {

    log.info("Processing RSVP for programId: {}, accountId: {}", programId, accountId);

    try {
      boolean rsvpSuccess = waitlistService.rsvpToEvent(accountId, programId);
      if (rsvpSuccess) {
        log.info("RSVP successful for programId: {}, accountId: {}", programId, accountId);
        ResponseDto<Boolean> responseDto =
            ResponseDto.<Boolean>builder()
                .statusCode(HttpStatus.OK.value())
                .message("RSVP successful")
                .data(true)
                .build();
        return ResponseEntity.ok(responseDto);
      }
      log.warn("RSVP failed - program not eligible for direct confirmation");
      return ResponseDto.badRequest(null, "RSVP failed");
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant not found for RSVP: programId: {}, accountId: {}", programId, accountId);
      throw new ResourceNotFoundException(e.getMessage());
    }
  }
}
