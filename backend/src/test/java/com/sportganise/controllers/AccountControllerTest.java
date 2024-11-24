package com.sportganise.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sportganise.entities.Account;
import com.sportganise.services.AccountService;
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

import java.util.Optional;

@WebMvcTest(controllers = AccountController.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    Account account;

    @BeforeEach
    public void setup() {
        account = new Account(1, "PLAYER", "test@example.com", "auth0_id",
                "124 test st.", "5146662272", "John", "Doe");
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/account/{id}", 1))
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
