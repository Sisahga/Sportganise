package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.entities.programsessions.ProgramType;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.exceptions.ProgramNotFoundException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.exceptions.programexceptions.ProgramInvitationiException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.EmailService;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service for managing the waitlist and participation in program sessions. */
@Slf4j
@Service
public class WaitlistService {

  private final ProgramParticipantRepository participantRepository;
  private final ProgramRepository programRepository;
  private final AccountRepository accountRepository;
  private final EmailService emailService;

  /**
   * Constructor for WaitlistService.
   *
   * @param participantRepository Repository for managing program participants.
   */
  public WaitlistService(
      ProgramParticipantRepository participantRepository,
      ProgramRepository programRepository,
      AccountRepository accountRepository,
      EmailService emailService) {
    this.participantRepository = participantRepository;
    this.programRepository = programRepository;
    this.accountRepository = accountRepository;
    this.emailService = emailService;
  }

  /**
   * Fetchs a waitlisted participant.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A programParticipantDto.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipant getWaitlistedParticipant(Integer programId, Integer accountId) {
    log.debug("opt-in participant (programId={}, accountId={})", programId, accountId);
    log.debug("{}", programId);
    ProgramParticipant participant =
        participantRepository.findWaitlistParticipant(programId, accountId);
    if (participant == null) {
      log.error(
          "Participant not found on waitlist for program={}, account={}", programId, accountId);
      throw new ParticipantNotFoundException(
          "Participant not found on waitlist for program: "
              + programId
              + ", account: "
              + accountId);
    }

    return participant;
  }

  /**
   * Fetches a confirmed program participant by their program ID and account ID.
   *
   * @param programId The ID of the program to search for (must not be null)
   * @param accountId The ID of the account to search for (must not be null)
   * @return If a confirmed participant is found, {@code null} if participant exists but is not
   *     confirmed
   * @throws ParticipantNotFoundException if no participant is found with the specified program ID
   *     and account ID combination
   * @throws IllegalArgumentException if either programId or accountId is null
   */
  public ProgramParticipantDto fetchParticipant(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {
    ProgramParticipant programParticipant = this.getParticipant(programId, accountId);

    return new ProgramParticipantDto(programParticipant);
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

    ProgramParticipant optedParticipant = getWaitlistedParticipant(programId, accountId);

    if (optedParticipant.isConfirmed() == true || optedParticipant.getRank() != null) {
      log.warn("Participant already confirmed");
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
    log.info("Confirming participant's spot (programId={}, accountId={})", programId, accountId);
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
    log.info(
        "Opting out participant from waitlist (programId={}, accountId={})", programId, accountId);
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
    log.debug(
        "Participant removal/confirmation from waitlist (programId={}, accountId={}, confirm={})",
        programId,
        accountId);

    ProgramParticipant optedParticipant = getWaitlistedParticipant(programId, accountId);

    if (confirmParticipant) {
      // Confirm participant
      ZonedDateTime ldt = ZonedDateTime.now();
      optedParticipant.setConfirmedDate(ldt);
      optedParticipant.setConfirmed(true);
    }

    // Update the ranks of everyone
    participantRepository.updateRanks(programId, optedParticipant.getRank());
    optedParticipant.setRank(null);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);
    log.debug(
        "Participant processed successfully (programId={}, accountId={})",
        savedParticipant.getProgramId(),
        savedParticipant.getAccountId());

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
    log.debug("Found {} opted participants:{}", queueDto.size(), queueDto);
    ;

    return queueDto;
  }

  /**
   * Marks a confirmed participant as absent and removes their confirmation.
   *
   * @param programId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the marked absent participant, or null if participant is not
   *     confirmed.
   * @throws ParticipantNotFoundException whenever participant can't be found.
   */
  public ProgramParticipantDto markAbsent(Integer programId, Integer accountId)
      throws ParticipantNotFoundException {

    ProgramParticipant programParticipant = this.getParticipant(programId, accountId);

    if (programParticipant.isConfirmed() == false) {
      return null;
    }

    programParticipant.setConfirmed(false);
    programParticipant.setConfirmedDate(null);

    ProgramParticipant savedParticipant = participantRepository.save(programParticipant);
    return new ProgramParticipantDto(savedParticipant);
  }

  /**
   * Gets all programs that are open for waitlisted participants to join.
   *
   * @return A list of ProgramDto's containing the waitlisted .
   * @throws ResourceNotFoundException whenever programs can't be found.
   */
  public List<ProgramDto> getWaitlistPrograms() throws ResourceNotFoundException {
    List<Program> programs = programRepository.findByProgramType("Training");

    if (programs == null) {
      log.error("Program list is null. Can't fetch waitlist programs");
      throw new ResourceNotFoundException("Programs list is null. Cannot fetch waitlist programs.");
    }

    return programs.stream()
        .flatMap(
            program -> {
              log.debug("{}", program);
              Integer participantCount =
                  participantRepository.countConfirmedParticipants(program.getProgramId());

              if (participantCount >= program.getCapacity()) {
                return Stream.empty();
              }

              return Stream.of(new ProgramDto(program, null));
            })
        .toList();
  }

  /**
   * Invites a user to a private event.
   *
   * <p>Adds the user to the list of invited participants, and sends them an invitation email.
   *
   * @param accountId The user to invite
   * @param programId The program to invite the user to
   * @return True if the user is newly registered as a participant, false otherwise.
   */
  public boolean inviteToPrivateEvent(Integer accountId, Integer programId) {
    AtomicBoolean isNewParticipant = new AtomicBoolean(false);

    Program program = this.getProgram(programId);

    // Direct user invitation is only supported for private events
    if (!program.getVisibility().equals("private")) {
      throw new ProgramInvitationiException("User invitation only supported for private programs");
    }

    Account account =
        this.accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> {
                  log.warn("Account not found with id " + accountId);
                  return new AccountNotFoundException("Account not found with id " + accountId);
                });

    // Subscribed players for training events
    final String type =
        program.getProgramType() == ProgramType.TRAINING ? "Subscribed" : account.getType().name();

    ProgramParticipant programParticipant =
        this.participantRepository
            .findById(new ProgramParticipantId(programId, accountId))
            .orElseGet(
                () -> {
                  // Register new program participant
                  // Confirming them
                  isNewParticipant.set(true);
                  return this.participantRepository.save(
                      ProgramParticipant.builder()
                          .programParticipantId(new ProgramParticipantId(programId, accountId))
                          .type(type)
                          .isConfirmed(true)
                          .confirmedDate(ZonedDateTime.now())
                          .build());
                });

    // Participant should not be confirmed yet
    // Change to make it so we confirm them for now, revisit.
    // if (programParticipant.isConfirmed()) {
    //   log.warn("Participant already confirmed to program");
    //   throw new ProgramInvitationiException("Participant already confirmed to program");
    // }

    // Send invitation email
    this.emailService.sendPrivateProgramInvitation(account.getEmail(), program);

    return isNewParticipant.get();
  }

