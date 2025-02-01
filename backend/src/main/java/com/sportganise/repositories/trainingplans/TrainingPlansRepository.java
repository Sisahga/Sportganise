package com.sportganise.repositories.trainingplans;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sportganise.entities.trainingplans.TrainingPlan;

/** Repository for Training Plans. */
@Repository
public interface TrainingPlansRepository extends JpaRepository<TrainingPlan, Integer>{

    @Query("""
            SELECT tp
            FROM TrainingPlan tp
            """)
    List<TrainingPlan> findTrainingPlans();

}
