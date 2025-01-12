package com.sportganise.services.auth;

import com.sportganise.entities.Verification;
import com.sportganise.repositories.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Random;
import com.sportganise.entities.Account;


import java.sql.Timestamp;
import java.util.Optional;

/**
 * Service for verification
 */
@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    /**
     * Generate a 6 digit integer
     * @return 6 digit integer
     */
    public int generateCode() {
        Random random = new Random();
        return 100000 + random.nextInt(900000);
    }

    /**
     * Calculate expiry timestamp
     * @param minutes amount of time to expiry
     * @return expiry value
     */
    public Timestamp calculateExpiryDate(int minutes) {
        return Timestamp.valueOf(LocalDateTime.now().plusMinutes(minutes));
    }

    /**
     * Create a verification instance
     * @param account user account
     * @return verification instance
     */
    public Verification createVerification(Account account) {
        int code = generateCode();
        Timestamp expiryDate = calculateExpiryDate(10);
        Verification verification = new Verification(account, code, expiryDate);
        return verificationRepository.save(verification);
    }

    /**
     * Validate given code against database
     * @param accountId account id
     * @param code verification code
     * @return verification instance
     */
    public Optional<Verification> validateCode(int accountId, int code) {
        Optional<Verification> verification = verificationRepository.findByAccount_AccountIdAndCode(accountId, code);
        if (verification.isPresent() && verification.get().getExpiryDate().after(Timestamp.valueOf(LocalDateTime.now()))) {
            return verification;
        }
        return Optional.empty();
    }

    /**
     * delete existing instance of a verification
     * @param accountId account id
     */
    public void deleteVerificationForAccount(int accountId) {
        verificationRepository.deleteByAccount_AccountId(accountId);
    }
}
