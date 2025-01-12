package com.sportganise.services.auth;

import com.sportganise.dto.auth.Auth0AccountDto;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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
}
