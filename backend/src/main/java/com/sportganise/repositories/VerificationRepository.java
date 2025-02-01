package com.sportganise.repositories;

import com.sportganise.entities.account.Verification;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository for 'Verification' Entity. Provides custom C.R.U.D. queries through the JpaRepository
 * in JPQL.
 */
@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {

  /**
   * Find a verification instance by account id and code.
   *
   * @param accountId account id
   * @param code verification code
   * @return verification instance
   */
  @Query("SELECT v FROM Verification v WHERE v.account.accountId = :accountId AND v.code = :code")
  Optional<Verification> findByAccount_AccountIdAndCode(int accountId, int code);

  /**
   * Delete all verification instances for a specific account.
   *
   * @param accountId account id
   */
  @Transactional
  @Modifying
  @Query("DELETE FROM Verification v WHERE v.account.accountId = :accountId")
  void deleteByAccount_AccountId(int accountId);
}
