package com.sportganise.services.account.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.Verification;
import com.sportganise.exceptions.InvalidCodeException;
import com.sportganise.repositories.VerificationRepository;
import java.lang.reflect.Method;
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
  public void generateCode_shouldReturnSixDigitNumber() throws Exception {
    Method method = VerificationService.class.getDeclaredMethod("generateCode");
    method.setAccessible(true);
    Object result = method.invoke(verificationService);
    assertTrue(
        (Integer) result >= 100000 && (Integer) result <= 999999,
        "Code should be a 6-digit number.");
  }

  @Test
  public void calculateExpiryDate_shouldReturnCorrectExpiryTime() throws Exception {
    Method method = VerificationService.class.getDeclaredMethod("calculateExpiryDate", int.class);
    method.setAccessible(true);

    Timestamp expectedExpiryDate =
        Timestamp.valueOf(LocalDateTime.now().plusMinutes(10).minusSeconds(2));
    Object result = method.invoke(verificationService, 10);
    Timestamp expiryDate = (Timestamp) result;

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
  public void validateCode_shouldThrowInvalidCodeException() {
    int accountId = 1;
    int invalidCode = 999999;

    when(mockVerificationRepository.findByAccount_AccountIdAndCode(accountId, invalidCode))
        .thenReturn(Optional.empty());

    assertThrows(
        InvalidCodeException.class,
        () -> {
          verificationService.validateCode(accountId, invalidCode);
        },
        "InvalidCodeException should be thrown for invalid code.");
  }
}
