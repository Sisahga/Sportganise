package com.sportganise.services;

import com.sportganise.entities.Account;
import com.sportganise.entities.Role;
import com.sportganise.entities.Program;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.ProgramRepository;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProgramService {

    private final ProgramRepository trainingSessionRepository;

    public ProgramService(ProgramRepository trainingSessionRepository) {
        this.trainingSessionRepository = trainingSessionRepository;
    }

    public Optional<Program> getSessionById(Integer id) {
        return trainingSessionRepository.findById(id);
    }

    public Optional<Program> getAttendees(Integer session_id) {
        return trainingSessionRepository.findById(session_id);
    }
}

