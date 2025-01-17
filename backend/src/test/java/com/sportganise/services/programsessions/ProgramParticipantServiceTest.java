package com.sportganise.services.programsessions;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.repositories.programsessions.ProgramParticipantRepository;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class ProgramParticipantServiceTest {

  @Mock private ProgramParticipantRepository participantRepository;

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
  public void testMarkAbsent_ParticipantAlreadyUnconfirmed() throws ParticipantNotFoundException {
    validParticipant.setConfirmed(false);
    when(participantRepository.findById(any(ProgramParticipantId.class)))
        .thenReturn(Optional.of(validParticipant));

    ProgramParticipantDto result = programParticipantService.markAbsent(programId, accountId);

    assertNull(result);
    verify(participantRepository, never()).save(any(ProgramParticipant.class));
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
}
