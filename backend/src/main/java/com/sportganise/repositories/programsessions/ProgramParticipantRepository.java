package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramParticipant;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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

        // @Modifying
        // @Transactional
        // @Query("INSERT INTO ProgramParticipant (program_id, account_id, type,
        // is_confirmed, confirm_date) " +
        // "VALUES (:programId, :accountId, :type, :isConfirmed, :confirmDate)")
        // int addParticipant(
        // @Param("programId") Integer programId,
        // @Param("accountId") Integer accountId,
        // @Param("type") String type,
        // @Param("isConfirmed") Boolean isConfirmed,
        // @Param("confirmDate") LocalDateTime confirmDate);

        // @Modifying
        // @Transactional
        // @Query("UPDATE ProgramParticipant pp SET pp.isConfirmed = :isConfirmed,
        // pp.confirmedDate = :confirmedDate " +
        // "WHERE pp.programId = :programId AND pp.accountId = :accountId")
        // int updateConfirmationStatus(
        // @Param("programId") Integer programId,
        // @Param("accountId") Integer accountId,
        // @Param("isConfirmed") Boolean isConfirmed,
        // @Param("confirmedDate") LocalDateTime confirmedDate);

        // @Modifying
        // @Transactional
        // @Query("DELETE FROM ProgramParticipant pp WHERE pp.id.programId = :programId
        // AND pp.id.accountId = :accountId")
        // void deleteProgramParticipant(
        // @Param("programId") Integer programId,
        // @Param("accountId") Integer accountId
        // );

        // Maybe unneeded
        // @Query("SELECT a FROM Account a "
        // + "JOIN ProgramParticipant pp ON pp.account.accountId = a.accountId "
        // + "JOIN Program p ON pp.program.programId = p.programId "
        // + "WHERE p.programId = :sessionId AND pp.isConfirmed = FALSE")
        // List<ProgramParticipant> findOptedInParticipants(@Param("sessionId") Integer
        // sessionId);

        @Query("SELECT pp FROM ProgramParticipant pp " +
                        "JOIN FETCH pp.programParticipantId ppi " +
                        "JOIN FETCH pp.participantType pt " +
                        "WHERE ppi.programId = :programId AND ppi.accountId = :accountId")
        ProgramParticipant findParticipant(
                        @Param("programId") Integer programId,
                        @Param("accountId") Integer accountId);

        @Query("SELECT MAX(pp.rank) " +
                        "FROM ProgramParticipant pp " +
                        "WHERE pp.programParticipantId.programId = :programId " +
                        "AND pp.isConfirmed = FALSE")
        Integer findMaxRank(@Param("programId") Integer programId);

}
