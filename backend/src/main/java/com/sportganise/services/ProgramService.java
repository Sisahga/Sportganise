package com.sportganise.services;

import com.sportganise.entities.Account;
import com.sportganise.entities.Program;
import com.sportganise.repositories.ProgramRepository;
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

    public List<MemberDTO> getAttendees(Integer sessionId) {
        // Fetch the list of attendees (e.g., Account or Player entities) for the session
        List<Account> attendees = programRepository.findAttendeesBySessionId(sessionId);
    
        // Map each Account to a MemberDTO
        return attendees.stream()
            .map(account -> new MemberDTO(account.getId(), account.getName(), account.getEmail()))
            .toList();
    }
}

