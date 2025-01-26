package com.sportganise.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.sportganise.dto.account.CookiesDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import jakarta.annotation.PostConstruct;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * UserAuthProvider class.
 */
@RequiredArgsConstructor
@Component
@Slf4j
public class UserAuthProvider {

  private final AccountService accountService;

  @Value("${security.jwt.token.secret-key}")
  private String secretKey;

  /** Avoids storing the secret key in plain text in the JVM. */
  @PostConstruct
  protected void init() {
    secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
  }

  /**
   * Creates a JWT token with the users email.
   *
   * @param login the user's email
   * @return the JWT token
   */
  public String createToken(String login) {
    log.debug("Creating token for login: {}", login);

    Date now = new Date();
    Date validity = new Date(now.getTime() + 3_600_000);

    return JWT.create()
        .withSubject(login)
        .withIssuer("sportganise")
        .withIssuedAt(now)
        .withExpiresAt(validity)
        .sign(Algorithm.HMAC256(secretKey));
  }

  /**
   * Validates the JWT token.
   *
   * @param token the JWT token.
   * @return the authentication object.
   */
  public Authentication validateToken(String token) {
    Algorithm algorithm = Algorithm.HMAC256(secretKey);
    JWTVerifier verifier = JWT.require(algorithm).build();
    DecodedJWT jwt = verifier.verify(token);

    log.debug("JWT: {}", jwt);
    log.debug("Subject: {}", jwt.getSubject());

    Account account = accountService.getAccountByEmail(jwt.getSubject());
    CookiesDto user =
        CookiesDto.builder()
            .accountId(account.getAccountId())
            .firstName(account.getFirstName())
            .lastName(account.getLastName())
            .email(account.getEmail())
            .pictureUrl(account.getPictureUrl())
            .type(account.getType())
            .phone(account.getPhone())
            .organisationIds(accountService.getOrganizationIdsByAccountId(account.getAccountId()))
            .build();

    return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
  }
}
