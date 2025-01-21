package com.sportganise.controllers.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.services.programsessions.WaitlistService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for managing program participants and their waitlist operations. */
@RestController
@RequestMapping("/api/program-participant")
public class ProgramParticipantController {

  private WaitlistService waitlistService;

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

    Integer rank = null;
    try {
      rank = waitlistService.optProgramParticipantDto(programId, accountId);
      return ResponseEntity.ok(rank);
    } catch (ParticipantNotFoundException e) {
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

    // Update the participant's confirmation status
    ProgramParticipantDto confirmedParticipant = null;
    try {
      confirmedParticipant = waitlistService.confirmParticipant(programId, accountId);
      return ResponseEntity.ok(confirmedParticipant);
    } catch (ParticipantNotFoundException e) {
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

    ProgramParticipantDto outParticipant = null;
    try {
      outParticipant = waitlistService.optOutParticipant(programId, accountId);
      return ResponseEntity.ok(outParticipant);
    } catch (ParticipantNotFoundException e) {
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

    List<ProgramParticipantDto> optedInParticipants =
        waitlistService.allOptedParticipants(programId);
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
    ProgramParticipantDto programParticipant = null;
    try {
      programParticipant = waitlistService.markAbsent(programId, accountId);
      return ResponseEntity.ok(programParticipant);
    } catch (ParticipantNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }
}
