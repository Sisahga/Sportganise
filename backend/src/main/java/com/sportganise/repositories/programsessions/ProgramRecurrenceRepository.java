package com.sportganise.repositories.programsessions;


import com.sportganise.entities.programsessions.ProgramRecurrence;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRecurrenceRepository extends JpaRepository<ProgramRecurrence,Integer> {

}
