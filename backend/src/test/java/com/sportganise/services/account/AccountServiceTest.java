package com.sportganise.services.account;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

import com.sportganise.dto.account.AccountDetailsDirectMessaging;
import com.sportganise.dto.account.AccountPermissions;
import com.sportganise.dto.account.UpdateAccountDto;
import com.sportganise.dto.account.auth.AccountDto;
import com.sportganise.dto.account.auth.Auth0AccountDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import com.sportganise.exceptions.*;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.auth.Auth0ApiService;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

  @Mock private AccountRepository accountRepository;

  @Mock private Auth0ApiService auth0ApiService;
  @Mock private BlobService blobService;

  @InjectMocks private AccountService accountService;

  private ProjectionFactory factory = new SpelAwareProxyProjectionFactory();

  private AccountDto accountDto;
  private Auth0AccountDto auth0AccountDto;

  @Nested
  class AuthTests {

    @BeforeEach
    public void setup() {
      accountDto = new AccountDto();
      accountDto.setEmail("userx@example.com");
      accountDto.setPassword("password!123");
      accountDto.setFirstName("John");
      accountDto.setLastName("Doe");
      accountDto.setPhone("555-555-5555");
      accountDto.setAddress(
          Address.builder()
              .line("123 Something St")
              .city("Montreal")
              .province("Quebec")
              .country("Canada")
              .postalCode("H1I 2J3")
              .build());
      accountDto.setType(AccountType.PLAYER);

      auth0AccountDto = new Auth0AccountDto("userx@example.com", "password!123", null);
    }

    @Test
    public void authenticateAccount_shouldReturnTrue() {

      Account mockAccount = mock(Account.class);
      mockAccount.setEmail(auth0AccountDto.getEmail());

      given(mockAccount.getVerified()).willReturn(true);
      given(auth0ApiService.verifyPassword(any(Auth0AccountDto.class))).willReturn(true);
      given(accountRepository.findByEmail(anyString())).willReturn(Optional.of(mockAccount));

      boolean isAuthenticated = accountService.authenticateAccount(auth0AccountDto);
      assertTrue(isAuthenticated);

      verify(auth0ApiService, times(1)).verifyPassword(any(Auth0AccountDto.class));
    }

    @Test
    public void
        authenticateAccount_shouldReturnInvalidCredentialsException_whenAuthenticationFails() {

      InvalidCredentialsException thrown =
          assertThrows(
              InvalidCredentialsException.class,
              () -> accountService.authenticateAccount(auth0AccountDto));
      assertEquals("Invalid Credentials", thrown.getMessage());
    }

    @Test
    public void createAccount_shouldThrowException() {
      given(accountRepository.save(any(Account.class)))
          .willThrow(new RuntimeException("Internal server error"));

      Exception exception =
          assertThrows(
              RuntimeException.class,
              () -> {
                accountService.createAccount(accountDto);
              });

      assertEquals("Internal server error", exception.getMessage());

      verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    public void createAccount_shouldReturnAuth0Id()
        throws AccountAlreadyExistsInAuth0, PasswordTooWeakException {
      Account account = new Account();
      account.setAuth0Id("auth0Id");
      given(accountRepository.save(any(Account.class))).willReturn(account);
      given(auth0ApiService.createUserInAuth0(any(Auth0AccountDto.class))).willReturn("auth0Id");

      String auth0Id = accountService.createAccount(accountDto);
      assertEquals("auth0Id", auth0Id);

      verify(accountRepository, times(1)).save(any(Account.class));
    }
  }

  @Nested
  class UpdateAccount {
    int notAccountId;
    Account originalAccount;
    MockMultipartFile file =
        new MockMultipartFile("file", "profile.jpg", MediaType.IMAGE_JPEG_VALUE, "".getBytes());

    @BeforeEach
    public void setup() {
      notAccountId = 2;
      originalAccount =
          Account.builder()
              .accountId(1)
              .type(AccountType.PLAYER)
              .email("john@email.com")
              .auth0Id("auth0|6743f6a0f0ab0e76ba3d7ceb")
              .phone("1231231234")
              .firstName("John")
              .lastName("Doe")
              .build();
    }

    @Test
    public void updateAccountTest_SuccessFullUpdate() throws AccountNotFoundException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount =
          UpdateAccountDto.builder()
              .firstName("John")
              .lastName("Doe")
              .email("john@email.com")
              .phone("1231231234")
              .address(
                  Address.builder()
                      .line("123 nowhere")
                      .city("laval")
                      .province("Manitoba")
                      .country("Canada")
                      .postalCode("H1H 2H2")
                      .build())
              .build();

      accountService.updateAccount(accountId, newAccount);

      originalAccount.setFirstName("John2");
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_SuccessPartialUpdate() throws AccountNotFoundException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount = new UpdateAccountDto();
      newAccount.setFirstName("John2");

      accountService.updateAccount(accountId, newAccount);

      originalAccount.setFirstName("John2");
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_SuccessNoUpdate() throws AccountNotFoundException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(accountId)).willReturn(Optional.of(originalAccount));

      UpdateAccountDto newAccount = new UpdateAccountDto();

      accountService.updateAccount(accountId, newAccount);

      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountTest_NotFound() {
      given(accountRepository.findById(anyInt())).willReturn(Optional.empty());

      UpdateAccountDto newAccount =
          UpdateAccountDto.builder()
              .firstName("John")
              .lastName("Doe")
              .email("john@email.com")
              .phone("1231231234")
              .build();

      assertThrows(
          AccountNotFoundException.class,
          () -> accountService.updateAccount(notAccountId, newAccount));

      verify(accountRepository, times(1)).findById(notAccountId);
      verify(accountRepository, times(0)).save(any());
    }

    @Test
    public void updateAccountTypeTest_NotFound() {
      given(accountRepository.findById(anyInt())).willReturn(Optional.empty());

      String newType = "PLAYER";

      assertThrows(
          AccountNotFoundException.class,
          () -> accountService.updateAccountRole(notAccountId, newType));

      verify(accountRepository, times(1)).findById(notAccountId);
      verify(accountRepository, times(0)).save(any());
    }

    @Test
    public void updateAccountTypeTest_InvalidType() {
      int accountId = originalAccount.getAccountId();
      String invalidType = "NOT_ADMIN";

      assertThrows(
          InvalidAccountTypeException.class,
          () -> accountService.updateAccountRole(accountId, invalidType));

      verify(accountRepository, times(0)).findById(any());
      verify(accountRepository, times(0)).save(any());
    }

    @Test
    public void updateAccountTypeTest_Success()
        throws AccountNotFoundException, InvalidAccountTypeException {
      int accountId = originalAccount.getAccountId();
      AccountType newType = AccountType.ADMIN;
      given(accountRepository.findById(anyInt())).willReturn(Optional.of(originalAccount));

      originalAccount.setType(newType);
      accountService.updateAccountRole(accountId, newType.toString());

      verify(accountRepository, times(1)).findById(accountId);
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountPicture_Success() throws AccountNotFoundException, IOException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(anyInt())).willReturn(Optional.of(originalAccount));

      accountService.updateAccountPicture(accountId, file);

      verify(accountRepository, times(1)).findById(accountId);
      verify(accountRepository, times(1)).save(originalAccount);
    }

    @Test
    public void updateAccountPicture_NotFound() throws AccountNotFoundException, IOException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(anyInt())).willReturn(Optional.empty());

      assertThrows(
          AccountNotFoundException.class,
          () -> accountService.updateAccountPicture(accountId, file));

      verify(accountRepository, times(1)).findById(accountId);
      verify(accountRepository, times(0)).save(any());
    }

    @Test
    public void updateAccountPicture_UploadFailed() throws AccountNotFoundException, IOException {
      int accountId = originalAccount.getAccountId();
      given(accountRepository.findById(anyInt())).willReturn(Optional.of(originalAccount));
      doThrow(new IOException("Failed to upload file")).when(blobService).uploadFile(any(), any());

      assertThrows(IOException.class, () -> accountService.updateAccountPicture(accountId, file));

      verify(accountRepository, times(1)).findById(accountId);
      verify(accountRepository, times(0)).save(any());
    }
  }

  @Test
  public void resetPassword_shouldReturnSuccessMessage() throws AccountNotFoundException {
    String email = "userx@example.com";
    String newPassword = "newPassword!123";
    Account mockAccount = new Account();
    mockAccount.setAuth0Id("mockAuth0Id");

    given(accountRepository.findByEmail(email)).willReturn(java.util.Optional.of(mockAccount));
    given(auth0ApiService.changePassword(anyString(), anyString()))
        .willReturn(Map.of("message", "Password updated successfully", "user", "mockUserDetails"));

    Map<String, Object> result = accountService.resetPassword(email, newPassword);

    assertEquals("Password updated successfully", result.get("message"));
    assertEquals("mockUserDetails", result.get("user"));

    verify(auth0ApiService, times(1)).changePassword("mockAuth0Id", newPassword);
    verify(accountRepository, times(1)).findByEmail(email);
  }

  @Test
  public void resetPassword_shouldThrowExceptionWhenAccountNotFound() {
    String email = "userx@example.com";
    String newPassword = "newPassword!123";

    given(accountRepository.findByEmail(email)).willReturn(java.util.Optional.empty());

    Exception exception =
        assertThrows(
            AccountNotFoundException.class, () -> accountService.resetPassword(email, newPassword));

    assertEquals("Account not found", exception.getMessage());

    verify(accountRepository, times(1)).findByEmail(email);
  }

  @Test
  public void modifyPassword_shouldReturnSuccessMessage() throws AccountNotFoundException {
    String email = "userx@example.com";
    String oldPassword = "oldPassword!123";
    String newPassword = "newPassword!123";
    Account mockAccount = new Account();
    mockAccount.setAuth0Id("mockAuth0Id");

    given(auth0ApiService.changePasswordWithOldPassword(any(Auth0AccountDto.class), anyString()))
        .willReturn(Map.of("message", "Password updated successfully", "user", "mockUserDetails"));

    Map<String, Object> result = accountService.modifyPassword(email, oldPassword, newPassword);

    assertEquals("Password updated successfully", result.get("message"));
    assertEquals("mockUserDetails", result.get("user"));

    verify(auth0ApiService, times(1))
        .changePasswordWithOldPassword(any(Auth0AccountDto.class), eq(newPassword));
  }

  @Test
  public void getAllNonAdminAccountsByOrganizationId_shouldReturnAccounts() {
    int organizationId = 1;

    // Prepare mock data
    List<AccountDetailsDirectMessaging> mockAccounts =
        List.of(
            AccountDetailsDirectMessaging.builder()
                .accountId(2)
                .firstName("Jane")
                .lastName("Smith")
                .pictureUrl("user2@example.com")
                .phone("555-5555")
                .type(AccountType.PLAYER)
                .build());

    // Mock the repository call
    given(accountRepository.getAllNonBlockedAccountsByOrganization(organizationId, 1))
        .willReturn(mockAccounts);

    // Call the service method
    List<AccountDetailsDirectMessaging> result =
        accountService.getAllNonBlockedAccountsByOrganizationId(organizationId, 1);

    // Assertions
    assertNotNull(result);
    assertEquals(1, result.size()); // Verify that the returned list has the correct size
    assertEquals("Jane", result.getFirst().getFirstName()); // Check second account data

    // Verify that the repository was called exactly once
    verify(accountRepository, times(1)).getAllNonBlockedAccountsByOrganization(organizationId, 1);
  }

  @Test
  public void getAllNonBlockedAccountsByOrganizationId_shouldReturnEmptyList_whenNoAccounts() {
    int organizationId = 1;

    // Mock the repository to return an empty list
    given(accountRepository.getAllNonBlockedAccountsByOrganization(organizationId, 1))
        .willReturn(List.of());

    // Call the service method
    List<AccountDetailsDirectMessaging> result =
        accountService.getAllNonBlockedAccountsByOrganizationId(organizationId, 1);

    // Assertions
    assertNotNull(result);
    assertTrue(result.isEmpty(), "The result should be an empty list");

    // Verify that the repository was called exactly once
    verify(accountRepository, times(1)).getAllNonBlockedAccountsByOrganization(organizationId, 1);
  }

  @Nested
  class GetAllAccountPermissions {

    @Test
    public void getAllAccountPermissions_NoAccount() {
      given(accountRepository.findAccountPermissions()).willReturn(List.of());

      // Call the service method
      List<AccountPermissions> result = accountService.getAccountPermissions();

      // Assertions
      assertTrue(result.isEmpty(), "The result should be an empty list");
      verify(accountRepository, times(1)).findAccountPermissions();
    }

    @Test
    public void getAllAccountPermissions_FewAccounts() {
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

      given(accountRepository.findAccountPermissions()).willReturn(accountPermissions);

      // Call the service method
      List<AccountPermissions> result = accountService.getAccountPermissions();

      // Assertions
      assertEquals(result.size(), 2);
      assertEquals(result.get(0).getEmail(), account1.getEmail());
      assertEquals(result.get(0).getPictureUrl(), account1.getPictureUrl());
      assertEquals(result.get(0).getType(), account1.getType());
      assertEquals(result.get(1).getEmail(), account2.getEmail());
      assertEquals(result.get(1).getPictureUrl(), account2.getPictureUrl());
      assertEquals(result.get(1).getType(), account2.getType());
      verify(accountRepository, times(1)).findAccountPermissions();
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
