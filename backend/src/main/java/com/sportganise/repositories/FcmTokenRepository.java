package com.sportganise.repositories;

import com.sportganise.entities.FcmToken;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for FcmToken entity.
 */
@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {
  @Query("""
        SELECT token
        FROM FcmToken
        WHERE accountId = :accountId
        """)
  List<String> findTokensByAccountId(@NotNull Integer accountId);
}
