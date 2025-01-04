package com.sportganise.controllers.programsessions;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.services.programsessions.ProgramService;

@RestController
@RequestMapping("/api/program-participant")
public class ProgramParticipantController {

    private ProgramService programService;
    
    @Autowired
    public ProgramParticipantController(ProgramService programService){
        this.programService = programService;
    }

    @PostMapping("/create-participant")
    public ResponseEntity<ProgramParticipantDto> createProgramParticipant(
        @RequestParam Integer programId,
        @RequestParam Integer accountId,
        @RequestParam AccountDto account,
        @RequestParam Boolean isConfirmed,
        @RequestParam LocalDateTime confirmedDate) {

        ProgramParticipantDto participant = programService.createProgramParticipantDto(account, accountId, programId);
        return ResponseEntity.ok(participant);
    }
}
