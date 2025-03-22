package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramParticipant;
import com.sportganise.entities.programsessions.ProgramParticipantId;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for ProgramParticipant. */
@Repository
public interface ProgramParticipantRepository
    extends JpaRepository<ProgramParticipant, ProgramParticipantId> {

  /** Find a participant who is waitlisted for a specific program. */
  @Query(
      """
      SELECT pp
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.programId = :programId
      AND pp.programParticipantId.accountId = :accountId
      AND pp.type = 'Waitlisted'
      """)
  ProgramParticipant findWaitlistParticipant(
      @Param("programId") Integer programId, @Param("accountId") Integer accountId);

  /** Find the maximum rank of unconfirmed participants in a specific program. */
  @Query(
      """
      SELECT MAX(pp.rank)
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.programId = :programId
      AND pp.isConfirmed = FALSE
      """)
  Integer findMaxRank(@Param("programId") Integer programId);

  /** Update the ranks of participants after one is confirmed. */
  @Modifying
  @Transactional
  @Query(
      """
      UPDATE ProgramParticipant pp
      SET pp.rank = pp.rank - 1
      WHERE pp.programParticipantId.programId = :programId
      AND pp.rank > :rank
      """)
  void updateRanks(@Param("programId") Integer programId, @Param("rank") Integer rank);

  /** Find all unconfirmed participants with a rank of at least 1 in a specific program. */
  @Query(
      """
      SELECT pp FROM ProgramParticipant pp
      WHERE pp.programParticipantId.programId = :programId
      AND pp.isConfirmed = FALSE
      AND pp.rank >= 1
      """)
  List<ProgramParticipant> findOptedParticipants(@Param("programId") Integer programId);

  @Query(
      """
      SELECT COUNT(pp)
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.programId = :programId
      AND pp.isConfirmed = TRUE
      """)
  int countConfirmedParticipants(@Param("programId") Integer programId);

  @Query(
      """
      SELECT pp.programParticipantId.accountId
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.programId = :programId
      AND pp.type = 'Coach'
      """)
  Integer findCoachIdByProgramId(@Param("programId") Integer programId);
}
