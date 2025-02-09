package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.exceptions.ProgramNotFoundException;
import com.sportganise.exceptions.programexceptions.ProgramInvitationiException;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import com.sportganise.repositories.programsessions.ProgramRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class WaitlistServiceTest {

  @Mock private ProgramParticipantRepository participantRepository;
  @Mock private ProgramRepository programRepository;
  @Mock private AccountRepository accountRepository;

  @InjectMocks private WaitlistService programParticipantService;

  private ProgramParticipant validParticipant;
  private Integer programId = 1;
  private Integer accountId = 2;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);

    validParticipant = new ProgramParticipant();
    ProgramParticipantId programParticipantId = new ProgramParticipantId(programId, accountId);
    validParticipant.setProgramParticipantId(programParticipantId);
    validParticipant.setConfirmed(true);
    validParticipant.setConfirmedDate(ZonedDateTime.of(2025, 1, 1, 10, 0, 0, 0, ZoneId.of("UTC")));
  }

  @Test
  void whenNoExistingParticipants_assignRank1() {

    Integer programId = 100;
    Integer accountId = 200;
    ProgramParticipant mockParticipant = new ProgramParticipant();
    mockParticipant.setConfirmed(false);
    mockParticipant.setRank(null);

    when(participantRepository.findMaxRank(programId)).thenReturn(null);
    when(participantRepository.findWaitlistParticipant(programId, accountId))
        .thenReturn(mockParticipant);
    when(participantRepository.save(mockParticipant)).thenReturn(mockParticipant);

    Integer result = programParticipantService.optProgramParticipantDto(programId, accountId);

    assertEquals(1, result);
    verify(participantRepository).save(mockParticipant);
  }

  @Test
  void whenParticipantNotFound_throwException() {
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt())).thenReturn(null);

    assertThrows(
        ParticipantNotFoundException.class,
        () -> {
          programParticipantService.optProgramParticipantDto(1, 2);
        });
  }

  @Test
  void whenParticipantAlreadyConfirmed_returnNull() {
    ProgramParticipant confirmedParticipant = new ProgramParticipant();
    confirmedParticipant.setConfirmed(true);

    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(confirmedParticipant);

    Integer result = programParticipantService.optProgramParticipantDto(1, 2);

    assertNull(result);
    verify(participantRepository, never()).save(any());
  }

  @Test
  void whenParticipantHasExistingRank_returnNull() {
    ProgramParticipant rankedParticipant = new ProgramParticipant();
    rankedParticipant.setConfirmed(false);
    rankedParticipant.setRank(5);

    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(rankedParticipant);

    Integer result = programParticipantService.optProgramParticipantDto(1, 2);

    assertNull(result);
    verify(participantRepository, never()).save(any());
  }

  @Test
  void whenMaxRankIs5_assignRank6() {
    ProgramParticipant participant = new ProgramParticipant();
    participant.setConfirmed(false);
    participant.setRank(null);

    when(participantRepository.findMaxRank(anyInt())).thenReturn(5);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt())).thenReturn(participant);
    when(participantRepository.save(participant)).thenReturn(participant);

    Integer result = programParticipantService.optProgramParticipantDto(1, 2);

    assertEquals(6, result);
  }

  @Test
  void whenMaxRankAtIntegerMax_overflowHandling() {
    ProgramParticipant participant = new ProgramParticipant();
    participant.setConfirmed(false);
    participant.setRank(null);

    when(participantRepository.findMaxRank(anyInt())).thenReturn(Integer.MAX_VALUE);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt())).thenReturn(participant);
    when(participantRepository.save(participant)).thenReturn(participant);

    Integer result = programParticipantService.optProgramParticipantDto(1, 2);

    assertEquals(Integer.MIN_VALUE, result);
  }

  // ---- confirmParticipant Tests ----

  @Test
  void confirmParticipant_Success() throws Exception {
    validParticipant.setRank(3);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(validParticipant);
    when(participantRepository.save(any())).thenReturn(validParticipant);

    ProgramParticipantDto result = programParticipantService.confirmParticipant(1, 2);

    assertTrue(validParticipant.isConfirmed());
    assertNotNull(validParticipant.getConfirmedDate());
    assertNull(validParticipant.getRank());
    verify(participantRepository).updateRanks(eq(1), eq(3));
    verify(participantRepository).save(validParticipant);
    assertDtoMatchesParticipant(validParticipant, result);
  }

  // ---- optOutParticipant Tests ----

  @Test
  void optOutParticipant_Success() throws Exception {
    validParticipant.setRank(3);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(validParticipant);
    when(participantRepository.save(any())).thenReturn(validParticipant);

    ProgramParticipantDto result =
        programParticipantService.optOutParticipant(
            validParticipant.getProgramId(), validParticipant.getAccountId());

    assertNull(validParticipant.getRank());
    verify(participantRepository).updateRanks(eq(1), eq(3));
    verify(participantRepository).save(validParticipant);
    assertDtoMatchesParticipant(validParticipant, result);
  }

  // ---- Common Error Cases ----

  @Test
  void confirmParticipant_NotFound_ThrowsException() {
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt())).thenReturn(null);
    assertThrows(
        ParticipantNotFoundException.class,
        () -> programParticipantService.confirmParticipant(1, 2));
  }

  @Test
  void optOutParticipant_NotFound_ThrowsException() {
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt())).thenReturn(null);
    assertThrows(
        ParticipantNotFoundException.class,
        () -> programParticipantService.optOutParticipant(1, 2));
  }

  // ---- Edge Cases ----

  @Test
  void removeParticipant_WithHighestRank_UpdatesCorrectly() throws Exception {
    validParticipant.setRank(1);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(validParticipant);
    when(participantRepository.save(any())).thenReturn(validParticipant);

    programParticipantService.optOutParticipant(1, 2);

    verify(participantRepository).updateRanks(eq(1), eq(1));
  }

  @Test
  void confirmParticipant_DoesNotUpdateRanksIfNoRank() throws Exception {
    validParticipant.setRank(null);
    when(participantRepository.findWaitlistParticipant(anyInt(), anyInt()))
        .thenReturn(validParticipant);
    when(participantRepository.save(any())).thenReturn(validParticipant);

    programParticipantService.confirmParticipant(1, 2);

    verify(participantRepository, never()).updateRanks(anyInt(), anyInt());
  }

  // ---- Helper Method ----

  @Test
  void allOptedParticipants_EmptyList_ReturnsEmptyDtoList() {
    Integer programId = 100;
    when(participantRepository.findOptedParticipants(programId))
        .thenReturn(Collections.emptyList());

    List<ProgramParticipantDto> result = programParticipantService.allOptedParticipants(programId);

    assertTrue(result.isEmpty());
    verify(participantRepository).findOptedParticipants(programId);
  }

  @Test
  void allOptedParticipants_SingleParticipant_ReturnsDtoWithCorrectData() {
    Integer programId = 100;
    ProgramParticipant participant = createSampleParticipant(programId, 200, 1, false);
    when(participantRepository.findOptedParticipants(programId)).thenReturn(List.of(participant));

    List<ProgramParticipantDto> result = programParticipantService.allOptedParticipants(programId);

    assertEquals(1, result.size());
    ProgramParticipantDto dto = result.get(0);
    assertDtoMatchesParticipant(participant, dto);
  }

  @Test
  void allOptedParticipants_MultipleParticipants_ReturnsDtosInOrder() {
    Integer programId = 100;
    List<ProgramParticipant> participants =
        List.of(
            createSampleParticipant(programId, 200, 1, false),
            createSampleParticipant(programId, 201, 2, true));
    when(participantRepository.findOptedParticipants(programId)).thenReturn(participants);

    List<ProgramParticipantDto> result = programParticipantService.allOptedParticipants(programId);

    assertEquals(2, result.size());
    for (int i = 0; i < participants.size(); i++) {
      assertDtoMatchesParticipant(participants.get(i), result.get(i));
    }
  }

  @Test
  void allOptedParticipants_EnsureDataMappingAccuracy() {
    Integer programId = 100;
    ProgramParticipant participant = createSampleParticipant(programId, 200, 3, true);
    when(participantRepository.findOptedParticipants(programId)).thenReturn(List.of(participant));

    ProgramParticipantDto dto = programParticipantService.allOptedParticipants(programId).get(0);

    assertEquals(participant.getRank(), dto.getRank());
    assertEquals(participant.isConfirmed(), dto.isConfirmed());
    assertEquals(participant.getProgramParticipantId().getAccountId(), dto.getAccountId());
    assertEquals(participant.getProgramParticipantId().getProgramId(), dto.getProgramId());
  }

  @Test
  void allOptedParticipants_RepositoryReturnsNull_ThrowsNullPointerException() {
    Integer programId = 100;
    when(participantRepository.findOptedParticipants(programId)).thenReturn(null);

    assertThrows(
        NullPointerException.class,
        () -> {
          programParticipantService.allOptedParticipants(programId);
        });
  }

  // Helper Methods

  private ProgramParticipant createSampleParticipant(
      Integer programId, Integer accountId, Integer rank, boolean isConfirmed) {
    ProgramParticipant participant = new ProgramParticipant();
    ProgramParticipantId id = new ProgramParticipantId();
    id.setProgramId(programId);
    id.setAccountId(accountId);
    participant.setProgramParticipantId(id);
    participant.setRank(rank);
    participant.setConfirmed(isConfirmed);
    return participant;
  }

  private void assertDtoMatchesParticipant(
      ProgramParticipant participant, ProgramParticipantDto dto) {
    assertEquals(participant.getProgramParticipantId().getProgramId(), dto.getProgramId());
    assertEquals(participant.getProgramParticipantId().getAccountId(), dto.getAccountId());
    assertEquals(participant.getRank(), dto.getRank());
    assertEquals(participant.isConfirmed(), dto.isConfirmed());
    assertEquals(participant.getConfirmedDate(), dto.getConfirmedDate());
  }

  // Comeback to this test failing because of the possibility of feeding a null ProgramParticipant
  // (shouldn't be allowed)
  @Test
  public void testMarkAbsent_ValidParticipant_Confirmed() throws ParticipantNotFoundException {
    when(participantRepository.findById(any(ProgramParticipantId.class)))
        .thenReturn(Optional.of(validParticipant));
    when(participantRepository.save(validParticipant)).thenReturn(validParticipant);

    ProgramParticipantDto result = programParticipantService.markAbsent(programId, accountId);

    assertNotNull(result);
    assertFalse(result.isConfirmed());
    assertNull(result.getConfirmedDate());
    verify(participantRepository).save(validParticipant);
  }

  @Test
  public void testMarkAbsent_ParticipantNotFound() {
    when(participantRepository.findById(any(ProgramParticipantId.class)))
        .thenReturn(Optional.empty());

    ParticipantNotFoundException exception =
        assertThrows(
            ParticipantNotFoundException.class,
            () -> {
              programParticipantService.markAbsent(programId, accountId);
            });
    assertEquals(
        "Participant not found on waitlist for program: 1, account: 2", exception.getMessage());
  }

  @Test
  public void testMarkAbsent_DatabaseSaveFailure() {
    when(participantRepository.findById(any(ProgramParticipantId.class)))
        .thenReturn(Optional.of(validParticipant));
    when(participantRepository.save(any(ProgramParticipant.class)))
        .thenThrow(new RuntimeException("Database error"));

    RuntimeException exception =
        assertThrows(
            RuntimeException.class,
            () -> {
              programParticipantService.markAbsent(programId, accountId);
            });
    assertEquals("Database error", exception.getMessage());
  }

  @Nested
  class InviteToPrivateEvent {
    private Integer programId;
    private Program program;
    private Integer accountId;
    private Account account;
    private ProgramParticipantId participantId;
    private ProgramParticipant participant;

    @BeforeEach
    public void setup() {
      programId = 1;
      program = Program.builder().programId(programId).visibility("private").build();
      accountId = 1;
      account = Account.builder().accountId(accountId).type(AccountType.PLAYER).build();
      participantId = new ProgramParticipantId(programId, accountId);
      participant =
          ProgramParticipant.builder()
              .programParticipantId(participantId)
              .isConfirmed(false)
              .build();
    }

    @Test
    public void programNotFound() {
      when(programRepository.findById(anyInt())).thenReturn(Optional.empty());
      when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

      assertThrows(
          ProgramNotFoundException.class,
          () -> programParticipantService.inviteToPrivateEvent(accountId, programId));
    }

    @Test
    public void programNotPrivate() {
      program.setVisibility("public");
      when(programRepository.findById(programId)).thenReturn(Optional.of(program));
      when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

      assertThrows(
          ProgramInvitationiException.class,
          () -> programParticipantService.inviteToPrivateEvent(accountId, programId));
    }

    @Test
    public void accountNotFound() {
      when(programRepository.findById(programId)).thenReturn(Optional.of(program));
      when(accountRepository.findById(anyInt())).thenReturn(Optional.empty());

      assertThrows(
          AccountNotFoundException.class,
          () -> programParticipantService.inviteToPrivateEvent(accountId, programId));
    }

    @Test
    public void participantAlreadyConfirmed() {
      participant.setConfirmed(true);
      when(programRepository.findById(programId)).thenReturn(Optional.of(program));
      when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
      when(participantRepository.findById(participantId)).thenReturn(Optional.of(participant));

      assertThrows(
          ProgramInvitationiException.class,
          () -> programParticipantService.inviteToPrivateEvent(accountId, programId));
    }

    @Test
    public void successfullyInviteNewParticipant() {
      when(programRepository.findById(programId)).thenReturn(Optional.of(program));
      when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
      when(participantRepository.findById(participantId)).thenReturn(Optional.empty());

      programParticipantService.inviteToPrivateEvent(accountId, programId);

      verify(participantRepository, times(1))
          .save(argThat(p -> p.getProgramParticipantId().equals(participantId)));
    }

    @Test
    public void successfullyReinviteParticipant() {
      when(programRepository.findById(programId)).thenReturn(Optional.of(program));
      when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
      when(participantRepository.findById(participantId)).thenReturn(Optional.of(participant));

      programParticipantService.inviteToPrivateEvent(accountId, programId);

      verify(participantRepository, times(0)).save(any(ProgramParticipant.class));
    }
  }
}
