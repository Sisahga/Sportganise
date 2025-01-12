package com.sportganise.services.auth;

import com.sportganise.dto.auth.Auth0AccountDto;
import com.sportganise.entities.Account;
import com.sportganise.exceptions.AccountNotFoundException;
import com.sportganise.repositories.AccountRepository;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/** Service for handling communication with Auth0 API. */
@Service
public class Auth0ApiService {

  @Value("${auth0.domain}")
  private String auth0Domain;

  @Value("${auth0.client-id}")
  private String auth0ClientId;

  @Value("${auth0.client-secret}")
  private String auth0ClientSecret;

  @Value("${auth0.audience}")
  private String auth0Audience;

  @Autowired private AccountRepository accountRepository;

  private final Auth0TokenService auth0TokenService;
  private final RestTemplate restTemplate = new RestTemplate();

  public Auth0ApiService(Auth0TokenService auth0TokenService) {
    this.auth0TokenService = auth0TokenService;
  }

  /** Create a user in Auth0 and return the Auth0 ID. */
  public String createUserInAuth0(Auth0AccountDto auth0AccountDto) {
    String token = auth0TokenService.getManagementApiToken();
    String url = auth0Audience + "/users";

    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + token);
    headers.add("Content-Type", "application/json");

    HttpEntity<Auth0AccountDto> request = new HttpEntity<>(auth0AccountDto, headers);

    ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
      return (String) response.getBody().get("user_id");
    } else {
      throw new RuntimeException("Failed to create user in Auth0:" + response.getBody());
    }
  }

  /** Login a user with Auth0 and return the access token. */
  public Map<String, Object> loginUserWithAuth0(Auth0AccountDto auth0AccountDto) {
    String url = "https://" + auth0Domain + "/oauth/token";

    Map<String, String> payload =
        Map.of(
            "grant_type",
            "password",
            "username",
            auth0AccountDto.getEmail(),
            "password",
            auth0AccountDto.getPassword(),
            "audience",
            auth0Audience,
            "client_id",
            auth0ClientId,
            "client_secret",
            auth0ClientSecret);

    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Type", "application/json");

    HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

    ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

    if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
      throw new RuntimeException("Invalid response from Auth0" + response.getBody());
    } else {
      return response.getBody();
    }
  }

  /** Verify a user's password with Auth0. */
  public boolean verifyPassword(Auth0AccountDto auth0AccountDto) {
    try {
      Map<String, Object> result = loginUserWithAuth0(auth0AccountDto);
      return result != null && result.containsKey("access_token");
    } catch (Exception e) {
      return false;
    }
  }

  /**
   * Method used to change password while communicating with auth0.
   *
   * @param auth0UserId user id mapped to auth0
   * @param newPassword new password to be set
   * @return response message
   */
  public Map<String, Object> changePassword(String auth0UserId, String newPassword) {
    String token = auth0TokenService.getManagementApiToken();
    String url = "https://" + auth0Domain + "/api/v2/users/" + auth0UserId;

    Map<String, String> payload = Map.of("password", newPassword);

    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Type", "application/json");
    headers.add("Authorization", "Bearer " + token);

    HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

    RestTemplate restTemplate = new RestTemplate(new JdkClientHttpRequestFactory());

    try {
      ResponseEntity<Map> response =
          restTemplate.exchange(url, HttpMethod.PATCH, request, Map.class);

      if (response.getStatusCode().is2xxSuccessful()) {
        return Map.of("message", "Password updated successfully", "user", response.getBody());
      } else {
        throw new RuntimeException("Error updating password: " + response.getBody());
      }
    } catch (HttpClientErrorException e) {
      throw new RuntimeException("Error making PATCH request: " + e.getMessage(), e);
    }
  }

  /**
   * Method used to change password given checks and account access.
   *
   * @param auth0AccountDto account details
   * @param newPassword new password to be set
   * @return response message
   */
  public Map<String, Object> changePasswordWithOldPassword(
      Auth0AccountDto auth0AccountDto, String newPassword) throws AccountNotFoundException {
    boolean isOldPasswordCorrect = verifyPassword(auth0AccountDto);

    if (!isOldPasswordCorrect) {
      throw new RuntimeException("Old password is incorrect.");
    }

    Account account =
    accountRepository
        .findByEmail(auth0AccountDto.getEmail())
        .orElseThrow(() -> new RuntimeException("Account not found"));


    String auth0UserId = account.getAuth0Id();

    return changePassword(auth0UserId, newPassword);
  }
}
