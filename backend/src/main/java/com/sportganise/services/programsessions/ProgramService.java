package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramAttachment;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.account.AccountService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** Service layer for Programs. */
@Service
public class ProgramService {

  private final ProgramRepository programRepository;
  private final AccountService accountService;
  private final AccountRepository accountRepository;
  private final ProgramAttachmentRepository programAttachmentRepository;

  /**
   * Constructor for ProgramService.
   *
   * @param programRepository program repository object.
   * @param accountService account service object.
   * @param accountRepository account repository object.
   * @param programAttachmentRepository program attachment repository object.
   */
  public ProgramService(
      ProgramRepository programRepository,
      AccountService accountService,
      AccountRepository accountRepository,
      ProgramAttachmentRepository programAttachmentRepository) {
    this.programRepository = programRepository;
    this.accountRepository = accountRepository;
    this.accountService = accountService;
    this.programAttachmentRepository = programAttachmentRepository;
  }

  public Optional<Program> getSessionById(Integer id) {
    return programRepository.findById(id);
  }

  /**
   * Get participants list of a program.
   *
   * @param programId Id of session
   * @return List of participants of a program
   */
  public List<ProgramParticipantDto> getParticipants(Integer programId) {
    List<ProgramParticipant> participants =
        programRepository.findParticipantsByProgramId(programId);

    return participants.stream()
        .map(
            participant -> {
              Optional<Account> accountOptional =
                  accountService.getAccount(participant.getAccountId());

              if (!accountOptional.isPresent()) {
                throw new IllegalArgumentException(
                    "Account not found for id: " + participant.getAccountId());
              }

              Account account = accountOptional.get();

              return new ProgramParticipantDto(
                  account.getAccountId(),
                  programId,
                  participant.getRank(),
                  participant.isConfirmed(),
                  participant.getConfirmedDate());
            })
        .toList();
  }

  /**
   * Method to fetch a single program and its details.
   *
   * @param programId Id of the program we want to fetch.
   * @return a single programDto for the program that we fetched.
   */
  public ProgramDto getProgramDetails(Integer programId) {
    Program program = programRepository.findProgramById(programId);

    List<ProgramAttachmentDto> programAttachments = getProgramAttachments(programId);

    return new ProgramDto(
        program.getProgramId(),
        program.getProgramType(),
        program.getTitle(),
        program.getDescription(),
        program.getCapacity(),
        program.getOccurrenceDate(),
        program.getDurationMins(),
        program.isRecurring(),
        program.getExpiryDate(),
        program.getFrequency(),
        program.getLocation(),
        program.getVisibility(),
        programAttachments);
  }

  /**
   * Method to get all the attachments uploaded to a specific program.
   *
   * @param programId Id of the program we want to fetch.
   * @return a list of ProgramAttachmentDto related to the program.
   */
  public List<ProgramAttachmentDto> getProgramAttachments(Integer programId) {
    List<ProgramAttachment> programAttachments =
        programAttachmentRepository.findAttachmentsByProgramId(programId);

    return programAttachments.stream()
        .map(
            programAttachment -> {
              return new ProgramAttachmentDto(
                  programAttachment.getProgramId(), programAttachment.getAttachmentUrl());
            })
        .toList();
  }

  /**
   * Method to fetch all programs.
   *
   * @return ProgramDto with details of the program we are looking for.
   */
  public List<ProgramDto> getPrograms() {
    List<Program> programs = programRepository.findPrograms();

    List<ProgramDto> programDtos = new ArrayList<>();

    for (Program program : programs) {

      List<ProgramAttachmentDto> programAttachments = getProgramAttachments(program.getProgramId());

      programDtos.add(
          new ProgramDto(
              program.getProgramId(),
              program.getProgramType(),
              program.getTitle(),
              program.getDescription(),
              program.getCapacity(),
              program.getOccurrenceDate(),
              program.getDurationMins(),
              program.isRecurring(),
              program.getExpiryDate(),
              program.getFrequency(),
              program.getLocation(),
              program.getVisibility(),
              programAttachments));
    }

    return programDtos;
  }

  /**
   * Method to create a list of ProgramDetailsParticipantsDto with all the programs and their
   * participants depending if the user accessing this view has permissions or not.
   *
   * @param programDtos Dtos of programs.
   * @param hasPermissions Boolean for whether the user has permissions or not.
   * @return a list of ProgramDetailsParticipantsDto.
   */
  public List<ProgramDetailsParticipantsDto> getProgramDetailsParticipantsDto(
      List<ProgramDto> programDtos, Boolean hasPermissions) {

    return programDtos.stream()
        .map(
            programDto -> {
              List<ProgramParticipantDto> participants =
                  hasPermissions ? getParticipants(programDto.getProgramId()) : new ArrayList<>();
              return new ProgramDetailsParticipantsDto(programDto, participants);
            })
        .collect(Collectors.toList());
  }

  /**
   * Method to create new ProgramDto.
   *
   * @param title Title of the program.
   * @param programType Type of the program.
   * @param startDate The first or only date of occurrence of the program.
   * @param endDate The end date of the first or only program occurrence.
   * @param isRecurring Boolean for whether this program is recurring.
   * @param visibility Visibility of the program i.e. is it only visible to registered members or
   *     all members.
   * @param description Description of the program.
   * @param capacity Participants capacity.
   * @param notify Boolean for whether or not to notify all participants.
   * @param startTime Start time of each occurrence of the program.
   * @param endTime End time of each occurrence of the program.
   * @param location Location of the program/session.
   * @param attachments String paths of files attached to this program/session.
   * @return A newly created programDto.
   */
  public ProgramDto createProgramDto(
      String title,
      String programType,
      String startDate,
      String endDate,
      Boolean isRecurring,
      String visibility,
      String description,
      Integer capacity,
      Boolean notify,
      String startTime,
      String endTime,
      String location,
      List<Map<String, String>> attachments) {

    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    int durationMins =
        (int)
            java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
                .toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    if (isRecurring != null && isRecurring) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);

