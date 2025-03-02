package com.sportganise.services.trainingplans;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.dto.trainingplans.UploadTrainingPlansResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Service layer for Training Plans. */
@Service
@Slf4j
public class TrainingPlansService {
  private final TrainingPlansRepository trainingPlansRepository;
  private final AccountService accountService;
  private final BlobService blobService;

  /**
   * Constructor for TrainingPlansService.
   *
   * @param trainingPlansRepository Repository for training plans.
   */
  public TrainingPlansService(
      TrainingPlansRepository trainingPlansRepository,
      AccountService accountService,
      BlobService blobService) {
    this.trainingPlansRepository = trainingPlansRepository;
    this.accountService = accountService;
    this.blobService = blobService;
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
    log.debug("PROGRAMS COUNT: {}", trainingPlans.size());

    List<TrainingPlanDto> trainingPlanDtos = new ArrayList<>();

    for (TrainingPlan trainingPlan : trainingPlans) {
      trainingPlanDtos.add(
          new TrainingPlanDto(
              trainingPlan.getPlanId(),
              trainingPlan.getUserId(),
              trainingPlan.getDocUrl(),
              trainingPlan.getShared(),
              trainingPlan.getCreationDate()));
    }
    log.debug("PROGRAM DTOS COUNT: {}", trainingPlanDtos.size());

    List<TrainingPlanDto> myPlans =
        trainingPlanDtos.stream()
            .filter(tp -> tp.getUserId().equals(userId))
            .collect(Collectors.toList());

    log.debug("MY PLANS COUNT: {}", myPlans.size());

    List<TrainingPlanDto> sharedWithMe =
        trainingPlanDtos.stream()
            .filter(tp -> !tp.getUserId().equals(userId) && tp.getShared() == true)
            .collect(Collectors.toList());

    log.debug("SHARED WITH ME COUNT: {}", sharedWithMe.size());

    return new TrainingPlanResponseDto(myPlans, sharedWithMe);
  }

  /**
   * Method to delete a training plan.
   *
   * @param userId Id of the user sending the request.
   * @param planId Id of the plan to be deleted.
   */
  public void deleteTrainingPlan(Integer userId, Integer planId) {
    Account user = getUser(userId);

    TrainingPlan trainingPlan = trainingPlansRepository.findTrainingPlan(planId);
    if (trainingPlan == null) {
      throw new ResourceNotFoundException("Training plan not found.");
    }
    log.debug("PLAN ID: {}", trainingPlan.getPlanId());

    if (!isAuthor(user, trainingPlan.getUserId())) {
      throw new ForbiddenException("You are not the author of this training plan.");
    }

    trainingPlansRepository.deleteById(planId);
  }

  /**
   * Method for sharing a training plan.
   *
   * @param userId Id of the user making the request.
   * @param planId Id of the plan to be shared.
   */
  public boolean shareTrainingPlan(Integer userId, Integer planId) {
    Account user = getUser(userId);

    TrainingPlan trainingPlan = trainingPlansRepository.findTrainingPlan(planId);
    if (trainingPlan == null) {
      throw new ResourceNotFoundException("Training plan not found.");
    }
    log.debug("PLAN ID: {}", trainingPlan.getPlanId());

    if (!isAuthor(user, trainingPlan.getUserId())) {
      throw new ForbiddenException("You are not the author of this training plan.");
    }

    Boolean isShared = trainingPlan.getShared();
    trainingPlan.setShared(!isShared);
    trainingPlansRepository.save(trainingPlan);

    return trainingPlan.getShared();
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
    log.debug("USER ID: {}", user.getAccountId());
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

  /**
   * Method to upload training plans.
   *
   * @param trainingPlans List of training plans to be uploaded.
   * @param accountId Id of the account uploading the training plans.
   * @return Response DTO for uploading training plans containing S3Urls of uploaded plans.
   */
  @Transactional
  public UploadTrainingPlansResponseDto uploadTrainingPlans(
      List<MultipartFile> trainingPlans, Integer accountId) {
    if (!hasPermissions(getUser(accountId))) {
      throw new ForbiddenException("Only Coaches and Admins can access this page.");
    } else {
      List<String> trainingPlanBlobs = storeTrainingPlans(trainingPlans, accountId);
      return UploadTrainingPlansResponseDto.builder().trainingPlanBlobs(trainingPlanBlobs).build();
    }
  }

  /**
   * Method to upload training plans to S3 bucket and store Training Plan in DB.
   *
   * @param files List of training plans to be uploaded.
   * @param accountId Id of the account uploading the training plans.
   * @return List of S3 URLs of uploaded training plans.
   */
  protected List<String> storeTrainingPlans(List<MultipartFile> files, Integer accountId) {
    List<String> trainingPlanBlobs = new ArrayList<>();
    try {
      for (MultipartFile file : files) {
        log.debug("Uploading training plan: {}", file.getOriginalFilename());
        String s3Url = blobService.uploadFile(file, accountId);
        ZonedDateTime createdDate = ZonedDateTime.now();
        TrainingPlan tp =
            TrainingPlan.builder()
                .userId(accountId)
                .docUrl(s3Url)
                .creationDate(createdDate)
                .build();
        trainingPlansRepository.save(tp); // Save training plan in DB.
        trainingPlanBlobs.add(s3Url);
      }
      return trainingPlanBlobs;
    } catch (IOException e) {
      log.error("Error uploading training plans: {}", e.getMessage());
      if (!trainingPlanBlobs.isEmpty()) {
        deleteUploadedBlobs(trainingPlanBlobs);
      }
      throw new FileProcessingException("Error uploading training plans.");
    }
  }

  /**
   * Method to delete uploaded training plans in S3 bucket.
   *
   * @param uploadedBlobs List of S3 URLs of uploaded training plans.
   */
  private void deleteUploadedBlobs(List<String> uploadedBlobs) {
    try {
      for (String blobUrl : uploadedBlobs) {
        blobService.deleteFile(blobUrl);
      }
    } catch (IOException e) {
      log.error("Error deleting training plans: {}", e.getMessage());
      throw new FileProcessingException("Error deleting training plans.");
    }
  }

  /**
   * Helper method to check if user is author of the training plan. User must also be a coach or
   * admin.
   *
   * @param user Account object of the user making the request.
   * @param authorId Id of the author of the training plan.
   * @return boolean of whether the person deleting the plan is the author.
   */
  private boolean isAuthor(Account user, Integer authorId) {
    return accountService.hasPermissions(user.getType()) && user.getAccountId().equals(authorId);
  }
}
