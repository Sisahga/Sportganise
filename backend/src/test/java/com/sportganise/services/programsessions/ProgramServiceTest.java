package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramAttachment;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramAttachmentRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
            .programType("Training")
            .title("Training Program")
            .description("This is a training program.")
            .capacity(10)
            .occurrenceDate(
                ZonedDateTime.of(
                    LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
            .durationMins(120)
            .isRecurring(false)
            .expiryDate(
                ZonedDateTime.of(
                    LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
            .frequency("None")
            .location("111 Random Ave")
            .visibility("public")
            .build();

    Mockito.when(programRepository.findProgramById(1)).thenReturn(mockProgram);

    List<ProgramAttachment> mockAttachments =
        List.of(
            new ProgramAttachment(1, "attachment1.url"),
            new ProgramAttachment(1, "attachment2.url"));
    Mockito.when(programAttachmentRepository.findAttachmentsByProgramId(1))
        .thenReturn(mockAttachments);

    ProgramDto programDto = programService.getProgramDetails(1);

    assertNotNull(programDto);

    assertEquals(1, programDto.getProgramId());
    assertEquals("Training", programDto.getProgramType());
    assertEquals("Training Program", programDto.getTitle());
    assertEquals("This is a training program.", programDto.getDescription());
    assertEquals(10, programDto.getCapacity());
    assertEquals(
        ZonedDateTime.of(LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()),
        programDto.getOccurrenceDate());
    assertEquals(120, programDto.getDurationMins());
    assertFalse(programDto.isRecurring());
    assertEquals(
        ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()),
        programDto.getExpiryDate());
    assertEquals("None", programDto.getFrequency());
    assertEquals("111 Random Ave", programDto.getLocation());
    assertEquals("public", programDto.getVisibility());
    assertEquals("attachment1.url", programDto.getProgramAttachments().get(0).getAttachmentUrl());
    assertEquals("attachment2.url", programDto.getProgramAttachments().get(1).getAttachmentUrl());
  }

  @Test
  void testGetProgramAttachments() {
    Integer programId = 1;

    ProgramAttachment attachment1 = new ProgramAttachment();
    attachment1.setProgramId(programId);
    attachment1.setAttachmentUrl("/file1.pdf");

    ProgramAttachment attachment2 = new ProgramAttachment();
    attachment2.setProgramId(programId);
    attachment2.setAttachmentUrl("/file2.pdf");

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

  @Test
  void testGetPrograms() {
    List<Program> mockPrograms =
        List.of(
            Program.builder()
                .programId(1)
                .programType("Training")
                .title("Training Program 1")
                .description("This is training program 1.")
                .capacity(10)
                .occurrenceDate(
                    ZonedDateTime.of(
                        LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                .durationMins(120)
                .isRecurring(false)
                .expiryDate(
                    ZonedDateTime.of(
                        LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
                .frequency("None")
                .location("111 Random Ave")
                .visibility("public")
                .build(),
            Program.builder()
                .programId(2)
                .programType("Training")
                .title("Training Program 2")
                .description("This is training program 2.")
                .capacity(10)
                .occurrenceDate(
                    ZonedDateTime.of(
                        LocalDate.of(2025, 6, 15), LocalTime.of(10, 0), ZoneId.systemDefault()))
                .durationMins(120)
                .isRecurring(false)
                .expiryDate(
                    ZonedDateTime.of(
                        LocalDate.of(2025, 6, 16), LocalTime.of(0, 0), ZoneId.systemDefault()))
                .frequency("None")
                .location("222 Random St")
                .visibility("private")
                .build());

    Mockito.when(programRepository.findPrograms()).thenReturn(mockPrograms);

    List<ProgramAttachment> mockAttachments1 =
        List.of(
            new ProgramAttachment(1, "attachment1.url"),
            new ProgramAttachment(1, "attachment2.url"));
    Mockito.when(programAttachmentRepository.findAttachmentsByProgramId(1))
        .thenReturn(mockAttachments1);

    List<ProgramAttachment> mockAttachments2 = List.of(new ProgramAttachment(1, "attachment3.url"));
    Mockito.when(programAttachmentRepository.findAttachmentsByProgramId(2))
        .thenReturn(mockAttachments2);

    List<ProgramDto> programDtos = programService.getPrograms();

    assertNotNull(programDtos);

    ProgramDto programDto1 = programDtos.getFirst();
    assertEquals(1, programDto1.getProgramId());
    assertEquals("Training", programDto1.getProgramType());
    assertEquals("Training Program 1", programDto1.getTitle());
    assertEquals(2, programDto1.getProgramAttachments().size());
    assertEquals("attachment1.url", programDto1.getProgramAttachments().get(0).getAttachmentUrl());
    assertEquals("attachment2.url", programDto1.getProgramAttachments().get(1).getAttachmentUrl());

    ProgramDto programDto2 = programDtos.get(1);
    assertEquals(2, programDto2.getProgramId());
    assertEquals("Training", programDto2.getProgramType());
    assertEquals("Training Program 2", programDto2.getTitle());
    assertEquals(1, programDto2.getProgramAttachments().size());
    assertEquals(
        "attachment3.url", programDto2.getProgramAttachments().getFirst().getAttachmentUrl());
  }

  @Test
  void testModifyProgram_ProgramNotFound() {
    ProgramDto programDtoToModify = new ProgramDto();
    programDtoToModify.setProgramId(1);

    Mockito.when(programRepository.findById(1)).thenReturn(Optional.empty());

    EntityNotFoundException exception =
        assertThrows(
            EntityNotFoundException.class,
            () ->
                programService.modifyProgram(
                    programDtoToModify,
                    "Updated Title",
                    "Updated Type",
                    "2024-01-30T10:00:00Z",
                    "2024-01-30T10:00:00Z",
                    false,
                    "private",
                    "Updated Description",
                    30,
                    "10:30",
                    "12:30",
                    "Updated Location",
                    Collections.emptyList(), // Empty list for attachments to add
                    Collections.emptyList(), // Empty list for attachments to remove
                    2)); // Mock account ID

    assertEquals("Program not found with ID: 1", exception.getMessage());
    Mockito.verify(programRepository).findById(1);
    Mockito.verifyNoInteractions(blobService);
    Mockito.verifyNoInteractions(programAttachmentRepository);
  }
}
