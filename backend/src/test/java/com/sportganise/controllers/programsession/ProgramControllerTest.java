package com.sportganise.controllers.programsession;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.controllers.programsessions.ProgramController;
import com.sportganise.dto.programsessions.*;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = ProgramController.class)
@AutoConfigureMockMvc
public class ProgramControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  @MockBean private ProgramService programService;

  @InjectMocks private ProgramController programController;

  private ProgramDto mockProgramDto;
  private ProgramParticipantDto mockProgramParticipantDto;
  private String jsonPayload;

  @BeforeEach
  public void setup() {
    mockProgramDto = new ProgramDto();
    mockProgramParticipantDto = new ProgramParticipantDto();

    ProgramAttachmentDto mockProgramAttachmentDto =
        new ProgramAttachmentDto(111, "https://example.com/program-guide.pdf");

    mockProgramDto.setProgramId(111);
    mockProgramDto.setProgramType("Training");
    mockProgramDto.setTitle("Training Program");
    mockProgramDto.setDescription("This is a training program.");
    mockProgramDto.setCapacity(10);
    mockProgramDto.setOccurrenceDate(
        ZonedDateTime.of(LocalDate.of(2025, 5, 15), LocalTime.of(10, 0), ZoneId.systemDefault()));
    mockProgramDto.setDurationMins(120);
    mockProgramDto.setRecurring(false);
    mockProgramDto.setExpiryDate(
        ZonedDateTime.of(LocalDate.of(2025, 5, 16), LocalTime.of(0, 0), ZoneId.systemDefault()));
    mockProgramDto.setFrequency("None");
    mockProgramDto.setLocation("999 Random Ave");
    mockProgramDto.setVisibility("public");
    mockProgramDto.setProgramAttachments(List.of(mockProgramAttachmentDto)); // Add the attachment

    mockProgramParticipantDto.setProgramId(111);
    mockProgramParticipantDto.setAccountId(1);
    mockProgramParticipantDto.setConfirmed(true);
    mockProgramParticipantDto.setConfirmedDate(ZonedDateTime.now());

    jsonPayload =
        "{"
            + "\"title\": \"Title\","
            + "\"type\": \"Type\","
            + "\"startDate\": \"2024-01-30T10:00:00Z\","
            + "\"endDate\": \"2024-02-01T10:00:00Z\","
            + "\"recurring\": false,"
            + "\"visibility\": \"public\","
            + "\"description\": \"description\","
            + "\"attachment\": ["
            + "   {\"path\": \"./Lab4.pdf\", \"relativePath\": \"./Lab4.pdf\"}"
            + "],"
            + "\"capacity\": 10,"
            + "\"startTime\": \"10:30\","
            + "\"endTime\": \"12:30\","
            + "\"location\": \"Centre-de-loisirs-St-Denis\""
            + "}";
  }

  @Test
  public void testGetProgramDetails_AccountNotFound() throws Exception {
    Mockito.when(accountService.getAccount(999)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/programs/999/details")).andExpect(status().isNotFound());
  }

  @Test
  public void testGetProgramDetails_ProgramNotFound() throws Exception {

    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.PLAYER);

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

    mockMvc.perform(get("/api/programs/2/details")).andExpect(status().isNotFound());
  }

  @Test
  public void testGetPrograms_UserWithPermissions() throws Exception {

    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.COACH);

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getPrograms()).thenReturn(List.of(mockProgramDto));
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(programService.getParticipants(111))
        .thenReturn(List.of(mockProgramParticipantDto));

    ProgramDetailsParticipantsDto mockProgramDetails =
        new ProgramDetailsParticipantsDto(mockProgramDto, List.of(mockProgramParticipantDto));

    Mockito.when(programService.getProgramDetailsParticipantsDto(List.of(mockProgramDto), true))
        .thenReturn(List.of(mockProgramDetails));

    mockMvc
        .perform(get("/api/programs/2/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].programDetails.programId").value(111))
        .andExpect(jsonPath("$.data[0].programDetails.title").value("Training Program"))
        .andExpect(
            jsonPath("$.data[0].programDetails.programAttachments[0].attachmentUrl")
                .value("https://example.com/program-guide.pdf"))
        .andExpect(jsonPath("$.data[0].attendees[0].accountId").value(1))
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Programs successfully fetched."));
  }

  @Test
  public void testGetPrograms_UserWithoutPermissions() throws Exception {

    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.PLAYER);

    ProgramDetailsParticipantsDto mockProgramDetailsParticipantsDtos =
        new ProgramDetailsParticipantsDto(mockProgramDto, new ArrayList<>());

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);
    Mockito.when(programService.getPrograms()).thenReturn(List.of(mockProgramDto));
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(programService.getProgramDetailsParticipantsDto(List.of(mockProgramDto), false))
        .thenReturn(List.of(mockProgramDetailsParticipantsDtos));

    mockMvc
        .perform(get("/api/programs/2/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].programDetails.programId").value(111))
        .andExpect(jsonPath("$.data[0].programDetails.title").value("Training Program"))
        .andExpect(
            jsonPath("$.data[0].programDetails.programAttachments[0].attachmentUrl")
                .value("https://example.com/program-guide.pdf"))
        .andExpect(jsonPath("$.data[0].attendees").isEmpty())
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Programs successfully fetched."));
  }

  @Test
  public void testCreateProgram_Success() throws Exception {
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.COACH);

    ProgramRequestDto mockProgramRequestDto = new ProgramRequestDto();
    mockProgramRequestDto.setTitle("Updated Training Program");
    mockProgramRequestDto.setType("Training");
    mockProgramRequestDto.setStartDate("2024-02-01");
    mockProgramRequestDto.setEndDate("2024-02-10");
    mockProgramRequestDto.setRecurring(false);
    mockProgramRequestDto.setVisibility("private");
    mockProgramRequestDto.setDescription("Updated Description");
    mockProgramRequestDto.setCapacity(20);
    mockProgramRequestDto.setStartTime("09:00");
    mockProgramRequestDto.setEndTime("11:00");
    mockProgramRequestDto.setLocation("Updated Location");

    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            new ObjectMapper().writeValueAsBytes(mockProgramRequestDto));

    MockMultipartFile attachment =
        new MockMultipartFile(
            "attachments",
            "program-guide.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "PDF content".getBytes());

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(
            programService.createProgramDto(
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyBoolean(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyInt(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyList(),
                Mockito.anyInt()))
        .thenReturn(mockProgramDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/programs/2/create-program")
                .file(programData)
                .file(attachment)
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.message").value("Created a new program successfully."))
        .andExpect(jsonPath("$.data.title").value("Training Program"))
        .andExpect(jsonPath("$.data.capacity").value(10))
        .andExpect(jsonPath("$.data.programType").value("Training"))
        .andExpect(
            jsonPath("$.data.programAttachments[0].attachmentUrl")
                .value("https://example.com/program-guide.pdf"));
  }

  @Test
  public void testCreateProgram_InsufficientPermissions() throws Exception {
    Account mockAccount = new Account();
    mockAccount.setAccountId(3);
    mockAccount.setType(AccountType.PLAYER);

    Mockito.when(accountService.getAccount(3)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);

    // Ensure the JSON payload is valid and formatted correctly
    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "program.json",
            MediaType.APPLICATION_JSON_VALUE,
            jsonPayload.getBytes(StandardCharsets.UTF_8));

    // Add an empty file to match the controller's expected attachments
    MockMultipartFile emptyAttachments =
        new MockMultipartFile(
            "attachments", "", MediaType.APPLICATION_OCTET_STREAM_VALUE, new byte[0]);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/programs/3/create-program")
                .file(programData)
                .file(emptyAttachments) // Include empty attachment to avoid 400
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isForbidden());
  }

  @Test
  public void testModifyProgram_Success() throws Exception {
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.COACH);

    ProgramRequestDto mockProgramRequestDto = new ProgramRequestDto();
    mockProgramRequestDto.setTitle("Title");
    mockProgramRequestDto.setType("Type");
    mockProgramRequestDto.setStartDate("2024-01-30T10:00:00Z");
    mockProgramRequestDto.setEndDate("2024-02-01T10:00:00Z");
    mockProgramRequestDto.setRecurring(false);
    mockProgramRequestDto.setVisibility("public");
    mockProgramRequestDto.setDescription("description");
    mockProgramRequestDto.setCapacity(10);
    mockProgramRequestDto.setStartTime("10:30");
    mockProgramRequestDto.setEndTime("12:30");
    mockProgramRequestDto.setLocation("Centre-de-loisirs-St-Denis");
    mockProgramRequestDto.setAttachmentsToRemove(List.of("file1.pdf", "file2.pdf"));

    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            new ObjectMapper().writeValueAsBytes(mockProgramRequestDto));

    MockMultipartFile attachment1 =
        new MockMultipartFile(
            "attachments",
            "file1.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "Sample PDF Content".getBytes());

    MockMultipartFile attachment2 =
        new MockMultipartFile(
            "attachments",
            "file2.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "Sample PDF Content".getBytes());

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart("/api/programs/2/111/modify-program")
                .file(programData)
                .file(attachment1)
                .file(attachment2)
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isOk());

    Mockito.verify(programService)
        .modifyProgram(
            Mockito.eq(mockProgramDto),
            Mockito.eq(mockProgramRequestDto.getTitle()),
            Mockito.eq(mockProgramRequestDto.getType()),
            Mockito.eq(mockProgramRequestDto.getStartDate()),
            Mockito.eq(mockProgramRequestDto.getEndDate()),
            Mockito.eq(mockProgramRequestDto.getRecurring()),
            Mockito.eq(mockProgramRequestDto.getVisibility()),
            Mockito.eq(mockProgramRequestDto.getDescription()),
            Mockito.eq(mockProgramRequestDto.getCapacity()),
            Mockito.eq(mockProgramRequestDto.getStartTime()),
            Mockito.eq(mockProgramRequestDto.getEndTime()),
            Mockito.eq(mockProgramRequestDto.getLocation()),
            Mockito.argThat(list -> list.size() == 2), // Assert 2 attachments were passed
            Mockito.eq(mockProgramRequestDto.getAttachmentsToRemove()),
            Mockito.eq(2));
  }

  @Test
  public void testModifyProgram_UserNotFound() throws Exception {
    Mockito.when(accountService.getAccount(123)).thenReturn(Optional.empty());

    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            jsonPayload.getBytes(StandardCharsets.UTF_8));

    MockMultipartFile attachment =
        new MockMultipartFile(
            "attachments",
            "dummy.txt",
            MediaType.TEXT_PLAIN_VALUE,
            "Sample content".getBytes(StandardCharsets.UTF_8));

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart(
                    HttpMethod.POST, "/api/programs/123/111/modify-program")
                .file(programData)
                .file(attachment)
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isNotFound());
  }

  @Test
  public void testModifyProgram_InsufficientPermissions() throws Exception {
    Account mockAccount = new Account();
    mockAccount.setAccountId(3);
    mockAccount.setType(AccountType.PLAYER);

    Mockito.when(accountService.getAccount(3)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);

    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            jsonPayload.getBytes(StandardCharsets.UTF_8));

    MockMultipartFile attachment =
        new MockMultipartFile(
            "attachments",
            "testfile.txt",
            MediaType.TEXT_PLAIN_VALUE,
            "Sample file content".getBytes(StandardCharsets.UTF_8));

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart(HttpMethod.POST, "/api/programs/3/111/modify-program")
                .file(programData)
                .file(attachment)
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isForbidden());
  }

  @Test
  public void testModifyProgram_ProgramNotFound() throws Exception {
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType(AccountType.COACH);

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

    MockMultipartFile programData =
        new MockMultipartFile(
            "programData",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            jsonPayload.getBytes(StandardCharsets.UTF_8));

    MockMultipartFile attachment =
        new MockMultipartFile(
            "attachments",
            "dummy.txt",
            MediaType.TEXT_PLAIN_VALUE,
            "Sample content".getBytes(StandardCharsets.UTF_8));

    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart(HttpMethod.POST, "/api/programs/2/111/modify-program")
                .file(programData)
                .file(attachment)
                .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isNotFound());
  }
}
