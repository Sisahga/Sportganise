package com.sportganise.controllers.programsessions;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ProgramParticipantController(ProgramService programService) {
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

    @PatchMapping("/confirm-participant")
    public ResponseEntity<String> updateConfirmationStatus(
            @RequestParam Integer programId,
            @RequestParam Integer accountId) {

        // Update the participant's confirmation status
        programService.confirmParticipant(programId, accountId);
        return ResponseEntity.ok("Success!");
    }

    @DeleteMapping("/delete-participant")
    public ResponseEntity<String> removeParticipant(
            @RequestParam Integer accountId,
            @RequestParam Integer programId) {

        programService.removeParticipant(programId, accountId);
        return ResponseEntity.ok("Success!");
    }
}
