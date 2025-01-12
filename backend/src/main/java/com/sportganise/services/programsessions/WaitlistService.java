package com.sportganise.services.programsessions;

import java.time.LocalDateTime;

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

    public Integer optProgramParticipantDto(Integer programId, Integer accountId) {

        Integer maxRank = participantRepository.findMaxRank(programId);
        int newRank = (maxRank == null) ? 1 : maxRank + 1;

        ProgramParticipant optedParticipant = participantRepository.findWaitlistParticipant(programId, accountId);
        optedParticipant.setRank(newRank);

        ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

        // TODO: Notify everyone

        return savedParticipant.getRank();
    }

    public ProgramParticipantDto confirmParticipant(Integer programId, Integer accountId) {

        ProgramParticipant optedParticipant = participantRepository.findWaitlistParticipant(programId, accountId);
        if(optedParticipant == null){
            return null;
        }
        //Update ranks of others in queue
        participantRepository.updateRanks(programId, accountId);
        
        //Confirm participants
        LocalDateTime ldt = LocalDateTime.now();
        optedParticipant.setConfirmedDate(ldt);
        optedParticipant.setConfirmed(true);
        //Take out of the waitlist
        optedParticipant.setRank(null);
        
        ProgramParticipant savedParticipant = participantRepository.save(optedParticipant);

        return new ProgramParticipantDto(savedParticipant.getAccountId(), savedParticipant.getProgramId(),
                savedParticipant.getRank(), savedParticipant.isConfirmed(), savedParticipant.getConfirmedDate());

    }
}
