package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramAttachment;
import com.sportganise.entities.programsessions.ProgramAttachmentCompositeKey;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.exceptions.EntityNotFoundException;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.programexceptions.ProgramCreationException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import io.micrometer.common.lang.Nullable;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Service layer for Programs. */
@Service
@Slf4j
public class ProgramService {

  private final ProgramRepository programRepository;
  private final AccountService accountService;
  private final AccountRepository accountRepository;
  private final ProgramAttachmentRepository programAttachmentRepository;
  private final BlobService blobService;

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
      ProgramAttachmentRepository programAttachmentRepository,
      BlobService blobService) {
    this.programRepository = programRepository;
    this.accountRepository = accountRepository;
    this.accountService = accountService;
    this.programAttachmentRepository = programAttachmentRepository;
    this.blobService = blobService;
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

    log.debug("PARTICIPANTS COUNT: ", participants.size());

    return participants.stream()
        .map(
            participant -> {
              Optional<Account> accountOptional =
                  accountService.getAccount(participant.getAccountId());

              if (accountOptional.isEmpty()) {
                throw new IllegalArgumentException(
                    "Account not found for id: " + participant.getAccountId());
              }

              Account account = accountOptional.get();

              log.debug("ACCOUNT ID: ", account.getFirstName(), " ", account.getLastName());

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

    log.debug("PROGRAM ID: ", program.getProgramId());

    List<ProgramAttachmentDto> programAttachments = getProgramAttachments(programId);

    log.debug("PROGRAM ATTACHMENTS COUNT: ", programAttachments.size());

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
   * Method to fetch all programs.
   *
   * @return ProgramDto with details of the program we are looking for.
   */
  public List<ProgramDto> getPrograms() {
    List<Program> programs = programRepository.findPrograms();

    log.debug("PROGRAMS COUNT: ", programs.size());

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

    log.debug("PROGRAM DTOS COUNT: ", programDtos.size());

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

              log.debug("PROGRAM PARTICIPANTS COUNT: ", participants.size());

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
   * @param startTime Start time of each occurrence of the program.
   * @param endTime End time of each occurrence of the program.
   * @param location Location of the program/session.
   * @param attachments String paths of files attached to this program/session.
   * @param accountId The account id of the user making the request.
   * @return A newly created programDto.
   */
  @Transactional
  public ProgramDto createProgramDto(
      String title,
      String programType,
      String startDate,
      String endDate,
      Boolean isRecurring,
      String visibility,
      String description,
      Integer capacity,
      String startTime,
      String endTime,
      String location,
      List<MultipartFile> attachments,
      Integer accountId) {

    Program savedProgram =
        createProgramObject(
            title,
            programType,
            startDate,
            endDate,
            isRecurring,
            visibility,
            description,
            capacity,
            startTime,
            endTime,
            location);
    programRepository.save(savedProgram);

    log.debug("NEW PROGRAM ID: ", savedProgram.getProgramId());

    List<ProgramAttachmentDto> programAttachmentsDto = new ArrayList<>();

    if (attachments != null && !attachments.isEmpty()) {
      try {
        for (MultipartFile attachment : attachments) {
          String s3AttachmentUrl = this.blobService.uploadFile(attachment, accountId);
          log.debug("Attachment Saved to S3 bucket: {}", s3AttachmentUrl);
          programAttachmentsDto.add(
              new ProgramAttachmentDto(savedProgram.getProgramId(), s3AttachmentUrl));
          ProgramAttachmentCompositeKey savedProgramCompositeKey =
              new ProgramAttachmentCompositeKey(savedProgram.getProgramId(), s3AttachmentUrl);
          ProgramAttachment programAttachment = new ProgramAttachment(savedProgramCompositeKey);
          programAttachmentRepository.saveProgramAttachment(
              programAttachment.getCompositeProgramAttachmentKey().getProgramId(),
              programAttachment.getCompositeProgramAttachmentKey().getAttachmentUrl());
        }
      } catch (FileProcessingException | IOException e) {
        throw new ProgramCreationException("Failed to create program: " + e.getMessage());
      }
    }
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
   * @param startTime Start time of each occurrence of the program.
   * @param endTime End time of each occurrence of the program.
   * @param location Location of the program/session.
   * @param attachmentsToAdd Attachments to add to the program.
   * @param attachmentsToRemove Attachments to remove from the program.
   * @param accountId Id of the user making the request.
   * @return An updated programDto.
   */
  @Transactional
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
      String startTime,
      String endTime,
      String location,
      List<MultipartFile> attachmentsToAdd,
      @Nullable List<String> attachmentsToRemove,
      Integer accountId)
      throws IOException {

    Program existingProgram =
        programRepository
            .findById(programDtoToModify.getProgramId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Program not found with ID: " + programDtoToModify.getProgramId()));

    log.debug("PROGRAM ID OF EXISTING PROGRAM TO BE MODIFIED: ", existingProgram.getProgramId());

    Program updatedProgram =
        createProgramObject(
            title,
            programType,
            startDate,
            endDate,
            isRecurring,
            visibility,
            description,
            capacity,
            startTime,
            endTime,
            location);
    updatedProgram.setProgramId(existingProgram.getProgramId());
    programRepository.save(updatedProgram);

    log.debug("PROGRAM ID OF MODIFIED PROGRAM: ", existingProgram.getProgramId());

    if (attachmentsToRemove != null) {
      if (!attachmentsToRemove.isEmpty()) {
        // Delete from repo.
        int rowsAffected =
            programAttachmentRepository.deleteProgramAttachmentByProgramIdAndAttachmentUrl(
                programDtoToModify.getProgramId(), attachmentsToRemove);
        if (rowsAffected != attachmentsToRemove.size()) {
          throw new RuntimeException("Could not delete all attachments.");
        }
        // Delete from S3 bucket.
        for (String attachment : attachmentsToRemove) {
          this.blobService.deleteFile(attachment);
        }
      }
    }

    List<ProgramAttachment> programAttachments = new ArrayList<>();
    List<ProgramAttachmentDto> programAttachmentDtos = new ArrayList<>();
    String s3AttachmentUrl;
    if (attachmentsToAdd != null) {
      if (!attachmentsToAdd.isEmpty()) {
        for (MultipartFile attachment : attachmentsToAdd) {
          s3AttachmentUrl = this.blobService.uploadFile(attachment, accountId);
          ProgramAttachmentCompositeKey programAttachmentCompositeKey =
              new ProgramAttachmentCompositeKey(programDtoToModify.getProgramId(), s3AttachmentUrl);
          programAttachments.add(new ProgramAttachment(programAttachmentCompositeKey));
          programAttachmentDtos.add(
              new ProgramAttachmentDto(programDtoToModify.getProgramId(), s3AttachmentUrl));
          programAttachmentRepository.saveAll(programAttachments);
        }
        log.debug("PROGRAM ATTACHMENTS COUNT: ", programAttachments.size());
      }
    }
    return new ProgramDto(updatedProgram, programAttachmentDtos);
  }

  private Program createProgramObject(
      String title,
      String programType,
      String startDate,
      String endDate,
      Boolean isRecurring,
      String visibility,
      String description,
      Integer capacity,
      String startTime,
      String endTime,
      String location) {
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    log.debug("occurrenceDate: ", occurrenceDate);

    int durationMins =
        (int)
            java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
                .toMinutes();
    log.debug("durationMins: ", durationMins);

    ZonedDateTime expiryDate = null;
    String frequency = null;

    if (isRecurring != null && isRecurring) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);

      while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {

        currentOccurrence = currentOccurrence.plusDays(7);
        log.debug("nextOccurrence: ", currentOccurrence);
      }
    }

    return new Program(
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
  }
}
