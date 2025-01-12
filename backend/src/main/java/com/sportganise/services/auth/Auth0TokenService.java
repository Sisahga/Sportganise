package com.sportganise.services.auth;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/** Service for obtaining Auth0 Management API token. */
@Service
public class Auth0TokenService {

  @Value("${auth0.domain}")
  private String auth0Domain;

  @Value("${auth0.clientid}")
  private String auth0ClientId;

  @Value("${auth0.client-secret}")
  private String auth0ClientSecret;

  @Value("${auth0.audience}")
  private String auth0Audience;

  /**
   * Get Auth0 Management API token.
   *
   * @return Auth0 Management API token.
   */
  public String getManagementApiToken() {
    Map<String, String> body = new HashMap<>();
    body.put("grant_type", "client_credentials");
    body.put("client_id", auth0ClientId);
    body.put("client_secret", auth0ClientSecret);
    body.put("audience", auth0Audience);

    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Type", "application/json");

    String url = "https://" + auth0Domain + "/oauth/token";
    RestTemplate restTemplate = new RestTemplate();
    HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
    ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

    return (String) response.getBody().get("access_token");
  }
}
