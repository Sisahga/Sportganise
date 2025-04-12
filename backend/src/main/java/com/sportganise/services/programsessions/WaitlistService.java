package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.DetailedProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramAttachment;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.entities.programsessions.ProgramRecurrence;
import com.sportganise.entities.programsessions.ProgramType;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.exceptions.programexceptions.ProgramInvitationiException;
import com.sportganise.exceptions.programexceptions.ProgramNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import com.sportganise.repositories.programsessions.ProgramRecurrenceRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.EmailService;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
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
  private final ProgramAttachmentRepository programAttachmentRepository;
  private final ProgramRecurrenceRepository recurrenceRepository;

  /**
   * Constructor for WaitlistService.
   *
   * @param participantRepository Repository for managing program participants.
   */
  public WaitlistService(
      ProgramParticipantRepository participantRepository,
      ProgramRepository programRepository,
      AccountRepository accountRepository,
      EmailService emailService,
      ProgramAttachmentRepository programAttachmentRepository,
      ProgramRecurrenceRepository recurrenceRepository) {
    this.participantRepository = participantRepository;
    this.programRepository = programRepository;
    this.accountRepository = accountRepository;
    this.emailService = emailService;
    this.programAttachmentRepository = programAttachmentRepository;
    this.recurrenceRepository = recurrenceRepository;
  }

  /**
   * Fetchs a waitlisted participant.
   *
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A programParticipantDto.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipant getWaitlistedParticipant(Integer recurrenceId, Integer accountId) {
    log.debug("opt-in participant (recurrenceId={}, accountId={})", recurrenceId, accountId);
    log.debug("{}", recurrenceId);
    ProgramParticipant participant =
        participantRepository.findWaitlistParticipant(recurrenceId, accountId);
    if (participant == null) {
      log.error(
          "Participant not found on waitlist for program={}, account={}", recurrenceId, accountId);
      throw new ParticipantNotFoundException(
          "Participant not found on waitlist for program: "
              + recurrenceId
              + ", account: "
              + accountId);
    }

    return participant;
  }

  /**
   * Fetches a confirmed program participant by their program ID and account ID.
   *
   * @param recurrenceId The ID of the program to search for (must not be null)
   * @param accountId The ID of the account to search for (must not be null)
   * @return If a confirmed participant is found, {@code null} if participant exists but is not
   *     confirmed
   * @throws ParticipantNotFoundException if no participant is found with the specified program ID
   *     and account ID combination
   * @throws IllegalArgumentException if either recurrenceId or accountId is null
   */
  public ProgramParticipantDto fetchParticipant(Integer recurrenceId, Integer accountId)
      throws ParticipantNotFoundException {
    ProgramParticipant programParticipant = this.getParticipant(recurrenceId, accountId);

    return new ProgramParticipantDto(programParticipant);
  }

  /**
   * Adds a participant to the waitlist for a program and assigns them a rank.
   *
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return The rank assigned to the participant.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public Integer optProgramParticipantDto(Integer recurrenceId, Integer accountId)
      throws ParticipantNotFoundException {

    Integer maxRank = participantRepository.findMaxRank(recurrenceId);
    int newRank = (maxRank == null) ? 1 : maxRank + 1;

    ProgramParticipant optedParticipant = getWaitlistedParticipant(recurrenceId, accountId);

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
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the confirmed participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto confirmParticipant(Integer recurrenceId, Integer accountId)
      throws ParticipantNotFoundException {
    log.info(
        "Confirming participant's spot (recurrenceId={}, accountId={})", recurrenceId, accountId);
    return removeParticipant(recurrenceId, accountId, true);
  }

  /**
   * Removes a participant from the waitlist and updates ranks of other participants.
   *
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the opted-out participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto optOutParticipant(Integer recurrenceId, Integer accountId)
      throws ParticipantNotFoundException {
    log.info(
        "Opting out participant from waitlist (recurrenceId={}, accountId={})",
        recurrenceId,
        accountId);
    return removeParticipant(recurrenceId, accountId, false);
  }

  /**
   * Function used by optOut and confirmParticipant to refactor and clean code.
   *
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @param confirmParticipant boolean if true confirms the participant and sends them into the
   *     program, if false removes them from the waitlist
   * @return A DTO representing the opted-out participant, or null if not found.
   * @throws ParticipantNotFoundException whenever participant can't be found
   */
  public ProgramParticipantDto removeParticipant(
      Integer recurrenceId, Integer accountId, boolean confirmParticipant)
      throws ParticipantNotFoundException {
    log.debug(
        """
        Participant removal/confirmation from waitlist (recurrenceId={},
        accountId={}, confirm={})
        """,
        recurrenceId,
        accountId);

    ProgramParticipant optedParticipant = getWaitlistedParticipant(recurrenceId, accountId);

    if (confirmParticipant) {
      // Confirm participant
      ZonedDateTime ldt = ZonedDateTime.now();
      optedParticipant.setConfirmedDate(ldt);
      optedParticipant.setConfirmed(true);
    }

    // Update the ranks of everyone
    participantRepository.updateRanks(recurrenceId, optedParticipant.getRank());
    optedParticipant.setRank(null);

    ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);
    log.debug(
        "Participant processed successfully (recurrenceId={}, accountId={})",
        savedParticipant.getRecurrenceId(),
        savedParticipant.getAccountId());

    return new ProgramParticipantDto(savedParticipant);
  }

  /**
   * Retrieves a list of all participants currently opted into a program.
   *
   * @param recurrenceId The ID of the program.
   * @return A list of DTOs representing the opted-in participants.
   */
  public List<ProgramParticipantDto> allOptedParticipants(Integer recurrenceId) {
    List<ProgramParticipant> queue = participantRepository.findOptedParticipants(recurrenceId);

    List<ProgramParticipantDto> queueDto =
        queue.stream().map(pp -> new ProgramParticipantDto(pp)).collect(Collectors.toList());
    log.debug("Found {} opted participants:{}", queueDto.size(), queueDto);
    ;

    return queueDto;
  }

  /**
   * Marks a confirmed participant as absent and removes their confirmation.
   *
   * @param recurrenceId The ID of the program.
   * @param accountId The ID of the participant's account.
   * @return A DTO representing the marked absent participant, or null if participant is not
   *     confirmed.
   * @throws ParticipantNotFoundException whenever participant can't be found.
   */
  public ProgramParticipantDto markAbsent(Integer recurrenceId, Integer accountId)
      throws ParticipantNotFoundException {

    ProgramParticipant programParticipant = this.getParticipant(recurrenceId, accountId);
    log.info("Program Participant:", programParticipant);

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
  public List<ProgramDto> getWaitlistPrograms(Integer accountId) throws ResourceNotFoundException {

    Account account =
        this.accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> {
                  log.warn("Account not found with id " + accountId);
                  return new AccountNotFoundException("Account not found with id " + accountId);
                });

    // TODO: Come back to this for the coach
    if (account.getType() == AccountType.ADMIN) {
      List<ProgramRecurrence> programs =
          recurrenceRepository.findAllByProgramType(ProgramType.TRAINING.toString());

      return programs.stream()
          .filter(
              program -> {
                Integer programId = program.getProgramId();
                Integer confirmedCount =
                    participantRepository.countConfirmedParticipants(program.getRecurrenceId());
                return confirmedCount < getProgram(programId).getCapacity();
              })
          .map(
              program -> {
                List<ProgramAttachmentDto> programAttachments =
                    getProgramAttachments(program.getProgramId());
                ProgramDto programDto =
                    new ProgramDto(getProgram(program.getProgramId()), programAttachments);
                programDto.setReccurenceDate(program.getOccurrenceDate());
                programDto.setRecurrenceId(program.getRecurrenceId());
                return programDto;
              })
          .collect(Collectors.toList());
    } else {
      List<ProgramParticipant> userParticipants = participantRepository.findByAccountId(accountId);
      return userParticipants.stream()
          // Only include participants with the role "Coach" or "Waitlisted"
          .filter(pp -> "Coach".equals(pp.getType()) || "Waitlisted".equals(pp.getType()))
          .map(
              pp ->
                  recurrenceRepository
                      .findById(pp.getProgramParticipantId().getRecurrenceId())
                      .orElse(null))
          .distinct() // Remove duplicate programs if user is in multiple roles
          .filter(
              program -> {
                Integer programId = program.getProgramId();
                Integer confirmedCount =
                    participantRepository.countConfirmedParticipants(program.getRecurrenceId());
                return confirmedCount < getProgram(programId).getCapacity();
              })
          .map(
              program -> {
                List<ProgramAttachmentDto> programAttachments =
                    getProgramAttachments(program.getProgramId());
                ProgramDto programDto =
                    new ProgramDto(getProgram(program.getProgramId()), programAttachments);
                programDto.setReccurenceDate(program.getOccurrenceDate());
                programDto.setRecurrenceId(program.getRecurrenceId());
                return programDto;
              })
          .collect(Collectors.toList());
    }
  }

  /**
   * Method to get all the attachments uploaded to a specific program.
   *
   * @param programId Id of the program we want to fetch.
   * @return a list of ProgramAttachmentDto related to the program.
   */
  public List<ProgramAttachmentDto> getProgramAttachments(Integer programId) {

    log.debug("PROGRAM ID: {}", programId);

    List<ProgramAttachment> programAttachments =
        programAttachmentRepository.findAttachmentsByProgramId(programId);

    log.debug("PROGRAM ATTACHMENTS ENTITIES COUNT: ", programAttachments.size());

    List<ProgramAttachmentDto> programAttachmentDtos = new ArrayList<>();

    for (ProgramAttachment attachment : programAttachments) {
      programAttachmentDtos.add(
          new ProgramAttachmentDto(
              attachment.getCompositeProgramAttachmentKey().getProgramId(),
              attachment.getCompositeProgramAttachmentKey().getAttachmentUrl()));
    }

    log.debug("PROGRAM ATTACHMENTS DTOS COUNT: ", programAttachmentDtos.size());

    return programAttachmentDtos;
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
    final boolean isTraining = program.getProgramType().equals(ProgramType.TRAINING);
    final String type = isTraining ? "Subscribed" : account.getType().name();
    final boolean isConfirmed = isTraining;
    final ZonedDateTime confirmedDate = isTraining ? ZonedDateTime.now() : null;

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
                          .isConfirmed(isConfirmed)
                          .confirmedDate(confirmedDate)
                          .build());
                });

    // Participant should not be confirmed yet
    if (programParticipant.isConfirmed() && isTraining) {
      log.warn("Participant already confirmed to program");
      throw new ProgramInvitationiException("Participant already confirmed to program");
    }

    // Send invitation (not for training session)
    if (!program.getProgramType().equals(ProgramType.TRAINING)) {
      this.emailService.sendPrivateProgramInvitation(account.getEmail(), program);
    }

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
    Program program = this.getProgram(programId);

    if (program.getProgramType().equals(ProgramType.TRAINING)
        || program.getProgramType().equals(ProgramType.SPECIALTRAINING)) {
      log.warn("RSVP not allowed for this program type");
      return false;
    }

    ProgramParticipant participant =
        participantRepository
            .findById(new ProgramParticipantId(programId, accountId))
            .orElseGet(
                () -> {
                  Account account =
                      accountRepository
                          .findById(accountId)
                          .orElseThrow(
                              () ->
                                  new AccountNotFoundException(
                                      "Account not found for id: " + accountId));
                  return new ProgramParticipant(
                      new ProgramParticipantId(programId, account.getAccountId()),
                      null,
                      null,
                      false,
                      null);
                });

    if (participant.isConfirmed()) {
      log.warn("Participant already confirmed program");
      throw new ProgramInvitationiException("Participant already confirmed to program");
    }

    participant.setConfirmed(true);
    participant.setConfirmedDate(ZonedDateTime.now());
    participantRepository.save(participant);

    return participant.isConfirmed();
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
   * @param recurrenceId The ProgramParticipant to fetch
   * @return ProgramParticipant entity if program found.
   */
  public ProgramParticipant getParticipant(Integer recurrenceId, Integer accountId) {
    return participantRepository
        .findById(new ProgramParticipantId(recurrenceId, accountId))
        .orElseThrow(
            () ->
                new ParticipantNotFoundException(
                    "Participant not found for program: "
                        + recurrenceId
                        + ", account: "
                        + accountId));
  }

  /**
   * Fetches a list of waitlisted and coach participants for a given program.
   *
   * @param programId The ID of the program.
   * @return A list of DetailedProgramParticipantDto objects representing the waitlisted and coach
   */
  public List<DetailedProgramParticipantDto> getProgramParticipantsWithAccountDetails(
      Integer programId) {
    return participantRepository.fetchProgramParticipantsWithAccountDetails(programId);
  }
}
