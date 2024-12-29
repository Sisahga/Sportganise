package com.sportganise.services.programsessions;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.auth.AccountService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

/**
 * Service layer for Programs.
 */
@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final AccountService accountService;

    public ProgramService(ProgramRepository programRepository, AccountService accountService) {
        this.programRepository = programRepository;
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

            // map account information and participant information into a list of ProgramParticipantDto
            return new ProgramParticipantDto(
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
                        program.getOccurenceDate(),
                        program.getDurationMins(),
                        program.isRecurring(),
                        program.getExpiryDate(),
                        program.getFrequency());
    }
}
