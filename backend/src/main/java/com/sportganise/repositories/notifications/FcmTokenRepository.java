package com.sportganise.repositories.notifications;

import com.sportganise.entities.notifications.FcmToken;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository interface for FcmToken entity. */
@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {
  @Query("""
        SELECT token
        FROM FcmToken
        WHERE accountId IN :ids
        """)
  List<String> findTokensByAccountId(@Param("ids") List<Integer> ids);

  @Modifying
  @Query("DELETE FROM FcmToken WHERE token = :token")
  void deleteFcmToken(String token);
}
