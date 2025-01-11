package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.Program;
import com.sportganise.entities.programsessions.ProgramParticipant;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Program.
 */
@Repository // Indicates that this is a Spring Data repository
public interface ProgramRepository extends JpaRepository<Program, Integer> {
    /**
     * Method to fetch a program based on the programId.
     *
     * @param programId.
     * @return All the details of a program.
     */
    @Query(
            "SELECT p FROM Program p "
                    + "WHERE p.programId = :programId")
    Program findProgramById(@Param("programId") Integer programId);

    @Query(
            "SELECT a FROM Account a "
                    + "JOIN ProgramParticipant pp ON pp.id.accountId = a.accountId "
                    + "JOIN Program p ON pp.id.programId = p.programId "
                    + "WHERE p.programId = :sessionId")
    List<ProgramParticipant> findParticipantsByProgramId(@Param("sessionId") Integer sessionId);
}
