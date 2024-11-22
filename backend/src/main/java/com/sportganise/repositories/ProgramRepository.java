package com.sportganise.repositories;

import com.sportganise.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Indicates that this is a Spring Data repository
public interface ProgramRepository extends JpaRepository<Program, Integer> {}
