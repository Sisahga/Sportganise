package com.sportganise.services.account.auth;

import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.Verification;
import com.sportganise.exceptions.ExpiredCodeException;
import com.sportganise.exceptions.InvalidCodeException;
import com.sportganise.repositories.VerificationRepository;
import com.sportganise.services.account.AccountService;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service for handling verification codes. */
@Service
public class VerificationService {

  @Autowired private VerificationRepository verificationRepository;
  @Autowired private AccountService accountService;

  /**
   * Generate a 6 digit integer.
   *
   * @return 6 digit integer
   */
  private int generateCode() {
    Random random = new Random();
    return 100000 + random.nextInt(900000);
  }

  /**
   * Calculate expiry timestamp.
   *
   * @param minutes amount of time to expiry
   * @return expiry value
   */
  private Timestamp calculateExpiryDate(int minutes) {
    return Timestamp.valueOf(LocalDateTime.now().plusMinutes(minutes));
  }

  /**
   * Create a verification instance.
   *
   * @param account user account
   * @return verification instance
   */
  public Verification createVerification(Account account) {
    this.deleteVerificationForAccount(account.getAccountId());
    int code = generateCode();
    Timestamp expiryDate = calculateExpiryDate(10);
    Verification verification = new Verification(account, code, expiryDate);
    return verificationRepository.save(verification);
  }

  /**
   * Validate given code against database.
   *
   * @param accountId account id
   * @param code verification code
   */
  public void validateCode(int accountId, int code) {
    Optional<Verification> verification =
        verificationRepository.findByAccount_AccountIdAndCode(accountId, code);
    if (verification.isEmpty()) {
      throw new InvalidCodeException("Invalid Token");
    } else if (verification
        .get()
        .getExpiryDateTime()
        .before(Timestamp.valueOf(LocalDateTime.now()))) {
      throw new ExpiredCodeException("Expired Token");
    }
    accountService.updateAccountVerificationStatus(accountId);
    this.deleteVerificationForAccount(accountId);
  }

  /**
   * delete existing instance of a verification.
   *
   * @param accountId account id
   */
  public void deleteVerificationForAccount(int accountId) {
    verificationRepository.deleteByAccount_AccountId(accountId);
  }
}
