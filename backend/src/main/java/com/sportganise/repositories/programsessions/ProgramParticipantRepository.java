package com.sportganise.repositories.programsessions;

import com.sportganise.dto.programsessions.DetailedProgramParticipantDto;
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
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.programParticipantId.accountId = :accountId
      AND pp.type = 'Waitlisted'
      """)
  ProgramParticipant findWaitlistParticipant(
      @Param("recurrenceId") Integer recurrenceId, @Param("accountId") Integer accountId);

  /** Find a participant for a specific program. */
  @Query(
      """
      SELECT pp
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.programParticipantId.accountId = :accountId
      """)
  ProgramParticipant findParticipant(
      @Param("recurrenceId") Integer recurrenceId, @Param("accountId") Integer accountId);

  /** Find the maximum rank of unconfirmed participants in a specific program. */
  @Query(
      """
      SELECT MAX(pp.rank)
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.isConfirmed = FALSE
      """)
  Integer findMaxRank(@Param("recurrenceId") Integer recurrenceId);

  /** Update the ranks of participants after one is confirmed. */
  @Modifying
  @Transactional
  @Query(
      """
      UPDATE ProgramParticipant pp
      SET pp.rank = pp.rank - 1
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.rank > :rank
      """)
  void updateRanks(@Param("recurrenceId") Integer recurrenceId, @Param("rank") Integer rank);

  /** Find all unconfirmed participants with a rank of at least 1 in a specific program. */
  @Query(
      """
      SELECT pp FROM ProgramParticipant pp
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.isConfirmed = FALSE
      AND pp.rank >= 1
      """)
  List<ProgramParticipant> findOptedParticipants(@Param("recurrenceId") Integer recurrenceId);

  @Query(
      """
      SELECT COUNT(pp)
      FROM ProgramParticipant pp
      WHERE pp.programParticipantId.recurrenceId = :recurrenceId
      AND pp.isConfirmed = TRUE
      """)
  int countConfirmedParticipants(@Param("recurrenceId") Integer recurrenceId);

  /**
   * Finds all ProgramParticipant entities for a given account ID.
   *
   * @param accountId the account ID to search by.
   * @return a list of ProgramParticipant entities associated with the given account.
   */
  @Query(
      "SELECT pp FROM ProgramParticipant pp WHERE pp.programParticipantId.accountId = :accountId")
  List<ProgramParticipant> findByAccountId(@Param("accountId") Integer accountId);

  @Query(
      """
              SELECT p.programParticipantId.accountId
              FROM ProgramParticipant p
              WHERE p.programParticipantId.recurrenceId = :recurrenceId
              AND LOWER(p.type) = LOWER('COACH')
              """)
  List<Integer> findProgramCoachIds(Integer recurrenceId);

  /**
   * Fetches detailed information about program participants, including useful account details.
   *
   * @param programId the ID of the program for which to fetch participants.
   * @return a list of DetailedProgramParticipantDto objects containing participant details.
   */
  @Query(
      """
        SELECT new com.sportganise.dto.programsessions.DetailedProgramParticipantDto(
          pp.programParticipantId.accountId,
          pp.programParticipantId.recurrenceId,
          pp.rank,
          pp.type,
          pp.isConfirmed,
          pp.confirmedDate,
          a.firstName,
          a.lastName,
          a.address,
          a.phone,
          a.email,
          a.pictureUrl,
          a.type
        )
        FROM ProgramParticipant pp
        JOIN Account a ON pp.programParticipantId.accountId = a.accountId
        WHERE pp.programParticipantId.recurrenceId = :programId
        """)
  List<DetailedProgramParticipantDto> fetchProgramParticipantsWithAccountDetails(Integer programId);
}
