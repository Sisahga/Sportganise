package com.sportganise.controllers.programsession;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.controllers.programsessions.ProgramController;
import com.sportganise.dto.programsessions.ProgramAttachmentDto;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = ProgramController.class)
@AutoConfigureMockMvc
public class ProgramControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  @MockBean private ProgramService programService;

  @InjectMocks private ProgramController programController;

  // Initialize Dtos
  private ProgramDto mockProgramDto;
  private ProgramParticipantDto mockProgramParticipantDto;
  private ProgramAttachmentDto mockProgramAttachmentDto;
  private String jsonPayload;

  @BeforeEach
  public void setup() {
    mockProgramDto = new ProgramDto();
    mockProgramParticipantDto = new ProgramParticipantDto();

    // Mock a program attachment
    mockProgramAttachmentDto = new ProgramAttachmentDto(111, "http://example.com/program-guide.pdf");

    // Set the programDto
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

    // Set the programParticipantDto
    mockProgramParticipantDto.setProgramId(111);
    mockProgramParticipantDto.setAccountId(1);
    mockProgramParticipantDto.setConfirmed(true);
    mockProgramParticipantDto.setConfirmedDate(ZonedDateTime.now());

    // Prepare a dummy JSON payload
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
            + "\"notify\": true,"
            + "\"startTime\": \"10:30\","
            + "\"endTime\": \"12:30\","
            + "\"location\": \"Centre-de-loisirs-St-Denis\""
            + "}";
  }

  // Test getProgramDetails for when user account does not exist
  @Test
  public void testGetProgramDetails_AccountNotFound() throws Exception {
    // Mock the accountService to return Optional.empty() for accountId = 999
    Mockito.when(accountService.getAccount(999)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/programs/999/details")).andExpect(status().isNotFound());
  }

  // Test getProgramDetails for when program does not exist
  @Test
  public void testGetProgramDetails_ProgramNotFound() throws Exception {

    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("USER");

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

    mockMvc.perform(get("/api/programs/2/details")).andExpect(status().isNotFound());
  }

  // Test getProgramDetails for when user has permission eg. COACH or ADMIN
  @Test
  public void testGetPrograms_UserWithPermissions() throws Exception {

    // Mock the user/account that is accessing the programs details
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("COACH");

    // Mock behaviour of the services using the mocked objects
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getPrograms()).thenReturn(List.of(mockProgramDto));
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(programService.getParticipants(111))
        .thenReturn(List.of(mockProgramParticipantDto));

    // Mock combined DTO
    ProgramDetailsParticipantsDto mockProgramDetails =
        new ProgramDetailsParticipantsDto(mockProgramDto, List.of(mockProgramParticipantDto));

    Mockito.when(programService.getProgramDetailsParticipantsDto(List.of(mockProgramDto), true))
        .thenReturn(List.of(mockProgramDetails));

    // Perform the GET request and verify the response
    mockMvc
        .perform(get("/api/programs/2/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].programDetails.programId").value(111))
        .andExpect(jsonPath("$.data[0].programDetails.title").value("Training Program"))
        .andExpect(jsonPath("$.data[0].programDetails.programAttachments[0].attachmentUrl").value("http://example.com/program-guide.pdf"))
        .andExpect(jsonPath("$.data[0].attendees[0].accountId").value(1))
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Programs successfully fetched."));
  }

  // Test getProgramDetails for when user has no permission eg. REGULAR
  @Test
  public void testGetPrograms_UserWithoutPermissions() throws Exception {

    // Mock the user/account that is accessing the programs details
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("REGULAR");

    // Mock ProgramDetailsParticipantsDto with no participants
    ProgramDetailsParticipantsDto mockProgramDetailsParticipantsDtos =
        new ProgramDetailsParticipantsDto(mockProgramDto, List.of());

    // Mock behaviour of the services using the mocked objects
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);
    Mockito.when(programService.getPrograms()).thenReturn(List.of(mockProgramDto));
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(programService.getProgramDetailsParticipantsDto(List.of(mockProgramDto), false))
    .thenReturn(List.of(mockProgramDetailsParticipantsDtos)); // `canDisplayAttendees` is false


    // Perform the GET request and verify the response
    mockMvc
        .perform(get("/api/programs/2/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].programDetails.programId").value(111))
        .andExpect(jsonPath("$.data[0].programDetails.title").value("Training Program"))
        .andExpect(jsonPath("$.data[0].programDetails.programAttachments[0].attachmentUrl").value("http://example.com/program-guide.pdf"))
        .andExpect(jsonPath("$.data[0].attendees.length()").value(0)) // No attendees
        .andExpect(jsonPath("$.statusCode").value(200))
        .andExpect(jsonPath("$.message").value("Programs successfully fetched."));
  }

  // Tests for createProgram() method
  @Test
  public void testCreateProgram_Success() throws Exception {
    // Mock data of a user with permissions i.e. COACH or ADMIN
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("COACH");

    // Mocking service calls
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
                Mockito.anyBoolean(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.<List<Map<String, String>>>any()))
        .thenReturn(mockProgramDto);

    // Perform request and verify the response
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/programs/2/create-program")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
        .andExpect(status().isCreated()) // Expect 201 Created
        .andExpect(jsonPath("$.data.title").value("Training Program")) // Verify title
        .andExpect(jsonPath("$.data.capacity").value(10)) // Verify capacity
        .andExpect(jsonPath("$.data.programType").value("Training")) // Verify programType
        .andExpect(jsonPath("$.data.programAttachments[0].attachmentUrl").value("http://example.com/program-guide.pdf"));
}

  @Test
  public void testCreateProgram_InsufficientPermissions() throws Exception {
    // Mock account without permissions like a PLAYER
    Account mockAccount = new Account();
    mockAccount.setAccountId(3);
    mockAccount.setType("PLAYER");

    // Mock behavior
    Mockito.when(accountService.getAccount(3)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/programs/3/create-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isForbidden());
  }

  @Test
  public void testModifyProgram_Success() throws Exception {
    // Mock data
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("COACH");

    // Mock behavior
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                    "/api/programs/2/111/modify-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isOk());

    // Verify that the modifyProgram method was called
    Mockito.verify(programService)
        .modifyProgram(
            Mockito.eq(mockProgramDto),
            Mockito.eq("Title"),
            Mockito.eq("Type"),
            Mockito.eq("2024-01-30T10:00:00Z"),
            Mockito.eq("2024-02-01T10:00:00Z"),
            Mockito.eq(false),
            Mockito.eq("public"),
            Mockito.eq("description"),
            Mockito.eq(10),
            Mockito.eq(true),
            Mockito.eq("10:30"),
            Mockito.eq("12:30"),
            Mockito.eq("Centre-de-loisirs-St-Denis"),
            Mockito.<List<Map<String, String>>>any());
  }

  @Test
  public void testModifyProgram_UserNotFound() throws Exception {

    // Mock behavior for accountService to return Optional.empty()
    Mockito.when(accountService.getAccount(123)).thenReturn(Optional.empty());

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                    "/api/programs/123/111/modify-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isNotFound()); // Expect 404 when user is not found
  }

  @Test
  public void testModifyProgram_InsufficientPermissions() throws Exception {
    // Mock an account without permissions
    Account mockAccount = new Account();
    mockAccount.setAccountId(3);
    mockAccount.setType("PLAYER");

    // Mock behavior
    Mockito.when(accountService.getAccount(3)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                    "/api/programs/3/111/modify-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isForbidden());
  }

  @Test
  public void testModifyProgram_ProgramNotFound() throws Exception {
    // Mock account with sufficient permissions
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("COACH");

    // Mock behavior
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.put(
                    "/api/programs/2/111/modify-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isNotFound());
  }
}
