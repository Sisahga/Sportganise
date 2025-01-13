package com.sportganise.controllers.programsession;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.controllers.programsessions.ProgramController;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.programsessions.ProgramService;
import java.time.LocalDateTime;
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
  private ProgramDetailsParticipantsDto mockProgramDetailsParticipantsDto;
  private String jsonPayload;

  @BeforeEach
  public void setup() {
    mockProgramDto = new ProgramDto();
    mockProgramParticipantDto = new ProgramParticipantDto();
    mockProgramDetailsParticipantsDto = new ProgramDetailsParticipantsDto();

    // Set the programDto
    mockProgramDto.setProgramId(111);
    mockProgramDto.setProgramType("Training");
    mockProgramDto.setTitle("Training Program");
    mockProgramDto.setDescription("This is a training program.");
    mockProgramDto.setCapacity(10);
    mockProgramDto.setOccurrenceDate(LocalDateTime.of(2025, 5, 15, 10, 0));
    mockProgramDto.setDurationMins(120);
    mockProgramDto.setRecurring(false);
    mockProgramDto.setExpiryDate(LocalDateTime.of(2025, 5, 16, 0, 0));
    mockProgramDto.setFrequency("None");
    mockProgramDto.setLocation("999 Random Ave");
    mockProgramDto.setVisibility("public");
    mockProgramDto.setAttachment(List.of("/banner.pdf"));

    // Set the programParticipantDto
    mockProgramParticipantDto.setProgramId(201);
    mockProgramParticipantDto.setAccountId(1);
    mockProgramParticipantDto.setConfirmed(true);
    mockProgramParticipantDto.setConfirmedDate(LocalDateTime.now());

    // Set the programDetailsParticipantsDto
    mockProgramDetailsParticipantsDto.setProgramDetails(mockProgramDto);
    mockProgramDetailsParticipantsDto.setAttendees(List.of(mockProgramParticipantDto));

    // Prepare a dummy JSON payload
    jsonPayload =
        "{"
            + "\"title\": \"Title\","
            + "\"type\": \"Type\","
            + "\"start_date\": \"2024-01-30T10:00:00Z\","
            + "\"end_date\": \"2024-02-01T10:00:00Z\","
            + "\"recurring\": false,"
            + "\"visibility\": \"public\","
            + "\"description\": \"description\","
            + "\"attachment\": ["
            + "   {\"path\": \"./Lab4.pdf\", \"relativePath\": \"./Lab4.pdf\"}"
            + "],"
            + "\"capacity\": 10,"
            + "\"notify\": true,"
            + "\"start_time\": \"10:30\","
            + "\"end_time\": \"12:30\","
            + "\"location\": \"Centre-de-loisirs-St-Denis\""
            + "}";
  }

  // Test getProgramDetails for when user account does not exist
  @Test
  public void testGetProgramDetails_AccountNotFound() throws Exception {
    // Mock the accountService to return Optional.empty() for accountId = 999
    Mockito.when(accountService.getAccount(999)).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/programs/999/111/details")).andExpect(status().isNotFound());
  }

  // Test getProgramDetails for when program does not exist
  @Test
  public void testGetProgramDetails_ProgramNotFound() throws Exception {

    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("USER");

    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

    mockMvc.perform(get("/api/programs/2/999/details")).andExpect(status().isNotFound());
  }

  // Test getProgramDetails for when user has permission eg. COACH or ADMIN
  @Test
  public void testGetProgramDetails_UserWithPermissions() throws Exception {

    // Mock the user/account that is accessing the programs details
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("COACH");

    // Mock the program participant and corresponding account details
    ProgramParticipantDto mockProgramParticipantDto = new ProgramParticipantDto();
    mockProgramParticipantDto.setProgramId(111);
    mockProgramParticipantDto.setAccountId(3); // Example account ID for a participant
    mockProgramParticipantDto.setConfirmed(true);
    mockProgramParticipantDto.setConfirmedDate(LocalDateTime.now());

    // Mock behaviour of the services using the mocked objects
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(programService.getParticipants(111))
        .thenReturn(List.of(mockProgramParticipantDto));

    // Perform the request and assert the response
    mockMvc
        .perform(get("/api/programs/2/111/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.programDetails.programId").value(111))
        .andExpect(jsonPath("$.programDetails.title").value("Training Program"));
  }

  // Test getProgramDetails for when user has permission eg. PLAYER
  @Test
  public void testGetProgramDetails_UserWithoutPermissions() throws Exception {

    // Mock the user/account that is accessing the programs details
    Account mockAccount = new Account();
    mockAccount.setAccountId(2);
    mockAccount.setType("PLAYER");

    // Mock behaviour of the services using the mocked objects
    Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
    Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
    Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(false);

    mockMvc
        .perform(get("/api/programs/2/111/details"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.programDetails.programId").value(111))
        .andExpect(jsonPath("$.programDetails.title").value("Training Program"))
        .andExpect(jsonPath("$.participants").doesNotExist());
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

    // Perform request with the dummy JSON payload from above
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/programs/2/create-program") // Use POST for creation
                .contentType(MediaType.APPLICATION_JSON) // Set the content type to JSON
                .content(jsonPayload)) // Pass the JSON payload
        .andExpect(status().isCreated()) // Expect status 201 Created
        .andExpect(jsonPath("$.capacity").value(10)) // Check that capacity is returned
        .andExpect(jsonPath("$.title").value("Training Program")); // Check the title
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
