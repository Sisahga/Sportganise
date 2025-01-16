package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramAttachment;
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
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

/** Service layer for Programs. */
@Service
public class ProgramService {

  private final ProgramRepository programRepository;
  private final AccountService accountService;
  private final AccountRepository accountRepository;
  private ProgramAttachmentRepository programAttachmentRepository;

  /**
   * Constructor for ProgramService.
   *
   * @param programRepository           program repository object.
   * @param accountService              account service object.
   * @param accountRepository           account repository object.
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
    // Get the list of participants for the program
    List<ProgramParticipant> participants = programRepository.findParticipantsByProgramId(programId);

    // Map each Account to a ProgramParticipantDto
    return participants.stream()
        .map(
            participant -> {

              // Get account from accountId (this is a wrapper, not the actual)
              Optional<Account> accountOptional = accountService.getAccount(participant.getAccountId());

              // Check if the value of accountOptional is empty
              if (!accountOptional.isPresent()) {
                throw new IllegalArgumentException(
                    "Account not found for id: " + participant.getAccountId());
              }

              // If not empty, then we go fetch the actual user value
              Account account = accountOptional.get();

              // map account information and participant information into a list of
              // ProgramParticipantDto
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
    // Get all the programs and their details
    Program program = programRepository.findProgramById(programId);

    // Fetch all the program attachments related to this programId
    List<ProgramAttachmentDto> programAttachments = getProgramAttachments(programId);

    // return a Dto of the program fetched from the database
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
    List<ProgramAttachment> programAttachments = programAttachmentRepository.findAttachmentsByProgramId(programId);

    return programAttachments.stream()
        .map(
            programAttachment -> {
              return new ProgramAttachmentDto(
                  programAttachment.getProgramId(),
                  programAttachment.getAttachmentUrl());
            })
        .toList();
  }

  /**
   * Method to fetch all programs.
   *
   * @return ProgramDto with details of the program we are looking for.
   */
  public List<ProgramDto> getPrograms() {
    // Get all the programs and their details
    List<Program> programs = programRepository.findPrograms();

    List<ProgramDto> programDtos = new ArrayList<>();

    for (Program program : programs) {

      // Fetch all the program attachments related to this program
      List<ProgramAttachmentDto> programAttachments = getProgramAttachments(program.getProgramId());

      programDtos.add(new ProgramDto(
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
   * Method to create a list of ProgramDetailsParticipantsDto with all the
   * programs and their participants depending if the user accessing this view has
   * permissions or not.
   * 
   * @param programDtos    Dtos of programs.
   * @param hasPermissions Boolean for whether the user has permissions or not.
   * @return a list of ProgramDetailsParticipantsDto.
   */
  public List<ProgramDetailsParticipantsDto> getProgramDetailsParticipantsDto(List<ProgramDto> programDtos,
      Boolean hasPermissions) {

    return programDtos.stream()
        .map(programDto -> {

          // Fetch all the participants of this program depending on whether they have
          // permission or not
          List<ProgramParticipantDto> participants = hasPermissions
              ? getParticipants(programDto.getProgramId())
              : new ArrayList<>();
          return new ProgramDetailsParticipantsDto(programDto, participants);
        })
        .collect(Collectors.toList());
  }

  /**
   * Method to create new ProgramDto.
   *
   * @param title       Title of the program.
   * @param programType Type of the program.
   * @param startDate   The first or only date of occurrence of the program.
   * @param endDate     The end date of the first or only program occurrence.
   * @param isRecurring Boolean for whether this program is recurring.
   * @param visibility  Visibility of the program i.e. is it only visible to
   *                    registered members or
   *                    all members.
   * @param description Description of the program.
   * @param capacity    Participants capacity.
   * @param notify      Boolean for whether or not to notify all participants.
   * @param startTime   Start time of each occurrence of the program.
   * @param endTime     End time of each occurrence of the program.
   * @param location    Location of the program/session.
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

    // Parse dates and times
    // occurrenceDate is the date, time and day of the week of the first occurrence
    // of the program
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    int durationMins = (int) java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
        .toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    // If this new program is a recurring one then we need to check if each
    // occurence overlaps an already existing program
    if (isRecurring != null && isRecurring) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);

      // While currentOccurrence is before or on the day of the expiryDate
      while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {
        // Verify/Validate scheduling conflicts
        if (checkForSchedulingConflicts(currentOccurrence, durationMins)) {
          throw new RuntimeException(
              "Scheduling conflict detected for recurring program at: " + currentOccurrence);
        }

        // Calculate the next occurrence
        currentOccurrence = currentOccurrence.plusDays(7);
      }

    } else {
      if (checkForSchedulingConflicts(occurrenceDate, durationMins)) {
        throw new RuntimeException("Scheduling conflict detected.");
      }
    }

    // Save program details in the database
    Program newProgram = new Program(
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
          // Create new ProgramAttachmentDto. This list of programAttachmentsDto will be
          // used to create the new programDto
          programAttachmentsDto.add(new ProgramAttachmentDto(savedProgram.getProgramId(), attachmentPath));

          // Create new ProgramAttachment entity to be saved into the database
          programAttachments.add(new ProgramAttachment(savedProgram.getProgramId(), attachmentPath));
        }
      }
      programAttachmentRepository.saveAll(programAttachments);
    }

    notifyAllMembers(newProgram);

    // Return ProgramDto to send back to the client
    return new ProgramDto(savedProgram, programAttachmentsDto);
  }

  /**
   * Method to modify an existing program.
   *
   * @param programDtoToModify programDto of the program to be modified.
   * @param title              Title of the program.
   * @param programType        Type of the program.
   * @param startDate          Start date of the first or only occurrence.
   * @param endDate            End date of the last or only occurrence.
   * @param isRecurring        Whether or not the program is a recurring one.
   * @param visibility         Visibility of the program. If it can be seen by
   *                           registered members only or
   *                           all members.
   * @param description        Description of the program.
   * @param capacity           Capacity of the program.
   * @param notify             Boolean for whether or not to notify all
   *                           participants/members.
   * @param startTime          Start time of each occurrence of the program.
   * @param endTime            End time of each occurrence of the program.
   * @param location           Location of the program/session.
   * @param attachments        List of Strings of paths uploaded, if any.
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

    // Make sure that the program exists in database
    Program existingProgram = programRepository
        .findById(programDtoToModify.getProgramId())
        .orElseThrow(
            () -> new EntityNotFoundException(
                "Program not found with ID: " + programDtoToModify.getProgramId()));

    // Parse dates and times
    // occurrenceDate is the date, time and day of the week of the first occurrence
    // of the program
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    int durationMins = (int) java.time.Duration.between(LocalTime.parse(startTime), LocalTime.parse(endTime))
        .toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    if (isRecurring != null && isRecurring) {
      // The program recurs weekly on the same day of the week
      frequency = "weekly";
      expiryDate = ZonedDateTime.parse(endDate);
    }

    // If anything regarding the dates is modified, then we need to
    // re-verify if there is any overlap with other programs
    if (!existingProgram.getOccurrenceDate().isEqual(occurrenceDate)
        || existingProgram.getDurationMins() != durationMins
        || existingProgram.isRecurring() != isRecurring
        || !existingProgram.getExpiryDate().isEqual(expiryDate)) {
      // If this program is a recurring one (or will become a recurring one) then we
      // need to check if each
      // occurence overlaps an already existing program
      if (isRecurring != null && isRecurring) {
        ZonedDateTime currentOccurrence = occurrenceDate;

        // While currentOccurrence is before or on the day of the expiryDate
        while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {
          // Verify/Validate scheduling conflicts
          if (checkForSchedulingConflicts(currentOccurrence, durationMins)) {
            throw new RuntimeException(
                "Scheduling conflict detected for recurring program at: " + currentOccurrence);
          }

          // Calculate the next occurrence based on the frequency
          currentOccurrence = currentOccurrence.plusDays(7);
        }
      } else {
        if (checkForSchedulingConflicts(occurrenceDate, durationMins)) {
          throw new RuntimeException("Scheduling conflict detected.");
        }
      }
    }

    // Create a new Program object with updated fields
    Program updatedProgram = new Program(
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

    // Set the same ID as the existing program (to update the same record in the
    // database)
    updatedProgram.setProgramId(existingProgram.getProgramId());

    // Save the updated program
    programRepository.save(updatedProgram);

    List<ProgramAttachmentDto> programAttachmentDtos = new ArrayList<>();

    // Any attachment not already in the database will be added.
    // Any attachment in the database but not included in the payload will be
    // removed.
    if (attachments != null) {
      // Fetch the current attachments from the database for the program
      List<ProgramAttachment> existingAttachments = programAttachmentRepository
          .findAttachmentsByProgramId(programDtoToModify.getProgramId());

      // Create new lists for additions and deletions
      List<ProgramAttachment> attachmentsToAdd = new ArrayList<>();
      List<ProgramAttachment> attachmentsToRemove = new ArrayList<>(existingAttachments);

      // Iterate over the provided attachments
      for (Map<String, String> attachment : attachments) {
        String attachmentPath = attachment.get("path");
        if (attachmentPath != null) {
          // Check if the attachment is already in the existing attachments
          boolean exists = false;
          // Iterate over the attachments already in database
          for (ProgramAttachment existingAttachment : existingAttachments) {
            // Check if the attachment provided is already in the database
            if (existingAttachment.getAttachmentUrl().equals(attachmentPath)) {
              exists = true;
              // Remove the attachment from the list of attachments to remove from database
              attachmentsToRemove.remove(existingAttachment);
              // Add the url to the Dto that will be used for the programdto returned at the end.
              programAttachmentDtos.add(
                  new ProgramAttachmentDto(programDtoToModify.getProgramId(), attachmentPath));
              break;
            }
          }

          // If the attachment does not exist, add it to the list to be added
          if (!exists) {
            attachmentsToAdd.add(new ProgramAttachment(programDtoToModify.getProgramId(), attachmentPath));
            // Add the url to the Dto that will be used for the programdto returned at the end.
            programAttachmentDtos.add(
                  new ProgramAttachmentDto(programDtoToModify.getProgramId(), attachmentPath));
          }
        }
      }

      // Remove attachments that are not in the provided list
      if (!attachmentsToRemove.isEmpty()) {
        programAttachmentRepository.deleteAll(attachmentsToRemove);
      }

      // Save new attachments to the database
      if (!attachmentsToAdd.isEmpty()) {
        programAttachmentRepository.saveAll(attachmentsToAdd);
      }
    }

    // Notify players about changes to the program
    notifyAllMembers(updatedProgram);

    // Return ProgramDto to send back to the client
    return new ProgramDto(updatedProgram, programAttachmentDtos);
  }

  /**
   * Method to verify if there is a scheduling conflict.
   *
   * @param occurrenceDate the date of the program's occurrence (start date).
   * @param durationMins   the duration of a program in minutes.
   * @return a boolean for whether there is a scheduling conflict or not.
   */
  private boolean checkForSchedulingConflicts(ZonedDateTime occurrenceDate, Integer durationMins) {
    ZonedDateTime startDateTime = occurrenceDate;
    ZonedDateTime endDateTime = startDateTime.plusMinutes(durationMins);

    // Get a list of all existing programs
    List<Program> programs = programRepository.findAll();
    for (Program program : programs) {
      // This is the existing program's end DateTime
      ZonedDateTime programEndDateTime = program.getOccurrenceDate().plusMinutes(program.getDurationMins());

      // Check for overlapping times. If the program we want to create starts before
      // the end of another program
      // and ends after the start of another program, then it is overlapping and will
      // return true.
      if ((startDateTime.isBefore(programEndDateTime)
          && endDateTime.isAfter(program.getOccurrenceDate()))) {
        return true;
      }
    }
    // if no overlap, then returns false
    return false;
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
