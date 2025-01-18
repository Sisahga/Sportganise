package com.sportganise.controllers.programsession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.controllers.programsessions.ProgramParticipantController;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.exceptions.ParticipantNotFoundException;
import com.sportganise.services.programsessions.WaitlistService;
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

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);

    validParticipantDto = new ProgramParticipantDto();
    validParticipantDto.setProgramId(programId);
    validParticipantDto.setAccountId(accountId);
    validParticipantDto.setConfirmed(false);
  }

  @Test
  public void testMarkAbsent_Success() throws Exception {
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    MockMvc mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    MvcResult result =
        mockMvc
            .perform(
                MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                    .param("programId", programId.toString())
                    .param("accountId", accountId.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.programId").value(programId))
            .andExpect(jsonPath("$.accountId").value(accountId))
            .andExpect(jsonPath("$.confirmed").value(false))
            .andReturn();

    assertNotNull(result);
    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_ParticipantNotFound() throws Exception {
    when(waitlistService.markAbsent(programId, accountId))
        .thenThrow(
            new ParticipantNotFoundException(
                "Participant not found on waitlist for program: "
                    + programId
                    + ", account: "
                    + accountId));

    MockMvc mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(status().isNotFound())
        .andExpect(
            content().string("Participant not found on waitlist for program: 1, account: 2"));

    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_AlreadyUnconfirmed() throws Exception {
    validParticipantDto.setConfirmed(false);
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    MockMvc mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
    mockMvc
        .perform(
            MockMvcRequestBuilders.patch("/api/program-participant/mark-absent")
                .param("programId", programId.toString())
                .param("accountId", accountId.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.confirmed").value(false));

    verify(waitlistService).markAbsent(programId, accountId);
  }

  @Test
  public void testMarkAbsent_MultipleConcurrentRequests() throws Exception {
    when(waitlistService.markAbsent(programId, accountId)).thenReturn(validParticipantDto);

    MockMvc mockMvc = MockMvcBuilders.standaloneSetup(programParticipantController).build();
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
}
