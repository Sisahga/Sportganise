// package com.sportganise.controllers;
//
// import static org.hamcrest.Matchers.equalTo;
// import static org.hamcrest.Matchers.hasSize;
// import static org.hamcrest.Matchers.is;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
// import com.sportganise.dto.ProgramParticipantDto;
// import com.sportganise.entities.Account;
// import com.sportganise.services.AccountService;
// import com.sportganise.services.ProgramService;
// import java.util.Arrays;
// import java.util.Optional;
// import org.junit.jupiter.api.Test;
// import org.mockito.Mockito;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

/*
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProgramControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ProgramService programService;
  @MockBean private AccountService accountService;

  @Test
  public void getParticipantsInSession_Success() throws Exception {
    // Mock an Account with permissions i.e. an Admin or Coach
    Account mockAccount = new Account();
    mockAccount.setType(Role.ADMIN);
    Mockito.when(accountService.getAccount(1)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(Role.ADMIN)).thenReturn(true);

    // Mock list of 2 participants
    ProgramParticipantDto participant1 =
        new ProgramParticipantDto(
            1,
            Role.PLAYER,
            "johndoe@gmail.com",
            "123 Boulevard Random",
            "5141234567",
            "John",
            "Doe");
    ProgramParticipantDto participant2 =
        new ProgramParticipantDto(
            2,
            Role.PLAYER,
            "janesmith@gmail.com",
            "123 Avenue Random",
            "5148901234",
            "Jane",
            "Smith");

    Mockito.when(programService.getParticipants(1001))
        .thenReturn(Arrays.asList(participant1, participant2));

    // Perform the GET request and verify the response gives us the appropriate list of participants
    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/api/programs/1001/details")
                .param("accountId", "1")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].firstName", is("John")))
        .andExpect(jsonPath("$[0].lastName", is("Doe")))
        .andExpect(jsonPath("$[1].firstName", is("Jane")))
        .andExpect(jsonPath("$[1].lastName", is("Smith")));
  }

  // Empty instead of Forbidden, because eventually players will see other details of the session
  // but just not the participants
  @Test
  public void getParticipantsInSession_Empty() throws Exception {
    // Mock an Account with no permissions to view attendees i.e. a Player user
    Account mockAccount = new Account();
    mockAccount.setType(Role.PLAYER);
    Mockito.when(accountService.getAccount(1)).thenReturn(Optional.of(mockAccount));
    Mockito.when(accountService.hasPermissions(Role.PLAYER)).thenReturn(false);

    // Perform the GET request and verify empty response
    // Note: for now will leave it as empty, but later, I will make it so that players can see other
    // session details
    // like date, time, location, etc. (just not the attendees)
    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/api/programs/1001/details")
                .param("accountId", "1")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(content().string(equalTo("")));
  }

  @Test
  public void getParticipantsInSession_NotFound() throws Exception {
    // Mock an empty Account i.e. no Account found
    Mockito.when(accountService.getAccount(1)).thenReturn(Optional.empty());

    // Perform the GET request and verify the NOT FOUND response
    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/api/programs/1001/details")
                .param("accountId", "1")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }
}
*/
