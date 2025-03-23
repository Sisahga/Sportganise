package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Program. */
@Repository
public interface ProgramRepository extends JpaRepository<Program, Integer> {

  @Query("""
      SELECT p
      FROM Program p
      WHERE p.programId = :programId
      """)
  Program findProgramById(@Param("programId") Integer programId);

  @Query("""
      SELECT p
      FROM Program p
      """)
  List<Program> findPrograms();

  @Query(
      """
      SELECT p
      FROM ProgramParticipant p
      WHERE p.programParticipantId.programId = :programId
      """)
  List<ProgramParticipant> findParticipantsByProgramId(@Param("programId") Integer programId);

  List<Program> findByProgramType(String type);

  @Transactional
  @Modifying
  @Query(
      """
          UPDATE Program p
          SET p.cancelled = true
          WHERE p.programId = :programId
          """)
  void cancelProgram(Integer programId);

  @Transactional
  @Modifying
  @Query(
      """
            UPDATE Program p
            SET p.cancelled = false
            WHERE p.programId = :programId
            """)
  void uncancelProgram(Integer programId);
}
