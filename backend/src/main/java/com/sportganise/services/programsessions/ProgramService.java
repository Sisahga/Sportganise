package com.sportganise.services;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.repositories.programsessions.ProgramRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

/**
 * Service layer for Programs.
 */
@Service
public class ProgramService {

    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    public Optional<Program> getSessionById(Integer id) {
        return programRepository.findById(id);
    }

    /**
     * Get participants list of a program.
     *
     * @param sessionId Id of session
     * @return List of participants of a program
     */
    public List<ProgramParticipantDto> getParticipants(Integer sessionId) {
        // Get the list of participants for the program
        List<Account> participants = programRepository.findParticipantsByProgramId(sessionId);

        // Map each Account to a ProgramParticipantDto
        return participants.stream()
                .map(
                        account ->
                                new ProgramParticipantDto(
                                        account.getAccountId(),
                                        account.getType(),
                                        account.getEmail(),
                                        account.getAddress(),
                                        account.getPhone(),
                                        account.getFirstName(),
                                        account.getLastName()))
                .toList();
    }

    /**
     * Method to retrieve list of all programs.
     *
     * @return List of all program.
     */
    public ProgramDto getProgramDetails(Integer sessionId) {
        // Get the program details
        Program program = programRepository.findProgramById(sessionId);

        return new ProgramParticipantDto(
                        program.getProgramId(),
                        program.getProgramType(),
                        program.getTitle(),
                        program.getDescription(),
                        program.getCapacity(),
                        program.getOccurenceDate(),
                        program.getDurationMins(),
                        program.getIsRecurring(),
                        program.getExpiryDate(),
                        program.getFrequency());
    }
}
