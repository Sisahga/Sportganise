package com.sportganise.controllers;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.entities.Account;
import com.sportganise.services.AccountService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AccountService accountService;

  Account account;

  @BeforeEach
  public void setup() {
    account = new Account();
    account.setAccountId(1);
    account.setType("PLAYER");
    account.setEmail("test@example.com");
    account.setAuth0Id("auth_id");
    account.setAddress("124 test st.");
    account.setPhone("5147772662");
    account.setFirstName("John");
    account.setLastName("Doe");
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
        .andDo(print())
        .andExpect(jsonPath("$.accountId", is(account.getAccountId())))
        .andExpect(jsonPath("$.type", is(account.getType())))
        .andExpect(jsonPath("$.email", is(account.getEmail())))
        .andExpect(jsonPath("$.auth0Id", is(account.getAuth0Id())))
        .andExpect(jsonPath("$.address", is(account.getAddress())))
        .andExpect(jsonPath("$.phone", is(account.getPhone())))
        .andExpect(jsonPath("$.firstName", is(account.getFirstName())))
        .andExpect(jsonPath("$.lastName", is(account.getLastName())));
  }
}
