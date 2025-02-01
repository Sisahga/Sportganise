package com.sportganise.services.trainingplans;

import java.util.ArrayList;
import java.util.List;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service layer for Training Plans. */
@Service
@Slf4j
public class TrainingPlansService {
    private final TrainingPlansRepository trainingPlansRepository;

    public TrainingPlansService(TrainingPlansRepository trainingPlansRepository) {
        this.trainingPlansRepository = trainingPlansRepository;
    }

    public List<TrainingPlanDto> getTrainingPlans() {
        List<TrainingPlan> trainingPlans = trainingPlansRepository.findTrainingPlans();
        log.debug("PROGRAMS COUNT: ", trainingPlans.size());

        List<TrainingPlanDto> trainingPlanDtos = new ArrayList<>();

        for(TrainingPlan trainingPlan : trainingPlans) {
            trainingPlanDtos.add(
                new TrainingPlanDto(
                    trainingPlan.getPlanId(),
                    trainingPlan.getUserId(),
                    trainingPlan.getDocUrl(),
                    trainingPlan.getCreationDate()
                )
            );
        }
        log.debug("PROGRAM DTOS COUNT: ", trainingPlanDtos.size());

        return trainingPlanDtos;
    }
}
