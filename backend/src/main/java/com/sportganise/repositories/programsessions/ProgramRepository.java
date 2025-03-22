package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
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

  @Query(
      value = "SELECT * FROM program WHERE type = CAST(:programType AS program_type)",
      nativeQuery = true)
  List<Program> findProgramByType(@Param("programType") String programType);
}
