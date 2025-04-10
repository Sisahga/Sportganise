package com.sportganise.controllers.programsession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.controllers.programsessions.ProgramParticipantController;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.exceptions.GlobalExceptionHandler;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.services.programsessions.WaitlistService;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class ProgramParticipantControllerTest {

  @Mock private WaitlistService waitlistService;

  @InjectMocks private ProgramParticipantController programParticipantController;

  private Integer programId = 1;
  private Integer accountId = 2;
  private ProgramParticipantDto validParticipantDto;

  MockMvc mockMvc;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);

    validParticipantDto = new ProgramParticipantDto();
    validParticipantDto.setRecurrenceId(programId);
    validParticipantDto.setAccountId(accountId);
    validParticipantDto.setConfirmed(false);
  }

  @Test
  public void testMarkAbsent_Success() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    MvcResult result =
        mockMvc
            .perform(
                MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                    .param("programId", programId.toString())
                    .param("accountId", accountId.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.programId").value(programId))
            .andExpect(jsonPath("$.data.accountId").value(accountId))
            .andExpect(jsonPath("$.data.confirmed").value(false))
            .andReturn();

    assertNotNull(result);
    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_ParticipantNotFound() throws Exception {
    this.mockMvc =
        MockMvcBuilders.standaloneSetup(programParticipantController)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    when(waitlistService.markAbsent(programId, accountId))
        .thenThrow(
            new ResourceNotFoundException(
                "Participant not found on waitlist for program: "
                    + programId
                    + ", account: "
                    + accountId));

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(jsonPath("$.statusCode").value(404))
        .andExpect(
            jsonPath("$.message")
                .value("Participant not found on waitlist for program: 1, account: 2"));

    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_AlreadyUnconfirmed() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    validParticipantDto.setConfirmed(false);
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.confirmed").value(false));

    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_MultipleConcurrentRequests() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    MvcResult result1 =
        mockMvc
            .perform(
                MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                    .param("programId", programId.toString())
                    .param("accountId", accountId.toString()))
            .andExpect(status().isOk())
            .andReturn();

    MvcResult result2 =
        mockMvc
            .perform(
                MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                    .param("programId", programId.toString())
                    .param("accountId", accountId.toString()))
            .andExpect(status().isOk())
            .andReturn();

    assertNotNull(result1);
    assertNotNull(result2);
    verify(waitlistService, times(2)).markAbsent(programId, accountId);
  }

  @Test
  public void testOptProgramParticipant_Success() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    Integer expectedRank = 3;
    when(waitlistService.optProgramParticipantDto(programId, accountId)).thenReturn(expectedRank);

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/opt-participant")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data").value(expectedRank));

    verify(waitlistService).optProgramParticipantDto(programId, accountId);
  }

  @Test
  public void testOptProgramParticipant_ParticipantNotFound() throws Exception {
    this.mockMvc =
        MockMvcBuilders.standaloneSetup(programParticipantController)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    String errorMessage = "Participant not found";
    when(waitlistService.optProgramParticipantDto(programId, accountId))
        .thenThrow(new ResourceNotFoundException(errorMessage));

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/opt-participant")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(jsonPath("$.statusCode").value(404))
        .andExpect(jsonPath("$.message").value(errorMessage));

    verify(waitlistService).optProgramParticipantDto(programId, accountId);
  }

  @Test
  public void testConfirmParticipant_Success() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    ProgramParticipantDto confirmedDto = new ProgramParticipantDto();
    confirmedDto.setConfirmed(true);
    when(waitlistService.confirmParticipant(programId, accountId)).thenReturn(confirmedDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/confirm-participant")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.confirmed").value(true));

    verify(waitlistService).confirmParticipant(programId, accountId);
  }

  @Test
  public void testConfirmParticipant_ParticipantNotFound() throws Exception {
    this.mockMvc =
        MockMvcBuilders.standaloneSetup(programParticipantController)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    String errorMessage = "Participant not found";
    when(waitlistService.confirmParticipant(programId, accountId))
        .thenThrow(new ResourceNotFoundException(errorMessage));

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/confirm-participant")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(jsonPath("$.statusCode").value(404));

    verify(waitlistService).confirmParticipant(programId, accountId);
  }

  @Test
  public void testOptOutParticipant_Success() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    ProgramParticipantDto outDto = new ProgramParticipantDto();
    when(waitlistService.optOutParticipant(programId, accountId)).thenReturn(outDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/out-participant")
                .param("accountId", accountId.toString()) // Note parameter order
                .param("programId", programId.toString()))
        .andExpect(status().isOk());

    verify(waitlistService).optOutParticipant(programId, accountId);
  }

  @Test
  public void testOptOutParticipant_ParticipantNotFound() throws Exception {
    this.mockMvc =
        MockMvcBuilders.standaloneSetup(programParticipantController)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    String errorMessage = "Participant not found";
    when(waitlistService.optOutParticipant(programId, accountId))
        .thenThrow(new ResourceNotFoundException(errorMessage));

    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/out-participant")
                .param("accountId", accountId.toString())
                .param("programId", programId.toString()))
        .andExpect(jsonPath("$.statusCode").value(404))
        .andExpect(jsonPath("$.message").value(errorMessage));

    verify(waitlistService).optOutParticipant(programId, accountId);
  }

  @Test
  public void testGetOptedParticipants_Success() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    List<ProgramParticipantDto> participants = Collections.singletonList(validParticipantDto);
    when(waitlistService.allOptedParticipants(programId)).thenReturn(participants);

    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/api/program-participant/queue")
                .param("programId", programId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].programId").value(programId))
        .andExpect(jsonPath("$[0].accountId").value(accountId));

    verify(waitlistService).allOptedParticipants(programId);
  }

  @Test
  public void testGetOptedParticipants_EmptyList() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    when(waitlistService.allOptedParticipants(programId)).thenReturn(Collections.emptyList());

    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/api/program-participant/queue")
                .param("programId", programId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$").isEmpty());

    verify(waitlistService).allOptedParticipants(programId);
  }

  @Test
  public void testInviteToPrivateEvent_NewParticipant() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    when(waitlistService.inviteToPrivateEvent(accountId, programId)).thenReturn(true);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/program-participant/invite-private")
                .param("accountId", accountId.toString())
                .param("programId", programId.toString()))
        .andExpect(status().isCreated());

    verify(waitlistService).inviteToPrivateEvent(accountId, programId);
  }

  @Test
  public void testInviteToPrivateEvent_ExistingParticipant() throws Exception {
    this.mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    when(waitlistService.inviteToPrivateEvent(accountId, programId)).thenReturn(false);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/program-participant/invite-private")
                .param("accountId", accountId.toString())
                .param("programId", programId.toString()))
        .andExpect(status().isOk());

    verify(waitlistService).inviteToPrivateEvent(accountId, programId);
  }
}