  /**
   * RSVPs a user to an event.
   *
   * @param accountId The user to RSVP
   * @param programId The program to RSVP the user to
   * @return True if the user is newly registered as a participant, false otherwise.
   */
  public boolean rsvpToEvent(Integer accountId, Integer programId) {

    ProgramParticipant participant = getParticipant(programId, accountId);

    if (participant.isConfirmed()) {
      log.warn("Participant already confirmed to program");
      throw new ProgramInvitationiException("Participant already confirmed to program");
    }

    Program program = this.getProgram(programId);
    if (!program.getProgramType().equals(ProgramType.TRAINING)) {
      participant.setConfirmed(true);
      participant.setConfirmedDate(ZonedDateTime.now());
      participantRepository.save(participant);

      return participant.isConfirmed();
    }

    log.warn("RSVP not allowed for this program type");
    return false;
  }

  /**
   * Fetches a program.
   *
   * @param programId The program to fetch
   * @return Program entity if program found.
   */
  public Program getProgram(Integer programId) {
    Program program =
        programRepository
            .findById(programId)
            .orElseThrow(
                () -> {
                  log.warn("Program not found with id " + programId);
                  return new ProgramNotFoundException("Program not found");
                });

    return program;
  }

  /**
   * Fetches a ProgramParticipant.
   *
   * @param accountId The ProgramParticipant to fetch
   * @return ProgramParticipant entity if program found.
   */
  public ProgramParticipant getParticipant(Integer programId, Integer accountId) {
    ProgramParticipant programParticipant =
        participantRepository
            .findById(new ProgramParticipantId(programId, accountId))
            .orElseThrow(
                () ->
                    new ParticipantNotFoundException(
                        "Participant not found for program: "
                            + programId
                            + ", account: "
                            + accountId));

    return programParticipant;
  }
}
