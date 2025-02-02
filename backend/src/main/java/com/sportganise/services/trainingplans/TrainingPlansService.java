package com.sportganise.services.trainingplans;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service layer for Training Plans. */
@Service
@Slf4j
public class TrainingPlansService {
    private final TrainingPlansRepository trainingPlansRepository;

    /**
     * Constructor for TrainingPlansService.
     * 
     * @param trainingPlansRepository Repository for training plans.
     */
    public TrainingPlansService(TrainingPlansRepository trainingPlansRepository) {
        this.trainingPlansRepository = trainingPlansRepository;
    }

    /**
     * Method to fetch all training Plans.
     * 
     * @return List of Training Plan Dtos.
     */
    public TrainingPlanResponseDto getTrainingPlans(Integer userId) {
        List<TrainingPlan> trainingPlans = trainingPlansRepository.findTrainingPlans();
        log.debug("PROGRAMS COUNT: ", trainingPlans.size());

        List<TrainingPlanDto> trainingPlanDtos = new ArrayList<>();

        for (TrainingPlan trainingPlan : trainingPlans) {
            trainingPlanDtos.add(
                    new TrainingPlanDto(
                            trainingPlan.getPlanId(),
                            trainingPlan.getUserId(),
                            trainingPlan.getDocUrl(),
                            trainingPlan.getCreationDate()));
        }
        log.debug("PROGRAM DTOS COUNT: ", trainingPlanDtos.size());

        List<TrainingPlanDto> myPlans = trainingPlanDtos.stream()
                .filter(tp -> tp.getUserId().equals(userId))
                .collect(Collectors.toList());

        log.debug("MY PLANS COUNT: {}", myPlans.size());

        List<TrainingPlanDto> sharedWithMe = trainingPlanDtos.stream()
                .filter(tp -> !tp.getUserId().equals(userId))
                .collect(Collectors.toList());

        log.debug("SHARED WITH ME COUNT: {}", sharedWithMe.size());

        TrainingPlanResponseDto trainingPlanResponseDto = new TrainingPlanResponseDto(myPlans, sharedWithMe);

        return trainingPlanResponseDto;
    }
}