      while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {

        currentOccurrence = currentOccurrence.plusDays(7);
      }
    }

    Program newProgram =
        new Program(
            programType,
            title,
            description,
            capacity,
            occurrenceDate,
            durationMins,
            isRecurring,
            expiryDate,
            frequency,
            location,
            visibility);
    Program savedProgram = programRepository.save(newProgram);

    List<ProgramAttachmentDto> programAttachmentsDto = new ArrayList<>();
    List<ProgramAttachment> programAttachments = new ArrayList<>();

    if (attachments != null && !attachments.isEmpty()) {
      for (Map<String, String> attachment : attachments) {
        String attachmentPath = attachment.get("path");
        if (attachmentPath != null) {

          programAttachmentsDto.add(
              new ProgramAttachmentDto(savedProgram.getProgramId(), attachmentPath));

          programAttachments.add(
              new ProgramAttachment(savedProgram.getProgramId(), attachmentPath));
        }
      }
      programAttachmentRepository.saveAll(programAttachments);
    }

    notifyAllMembers(newProgram);

    return new ProgramDto(savedProgram, programAttachmentsDto);
  }

  /**
   * Method to modify an existing program. Any attachment not already in the database will be added.
   * Any attachment in the database but not included in the payload will be removed.
   *
   * @param programDtoToModify programDto of the program to be modified.
   * @param title Title of the program.
   * @param programType Type of the program.
   * @param startDate Start date of the first or only occurrence.
   * @param endDate End date of the last or only occurrence.
   * @param isRecurring Whether or not the program is a recurring one.
   * @param visibility Visibility of the program. If it can be seen by registered members only or
   *     all members.
   * @param description Description of the program.
   * @param capacity Capacity of the program.
   * @param notify Boolean for whether or not to notify all participants/members.
   * @param startTime Start time of each occurrence of the program.
   * @param endTime End time of each occurrence of the program.
   * @param location Location of the program/session.
   * @param attachments List of Strings of paths uploaded, if any.
   * @return An updated programDto.
   */
  public ProgramDto modifyProgram(
      ProgramDto programDtoToModify,
      String title,
      String programType,
      String startDate,
      String endDate,
      Boolean isRecurring,
      String visibility,
      String description,
      Integer capacity,
      Boolean notify,
      String startTime,
      String endTime,
      String location,
      List<Map<String, String>> attachments) {

    Program existingProgram =
        programRepository
            .findById(programDtoToModify.getProgramId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Program not found with ID: " + programDtoToModify.getProgramId()));

    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    int durationMins =
        (int)
            java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
                .toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    if (isRecurring != null && isRecurring) {
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);
    }

    if (isRecurring != null && isRecurring) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);

      while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {

        currentOccurrence = currentOccurrence.plusDays(7);
      }
    }

    Program updatedProgram =
        new Program(
            programType,
            title,
            description,
            capacity,
            occurrenceDate,
            durationMins,
            isRecurring,
            expiryDate,
            frequency,
            location,
            visibility);

    updatedProgram.setProgramId(existingProgram.getProgramId());

    programRepository.save(updatedProgram);

    List<ProgramAttachmentDto> programAttachmentDtos = new ArrayList<>();

    if (attachments != null) {
      List<ProgramAttachment> existingAttachments =
          programAttachmentRepository.findAttachmentsByProgramId(programDtoToModify.getProgramId());

      List<ProgramAttachment> attachmentsToAdd = new ArrayList<>();
      List<ProgramAttachment> attachmentsToRemove = new ArrayList<>(existingAttachments);

      for (Map<String, String> attachment : attachments) {
        String attachmentPath = attachment.get("path");
        if (attachmentPath != null) {
          boolean exists = false;
          for (ProgramAttachment existingAttachment : existingAttachments) {
            if (existingAttachment.getAttachmentUrl().equals(attachmentPath)) {
              exists = true;
              attachmentsToRemove.remove(existingAttachment);

              programAttachmentDtos.add(
                  new ProgramAttachmentDto(programDtoToModify.getProgramId(), attachmentPath));
              break;
            }
          }

          if (!exists) {
            attachmentsToAdd.add(
                new ProgramAttachment(programDtoToModify.getProgramId(), attachmentPath));

            programAttachmentDtos.add(
                new ProgramAttachmentDto(programDtoToModify.getProgramId(), attachmentPath));
          }
        }
      }

      if (!attachmentsToRemove.isEmpty()) {
        programAttachmentRepository.deleteAll(attachmentsToRemove);
      }

      if (!attachmentsToAdd.isEmpty()) {
        programAttachmentRepository.saveAll(attachmentsToAdd);
      }
    }

    notifyAllMembers(updatedProgram);

    return new ProgramDto(updatedProgram, programAttachmentDtos);
  }

  /** Method to notify all the members of a newly create/posted program. */
  private void notifyAllMembers(Program programToBeNotifiedAbout) {
    List<Account> accounts = accountRepository.findAll();
    for (Account account : accounts) {
      // TODO: Implement logic to notify all members when new program is
      // created/posted.
    }
  }
}
