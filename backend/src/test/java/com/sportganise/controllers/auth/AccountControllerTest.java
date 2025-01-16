package com.sportganise.controllers.auth;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.controllers.account.AccountController;
import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.UpdateAccountDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.Address;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.services.account.AccountService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = AccountController.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  Account account;

  @BeforeEach
  public void setup() {
    account =
        Account.builder()
            .accountId(1)
            .type("PLAYER")
            .email("test@example.com")
            .phone("5146662272")
            .firstName("John")
            .lastName("Doe")
            .address(
                Address.builder()
                    .line("124 test st.")
                    .city("Paris")
                    .province("Idontknow")
                    .country("France")
                    .postalCode("12312334")
                    .build())
            .build();
  }

  @Test
  @Order(1)
  public void index() throws Exception {
    mockMvc
        .perform(MockMvcRequestBuilders.get("/api/account/").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().string(not(equalTo(""))))
        .andExpect(content().string(equalTo("Welcome to Sportganise")));
  }

  @Test
  @Order(2)
  public void getAccountTest() throws Exception {
    given(accountService.getAccount(account.getAccountId())).willReturn(Optional.of(account));
    mockMvc
        .perform(MockMvcRequestBuilders.get("/api/account/{id}", 1))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accountId", is(account.getAccountId())))
        .andExpect(jsonPath("$.type", is(account.getType())))
        .andExpect(jsonPath("$.email", is(account.getEmail())))
        .andExpect(jsonPath("$.auth0Id", is(account.getAuth0Id())))
        .andExpect(jsonPath("$.address.line", is(account.getAddress().getLine())))
        .andExpect(jsonPath("$.address.city", is(account.getAddress().getCity())))
        .andExpect(jsonPath("$.address.province", is(account.getAddress().getProvince())))
        .andExpect(jsonPath("$.address.country", is(account.getAddress().getCountry())))
        .andExpect(jsonPath("$.address.postalCode", is(account.getAddress().getPostalCode())))
        .andExpect(jsonPath("$.phone", is(account.getPhone())))
        .andExpect(jsonPath("$.firstName", is(account.getFirstName())))
        .andExpect(jsonPath("$.lastName", is(account.getLastName())));
  }

  @Test
  @Order(3)
  public void getAllUsersByOrganizationTest() throws Exception {
    int organizationId = 1;

    // Mock data
    List<AccountDetailsDirectMessaging> accounts =
        List.of(
            new AccountDetailsDirectMessaging(
                2, "Jane", "Smith", "jane@example.com", "5145551234", "PLAYER"));

    // Mock service behavior
    given(accountService.getAllNonBlockedAccountsByOrganizationId(organizationId, 1))
        .willReturn(accounts);

    // Perform GET request
    mockMvc
        .perform(
            MockMvcRequestBuilders.get(
                    "/api/account/get-all-users/{organizationId}/1", organizationId)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.size()", is(accounts.size())))
        .andExpect(jsonPath("$[0].firstName", is(accounts.getFirst().getFirstName())))
        .andExpect(jsonPath("$[0].lastName", is(accounts.getFirst().getLastName())))
        .andExpect(jsonPath("$[0].phone", is(accounts.getFirst().getPhone())));
  }

  @Test
  public void updateAccountTest_NotFound() throws Exception {
    int accountId = 2;
    String requestBody = "{}";

    doThrow(new AccountNotFoundException("Account not found"))
        .when(accountService)
        .updateAccount(anyInt(), any(UpdateAccountDto.class));

    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/api/account/{accountId}", accountId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect((status().isNotFound()));
  }

  @Test
  public void updateAccountTest_Success() throws Exception {

    int accountId = 3;
    String requestBody = "{}";

    mockMvc
        .perform(
            (MockMvcRequestBuilders.put("/api/account/{accountId}", accountId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)))
        .andExpect((status().isNoContent()));
  }
}
