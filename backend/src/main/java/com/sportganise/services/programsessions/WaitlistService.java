package com.sportganise.services.programsessions;

import org.springframework.stereotype.Service;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;

@Service
public class WaitlistService {

    private final ProgramParticipantRepository participantRepository;

    public WaitlistService(ProgramParticipantRepository participantRepository) {

        this.participantRepository = participantRepository;

    }

    public ProgramParticipantDto optProgramParticipantDto(Integer programId, Integer accountId) {

        Integer maxRank = participantRepository.findMaxRank(programId);
        int newRank = (maxRank == null) ? 1 : maxRank + 1;

        ProgramParticipant optedParticipant = participantRepository.findParticipant(programId, accountId);
        optedParticipant.setRank(newRank);

        ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

        return new ProgramParticipantDto(savedParticipant.getAccountId(), savedParticipant.getProgramId(),
                savedParticipant.isConfirmed(), savedParticipant.getConfirmedDate());
    }
}
