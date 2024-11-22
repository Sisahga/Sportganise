package com.sportganise.services;

import com.sportganise.entities.Account;
import com.sportganise.entities.Program;
import com.sportganise.dto.ProgramParticipantDTO;
import com.sportganise.repositories.ProgramRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    public Optional<Program> getSessionById(Integer id) {
        return programRepository.findById(id);
    }

    public List<ProgramParticipantDTO> getAttendees(Integer sessionId) {
        // Get the list of attendees for the program
        List<Account> attendees = programRepository.findParticipantsByProgramId(sessionId);
    
        // Map each Account to a ProgramParticipantDTO
        return attendees.stream()
            .map(account -> new ProgramParticipantDTO(account.getAccountId(), account.getType(), account.getEmail(), account.getAddress(), account.getPhone(), account.getFirstName(), account.getLastName()))
            .toList();
    }
}

