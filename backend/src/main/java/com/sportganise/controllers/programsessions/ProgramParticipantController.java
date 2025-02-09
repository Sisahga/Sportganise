package com.sportganise.controllers.programsessions;

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
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return The rank assigned to the participant.
   */
  @PatchMapping("/opt-participant")
  public ResponseEntity<?> optProgramParticipant(
      @RequestParam Integer programId, @RequestParam Integer accountId) {
    log.info("Opting in participant: programId: {}, accountId: {}", programId, accountId);

    try {
      Integer rank = waitlistService.optProgramParticipantDto(programId, accountId);
      log.info(
          "Successfully opted in participant. programId: {}, accountId: {}, with rank: {}",
          programId,
          accountId,
          rank);
      return ResponseEntity.ok(rank);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant not found for opt-in. programId: {}, accountId: {}. Error: {}",
          programId,
          accountId,
          e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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
  public ResponseEntity<?> confirmParticipant(
      @RequestParam Integer programId, @RequestParam Integer accountId) {
    log.info("Confirming participant. programId: {}, accountId: {}", programId, accountId);

    try {
      ProgramParticipantDto confirmedParticipant =
          waitlistService.confirmParticipant(programId, accountId);
      log.info(
          "Participant confirmed successfully. programId: {}, accountId: {}", programId, accountId);
      return ResponseEntity.ok(confirmedParticipant);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant confirmation failed. programId: {}, accountId: {}. Error: {}",
          programId,
          accountId,
          e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  /**
   * Removes a participant from a program's waitlist.
   *
   * @param accountId The ID of the participant's account.
   * @param programId The ID of the program.
   * @return A DTO representing the participant who opted out.
   */
  @PatchMapping("/out-participant")
  public ResponseEntity<?> optOutParticipant(
      @RequestParam Integer accountId, @RequestParam Integer programId) {
    log.info("Opting out participant. programId: {}, accountId: {}", programId, accountId);

    try {
      ProgramParticipantDto outParticipant =
          waitlistService.optOutParticipant(programId, accountId);
      log.info(
          "Participant opted out successfully. programId: {}, accountId: {}", programId, accountId);
      return ResponseEntity.ok(outParticipant);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Participant opt-out failed. programId: {}, accountId: {}. Error: {}",
          programId,
          accountId,
          e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  /**
   * Retrieves a list of all participants currently opted into a program.
   *
   * @param programId The ID of the program.
   * @return A list of DTOs representing the opted-in participants.
   */
  @GetMapping("/queue")
  public ResponseEntity<List<ProgramParticipantDto>> getOptedParticipants(
      @RequestParam Integer programId) {
    log.info("Fetching opted participants queue for programId: {}", programId);

    List<ProgramParticipantDto> optedInParticipants =
        waitlistService.allOptedParticipants(programId);
    log.info(
        "Retrieved {} opted participants for programId: {}", optedInParticipants.size(), programId);
    return ResponseEntity.ok(optedInParticipants);
  }

  /**
   * Marks a participant as absent for a program by setting isConfirmed to false.
   *
   * @param accountId The ID of the participant's account.
   * @param programId The ID of the program.
   * @return A DTO representing the participant who confirmed absent.
   */
  @PatchMapping("/mark-absent")
  public ResponseEntity<?> markAbsent(
      @RequestParam Integer programId, @RequestParam Integer accountId) {
    log.info("Marking participant as absent. programId: {}, accountId: {}", programId, accountId);

    try {
      ProgramParticipantDto programParticipant = waitlistService.markAbsent(programId, accountId);
      log.info(
          "Successfully marked participant as absent. programId: {}, accountId: {}",
          programId,
          accountId);
      return ResponseEntity.ok(programParticipant);
    } catch (ParticipantNotFoundException e) {
      log.error(
          "Mark absent failed. programId: {}, accountId: {}. Error: {}",
          programId,
          accountId,
          e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  /**
   * Fetches all the training sessions missing a player, making waitlist players available to join.
   */
  @GetMapping("/waitlist-programs")
  public ResponseEntity<?> getWaitlistPrograms() {
    try {
      List<ProgramDto> ppc = waitlistService.getWaitlistPrograms();
      log.info("Successfully fetched {} waitlist programs", ppc.size());
      return ResponseEntity.ok(ppc);
    } catch (ResourceNotFoundException e) {
      log.error("Program list is empy", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error fetching waitlist programs");
    }
  }

  /**
   * Invites a user to a private program.
   *
   * @param accountId The user to invite
   * @param programId The program to invite the user to
   * @return An empty ResponseDTO.
   */
  @PostMapping("/invite-private")
  public ResponseEntity<?> inviteToPrivateEvent(
      @RequestParam Integer accountId, @RequestParam Integer programId) {
    log.info(
        "Inviting participant to private program: programId: {}, accountId: {}",
        programId,
        accountId);

    this.waitlistService.inviteToPrivateEvent(accountId, programId);

    // TODO: implement the controller
    return null;
  }
}
