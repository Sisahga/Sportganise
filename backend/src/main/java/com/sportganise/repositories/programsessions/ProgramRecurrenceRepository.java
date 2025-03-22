package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramRecurrence;
import jakarta.transaction.Transactional;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Program Recurrence. */
@Repository
public interface ProgramRecurrenceRepository extends JpaRepository<ProgramRecurrence, Integer> {

  void deleteProgramRecurrenceByRecurrenceId(Integer recurrenceId);

  /**
   * Deletes all recurrences that are older than the expiry date.
   *
   * @param expiryDate the date to compare the recurrences against.
   * @param programId the program id to delete the recurrences for.
   */
  @Modifying
  @Transactional
  @Query(
      """
                 DELETE FROM ProgramRecurrence pr
                 WHERE pr.programId = :programId
                 AND pr.occurrenceDate > :expiryDate
                 """)
  void deleteOverflowingRecurrences(
      @Param("expiryDate") ZonedDateTime expiryDate, @Param("programId") Integer programId);

  /**
   * Finds all recurrences for a program.
   *
   * @param programId the program id to find the recurrences for.
   * @return a list of recurrences.
   */
  @Query(
      """
             SELECT pr FROM ProgramRecurrence pr
             WHERE pr.programId = :programId
             ORDER BY pr.occurrenceDate
               """)
  List<ProgramRecurrence> findProgramRecurrenceByProgramId(Integer programId);

  /**
   * Finds the last recurrence for a program.
   *
   * @param programId the program id to find the last recurrence for.
   * @return the last recurrence.
   */
  @Query(
      """
            SELECT pr FROM ProgramRecurrence pr
            WHERE pr.programId = :programId
            ORDER BY pr.occurrenceDate DESC
              """)
  Optional<ProgramRecurrence> findLastRecurrenceByProgramId(@Param("programId") Integer programId);

  /**
   * Deletes all recurrences for a program.
   *
   * @param programId the program id to delete the recurrences for.
   */
  void deleteProgramRecurrenceByProgramId(Integer programId);

  /**
   * Deletes all recurrences that are between two dates.
   *
   * @param programId the program id to delete the recurrences for.
   * @param firstDate the first date to compare the recurrences against.
   * @param secondDate the second date to compare the recurrences against.
   */
  @Transactional
  @Modifying
  @Query(
      """
             DELETE FROM ProgramRecurrence pr
             WHERE pr.programId = :programId
             AND pr.occurrenceDate >:firstDate AND pr.occurrenceDate< :secondDate
                    """)
  void deleteMiddleRecurrences(
      @Param("programId") Integer programId,
      @Param("firstDate") ZonedDateTime firstDate,
      @Param("secondDate") ZonedDateTime secondDate);

  /**
   * Finds all recurrences that are between two dates.
   *
   * @param programId the program id to find the recurrences for.
   * @param newStartDate the first date to compare the recurrences against.
   * @param newEndDate the second date to compare the recurrences against.
   * @return a list of recurrences.
   */
  List<ProgramRecurrence> findByProgramIdAndOccurrenceDateBetween(
      Integer programId, ZonedDateTime newStartDate, ZonedDateTime newEndDate);

  @Transactional
  @Modifying
  @Query(
      """
                 DELETE FROM ProgramRecurrence pr
                 WHERE pr.programId = :programId
                 AND pr.occurrenceDate < :firstDate
                 """)
  void deletePrecedingRecurrences(Integer programId, ZonedDateTime firstDate);

  @Transactional
  @Modifying
  @Query(
      """
       UPDATE ProgramRecurrence pr
       SET pr.occurrenceDate =
           FUNCTION('TIMESTAMP', FUNCTION('DATE', pr.occurrenceDate), :newStartTime)
       WHERE pr.programId = :programId
       """)
  void updateRecurrenceStartTime(Integer programId, LocalTime newStartTime);
}
