package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramRecurrence;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRecurrenceRepository extends JpaRepository<ProgramRecurrence, Integer> {

  void deleteProgramRecurrenceByRecurrenceId(Integer recurrenceId);

  @Modifying
  @Transactional
  @Query(
      "DELETE FROM ProgramRecurrence pr WHERE pr.programId = :programId AND pr.occurrenceDate <= :expiryDate")
  void deleteExpiredRecurrences(
      @Param("expiryDate") ZonedDateTime expiryDate, @Param("programId") Integer programId);

  @Query("SELECT pr FROM ProgramRecurrence pr WHERE pr.programId = :programId ORDER BY pr.occurrenceDate")
  List<ProgramRecurrence> findProgramRecurrenceByProgramId(Integer programId);

  @Query(
      "SELECT pr FROM ProgramRecurrence pr WHERE pr.programId = :programId ORDER BY pr.occurrenceDate DESC")
  Optional<ProgramRecurrence> findLastRecurrenceByProgramId(@Param("programId") Integer programId);

  void deleteProgramRecurrenceByProgramId(Integer programId);

  @Transactional
  @Modifying
  @Query("DELETE FROM ProgramRecurrence pr WHERE pr.programId = :programId " +
          "AND pr.occurrenceDate BETWEEN :firstDate AND :secondDate")
  void deleteMiddleRecurrences(@Param("programId") Integer programId,
                               @Param("firstDate") ZonedDateTime firstDate,
                               @Param("secondDate") ZonedDateTime secondDate);

  List<ProgramRecurrence> findByProgramIdAndOccurrenceDateBetween(Integer programId, ZonedDateTime newStartDate, ZonedDateTime newEndDate);
}
