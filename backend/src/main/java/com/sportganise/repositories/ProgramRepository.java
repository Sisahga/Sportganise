package com.sportganise.repositories;

import com.sportganise.entities.Account;
import com.sportganise.entities.Program;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository // Indicates that this is a Spring Data repository
public interface ProgramRepository extends JpaRepository<Program, Integer> {

  @Query(
      "SELECT a FROM Account a "
          + "JOIN ProgramParticipant pp ON pp.account.accountId = a.accountId "
          + "JOIN Program p ON pp.program.programId = p.programId "
          + "WHERE p.programId = :sessionId")
  List<Account> findParticipantsByProgramId(@Param("sessionId") Integer sessionId);
}
