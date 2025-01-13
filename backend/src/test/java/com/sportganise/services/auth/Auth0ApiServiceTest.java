package com.sportganise.services.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.repositories.AccountRepository;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class Auth0ApiServiceTest {

  @Spy @InjectMocks private Auth0ApiService auth0ApiService;

  @Mock private AccountService accountService;
  private Auth0AccountDto auth0AccountDto;

  @Mock private AccountRepository accountRepository;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
    auth0AccountDto =
        new Auth0AccountDto(
            "userx@example.com", "password!123", "Username-Password-Authentication");

    ReflectionTestUtils.setField(auth0ApiService, "auth0Domain", "placeholder.com");
    ReflectionTestUtils.setField(auth0ApiService, "auth0ClientId", "placeholderClientId");
    ReflectionTestUtils.setField(auth0ApiService, "auth0ClientSecret", "placeholderClientSecret");
    ReflectionTestUtils.setField(
        auth0ApiService, "auth0Audience", "https://placeholder.com/api/v2");
  }

  @Test
  public void createUserInAuth0_shouldReturnAuth0Id() {
    String auth0Id = "mockAuth0Id";
    doReturn(auth0Id).when(auth0ApiService).createUserInAuth0(any(Auth0AccountDto.class));

    String result = auth0ApiService.createUserInAuth0(auth0AccountDto);
    assertEquals(auth0Id, result);
  }

  @Test
  public void loginUserWithAuth0_shouldReturnAccessToken() {
    Map<String, Object> responseMap = Map.of("access_token", "mockAccessToken");
    doReturn(responseMap).when(auth0ApiService).loginUserWithAuth0(any(Auth0AccountDto.class));

    Map<String, Object> result = auth0ApiService.loginUserWithAuth0(auth0AccountDto);
    assertEquals("mockAccessToken", result.get("access_token"));
  }

  @Test
  public void verifyPassword_shouldCallLoginUserWithAuth0() {
    auth0ApiService.verifyPassword(auth0AccountDto);

    verify(auth0ApiService).loginUserWithAuth0(auth0AccountDto);
  }

  @Test
  public void changePassword_shouldReturnSuccessMessage() {
    Map<String, Object> mockResponse =
        Map.of("message", "Password updated successfully", "user", "mockUserDetails");

    doReturn(mockResponse).when(auth0ApiService).changePassword(anyString(), anyString());

    Map<String, Object> result = auth0ApiService.changePassword("someId", "newPassword!123");

    assertEquals("Password updated successfully", result.get("message"));
    assertEquals("mockUserDetails", result.get("user"));
  }

  @Test
  public void changePasswordWithOldPassword_shouldCallChangePassword()
      throws AccountNotFoundException {
    String newPassword = "newPassword!123";
    Account mockAccount = mock(Account.class);

    when(accountRepository.findByEmail(anyString())).thenReturn(Optional.of(mockAccount));
    when(mockAccount.getAuth0Id()).thenReturn("mockAuth0Id");

    doReturn(true).when(auth0ApiService).verifyPassword(eq(auth0AccountDto)); // Use eq() here
    doReturn(Map.of("message", "Password updated successfully", "user", "mockUserDetails"))
        .when(auth0ApiService)
        .changePassword(anyString(), anyString()); // Stub changePassword

    auth0ApiService.changePasswordWithOldPassword(auth0AccountDto, newPassword);

    verify(auth0ApiService, times(1))
        .changePassword(eq("mockAuth0Id"), eq(newPassword)); // Use eq() for both args
  }
}
