package com.sportganise.services.account.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.Verification;
import com.sportganise.repositories.VerificationRepository;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class) // Automatically initializes mocks
public class VerificationServiceTest {

  @InjectMocks
  private VerificationService verificationService; // Automatically injects the mock repository

  @Mock private VerificationRepository mockVerificationRepository;

  @Test
  public void generateCode_shouldReturnSixDigitNumber() {
    int code = verificationService.generateCode();
    assertTrue(code >= 100000 && code <= 999999, "Code should be a 6-digit number.");
  }

  @Test
  public void calculateExpiryDate_shouldReturnCorrectExpiryTime() {
    Timestamp expectedExpiryDate =
        Timestamp.valueOf(LocalDateTime.now().plusMinutes(10).minusSeconds(2));
    Timestamp expiryDate = verificationService.calculateExpiryDate(10);

    assertTrue(expiryDate.after(expectedExpiryDate), "Expiry date should be after current time.");
    assertTrue(
        expiryDate.before(Timestamp.valueOf(LocalDateTime.now().plusMinutes(10).plusSeconds(2))),
        "Expiry date should be within a reasonable range.");
  }

  @Test
  public void createVerification_shouldSaveVerification() {
    Account mockAccount = new Account();
    Verification mockVerification =
        new Verification(
            mockAccount, 123456, Timestamp.valueOf(LocalDateTime.now().plusMinutes(10)));

    when(mockVerificationRepository.save(any(Verification.class))).thenReturn(mockVerification);

    Verification verification = verificationService.createVerification(mockAccount);

    assertNotNull(verification, "Verification should not be null.");
    verify(mockVerificationRepository, times(1))
        .save(any(Verification.class)); // Ensure save is called once
  }

  @Test
  public void validateCode_shouldReturnEmptyWhenInvalidCode() {
    int accountId = 1;
    int invalidCode = 999999;

    when(mockVerificationRepository.findByAccount_AccountIdAndCode(accountId, invalidCode))
        .thenReturn(Optional.empty());

    Optional<Verification> verification = verificationService.validateCode(accountId, invalidCode);

    assertFalse(verification.isPresent(), "Verification should be empty for invalid code.");
  }
}
