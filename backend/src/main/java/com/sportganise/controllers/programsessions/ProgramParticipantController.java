package com.sportganise.controllers.programsessions;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sportganise.dto.auth.AccountDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.services.programsessions.ProgramService;
import com.sportganise.services.programsessions.WaitlistService;

@RestController
@RequestMapping("/api/program-participant")
public class ProgramParticipantController {

    private ProgramService programService;
    private WaitlistService waitlistService;

    @Autowired
    public ProgramParticipantController(ProgramService programService, WaitlistService waitlistService) {
        this.programService = programService;
        this.waitlistService = waitlistService;
    }

    @PatchMapping("/opt-participant")
    public ResponseEntity<Integer> optProgramParticipant(
            @RequestParam Integer programId,
            @RequestParam Integer accountId) {

        Integer rank = waitlistService.optProgramParticipantDto(programId, accountId);
        return ResponseEntity.ok(rank);
    }

    @PatchMapping("/confirm-participant")
    public ResponseEntity<ProgramParticipantDto> updateConfirmationStatus(
            @RequestParam Integer programId,
            @RequestParam Integer accountId) {

        // Update the participant's confirmation status
        ProgramParticipantDto confirmedParticipant = waitlistService.confirmParticipant(programId, accountId);
        return ResponseEntity.ok(confirmedParticipant);
    }

    // @DeleteMapping("/delete-participant")
    // public ResponseEntity<String> removeParticipant(
    //         @RequestParam Integer accountId,
    //         @RequestParam Integer programId) {

    //     programService.removeParticipant(programId, accountId);
    //     return ResponseEntity.ok("Success!");
    // }

    // @GetMapping("/opted-participants")
    // public ResponseEntity<List<ProgramParticipantDto>> getOptedParticipants(
    //         @RequestParam Integer programId) {

    //     List<ProgramParticipantDto> optedInParticipants = programService.getOptedParticipants(programId);
    //     return ResponseEntity.ok(optedInParticipants);
    // }
}
