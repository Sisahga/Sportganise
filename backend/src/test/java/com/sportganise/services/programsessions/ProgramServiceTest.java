package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
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

    //Test for getProgramDetails() method
    @Test
    public void testGetProgramDetails() {
        // Mock a Program object with the below attributes
        Program mockProgram = Program.builder()
                .programId(1)
                .programType("Training")
                .title("Training Program")
                .description("This is a training program.")
                .capacity(10)
                .occurrenceDate(LocalDateTime.of(2025, 5, 15, 10, 0))
                .durationMins(120)
                .isRecurring(false)
                .expiryDate(LocalDateTime.of(2025, 5, 16, 0, 0))
                .frequency("None")
                .location("111 Random Ave")
                .visibility("public")
                .attachment("/banner.pdf")
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
        assertEquals(LocalDateTime.of(2025, 5, 15, 10, 0), programDto.getOccurrenceDate());
        assertEquals(120, programDto.getDurationMins());
        assertFalse(programDto.isRecurring());
        assertEquals(LocalDateTime.of(2025, 5, 16, 0, 0), programDto.getExpiryDate());
        assertEquals("None", programDto.getFrequency());
        assertEquals("111 Random Ave", programDto.getLocation());
        assertEquals("public", programDto.getVisibility());
        assertEquals("/banner.pdf", programDto.getAttachment());
    }

    /* 
    // Tests for the creation of a new programDto
    @Test
    public void testCreateProgramDto_NonRecurring_NoConflict() {
        // Given these attributes
        String programType = "Training";
        String title = "Training Program";
        String description = "Dummy Description";
        Integer capacity = 20;
        LocalDateTime occurrenceDate = LocalDateTime.of(2024, 12, 15, 10, 0, 0, 0);
        Integer durationMins = 120;
        Boolean isRecurring = false;
        LocalDateTime expiryDate = null;
        String frequency = null;
        String location = "Gym";
        String visibility = "Public";
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy content".getBytes());

        // Mock repository behavior
        Mockito.when(programRepository.findAll()).thenReturn(Collections.emptyList()); // No existing programs

        // TODO: Mock file upload behavior 
        // Mockito.when(fileStorageService.storeFile(mockFile)).thenReturn("file_path");

        // Call the method
        ProgramDto programDto = programService.createProgramDto(programType, title, description, capacity,
                occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, mockFile);

        assertNotNull(programDto);
        assertEquals("file_path", programDto.getAttachment()); // Check that file path is correctly returned
    }

    @Test
    public void testCreateProgramDto_Recurring_NoConflict() {
        // Given these attributes
        String programType = "Training";
        String title = "Training Program";
        String description = "Training Description";
        Integer capacity = 20;
        LocalDateTime occurrenceDate = LocalDateTime.of(2024, 1, 15, 10, 0, 0, 0);
        Integer durationMins = 120;
        Boolean isRecurring = true;
        LocalDateTime expiryDate = LocalDateTime.of(2024, 1, 30, 10, 0, 0, 0);
        String frequency = "daily";
        String location = "Gym";
        String visibility = "Public";
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy content".getBytes());

        // Mock repository behavior
        Mockito.when(programRepository.findAll()).thenReturn(Collections.emptyList()); // No existing programs

        // TODO: Mock file upload behavior
        // Mockito.when(fileStorageService.storeFile(mockFile)).thenReturn("file_path");

        // Call the method
        ProgramDto programDto = programService.createProgramDto(programType, title, description, capacity,
                occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, mockFile);

        assertNotNull(programDto);
        assertEquals("file_path", programDto.getAttachment()); // Check that file path is correctly returned
    }

    @Test(expected = RuntimeException.class)
    public void testCreateProgramDto_Recurring_WithSchedulingConflict() {
        // Given these attributes
        String programType = "Training";
        String title = "Training Program";
        String description = "Training Description";
        Integer capacity = 20;
        LocalDateTime occurrenceDate = LocalDateTime.of(2024, 1, 15, 10, 0, 0, 0);
        Integer durationMins = 120;
        Boolean isRecurring = true;
        LocalDateTime expiryDate = LocalDateTime.of(2024, 1, 30, 10, 0, 0, 0);
        String frequency = "daily";
        String location = "Gym";
        String visibility = "Public";
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy content".getBytes());

        // Mock repository behavior
        Program existingProgram = new Program("Training", "Existing Program", "Existing Description", 20,
                LocalDateTime.of(2024, 1, 15, 10, 0, 0, 0), 120, true, LocalDateTime.of(2024, 1, 30, 10, 0, 0, 0),
                "daily", "Gym", "Public", "file_path");
        Mockito.when(programRepository.findAll()).thenReturn(Collections.singletonList(existingProgram)); // One existing program

        // TODO: Mock file upload behavior
        // Mockito.when(fileStorageService.storeFile(mockFile)).thenReturn("file_path");

        // Call the method
        programService.createProgramDto(programType, title, description, capacity,
                occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, mockFile);

        //Should throw exception
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateProgramDto_InvalidFrequency() {
        // Given these attributes
        String programType = "Training";
        String title = "Training Program";
        String description = "Training Description";
        Integer capacity = 20;
        LocalDateTime occurrenceDate = LocalDateTime.of(2024, 1, 15, 10, 0, 0, 0);
        Integer durationMins = 120;
        Boolean isRecurring = true;
        LocalDateTime expiryDate = LocalDateTime.of(2024, 1, 30, 10, 0, 0, 0);
        String frequency = "invalidFrequency"; // Invalid frequency
        String location = "Gym";
        String visibility = "Public";
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy content".getBytes());

        // Call the method
        programService.createProgramDto(programType, title, description, capacity,
                occurrenceDate, durationMins, isRecurring, expiryDate, frequency, location, visibility, mockFile);

        // Should throw exception due to invalid frequency
    }
        */
}
