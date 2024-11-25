package com.sportganise.services.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for obtaining Auth0 Management API token.
 */
@Service
public class Auth0TokenService {

    @Value("${auth0.domain}")
    private String auth0Domain;

    @Value("${auth0.client_id}")
    private String auth0ClientId;

    @Value("${auth0.client_secret}")
    private String auth0ClientSecret;

    @Value("${auth0.audience}")
    private String auth0Audience;

    /**
     * Get Auth0 Management API token.
     * @return Auth0 Management API token.
     */
    public String getManagementApiToken() {
        RestTemplate restTemplate = new RestTemplate();

        String url = "https://" + auth0Domain + "/oauth/token";

        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("client_id", auth0ClientId);
        body.put("client_secret", auth0ClientSecret);
        body.put("audience", auth0Audience);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return (String) response.getBody().get("access_token");
    }
}
