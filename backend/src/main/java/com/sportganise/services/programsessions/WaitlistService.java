package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** Service for managing the waitlist and participation in program sessions. */
@Service
public class WaitlistService {

  private final ProgramParticipantRepository participantRepository;

  /**
   * Constructor for WaitlistService.
   *
   * @param participantRepository Repository for managing program participants.
   */
  public WaitlistService(ProgramParticipantRepository participantRepository) {
    this.participantRepository = participantRepository;
  }

  /**
   * Adds a participant to the waitlist for a program and assigns them a rank.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return The rank assigned to the participant.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public Integer optProgramParticipantDto(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {
    Integer maxRank = participantRepository.findMaxRank(programId);
    int newRank = (maxRank == null) ? 1 : maxRank + 1;

    ProgramParticipant optedParticipant =
        participantRepository.findWaitlistParticipant(programId, accountId);
    if (optedParticipant == null) {
      throw new ParticipantNotFoundException(
          "Participant not found on waitlist for program: "
              + programId
              + ", account: "
              + accountId);
    }
    if (optedParticipant.isConfirmed() == true || optedParticipant.getRank() != null) {
      return null;
    }

    optedParticipant.setRank(newRank);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

    // TODO: Notify everyone

    return savedParticipant.getRank();
  }

  /**
   * Confirms a participant's spot in a program, updating ranks of other participants.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the confirmed participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto confirmParticipant(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {
    return removeParticipant(programId, accountId, true);
  }

  /**
   * Removes a participant from the waitlist and updates ranks of other participants.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the opted-out participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto optOutParticipant(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {
    return removeParticipant(programId, accountId, false);
  }

  /**
   * Function used by optOut and confirmParticipant to refactor and clean code.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @param confirmParticipant boolean if true confirms the participant and sends them into the
   *     program, if false removes them from the waitlist
   * @return A DTO representing the opted-out participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto removeParticipant(
      Integer programId, Integer accountId, boolean confirmParticipant)
      throws ParticipantNotFoundException {
    ProgramParticipant optedParticipant =
        participantRepository.findWaitlistParticipant(programId, accountId);

    if (optedParticipant == null) {
      throw new ParticipantNotFoundException(
          "Participant not found on waitlist for program: "
              + programId
              + ", account: "
              + accountId);
    }

    if (confirmParticipant == true) {
      // Confirm participant
      ZonedDateTime ldt = ZonedDateTime.now();
      optedParticipant.setConfirmedDate(ldt);
      optedParticipant.setConfirmed(true);
    }

    // Update the ranks of everyone
    participantRepository.updateRanks(programId, optedParticipant.getRank());
    optedParticipant.setRank(null);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

    return new ProgramParticipantDto(savedParticipant);
  }

  /**
   * Retrieves a list of all participants currently opted into a program.
   *
   * @param programId The ID of the program.
   * @return A list of DTOs representing the opted-in participants.
   */
  public List<ProgramParticipantDto> allOptedParticipants(Integer programId) {
    List<ProgramParticipant> queue = participantRepository.findOptedParticipants(programId);

    List<ProgramParticipantDto> queueDto =
        queue.stream().map(pp -> new ProgramParticipantDto(pp)).collect(Collectors.toList());

    return queueDto;
  }

  /**
   * Function used by optOut and confirmParticipant to refactor and clean code.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the marked absent participant, or null if participant is already not
   *     confirmed for a program.
   * @throws ParticipantNotFoundException whenever participant can't be found.
   */
  public ProgramParticipantDto markAbsent(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {

    ProgramParticipant programParticipant =
        participantRepository
            .findById(new ProgramParticipantId(programId, accountId))
            .orElseThrow(
                () ->
                    new ParticipantNotFoundException(
                        "Participant not found on waitlist for program: "
                            + programId
                            + ", account: "
                            + accountId));

    if (programParticipant.isConfirmed() == false) {
      return null;
    }

    programParticipant.setConfirmed(false);
    programParticipant.setConfirmedDate(null);

    ProgramParticipant savedParticipant = participantRepository.save(programParticipant);
    return new ProgramParticipantDto(savedParticipant);
  }
}
