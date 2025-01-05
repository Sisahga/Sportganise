package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;

import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.auth.AccountService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProgramServiceTest {
  @Mock private ProgramRepository programRepository;

  @Mock private AccountService accountService;

  @InjectMocks private ProgramService programService;

  // Test for getParticipants() method
  @Test
  public void testGetParticipants() {
    // Mock a Program object with the below attributes
    ProgramParticipant participant1 =
        ProgramParticipant.builder()
            .programId(1)
            .accountId(101)
            .participantType("Player")
            .isConfirmed(true)
            .confirmedDate(LocalDateTime.now())
            .build();

    ProgramParticipant participant2 =
        ProgramParticipant.builder()
            .programId(1)
            .accountId(102)
            .participantType("Coach")
            .isConfirmed(false)
            .confirmedDate(LocalDateTime.now().minusDays(1))
            .build();

    List<ProgramParticipant> mockParticipants = List.of(participant1, participant2);

    // Mock account objects with the below attributes
    Account account1 =
        Account.builder()
            .accountId(101)
            .type("Player")
            .firstName("John")
            .lastName("Doe")
            .email("john.doe@example.com")
            .address("123 Main St")
            .phone("555-555-5555")
            .build();

    Account account2 =
        Account.builder()
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

  // Test for getProgramDetails() method
  @Test
  public void testGetProgramDetails() {
    // Mock a Program object with the below attributes
    Program mockProgram =
        Program.builder()
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

    // Verify that we have retrieved the correct programDto along with the correct
    // details/attributes
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

  /* Commenting out for new as I still need to figure some of the underlying methods
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



      @Test
      void testModifyProgram_Success() throws IOException {
          // Arrange an existing Program
          Program existingProgram = new Program(
                          "Training", "Existing Title", "Existing Description", 20,
                          LocalDateTime.of(2024, 1, 10, 10, 0),
                          120, true, LocalDateTime.of(2024, 1, 30, 10, 0),
                          "weekly", "Existing Location", "public", "oldFilePath.pdf");
          existingProgram.setProgramId(1);

          ProgramDto programDtoToModify = new ProgramDto(existingProgram);

          MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf",
                          "dummy content".getBytes());
          String newFilePath = "newFilePath.pdf";

          Mockito.when(programRepository.findById(1)).thenReturn(Optional.of(existingProgram));

          // Call the modifyProgram method
          programService.modifyProgram(
                          programDtoToModify, "Updated Type", "Updated Title", "Updated Description", 30,
                          LocalDateTime.of(2024, 1, 15, 10, 0), 90, false,
                          LocalDateTime.of(2024, 2, 1, 10, 0), "daily", "Updated Location", "private", mockFile);

          // Verify
          ArgumentCaptor<Program> programCaptor = ArgumentCaptor.forClass(Program.class);
          Mockito.verify(programRepository).save(programCaptor.capture());

          Program savedProgram = programCaptor.getValue();
          assertEquals("Updated Type", savedProgram.getProgramType());
          assertEquals("Updated Title", savedProgram.getTitle());
          assertEquals("Updated Description", savedProgram.getDescription());
          assertEquals(30, savedProgram.getCapacity());
          assertEquals(LocalDateTime.of(2024, 1, 15, 10, 0), savedProgram.getOccurrenceDate());
          assertEquals(90, savedProgram.getDurationMins());
          assertFalse(savedProgram.isRecurring());
          assertEquals(LocalDateTime.of(2024, 2, 1, 10, 0), savedProgram.getExpiryDate());
          assertEquals("daily", savedProgram.getFrequency());
          assertEquals("Updated Location", savedProgram.getLocation());
          assertEquals("private", savedProgram.getVisibility());
          assertEquals(newFilePath, savedProgram.getAttachment());
  }
  */

  @Test
  void testModifyProgram_ProgramNotFound() {
    // Arrange an empty program. i.e. a program that does not exist in the database
    ProgramDto programDtoToModify = new ProgramDto();
    programDtoToModify.setProgramId(1);

    Mockito.when(programRepository.findById(1)).thenReturn(Optional.empty());

    // Act & Assert
    EntityNotFoundException exception =
        assertThrows(
            EntityNotFoundException.class,
            () ->
                programService.modifyProgram(
                    programDtoToModify,
                    "Updated Type",
                    "Updated Title",
                    "Updated Description",
                    30,
                    LocalDateTime.of(2024, 1, 15, 10, 0),
                    90,
                    false,
                    LocalDateTime.of(2024, 2, 1, 10, 0),
                    "daily",
                    "Updated Location",
                    "private",
                    null));
    assertEquals("Program not found with ID: 1", exception.getMessage());
  }
}
