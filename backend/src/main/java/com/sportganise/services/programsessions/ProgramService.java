package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.account.AccountService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** Service layer for Programs. */
@Service
public class ProgramService {

  private final ProgramRepository programRepository;
  private final AccountService accountService;
  private final AccountRepository accountRepository;

  /**
   * Constructor for ProgramService.
   *
   * @param programRepository program repository object.
   * @param accountService account service object.
   * @param accountRepository account repository object.
   */
  public ProgramService(
      ProgramRepository programRepository,
      AccountService accountService,
      AccountRepository accountRepository) {
    this.programRepository = programRepository;
    this.accountRepository = accountRepository;
    this.accountService = accountService;
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
    List<ProgramParticipant> participants =
        programRepository.findParticipantsByProgramId(programId);

    // Map each Account to a ProgramParticipantDto
    return participants.stream()
        .map(
            participant -> {

              // Get account from accountId (this is a wrapper, not the actual)
              Optional<Account> accountOptional =
                  accountService.getAccount(participant.getAccountId());

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
   * Method to fetch program details.
   *
   * @param programId Id of the program.
   * @return ProgramDto with details of the program we are looking for.
   */
  public ProgramDto getProgramDetails(Integer programId) {
    // Get the program details
    Program program = programRepository.findProgramById(programId);

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
        program.getAttachment());
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

    // Get the path of each attachment
    List<String> attachmentPaths = null;
    if (attachments != null && !attachments.isEmpty()) {
      // Map each attachment to its "path" value and collect as a list
      attachmentPaths =
          attachments.stream()
              .map(attachment -> attachment.get("path"))
              .toList(); // Collect the attachment paths into a List
    }

    // Parse dates and times
    // occurrenceDate is the date, time and day of the week of the first occurrence
    // of the program
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    ZonedDateTime endDateTime = ZonedDateTime.parse(endDate).with(LocalTime.parse(endTime));
    int durationMins = (int) java.time.Duration.between(occurrenceDate, endDateTime).toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    // If this new program is a recurring one then we need to check if each
    // occurence overlaps an already existing program
    if (isRecurring != null && isRecurring) {
      ZonedDateTime currentOccurrence = occurrenceDate;
      frequency = "weekly";
      // The program recurs weekly on the same day of the week
      expiryDate = endDateTime.plusDays(7);

      // While currentOccurrence is before or on the day of the expiryDate
      while (currentOccurrence.isBefore(expiryDate) || currentOccurrence.isEqual(expiryDate)) {
        // Verify/Validate scheduling conflicts
        if (checkForSchedulingConflicts(currentOccurrence, durationMins)) {
          throw new RuntimeException(
              "Scheduling conflict detected for recurring program at: " + currentOccurrence);
        }

        // Calculate the next occurrence based on the frequency
        currentOccurrence = getNextOccurrence(currentOccurrence, frequency);
        if (currentOccurrence == null) {
          throw new IllegalArgumentException("Invalid frequency value: " + frequency);
        }
      }
    } else {
      if (checkForSchedulingConflicts(occurrenceDate, durationMins)) {
        throw new RuntimeException("Scheduling conflict detected.");
      }
    }

    // Save program details in the database
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
            visibility,
            attachmentPaths);
    Program savedProgram = programRepository.save(newProgram);

    notifyAllMembers(newProgram);
    // Return ProgramDto to send back to the client
    return new ProgramDto(savedProgram);
  }

  /**
   * Method to modify an existing program.
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
   */
  public void modifyProgram(
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

    // Fetch the existing program by its Id if it exists. Other
    Program existingProgram =
        programRepository
            .findById(programDtoToModify.getProgramId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Program not found with ID: " + programDtoToModify.getProgramId()));

    // Get the path of each attachment
    List<String> attachmentPaths = null;
    if (attachments != null && !attachments.isEmpty()) {
      // Map each attachment to its "path" value and collect as a list
      attachmentPaths =
          attachments.stream()
              .map(attachment -> attachment.get("path"))
              .toList(); // Collect the attachment paths into a List
    }

    // Parse dates and times
    // occurrenceDate is the date, time and day of the week of the first occurrence
    // of the program
    ZonedDateTime occurrenceDate = ZonedDateTime.parse(startDate).with(LocalTime.parse(startTime));
    ZonedDateTime endDateTime = ZonedDateTime.parse(endDate).with(LocalTime.parse(endTime));
    int durationMins = (int) java.time.Duration.between(occurrenceDate, endDateTime).toMinutes();

    ZonedDateTime expiryDate = null;
    String frequency = null;

    if (isRecurring != null && isRecurring) {
      frequency = "weekly";
      // The program recurs weekly on the same day of the week
      expiryDate = endDateTime.plusDays(7);
    }

    // If anything regarding the dates is modified, then we need to
    // re-verify if there is any overlap with other programs
    if (!existingProgram.getOccurrenceDate().isEqual(occurrenceDate)
        || existingProgram.getDurationMins() != durationMins
        || existingProgram.isRecurring() != isRecurring
        || existingProgram.getExpiryDate().isEqual(expiryDate)
        || existingProgram.getFrequency().equalsIgnoreCase(frequency)) {
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
          currentOccurrence = getNextOccurrence(currentOccurrence, frequency);
          if (currentOccurrence == null) {
            throw new IllegalArgumentException("Invalid frequency value: " + frequency);
          }
        }
      } else {
        if (checkForSchedulingConflicts(occurrenceDate, durationMins)) {
          throw new RuntimeException("Scheduling conflict detected.");
        }
      }
    }

    // Create a new Program object with updated fields
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
            visibility,
            attachmentPaths);

    // Set the same ID as the existing program (to update the same record in the
    // database)
    updatedProgram.setProgramId(existingProgram.getProgramId());

    // Save the updated program
    programRepository.save(updatedProgram);

    // Notify players about changes to the program
    notifyAllMembers(updatedProgram);
  }

  /**
   * Method to verify if there is a scheduling conflict.
   *
   * @param occurrenceDate the date of the program's occurrence (start date).
   * @param durationMins the duration of a program in minutes.
   * @return a boolean for whether there is a scheduling conflict or not.
   */
  private boolean checkForSchedulingConflicts(ZonedDateTime occurrenceDate, Integer durationMins) {
    ZonedDateTime startDateTime = occurrenceDate;
    ZonedDateTime endDateTime = startDateTime.plusMinutes(durationMins);

    // Get a list of all existing programs
    List<Program> programs = programRepository.findAll();
    for (Program program : programs) {
      // This is the existing program's end DateTime
      ZonedDateTime programEndDateTime =
          program.getOccurrenceDate().plusMinutes(program.getDurationMins());

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

  /**
   * Method to get the next occurrence in a recurring programs/sessions serie.
   *
   * @param current ZonedDateTime of current occurrence.
   * @param frequency String depicting the frequency of the programs/sessions.
   * @return ZonedDateTime of the next occurrence.
   */
  private ZonedDateTime getNextOccurrence(ZonedDateTime current, String frequency) {
    switch (frequency.toLowerCase()) {
      case "daily":
        return current.plusDays(1);
      case "weekly":
        return current.plusWeeks(1);
      case "monthly":
        return current.plusMonths(1);
      case "yearly":
        return current.plusYears(1);
      default:
        return null; // Invalid frequency
    }
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
