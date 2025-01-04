package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramParticipant;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Program.
 */
@Repository // Indicates that this is a Spring Data repository
public interface ProgramParticipantRepository extends JpaRepository<ProgramParticipant, Integer> {
    @Modifying
    @Transactional
    @Query("INSERT INTO ProgramParticipant (program_id, account_id, type, is_confirmed, confirm_date) " +
       "VALUES (:programId, :accountId, :type, :isConfirmed, :confirmDate)")
    int addParticipant(
        @Param("programId") Integer programId,
        @Param("accountId") Integer accountId,
        @Param("type") String type,
        @Param("isConfirmed") Boolean isConfirmed,
        @Param("confirmDate") LocalDateTime confirmDate
    );

}
