package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramRecurrence;
import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
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
      "DELETE FROM ProgramRecurrence rp WHERE rp.programId = :programId AND rp.occurrenceDate <= :expiryDate")
  void deleteExpiredRecurrences(
      @Param("expiryDate") ZonedDateTime expiryDate, @Param("programId") Integer programId);
}
