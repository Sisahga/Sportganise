package com.sportganise.controllers.programsession;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.time.LocalDateTime;
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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.multipart.MultipartFile;

import com.sportganise.controllers.programsessions.ProgramController;
import com.sportganise.dto.programsessions.ProgramDetailsParticipantsDto;
import com.sportganise.dto.programsessions.ProgramDto;
import com.sportganise.dto.programsessions.ProgramParticipantDto;
import com.sportganise.entities.Account;
import com.sportganise.services.auth.AccountService;
import com.sportganise.services.programsessions.ProgramService;

@WebMvcTest(controllers = ProgramController.class)
@AutoConfigureMockMvc
public class ProgramControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    @MockBean
    private ProgramService programService;

    @InjectMocks
    private ProgramController programController;

    // Initialize Dtos
    private ProgramDto mockProgramDto;
    private ProgramParticipantDto mockProgramParticipantDto;
    private ProgramDetailsParticipantsDto mockProgramDetailsParticipantsDto;

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
        mockProgramDto.setAttachment("/banner.pdf");

        // Set the programParticipantDto
        mockProgramParticipantDto.setAccountId(1);
        mockProgramParticipantDto.setProgramId(1);
        mockProgramParticipantDto.setConfirmed(true);
        mockProgramParticipantDto.setConfirmedDate(LocalDateTime.now());

        // Set the programDetailsParticipantsDto
        mockProgramDetailsParticipantsDto.setProgramDetails(mockProgramDto);
        mockProgramDetailsParticipantsDto.setAttendees(List.of(mockProgramParticipantDto));
    }

    // Test getProgramDetails for when user account does not exist
    @Test
    public void testGetProgramDetails_AccountNotFound() throws Exception {
        // Mock the accountService to return Optional.empty() for accountId = 999
        Mockito.when(accountService.getAccount(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/programs/999/111/details"))
                .andExpect(status().isNotFound());
    }

    // Test getProgramDetails for when program does not exist
    @Test
    public void testGetProgramDetails_ProgramNotFound() throws Exception {

        Account mockAccount = new Account();
        mockAccount.setAccountId(2);
        mockAccount.setType("USER");

        Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
        Mockito.when(programService.getProgramDetails(999)).thenReturn(null);

        mockMvc.perform(get("/api/programs/2/999/details"))
                .andExpect(status().isNotFound());
    }

    // Test getProgramDetails for when user has permission eg. COACH or ADMIN
    @Test
    public void testGetProgramDetails_UserWithPermissions() throws Exception {

        // Mock the user/account that is accessing the programs details
        Account mockAccount = new Account();
        mockAccount.setAccountId(2);
        mockAccount.setType("COACH");

        // Mock behaviour of the services using the mocked objects
        Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
        Mockito.when(programService.getProgramDetails(111)).thenReturn(mockProgramDto);
        Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
        Mockito.when(programService.getParticipants(111)).thenReturn(List.of(mockProgramParticipantDto));

        // Perform the request and assert the response
        mockMvc.perform(get("/api/programs/2/111/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.programDetails.programId").value(111))
                .andExpect(jsonPath("$.programDetails.title").value("Training Program"))
                .andExpect(jsonPath("$.attendees[0].firstName").value("John"))
                .andExpect(jsonPath("$.attendees[0].lastName").value("Doe"));
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

        mockMvc.perform(get("/api/programs/2/111/details"))
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

        // Mocking file
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf",
                "dummy content".getBytes());

        // Mocking service calls
        Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
        Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
        Mockito.when(programService.createProgramDto(
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyInt(),
                Mockito.any(LocalDateTime.class),
                Mockito.anyInt(),
                Mockito.anyBoolean(),
                Mockito.any(LocalDateTime.class),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.any(MultipartFile.class)))
                .thenReturn(mockProgramDto);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/programs/2/create-program")
                .file((MockMultipartFile) mockFile)
                .param("type", "Training")
                .param("title", "Training Program")
                .param("description", "Dummy Description")
                .param("capacity", "20")
                .param("occurrenceDate", "2024-01-15T10:00:00")
                .param("durationMins", "120")
                .param("isRecurring", "false")
                .param("expiryDate", "2024-01-16T10:00:00")
                .param("frequency", "WEEKLY")
                .param("location", "Gym")
                .param("visibility", "Public")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.programId").value(111))
                .andExpect(jsonPath("$.title").value("Training Program"));
    }

    @Test
    public void testCreateProgram_UserNotFound() throws Exception {
        // Mock behavior
        Mockito.when(accountService.getAccount(999)).thenReturn(Optional.empty());

        // Mocking file
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf",
                "dummy content".getBytes());

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/programs/999/create-program")
                .file((MockMultipartFile) mockFile)
                .param("type", "Training")
                .param("title", "Training Program")
                .param("description", "Dummy Description")
                .param("capacity", "20")
                .param("occurrenceDate", "2024-01-15T10:00:00")
                .param("durationMins", "120")
                .param("isRecurring", "false")
                .param("expiryDate", "2024-01-30T10:00:00")
                .param("frequency", "WEEKLY")
                .param("location", "Gym")
                .param("visibility", "Public")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isNotFound());
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

        // Mocking file
        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf",
                "dummy content".getBytes());

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/programs/3/create-program")
                .file((MockMultipartFile) mockFile)
                .param("type", "Training")
                .param("title", "Training Program")
                .param("description", "Dummy Description")
                .param("capacity", "20")
                .param("occurrenceDate", "2024-01-15T10:00:00")
                .param("durationMins", "120")
                .param("isRecurring", "false")
                .param("expiryDate", "2024-01-30T10:00:00")
                .param("frequency", "WEEKLY")
                .param("location", "Gym")
                .param("visibility", "Public")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testCreateProgram_ServiceThrowsException() throws Exception {
        // Mock data
        Account mockAccount = new Account();
        mockAccount.setAccountId(2);
        mockAccount.setType("COACH");

        MultipartFile mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf",
                "dummy content".getBytes());

        // Mocking service calls
        Mockito.when(accountService.getAccount(2)).thenReturn(Optional.of(mockAccount));
        Mockito.when(accountService.hasPermissions(mockAccount.getType())).thenReturn(true);
        Mockito.when(programService.createProgramDto(
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyInt(),
                Mockito.any(LocalDateTime.class),
                Mockito.anyInt(),
                Mockito.anyBoolean(),
                Mockito.any(LocalDateTime.class),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.any(MultipartFile.class)))
                .thenThrow(new RuntimeException("Something went wrong"));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/programs/2/create-program")
                .file((MockMultipartFile) mockFile)
                .param("type", "Training")
                .param("title", "Training Program")
                .param("description", "Description")
                .param("capacity", "20")
                .param("occurrenceDate", "2024-01-15T10:00:00")
                .param("durationMins", "120")
                .param("isRecurring", "false")
                .param("expiryDate", "2024-01-30T10:00:00")
                .param("frequency", "WEEKLY")
                .param("location", "Gym")
                .param("visibility", "Public")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());
    }
}
