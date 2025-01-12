package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import java.time.LocalDateTime;
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
   */
  public Integer optProgramParticipantDto(Integer programId, Integer accountId) {
    Integer maxRank = participantRepository.findMaxRank(programId);
    int newRank = (maxRank == null) ? 1 : maxRank + 1;

    ProgramParticipant optedParticipant =
        participantRepository.findWaitlistParticipant(programId, accountId);
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
   */
  public ProgramParticipantDto confirmParticipant(Integer programId, Integer accountId) {
    ProgramParticipant optedParticipant =
        participantRepository.findWaitlistParticipant(programId, accountId);
    if (optedParticipant == null) {
      return null;
    }
    // Update ranks of others in queue
    participantRepository.updateRanks(programId, accountId);

    // Confirm participant
    LocalDateTime ldt = LocalDateTime.now();
    optedParticipant.setConfirmedDate(ldt);
    optedParticipant.setConfirmed(true);
    // Remove from the waitlist
    optedParticipant.setRank(null);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

    return new ProgramParticipantDto(
        savedParticipant.getAccountId(),
        savedParticipant.getProgramId(),
        savedParticipant.getRank(),
        savedParticipant.isConfirmed(),
        savedParticipant.getConfirmedDate());
  }

  /**
   * Removes a participant from the waitlist and updates ranks of other participants.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the opted-out participant, or null if not found.
   */
  public ProgramParticipantDto optOutParticipant(Integer programId, Integer accountId) {
    ProgramParticipant optedParticipant =
        participantRepository.findWaitlistParticipant(programId, accountId);
    if (optedParticipant == null) {
      return null;
    }

    // Update the ranks of everyone
    participantRepository.updateRanks(programId, accountId);
    optedParticipant.setRank(null);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

    return new ProgramParticipantDto(
        savedParticipant.getAccountId(),
        savedParticipant.getProgramId(),
        savedParticipant.getRank(),
        savedParticipant.isConfirmed(),
        savedParticipant.getConfirmedDate());
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
        queue.stream()
            .map(
                pp ->
                    new ProgramParticipantDto(
                        pp.getAccountId(),
                        pp.getProgramId(),
                        pp.getRank(),
                        pp.isConfirmed(),
                        pp.getConfirmedDate()))
            .collect(Collectors.toList());

    return queueDto;
  }

  public ProgramParticipantDto markAbsent(Integer programId, Integer accountId) {

    ProgramParticipant absParticipant = participantRepository.findParticipant(programId, accountId);
    if (absParticipant.isConfirmed() == false) {
      return null;
    }

    absParticipant.setConfirmed(false);
    absParticipant.setConfirmedDate(null);

    ProgramParticipant savedParticipant = participantRepository.save(absParticipant);

    return new ProgramParticipantDto(
        savedParticipant.getAccountId(),
        savedParticipant.getProgramId(),
        savedParticipant.getRank(),
        savedParticipant.isConfirmed(),
        savedParticipant.getConfirmedDate());
  }
}
