package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.services.auth.AccountService;
import com.sportganise.repositories.programsessions.ProgramRepository;

@ExtendWith(MockitoExtension.class)
public class ProgramServiceTest {
    @Mock
    private ProgramRepository programRepository;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private ProgramService programService;

    //Test for getParticipants() method
    @Test
    public void testGetParticipants() {
        // Mock a Program object with the below attributes
        ProgramParticipant participant1 = ProgramParticipant.builder()
                .programId(1)
                .accountId(101)
                .participantType("Player")
                .isConfirmed(true)
                .confirmedDate(LocalDateTime.now())
                .build();

        ProgramParticipant participant2 = ProgramParticipant.builder()
                .programId(1)
                .accountId(102)
                .participantType("Coach")
                .isConfirmed(false)
                .confirmedDate(LocalDateTime.now().minusDays(1))
                .build();

        List<ProgramParticipant> mockParticipants = List.of(participant1, participant2);

        // Mock account objects with the below attributes
        Account account1 = Account.builder()
                .accountId(101)
                .type("Player")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .address("123 Main St")
                .phone("555-555-5555")
                .build();

        Account account2 = Account.builder()
                .accountId(102)
                .type("Coach")
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .address("456 Random St")
                .phone("222-222-2222")
                .build();

        // Mock the repository and service behavior with mockParticipants, account1 and account2
        Mockito.when(programRepository.findParticipantsByProgramId(1)).thenReturn(mockParticipants);
        Mockito.when(accountService.getAccount(101)).thenReturn(Optional.of(account1));
        Mockito.when(accountService.getAccount(102)).thenReturn(Optional.of(account2));

        // Call the getParticipants method with programId = 1 to retrieve the list of participantDtos
        List<ProgramParticipantDto> participantDtos = programService.getParticipants(1);

        // Verify that participantDtos is not empty/null
        assertNotNull(participantDtos);

        // Verify that there are correctly 2 participants in participantDtos
        assertEquals(2, participantDtos.size());

        // Verify that participant1 is correctly retrieved along with its attributes
        ProgramParticipantDto participantDto1 = participantDtos.get(0);
        assertEquals(101, participantDto1.getAccountId());
        assertEquals("Player", participantDto1.getParticipantType());
        assertEquals("John", participantDto1.getFirstName());
        assertEquals("Doe", participantDto1.getLastName());
        assertEquals("john.doe@example.com", participantDto1.getEmail());
        assertEquals("123 Main St", participantDto1.getAddress());
        assertEquals("555-555-5555", participantDto1.getPhone());
        assertTrue(participantDto1.isConfirmed());
        assertEquals(participant1.getConfirmedDate(), participantDto1.getConfirmedDate());

        // Verify that participant2 is correctly retrieved along with the correct attributes
        ProgramParticipantDto participantDto2 = participantDtos.get(1);
        assertEquals(102, participantDto2.getAccountId());
        assertEquals("Coach", participantDto2.getParticipantType());
        assertEquals("Jane", participantDto2.getFirstName());
        assertEquals("Smith", participantDto2.getLastName());
        assertEquals("jane.smith@example.com", participantDto2.getEmail());
        assertEquals("456 Random St", participantDto2.getAddress());
        assertEquals("222-222-2222", participantDto2.getPhone());
        assertFalse(participantDto2.isConfirmed());
        assertEquals(participant2.getConfirmedDate(), participantDto2.getConfirmedDate());
    }

    //Test for findParticipantsByProgramId() method
    @Test
    public void testGetProgramDetails() {
        // Mock a Program object with the below attributes
        Program mockProgram = Program.builder()
                .programId(1)
                .programType("Training")
                .title("Training Program")
                .description("This is a training program.")
                .capacity(10)
                .occurenceDate(LocalDateTime.of(2025, 5, 15, 10, 0))
                .durationMins(120)
                .isRecurring(false)
                .expiryDate(LocalDateTime.of(2025, 5, 16, 0, 0))
                .frequency("None")
                .build();
        
        // Mock the repository behavior of findProgramById with mockProgram
        Mockito.when(programRepository.findProgramById(1)).thenReturn(mockProgram);

        // Call the getProgramDetails method with programId = 1 to retrieve the programDto
        ProgramDto programDto = programService.getProgramDetails(1);

        // Verify that the returned ProgramDto is not empty/null
        assertNotNull(programDto);

        // Verify that we have retrieved the correct programDto along with the correct details/attributes
        assertEquals(1, programDto.getProgramId());
        assertEquals("Training", programDto.getProgramType());
        assertEquals("Training Program", programDto.getTitle());
        assertEquals("This is a training program.", programDto.getDescription());
        assertEquals(10, programDto.getCapacity());
        assertEquals(LocalDateTime.of(2025, 5, 15, 10, 0), programDto.getOccurenceDate());
        assertEquals(120, programDto.getDurationMins());
        assertFalse(programDto.isRecurring());
        assertEquals(LocalDateTime.of(2025, 5, 16, 0, 0), programDto.getExpiryDate());
        assertEquals("None", programDto.getFrequency());
    }
}
