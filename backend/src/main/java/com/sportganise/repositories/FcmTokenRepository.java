package com.sportganise.repositories;

import com.sportganise.entities.FcmToken;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository interface for FcmToken entity. */
@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {
  @Query(
      """
        SELECT token
        FROM FcmToken
        WHERE accountId = :ids
        """)
  List<String> findTokensByAccountId(@Param("ids") List<Integer> ids);
}
