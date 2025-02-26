package com.sportganise.repositories;

import com.sportganise.entities.FcmToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for FcmToken entity.
 */
@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {
}
