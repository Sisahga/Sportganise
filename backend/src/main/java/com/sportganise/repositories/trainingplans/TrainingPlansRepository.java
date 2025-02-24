package com.sportganise.repositories.trainingplans;

import com.sportganise.entities.trainingplans.TrainingPlan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for Training Plans. */
@Repository
public interface TrainingPlansRepository extends JpaRepository<TrainingPlan, Integer> {

  @Query("""
            SELECT tp
            FROM TrainingPlan tp
            """)
  List<TrainingPlan> findTrainingPlans();

  @Query(
      """
            SELECT tp
            FROM TrainingPlan tp
            WHERE tp.planId = :planId
            """)
  TrainingPlan findTrainingPlan(@Param("planId") Integer planId);
}
