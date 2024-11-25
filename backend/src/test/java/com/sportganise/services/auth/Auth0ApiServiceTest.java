package com.sportganise.services.auth;

import com.sportganise.dto.auth.Auth0AccountDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class Auth0ApiServiceTest {

    @Spy
    @InjectMocks
    private Auth0ApiService auth0ApiService;

    private Auth0AccountDTO auth0AccountDTO;

    @BeforeEach
    public void setup() {
        auth0AccountDTO = new Auth0AccountDTO("userx@example.com", "password!123", "Username-Password-Authentication");
        ReflectionTestUtils.setField(auth0ApiService, "auth0Domain", "placeholder.com");
        ReflectionTestUtils.setField(auth0ApiService, "auth0ClientId", "placeholderClientId");
        ReflectionTestUtils.setField(auth0ApiService, "auth0ClientSecret", "placeholderClientSecret");
        ReflectionTestUtils.setField(auth0ApiService, "auth0Audience", "https://placeholder.com/api/v2");
    }

    @Test
    public void createUserInAuth0_shouldReturnAuth0Id() {
        String auth0Id = "mockAuth0Id";
        doReturn(auth0Id).when(auth0ApiService).createUserInAuth0(any(Auth0AccountDTO.class));

        String result = auth0ApiService.createUserInAuth0(auth0AccountDTO);
        assertEquals(auth0Id, result);
    }

    @Test
    public void loginUserWithAuth0_shouldReturnAccessToken() {
        Map<String, Object> responseMap = Map.of("access_token", "mockAccessToken");
        doReturn(responseMap).when(auth0ApiService).loginUserWithAuth0(any(Auth0AccountDTO.class));

        Map<String, Object> result = auth0ApiService.loginUserWithAuth0(auth0AccountDTO);
        assertEquals("mockAccessToken", result.get("access_token"));
    }

    @Test
    public void verifyPassword_shouldCallLoginUserWithAuth0() {
        auth0ApiService.verifyPassword(auth0AccountDTO);

        verify(auth0ApiService).loginUserWithAuth0(auth0AccountDTO);
    }
}