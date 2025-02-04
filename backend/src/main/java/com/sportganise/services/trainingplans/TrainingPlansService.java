package com.sportganise.services.trainingplans;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;
import com.sportganise.services.account.AccountService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service layer for Training Plans. */
@Service
@Slf4j
public class TrainingPlansService {
  private final TrainingPlansRepository trainingPlansRepository;
  private final AccountService accountService;

  /**
   * Constructor for TrainingPlansService.
   *
   * @param trainingPlansRepository Repository for training plans.
   */
  public TrainingPlansService(
      TrainingPlansRepository trainingPlansRepository, AccountService accountService) {
    this.trainingPlansRepository = trainingPlansRepository;
    this.accountService = accountService;
  }

  /**
   * Method to fetch all training Plans.
   *
   * @return List of Training Plan Dtos.
   */
  public TrainingPlanResponseDto getTrainingPlans(Integer userId) {
    Account user = getUser(userId);

    if (!hasPermissions(user)) {
      throw new ForbiddenException("Only Coaches and Admins can access this page.");
    }

    List<TrainingPlan> trainingPlans = trainingPlansRepository.findTrainingPlans();
    if (trainingPlans.isEmpty()) {
      throw new ResourceNotFoundException("No training plans found.");
    }
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

    List<TrainingPlanDto> myPlans =
        trainingPlanDtos.stream()
            .filter(tp -> tp.getUserId().equals(userId))
            .collect(Collectors.toList());

    log.debug("MY PLANS COUNT: {}", myPlans.size());

    List<TrainingPlanDto> sharedWithMe =
        trainingPlanDtos.stream()
            .filter(tp -> !tp.getUserId().equals(userId))
            .collect(Collectors.toList());

    log.debug("SHARED WITH ME COUNT: {}", sharedWithMe.size());

    TrainingPlanResponseDto trainingPlanResponseDto =
        new TrainingPlanResponseDto(myPlans, sharedWithMe);

    return trainingPlanResponseDto;
  }

  /**
   * Helper method to get user Account object.
   *
   * @param accountId Id of user account.
   * @return Account object.
   */
  private Account getUser(Integer accountId) {
    Optional<Account> userOptional = getAccountById(accountId);

    if (userOptional.isEmpty()) {
      throw new ResourceNotFoundException("User not found.");
    }

    Account user = userOptional.get();
    log.debug("USER ID:", user.getAccountId());
    return user;
  }

  /**
   * Helper method to fetch and validate user account based on accountId.
   *
   * @param accountId Id of Account.
   * @return return an Optional of Account object.
   */
  private Optional<Account> getAccountById(Integer accountId) {
    return accountService.getAccount(accountId);
  }

  /**
   * Helper method to check user permissions.
   *
   * @param user Account object.
   * @return Whether user has permission or not.
   */
  private boolean hasPermissions(Account user) {
    return accountService.hasPermissions(user.getType());
  }
}
