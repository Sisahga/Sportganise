package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import com.sportganise.entities.programsessions.*;
import com.sportganise.exceptions.EntityNotFoundException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramRecurrenceRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import java.io.IOException;
import java.time.*;
import java.util.Arrays;
import java.util.Collections;
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

  @Mock private ProgramAttachmentRepository programAttachmentRepository;

  @Mock private AccountService accountService;

  @Mock private AccountRepository accountRepository;

  @Mock private ProgramRecurrenceRepository programRecurrenceRepository;

  @Mock private BlobService blobService;

  @InjectMocks private ProgramService programService;

  @Test
  public void testGetParticipants() {
    ProgramParticipant participant1 =
            new ProgramParticipant(
                    new ProgramParticipantId(1, 101), null, "Player", true, ZonedDateTime.now());

    ProgramParticipant participant2 =
            new ProgramParticipant(
                    new ProgramParticipantId(2, 102),
                    null,
                    "Coach",
                    false,
                    ZonedDateTime.now().minusDays(1));

    List<ProgramParticipant> mockParticipants = List.of(participant1, participant2);

    Account account1 =
            Account.builder()
                    .accountId(101)
                    .type(AccountType.PLAYER)
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .address(
                            Address.builder()
                                    .line("123 Main St")
                                    .city("Springfield")
                                    .province("IL")
                                    .country("USA")
                                    .postalCode("62704")
                                    .build())
                    .phone("555-555-5555")
                    .build();

    Account account2 =
            Account.builder()
                    .accountId(102)
                    .type(AccountType.COACH)
                    .firstName("Jane")
                    .lastName("Smith")
                    .email("jane.smith@example.com")
                    .address(
                            Address.builder()
                                    .line("456 Random St")
                                    .city("Springfield")
                                    .province("IL")
                                    .country("USA")
                                    .postalCode("62704")
                                    .build())
                    .phone("222-222-2222")
                    .build();

    Mockito.when(programRepository.findParticipantsByProgramId(1)).thenReturn(mockParticipants);
    Mockito.when(accountService.getAccount(101)).thenReturn(Optional.of(account1));
    Mockito.when(accountService.getAccount(102)).thenReturn(Optional.of(account2));

    List<ProgramParticipantDto> participantDtos = programService.getParticipants(1);

    assertNotNull(participantDtos);

    assertEquals(2, participantDtos.size());

    ProgramParticipantDto participantDto1 = participantDtos.getFirst();
    assertEquals(1, participantDto1.getProgramId());
    assertEquals(101, participantDto1.getAccountId());
    assertTrue(participantDto1.isConfirmed());
    assertEquals(participant1.getConfirmedDate(), participantDto1.getConfirmedDate());

    ProgramParticipantDto participantDto2 = participantDtos.get(1);
    assertEquals(1, participantDto2.getProgramId());
    assertEquals(102, participantDto2.getAccountId());
    assertFalse(participantDto2.isConfirmed());
    assertEquals(participant2.getConfirmedDate(), participantDto2.getConfirmedDate());
  }

  @Test
  public void testGetProgramDetails() {
    Program mockProgram =
            Program.builder()
                    .programId(1)
                    .programType(ProgramType.TRAINING)
                    .title("Training Program")
                    .description("This is a training program.")
                    .capacity(10)
                    .occurrenceDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                    .durationMins(120)
                    .expiryDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
                    .frequency("once")
                    .location("111 Random Ave")
                    .visibility("public")
                    .build();

    Mockito.when(programRepository.findProgramById(1)).thenReturn(mockProgram);

    ProgramAttachmentCompositeKey attachment1Key =
            new ProgramAttachmentCompositeKey(1, "attachment1.url");
    ProgramAttachmentCompositeKey attachment2Key =
            new ProgramAttachmentCompositeKey(1, "attachment2.url");
    List<ProgramAttachment> mockAttachments =
            List.of(new ProgramAttachment(attachment1Key), new ProgramAttachment(attachment2Key));
    Mockito.when(programAttachmentRepository.findAttachmentsByProgramId(1))
            .thenReturn(mockAttachments);

    ProgramDto programDto = programService.getProgramDetails(1);

    assertNotNull(programDto);

    assertEquals(1, programDto.getProgramId());
    assertEquals(ProgramType.TRAINING, programDto.getProgramType());
    assertEquals("Training Program", programDto.getTitle());
    assertEquals("This is a training program.", programDto.getDescription());
    assertEquals(10, programDto.getCapacity());
    assertEquals(
            ZonedDateTime.of(LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()),
            programDto.getOccurrenceDate());
    assertEquals(120, programDto.getDurationMins());
    assertEquals(
            ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()),
            programDto.getExpiryDate());
    assertEquals("once", programDto.getFrequency());
    assertEquals("111 Random Ave", programDto.getLocation());
    assertEquals("public", programDto.getVisibility());
    assertEquals("attachment1.url", programDto.getProgramAttachments().get(0).getAttachmentUrl());
    assertEquals("attachment2.url", programDto.getProgramAttachments().get(1).getAttachmentUrl());
  }

  @Test
  void testGetProgramAttachments() {
    Integer programId = 1;

    ProgramAttachmentCompositeKey attachment1Key =
            new ProgramAttachmentCompositeKey(programId, "/file1.pdf");
    ProgramAttachment attachment1 = new ProgramAttachment(attachment1Key);

    ProgramAttachmentCompositeKey attachment2Key =
            new ProgramAttachmentCompositeKey(programId, "/file2.pdf");
    ProgramAttachment attachment2 = new ProgramAttachment(attachment2Key);

    when(programAttachmentRepository.findAttachmentsByProgramId(programId))
            .thenReturn(Arrays.asList(attachment1, attachment2));

    List<ProgramAttachmentDto> result = programService.getProgramAttachments(programId);

    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("/file1.pdf", result.get(0).getAttachmentUrl());
    assertEquals("/file2.pdf", result.get(1).getAttachmentUrl());
    assertEquals(programId, result.get(0).getProgramId());
    assertEquals(programId, result.get(1).getProgramId());
  }

  private List<Program> createMockPrograms() {
    Program program1 =
            Program.builder()
                    .programId(1)
                    .programType(ProgramType.TRAINING)
                    .title("First Program")
                    .description("First Description")
                    .capacity(10)
                    .occurrenceDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                    .durationMins(60)
                    .expiryDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
                    .frequency("Once")
                    .location("Location 1")
                    .visibility("public")
                    .build();

    Program program2 =
            Program.builder()
                    .programId(2)
                    .programType(ProgramType.FUNDRAISER)
                    .title("Second Program")
                    .description("Second Description")
                    .capacity(20)
                    .occurrenceDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 6, 15), LocalTime.of(14, 0), ZoneId.systemDefault()))
                    .durationMins(120)
                    .expiryDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 6, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
                    .frequency("weekly")
                    .location("Location 2")
                    .visibility("private")
                    .build();

    ProgramRecurrence recurrence2 =
            ProgramRecurrence.builder()
                    .recurrenceId(1)
                    .programId(2)
                    .occurrenceDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                    .build();

    return List.of(program1, program2);
  }

  @Test
  void testGetPrograms() {
    List<Program> mockPrograms = createMockPrograms();
    when(programRepository.findPrograms()).thenReturn(mockPrograms);
    ProgramRecurrence recurrence2 =
            ProgramRecurrence.builder()
                    .recurrenceId(1)
                    .programId(2)
                    .occurrenceDate(
                            ZonedDateTime.of(
                                    LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                    .build();

    when(programRecurrenceRepository.findProgramRecurrenceByProgramId(2))
            .thenReturn(List.of(recurrence2));

    mockPrograms.forEach(
            program ->
                    when(programAttachmentRepository.findAttachmentsByProgramId(program.getProgramId()))
                            .thenReturn(List.of()));

    List<ProgramDto> result = programService.getPrograms();

    assertNotNull(result);
    assertEquals(2, result.size(), "Expected 2 programs");

    ProgramDto firstProgram = result.getFirst();
    assertEquals(1, firstProgram.getProgramId(), "Expected program ID to be 1");
    assertEquals(
            ProgramType.TRAINING, firstProgram.getProgramType(), "Expected program type training");
    assertEquals("First Program", firstProgram.getTitle(), "Expected program title");
    assertTrue(firstProgram.getProgramAttachments().isEmpty(), "Expected no attachments");

    ProgramDto secondProgram = result.get(1);
    assertEquals(2, secondProgram.getProgramId(), "Expected program ID to be 2");
    assertEquals(
            ProgramType.FUNDRAISER, secondProgram.getProgramType(), "Expected program type fundraiser");
    assertEquals("Second Program", secondProgram.getTitle(), "Expected program title");
    assertTrue(secondProgram.getProgramAttachments().isEmpty(), "Expected no attachments");

    verify(programRepository).findPrograms();
  }

  @Test
  void testModifyProgram_ProgramNotFound() {
    ProgramDto programDtoToModify = new ProgramDto();
    programDtoToModify.setProgramId(1);

    Mockito.when(programRepository.findById(1)).thenReturn(Optional.empty());

    EntityNotFoundException exception =
            assertThrows(
                    com.sportganise.exceptions.EntityNotFoundException.class,
                    () ->
                            programService.modifyProgram(
                                    programDtoToModify,
                                    "Updated Title",
                                    ProgramType.TOURNAMENT,
                                    "2024-01-30T10:00:00Z",
                                    "2024-01-30T10:00:00Z",
                                    "private",
                                    "Updated Description",
                                    30,
                                    "10:30",
                                    "12:30",
                                    "Updated Location",
                                    Collections.emptyList(), // Empty list for attachments to add
                                    Collections.emptyList(), // Empty list for attachments to remove
                                    2,
                                    null)); // Mock account ID

    assertEquals("Program not found with ID: 1", exception.getMessage());
    verify(programRepository).findById(1);
    Mockito.verifyNoInteractions(blobService);
    Mockito.verifyNoInteractions(programAttachmentRepository);
  }

  @Test
  public void testCreateProgramRecurrences() {
    ZonedDateTime startDate =
            ZonedDateTime.of(LocalDate.of(2025, 6, 16), LocalTime.of(0, 0), ZoneId.systemDefault());
    ZonedDateTime endDate = startDate.plusWeeks(3);
    String frequency = "weekly";
    Integer programId = 1;

    programService.createProgramRecurrences(startDate, endDate, frequency, programId);

    verify(programRecurrenceRepository, times(4)).save(Mockito.any(ProgramRecurrence.class));
  }

  @Test
  public void testDeleteExpiredRecurrences() {

    ZonedDateTime runningDateTime =
            ZonedDateTime.of(LocalDate.of(2025, 6, 16), LocalTime.of(0, 0), ZoneId.systemDefault());
    Integer programId = 1;
    ZonedDateTime expiryDate = runningDateTime.plusDays(7);

    ProgramRecurrence recurrence1 = new ProgramRecurrence(programId, runningDateTime, false);
    ProgramRecurrence recurrence2 =
            new ProgramRecurrence(programId, runningDateTime.plusDays(10), false);
    List<ProgramRecurrence> recurrences = List.of(recurrence1, recurrence2);

    programService.deleteExpiredRecurrences(expiryDate, programId);

    verify(programRecurrenceRepository).deleteExpiredRecurrences(expiryDate, programId);
  }

  @Test
  void testModifyProgramRecurrences_shouldDeleteExpiredRecurrences() throws IOException {
    ZonedDateTime mockOccurenceDate =
            ZonedDateTime.of(LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.of("UTC"));
    ZonedDateTime mockExpiryDate =
            ZonedDateTime.of(LocalDate.of(2025, 5, 17), LocalTime.of(9, 0), ZoneId.of("UTC"));
    Program mockProgram =
            Program.builder()
                    .programId(1)
                    .programType(ProgramType.TRAINING)
                    .title("First Program")
                    .description("First Description")
                    .capacity(10)
                    .occurrenceDate(mockOccurenceDate)
                    .durationMins(60)
                    .expiryDate(mockExpiryDate)
                    .frequency("Daily")
                    .location("Location 1")
                    .visibility("public")
                    .build();

    ProgramDto mockProgramDto = new ProgramDto(mockProgram, Collections.emptyList());

    ZonedDateTime newEndDate =
            ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(9, 0), ZoneId.of("UTC"));

    when(programRepository.findById(1)).thenReturn(Optional.of(mockProgram));

    programService.modifyProgram(
            mockProgramDto,
            "First Program",
            ProgramType.TRAINING,
            "2025-05-15T10:00:00Z[UTC]",
            "2025-05-16T09:00:00Z[UTC]",
            "public",
            "First Description",
            10,
            "10:00",
            "11:00",
            "Location 1",
            Collections.emptyList(),
            Collections.emptyList(),
            1,
            "daily");

    verify(programRecurrenceRepository)
            .deleteExpiredRecurrences(any(ZonedDateTime.class), any(Integer.class));
  }

  @Test
  void testModifyProgramRecurrences_shouldCreateNewRecurrences() throws IOException {
    Program mockProgram =
            Program.builder()
                    .programId(1)
                    .programType(ProgramType.TRAINING)
                    .title("First Program")
                    .description("First Description")
                    .capacity(10)
                    .occurrenceDate(
                            ZonedDateTime.of(LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.of("UTC")))
                    .durationMins(60)
                    .expiryDate(
                            ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(11, 0), ZoneId.of("UTC")))
                    .frequency("Daily")
                    .location("Location 1")
                    .visibility("public")
                    .build();

    ProgramDto mockProgramDto = new ProgramDto(mockProgram, Collections.emptyList());

    ZonedDateTime lastrecurrence =
            ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(10, 0), ZoneId.of("UTC"));

    when(programRepository.findById(1)).thenReturn(Optional.of(mockProgram));
    when(programRecurrenceRepository.findLastRecurrenceByProgramId(1))
            .thenReturn(Optional.of(new ProgramRecurrence(1, lastrecurrence, false)));

    programService.modifyProgram(
            mockProgramDto,
            "First Program",
            ProgramType.TRAINING,
            "2025-05-15T10:00:00Z[UTC]",
            "2025-05-18T02:00:00Z[UTC]",
            "public",
            "First Description",
            10,
            "10:00",
            "11:00",
            "Location 1",
            Collections.emptyList(),
            Collections.emptyList(),
            1,
            "daily");

    System.out.println("Last Occurrence: " + lastrecurrence);

    verify(programRecurrenceRepository, times(2)).save(any());
  }
}