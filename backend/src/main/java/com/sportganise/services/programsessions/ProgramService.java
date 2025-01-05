package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.auth.AccountService;

import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service layer for Programs.
 */
@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final AccountService accountService;
    private final AccountRepository accountRepository;

    public ProgramService(ProgramRepository programRepository, AccountService accountService,
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
        List<ProgramParticipant> participants = programRepository.findParticipantsByProgramId(programId);

        // Map each Account to a ProgramParticipantDto
        return participants.stream()
                .map(participant -> {

                    // Get account from accountId (this is a wrapper, not the actual)
                    Optional<Account> accountOptional = accountService.getAccount(participant.getAccountId());

                    // Check if the value of accountOptional is empty
                    if (!accountOptional.isPresent()) {
                        throw new IllegalArgumentException("Account not found for id: " + participant.getAccountId());
                    }

                    // Get the actual account object
                    Account account = accountOptional.get();

                    // map account information and participant information into a list of
                    // ProgramParticipantDto
                    return new ProgramParticipantDto(
                            programId,
                            account.getAccountId(),
                            account.getType(),
                            account.getFirstName(),
                            account.getLastName(),
                            account.getEmail(),
                            account.getAddress(),
                            account.getPhone(),
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
     * @param accountId      Id of user who is making the request.
     * @param programType    Type of the program.
     * @param title          Title of the program.
     * @param description    Description of the program.
     * @param capacity       Participants capacity.
     * @param occurrenceDate Date of the program.
     * @param durationMins   Duration of the program/session in minutes.
     * @param isRecurring    Boolean for whether this program is recurring.
     * @param expiryDate     Expiry Date of the program i.e. when is the last
     *                       occurence.
     * @param frequency      Frequency of program/sessions.
     * @param location       Location of the program/session.
     * @param visibility     Visibility of the program i.e. is it only visible to
     *                       registered members or all members.
     * @param attachment     Files attached to this program/session.
     * @return A new programDto.
     */
    public ProgramDto createProgramDto(String programType, String title, String description,
            Integer capacity, LocalDateTime occurrenceDate, Integer durationMins, Boolean isRecurring,
            LocalDateTime expiryDate, String frequency, String location, String visibility, MultipartFile attachment) {

        // If this new program is a recurring one then we need to check if each
        // occurence overlaps an already existing program
        if (isRecurring) {
            LocalDateTime currentOccurrence = occurrenceDate;

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

        String filePath = null;
        // Handle file upload (i.e. store the file into database) and returns a String
        // filePath
        if (!attachment.isEmpty()) {
            try {
                filePath = handleFileUpload(attachment);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // Save program details in the database
        Program newProgram = new Program(programType, title, description, capacity,
                occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, filePath);
        Program savedProgram = programRepository.save(newProgram);

        notifyAllMembers(newProgram);
        // Return ProgramDto to send back to the client
        return new ProgramDto(savedProgram);
    }

    /**
     * Method to modify an existing program.
     * 
     * @param programDtoToModify programDto of the program to be modified.
     * @param programType        Type of the program.
     * @param title              Title of the program.
     * @param description        Description of the program.
     * @param capacity           Capacity of the program.
     * @param occurrenceDate     DateTime of occurrence of the program.
     * @param durationMins       Duration in minutes of the program.
     * @param isRecurring        Whether or not the program is a recurring one.
     * @param expiryDate         Expiry Date of a program.
     * @param frequency          Frequency of a program. i.e. if it has multiple
     *                           sessions/occurrences.
     * @param location           Location of the program/session.
     * @param visibility         Visibility of the program. If it can be seen by
     *                           registered members only or all members.
     * @param attachment         Files uploaded, if any.
     */
    public void modifyProgram(ProgramDto programDtoToModify, String programType, String title, String description,
            Integer capacity, LocalDateTime occurrenceDate, Integer durationMins, Boolean isRecurring,
            LocalDateTime expiryDate, String frequency, String location, String visibility, MultipartFile attachment) {

        // Fetch the existing program by its Id if it exists. Other
        Program existingProgram = programRepository.findById(programDtoToModify.getProgramId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Program not found with ID: " + programDtoToModify.getProgramId()));

        // TODO: Need to add additional logic for the files upload/delete/modifications
        // once I figure out how the storage is handled
        String filePath = existingProgram.getAttachment();
        if (attachment != null && !attachment.isEmpty()) {
            if (filePath != null) {
                // Delete the old file (We delete all the files since attachment also includes
                // the already uploaded files that we want to keep)
                deleteFile(filePath);
            }
            // We re-upload the previous ones that we want to keep along with the new ones
            try {
                filePath = handleFileUpload(attachment);
            } catch (IOException e) {
                e.printStackTrace();
            }
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
            if (isRecurring) {
                LocalDateTime currentOccurrence = occurrenceDate;

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
                visibility,
                filePath);

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
     * @param occurrenceDate
     * @param durationMins
     * @return
     */
    private boolean checkForSchedulingConflicts(LocalDateTime occurrenceDate, Integer durationMins) {
        LocalDateTime startDateTime = occurrenceDate;
        LocalDateTime endDateTime = startDateTime.plusMinutes(durationMins);

        // Get a list of all existing programs
        List<Program> programs = programRepository.findAll();
        for (Program program : programs) {
            // This is the existing program's end DateTime
            LocalDateTime programEndDateTime = program.getOccurrenceDate().plusMinutes(program.getDurationMins());

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
     * @param current   LocalDateTime of current occurrence.
     * @param frequency String depicting the frequency of the programs/sessions.
     * @return LocalDateTime of the next occurrence.
     */
    private LocalDateTime getNextOccurrence(LocalDateTime current, String frequency) {
        // TODO: There may be more frequencies, may need to change (also, maybe making
        // an enum will be better but for now I will keep it as is)
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

    /**
     * Handle file upload (e.g., save file path).
     * 
     * @param file File to be saved/uploaded.
     * @return Path of file saved/uploaded.
     * @throws IOException
     */
    private String handleFileUpload(MultipartFile file) throws IOException {
        // TODO: Implement logic to save file to database
        if (!file.isEmpty()) {
            // Return the file path or URL
            return "file_upload_path";
        }
        return null;
    }

    /**
     * 
     * @param filePath file path of the file that we want to delete.
     */
    public void deleteFile(String filePath) {
        // TODO: Not sure yet if this logic is good since I am not sure how we are
        // dealing with file storage
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + filePath, e);
        }
    }

    /**
     * Method to notify all the members of a newly create/posted program
     */
    private void notifyAllMembers(Program programToBeNotifiedAbout) {
        List<Account> accounts = accountRepository.findAll();
        for (Account account : accounts) {
            // TODO: Implement logic to notify all members when new program is
            // created/posted.
        }
    }
}
