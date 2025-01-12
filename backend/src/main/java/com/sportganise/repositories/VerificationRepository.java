package com.sportganise.repositories;

import com.sportganise.entities.Verification;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {

  @Query("SELECT v FROM Verification v WHERE v.account.accountId = :accountId AND v.code = :code")
  Optional<Verification> findByAccount_AccountIdAndCode(int accountId, int code);

  @Modifying
  @Query("DELETE FROM Verification v WHERE v.account.accountId = :accountId")
  void deleteByAccount_AccountId(int accountId);
}
