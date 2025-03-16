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
import com.sportganise.entities.programsessions.ProgramRecurrence;
import com.sportganise.entities.programsessions.ProgramType;
import com.sportganise.exceptions.EntityNotFoundException;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.ProgramNotFoundException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.exceptions.programexceptions.InvalidFrequencyException;
import com.sportganise.exceptions.programexceptions.ProgramCreationException;
import com.sportganise.exceptions.programexceptions.ProgramModificationException;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramRecurrenceRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.forum.PostService;
import io.micrometer.common.lang.Nullable;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
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
  private final PostService postService;
  private final ProgramAttachmentRepository programAttachmentRepository;
  private final ProgramRecurrenceRepository programRecurrenceRepository;
  private final BlobService blobService;

  /**
   * Constructor for ProgramService.
   *
   * @param programRepository program repository object.
   * @param accountService account service object.
   * @param programAttachmentRepository program attachment repository object.
   */
  public ProgramService(
      ProgramRepository programRepository,
      AccountService accountService,
      PostService postService,
      ProgramAttachmentRepository programAttachmentRepository,
      ProgramRecurrenceRepository programRecurrenceRepository,
      BlobService blobService) {
    this.programRepository = programRepository;
    this.accountService = accountService;
    this.postService = postService;
    this.programAttachmentRepository = programAttachmentRepository;
    this.programRecurrenceRepository = programRecurrenceRepository;
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
                  participant.getType(),
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
        program.getAuthor(),
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
      Integer programId = program.getProgramId();
      ProgramType programType = program.getProgramType();
      String title = program.getTitle();
      String description = program.getDescription();
      String author = program.getAuthor();
      Integer capacity = program.getCapacity();
      ZonedDateTime occurrenceDate = program.getOccurrenceDate();
      Integer durationMins = program.getDurationMins();
      Boolean isRecurring = program.isRecurring();
      ZonedDateTime expiryDate = program.getExpiryDate();
      String frequency = program.getFrequency();
      String location = program.getLocation();
      String visibility = program.getVisibility();

      if (!(program.getFrequency() == null || program.getFrequency().equalsIgnoreCase("once"))) {
        List<ProgramRecurrence> recurrences = getProgramRecurrences(program.getProgramId());
        for (ProgramRecurrence recurrence : recurrences) {
          programDtos.add(
              new ProgramDto(
                  programId,
                  programType,
                  title,
                  description,
                  author,
                  capacity,
                  recurrence.getOccurrenceDate(),
                  durationMins,
                  isRecurring,
                  expiryDate,
                  frequency,
                  location,
                  visibility,
                  programAttachments));
        }
      } else {
        programDtos.add(
            new ProgramDto(
                programId,
                programType,
                title,
                description,
                author,
                capacity,
                occurrenceDate,
                durationMins,
                isRecurring,
                expiryDate,
                frequency,
                location,
                visibility,
                programAttachments));
      }
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
   * Method to create new ProgramDto. It creates a new post too which will be linked to this program
   * by programId.
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
      ProgramType programType,
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
      Integer accountId,
      String frequency) {

    Account user = accountService.getAccountById(accountId);
    if (user == null) {
      throw new ResourceNotFoundException("User with ID: " + accountId + " not found.");
    }

    String author = user.getFirstName() + " " + user.getLastName();

    Program savedProgram =
        createProgramObject(
            title,
            author,
            programType,
            startDate,
            endDate,
            isRecurring,
            visibility,
            description,
            capacity,
            startTime,
            endTime,
            location,
            frequency);
    programRepository.save(savedProgram);

    log.debug("NEW PROGRAM ID: ", savedProgram.getProgramId());

    postService.createNewPost(
        accountId,
        title,
        description,
        savedProgram.getOccurrenceDate(),
        programType,
        savedProgram.getProgramId());

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
      ProgramType programType,
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
      Integer accountId,
      String frequency)
      throws IOException {

    Program existingProgram =
        programRepository
            .findById(programDtoToModify.getProgramId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Program not found with ID: " + programDtoToModify.getProgramId()));

    log.debug("PROGRAM ID OF EXISTING PROGRAM TO BE MODIFIED: ", existingProgram.getProgramId());

    boolean existingProgramIsRecurring =
        (existingProgram.getFrequency() == null
                || existingProgram.getFrequency().equalsIgnoreCase("once"))
            ? false
            : true;
    boolean newProgramIsRecurring =
        (frequency == null || frequency.equalsIgnoreCase("once")) ? false : true;
    log.debug("Modifying recurrences for recurring programs");
    ZonedDateTime parsedStartDateTime =
        ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));

    if (existingProgramIsRecurring) {
      if (endDate == null) {
        throw new ProgramModificationException("End date is required for recurring programs.");
      }
      ZonedDateTime parsedEndDateTime = ZonedDateTime.parse(endDate).with(LocalTime.parse(endTime));
      if (!newProgramIsRecurring) {
        deleteAllRecurrences(existingProgram.getProgramId());
      } else if (!existingProgram.getFrequency().equalsIgnoreCase(frequency)
          || !(existingProgram.getOccurrenceDate().isEqual(parsedStartDateTime))) {
        modifyRecurrenceWithDrasticChanges(
            existingProgram.getProgramId(), parsedStartDateTime, parsedEndDateTime, frequency);
      } else if (existingProgram.getFrequency().equalsIgnoreCase(frequency)) {

        if (existingProgram.getExpiryDate().isBefore(parsedEndDateTime)) {

          ZonedDateTime lastOccurrence =
              getLastProgramRecurrence(existingProgram.getProgramId()).getOccurrenceDate();
          ZonedDateTime newExpiryDate = parsedEndDateTime;
          String usedFrequency = existingProgram.getFrequency();
          ZonedDateTime newStartDate = getNextDateTime(lastOccurrence, usedFrequency);
          createProgramRecurrences(
              newStartDate, newExpiryDate, usedFrequency, existingProgram.getProgramId());
        } else if (existingProgram.getExpiryDate().isAfter(parsedEndDateTime)) {
          deleteExpiredRecurrences(parsedEndDateTime, existingProgram.getProgramId());
        } else {
          throw new ProgramModificationException(("An error occurred while handling recurrences"));
        }
      }
    }

    existingProgram.setTitle(title);
    existingProgram.setProgramType(programType);
    existingProgram.setOccurrenceDate(parsedStartDateTime);
    existingProgram.setExpiryDate(
        endDate != null ? ZonedDateTime.parse(endDate).with(LocalTime.parse(endTime)) : null);
    existingProgram.setRecurring(isRecurring);
    existingProgram.setVisibility(visibility);
    existingProgram.setDescription(description);
    existingProgram.setCapacity(capacity);
    existingProgram.setLocation(location);
    existingProgram.setFrequency(frequency);

    programRepository.save(existingProgram);

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
    return new ProgramDto(existingProgram, programAttachmentDtos);
  }

  /**
   * Method to create a list of ProgramRecurrence objects for a recurring program.
   *
   * @param title Title of the program.
   * @param author The name of the person who created the program.
   * @param programType Type of the program.
   * @param startDate Start date of the first occurrence.
   * @param endDate End date of the last occurrence.
   * @param isRecurring Boolean for whether this program is recurring.
   * @param visibility Visibility of the program.
   * @param description Description of the program.
   * @param capacity Capacity of the program.
   * @param startTime Start time of each occurrence of the program.
   * @param endTime End time of each occurrence of the program.
   * @param location Location of the program/session.
   * @param frequency Frequency of the program.
   * @return A list of ProgramRecurrence objects.
   */
  private Program createProgramObject(
      String title,
      String author,
      ProgramType programType,
      String startDate,
      String endDate,
      Boolean isRecurring,
      String visibility,
      String description,
      Integer capacity,
      String startTime,
      String endTime,
      String location,
      String frequency) {
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    log.debug("occurrenceDate: ", occurrenceDate);

    int durationMins =
        (int)
            java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
                .toMinutes();
    log.debug("durationMins: ", durationMins);

    ZonedDateTime expiryDate = null;
    Program program;

    if (frequency != null && !(frequency.equalsIgnoreCase("once"))) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      expiryDate = ZonedDateTime.parse(endDate);
      program =
          new Program(
              programType,
              title,
              description,
              author,
              capacity,
              occurrenceDate,
              durationMins,
              true,
              expiryDate,
              frequency,
              location,
              visibility);
      createProgramRecurrences(currentOccurrence, expiryDate, frequency, program.getProgramId());
    } else {
      program =
          new Program(
              programType,
              title,
              description,
              author,
              capacity,
              occurrenceDate,
              durationMins,
              isRecurring,
              expiryDate,
              frequency,
              location,
              visibility);
    }
    return program;
  }

  /**
   * Method to create a list of ProgramRecurrence objects for a recurring program.
   *
   * @param startDate Start date of the first occurrence.
   * @param expiryDate End date of the last occurrence.
   * @param frequency Frequency of the program.
   * @param programId Id of the program.
   */
  public void createProgramRecurrences(
      ZonedDateTime startDate, ZonedDateTime expiryDate, String frequency, Integer programId) {
    ZonedDateTime currentOccurrence = startDate;
    while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {
      ProgramRecurrence recurrence = new ProgramRecurrence(programId, currentOccurrence, false);
      programRecurrenceRepository.save(recurrence);
      if (frequency.equalsIgnoreCase("daily")) {
        currentOccurrence = currentOccurrence.plusDays(1);
      } else if (frequency.equalsIgnoreCase("weekly")) {
        currentOccurrence = currentOccurrence.plusDays(7);
      } else if (frequency.equalsIgnoreCase("monthly")) {
        currentOccurrence = currentOccurrence.plusMonths(1);
      } else {
        throw new InvalidFrequencyException("Invalid frequency: " + frequency);
      }
    }
  }

  /**
   * Method to get the next date time based on the last date time and the frequency.
   *
   * @param lastOccurrence The last occurrence of the program.
   * @param frequency The frequency of the program.
   * @return The next occurrence of the program.
   */
  @NotNull
  private ZonedDateTime getNextDateTime(ZonedDateTime lastOccurrence, String frequency) {
    ZonedDateTime nextDateTime;
    System.out.println("Last Occurrence in method getnext: " + lastOccurrence);
    if (frequency.equalsIgnoreCase("daily")) {
      nextDateTime = lastOccurrence.plusDays(1);
    } else if (frequency.equalsIgnoreCase("weekly")) {
      nextDateTime = lastOccurrence.plusDays(7);
    } else if (frequency.equalsIgnoreCase("monthly")) {
      nextDateTime = lastOccurrence.plusMonths(1);
    } else {
      throw new InvalidFrequencyException("Invalid frequency: " + frequency);
    }
    System.out.println("Next Occurrence in method getnext: " + nextDateTime);
    return nextDateTime;
  }

  /**
   * Method to get the last occurrence of a program.
   *
   * @param programId Id of the program.
   * @return The last occurrence of the program.
   */
  public ProgramRecurrence getLastProgramRecurrence(Integer programId) {
    return programRecurrenceRepository
        .findLastRecurrenceByProgramId(programId)
        .orElseThrow(() -> new ProgramNotFoundException("Recurrence Not Found"));
  }

  /**
   * Method to delete a program and all its recurrences.
   *
   * @param programId Id of the program to be deleted.
   */
  public void deleteExpiredRecurrences(ZonedDateTime expiryDate, Integer programId) {
    programRecurrenceRepository.deleteExpiredRecurrences(expiryDate, programId);
  }

  /**
   * Method to modify a recurring program with drastic changes, namely those with different
   * frequencies and dates.
   *
   * @param programId Id of the program.
   * @param newStartDate Start date of the first occurrence.
   * @param newEndDate End date of the last occurrence.
   * @param newFrequency Frequency of the program.
   */
  public void modifyRecurrenceWithDrasticChanges(
      Integer programId,
      ZonedDateTime newStartDate,
      ZonedDateTime newEndDate,
      String newFrequency) {
    ZonedDateTime currentOccurrence = newStartDate;
    ZonedDateTime nextOccurrence;

    List<ProgramRecurrence> existingRecurrences =
        programRecurrenceRepository.findByProgramIdAndOccurrenceDateBetween(
            programId, newStartDate, newEndDate);

    while (currentOccurrence.isBefore(newEndDate) || currentOccurrence.isEqual(newEndDate)) {
      nextOccurrence = getNextDateTime(currentOccurrence, newFrequency);

      ZonedDateTime currentOccurrenceForComparison = currentOccurrence;

      boolean exists =
          existingRecurrences.stream()
              .anyMatch(
                  recurrence ->
                      recurrence.getOccurrenceDate().equals(currentOccurrenceForComparison));

      if (!exists) {
        ProgramRecurrence recurrence = new ProgramRecurrence(programId, currentOccurrence, false);
        programRecurrenceRepository.save(recurrence);
      }

      deleteMiddleRecurrences(programId, currentOccurrence, nextOccurrence);

      currentOccurrence = nextOccurrence;
    }
  }

  /**
   * Method to create a list of ProgramRecurrence objects for a recurring program.
   *
   * @param programId Id of the program.
   * @return A list of ProgramRecurrence objects.
   */
  public List<ProgramRecurrence> getProgramRecurrences(Integer programId) {
    return programRecurrenceRepository.findProgramRecurrenceByProgramId(programId);
  }

  /**
   * Method to delete a program and all its recurrences.
   *
   * @param programId Id of the program to be deleted.
   */
  public void deleteAllRecurrences(Integer programId) {
    programRecurrenceRepository.deleteProgramRecurrenceByProgramId(programId);
  }

  /**
   * Method to delete a recurrence.
   *
   * @param recurrenceId Id of the recurrence to be deleted.
   */
  public void deleteProgramRecurrence(Integer recurrenceId) {
    programRecurrenceRepository.deleteProgramRecurrenceByRecurrenceId(recurrenceId);
  }

  /**
   * Method to delete a program and all its recurrences.
   *
   * @param programId Id of the program to be deleted.
   */
  public void deleteMiddleRecurrences(
      Integer programId, ZonedDateTime firstDate, ZonedDateTime secondDate) {
    ZonedDateTime effectiveStartDate = firstDate.plusDays(1);
    ZonedDateTime effectiveEndDate = secondDate.minusDays(1);
    if (effectiveStartDate.isBefore(effectiveEndDate)) {
      programRecurrenceRepository.deleteMiddleRecurrences(
          programId, effectiveStartDate, effectiveEndDate);
    }
  }
}
