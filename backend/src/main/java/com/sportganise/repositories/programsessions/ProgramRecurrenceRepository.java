package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramRecurrence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRecurrenceRepository extends JpaRepository<ProgramRecurrence, Integer> {}
