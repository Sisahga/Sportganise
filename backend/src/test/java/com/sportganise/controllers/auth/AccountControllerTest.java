package com.sportganise.controllers.auth;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportganise.controllers.account.AccountController;
import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.AccountPermissions;
import com.sportganise.dto.account.UpdateAccountDto;
import com.sportganise.dto.account.UpdateAccountTypeDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.exceptions.InvalidAccountTypeException;
import com.sportganise.services.account.AccountService;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = AccountController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AccountControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockBean private AccountService accountService;

  private ProjectionFactory factory = new SpelAwareProxyProjectionFactory();

  private Account account;

  @BeforeEach
  public void setup() {
    account =
        Account.builder()
            .accountId(1)
            .type(AccountType.PLAYER)
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
        .andExpect(jsonPath("$.type", is(account.getType().toString())))
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
            AccountDetailsDirectMessaging.builder()
                .accountId(2)
                .firstName("Jane")
                .lastName("Smith")
                .pictureUrl("jane@example.com")
                .phone("5145551234")
                .type(AccountType.PLAYER)
                .build());

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

  @Nested
  class UpdateAccount {

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

      verify(accountService, times(1)).updateAccount(eq(accountId), any(UpdateAccountDto.class));
    }

    @Test
    public void updateAccountTest_Success() throws Exception {

      int accountId = 3;
      String requestBody = "{}";

      mockMvc
          .perform(
              MockMvcRequestBuilders.put("/api/account/{accountId}", accountId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(requestBody))
          .andExpect(status().isNoContent());

      verify(accountService, times(1)).updateAccount(eq(accountId), any(UpdateAccountDto.class));
    }
  }

  @Nested
  class UpdateAccountPicture {
    MockMultipartFile multipartFile =
        new MockMultipartFile("file", "profile.jpg", MediaType.IMAGE_JPEG_VALUE, "asdf".getBytes());

    @Test
    public void updateAccountPicture_Success() throws Exception {
      int accountId = 1;

      mockMvc
          .perform(
              MockMvcRequestBuilders.multipart(
                      HttpMethod.PUT, "/api/account/{accountId}/picture", accountId)
                  .file(multipartFile))
          .andExpect(status().isNoContent());

      verify(accountService, times(1)).updateAccountPicture(accountId, multipartFile);
    }

    @Test
    public void updateAccountPicture_AccountNotFound() throws Exception {
      int accountId = 2;

      doThrow(new AccountNotFoundException("Account not found"))
          .when(accountService)
          .updateAccountPicture(any(), any());

      mockMvc
          .perform(
              MockMvcRequestBuilders.multipart(
                      HttpMethod.PUT, "/api/account/{accountId}/picture", accountId)
                  .file(multipartFile))
          .andExpect(status().isNotFound());

      verify(accountService, times(1)).updateAccountPicture(accountId, multipartFile);
    }

    @Test
    public void updateAccountPicture_UploadFailure() throws Exception {
      int accountId = 1;

      doThrow(new IOException("File upload failed"))
          .when(accountService)
          .updateAccountPicture(any(), any());

      mockMvc
          .perform(
              MockMvcRequestBuilders.multipart(
                      HttpMethod.PUT, "/api/account/{accountId}/picture", accountId)
                  .file(multipartFile))
          .andExpect(status().isInternalServerError());

      verify(accountService, times(1)).updateAccountPicture(accountId, multipartFile);
    }
  }

  @Nested
  class UpdateAccountPermissions {

    @Test
    public void updateAccountPermissionTest_NotFound() throws Exception {
      int accountId = 2;
      UpdateAccountTypeDto dto = new UpdateAccountTypeDto("ADMIN");

      doThrow(new AccountNotFoundException("Account not found"))
          .when(accountService)
          .updateAccountRole(anyInt(), any());

      mockMvc
          .perform(
              MockMvcRequestBuilders.put("/api/account/{accountId}/type", accountId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(dto)))
          .andExpect(status().isNotFound());

      verify(accountService, times(1)).updateAccountRole(accountId, dto.getType());
    }

    @Test
    public void updateAccountPermissionTest_InvalidRequest() throws Exception {
      int accountId = 1;

      doThrow(new InvalidAccountTypeException("Invalid account type"))
          .when(accountService)
          .updateAccountRole(anyInt(), anyString());

      mockMvc
          .perform(
              MockMvcRequestBuilders.put("/api/account/{accountId}/type", accountId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{}"))
          .andExpect(status().isBadRequest());

      verify(accountService, times(0)).updateAccountRole(any(), any());
    }

    @Test
    public void updateAccountPermissionTest_InvalidAccountType() throws Exception {
      int accountId = 1;
      UpdateAccountTypeDto dto = new UpdateAccountTypeDto("NOT_ADMIN");

      doThrow(new InvalidAccountTypeException("Invalid account type"))
          .when(accountService)
          .updateAccountRole(anyInt(), anyString());

      mockMvc
          .perform(
              MockMvcRequestBuilders.put("/api/account/{accountId}/type", accountId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(dto)))
          .andExpect(status().isBadRequest());

      verify(accountService, times(1)).updateAccountRole(accountId, dto.getType());
    }

    @Test
    public void updateAccountPermissionTest_Success() throws Exception {
      int accountId = 1;
      UpdateAccountTypeDto dto = new UpdateAccountTypeDto("ADMIN");

      mockMvc
          .perform(
              MockMvcRequestBuilders.put("/api/account/{accountId}/type", accountId)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(dto)))
          .andExpect(status().isNoContent());

      verify(accountService, times(1)).updateAccountRole(accountId, dto.getType());
    }
  }

  @Nested
  class ListPermissions {

    @Test
    public void listPermissionsTest_EmptyList() throws Exception {
      // Mock data
      List<AccountPermissions> accountPermissions = List.of();

      given(accountService.getAccountPermissions()).willReturn(accountPermissions);

      mockMvc
          .perform(MockMvcRequestBuilders.get("/api/account/permissions"))
          .andExpect((status().isOk()))
          .andExpect(content().contentType(MediaType.APPLICATION_JSON))
          .andExpect(content().json("[]"));
    }

    @Test
    public void listPermissionsTest_Success() throws Exception {

      // Mock data
      AccountPermissionsTest account1 = factory.createProjection(AccountPermissionsTest.class);
      account1.setAccountId(1);
      account1.setType(AccountType.PLAYER);
      account1.setEmail("test1@example.com");
      account1.setFirstName("John");
      account1.setLastName("Doe");

      AccountPermissionsTest account2 = factory.createProjection(AccountPermissionsTest.class);
      account2.setAccountId(2);
      account2.setType(AccountType.COACH);
      account2.setEmail("test2@example.com");
      account2.setFirstName("Jane");
      account2.setLastName("Dane");
      account2.setPictureUrl("https://ui-avatars.com/api/?name=Jane+Dane");

      List<AccountPermissions> accountPermissions = List.of(account1, account2);

      given(accountService.getAccountPermissions()).willReturn(accountPermissions);

      mockMvc
          .perform(MockMvcRequestBuilders.get("/api/account/permissions"))
          .andExpect((status().isOk()))
          .andExpect(content().contentType(MediaType.APPLICATION_JSON))
          .andExpect(jsonPath("$.length()").value(2))
          .andExpectAll( // account 1
              jsonPath("$[0].accountId", is(account1.getAccountId())),
              jsonPath("$[0].email", is(account1.getEmail())),
              jsonPath("$[0].type", is(account1.getType().toString())),
              jsonPath("$[0].pictureUrl").doesNotExist())
          .andExpectAll( // account 2
              jsonPath("$[1].accountId", is(account2.getAccountId())),
              jsonPath("$[1].email", is(account2.getEmail())),
              jsonPath("$[1].type", is(account2.getType().toString())),
              jsonPath("$[1].pictureUrl", is(account2.getPictureUrl())));
    }
  }
}

interface AccountPermissionsTest extends AccountPermissions {

  void setAccountId(Integer acountId);

  void setFirstName(String firstName);

  void setLastName(String lastName);

  void setEmail(String email);

  void setPictureUrl(String pictureUrl);

  void setType(AccountType type);
}
