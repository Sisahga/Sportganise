package com.sportganise.controllers.trainingplans;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.dto.trainingplans.UploadTrainingPlansResponseDto;
 import com.sportganise.services.trainingplans.TrainingPlansService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for managing 'Training Plans' Entities. Handles HTTP request and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/training-plans")
@Slf4j
public class TrainingPlansController {
  private final TrainingPlansService trainingPlansService;

  @Autowired
  public TrainingPlansController(TrainingPlansService trainingPlansService) {
    this.trainingPlansService = trainingPlansService;
  }

  /**
   * GET mapping for training plans. Only coaches and admins can see this page.
   *
   * @param accountId Id of account sending this request/accessing this page.
   * @return HTTP ResponseEntity.
   */
  @GetMapping("{accountId}/view-plans")
  public ResponseEntity<ResponseDto<TrainingPlanResponseDto>> getTrainingPlans(
      @PathVariable Integer accountId) {

    TrainingPlanResponseDto trainingPlanResponseDto =
        trainingPlansService.getTrainingPlans(accountId);

    ResponseDto<TrainingPlanResponseDto> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Training plans successfully fetched.");
    responseDto.setData(trainingPlanResponseDto);

    log.debug("TRAINING PLANS SHARED WITH ME COUNT: {}", trainingPlanResponseDto.getSharedWithMe());

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**

   Method to delete training plans.*
   @param accountId parameter for Id of the user sending the request.
   @param planId parameter for the Id of the plan that is to be deleted.
   @return HTTP response.*/
  @DeleteMapping("{accountId}/{planId}/delete-plan")
  public ResponseEntity<ResponseDto<TrainingPlanResponseDto>> deleteTrainingPlans(
          @PathVariable Integer accountId, @PathVariable Integer planId) {

    trainingPlansService.deleteTrainingPlan(accountId, planId);

    ResponseDto<TrainingPlanResponseDto> responseDto = new ResponseDto<>();
    responseDto.setStatusCode(HttpStatus.OK.value());
    responseDto.setMessage("Training plan successfully deleted.");

    log.debug("TRAINING PLAN SUCCESSFULLY DELETED.");

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }

  /**
   * POST mapping for uploading training plans.
   *
   * @param trainingPlans List of training plans to be uploaded.
   * @param accountId Id of the account uploading the training plans.
   * @return HTTP ResponseEntity CREATED if successful along with S3 blobs of training plans.
   */
  @PostMapping(value = "{accountId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ResponseDto<UploadTrainingPlansResponseDto>> uploadTrainingPlans(
      @RequestParam(value = "trainingPlan", required = false) List<MultipartFile> trainingPlans,
      @PathVariable Integer accountId) {
    // Validate # of training plans uploaded.
    if (trainingPlans == null || trainingPlans.size() > 5) {
      ResponseDto<UploadTrainingPlansResponseDto> responseDto = new ResponseDto<>();
      responseDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
      responseDto.setMessage("0 or 5+ files uploaded, bad request. Expected 1-5 files.");
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    } else {
      UploadTrainingPlansResponseDto trainingPlanBlobs =
          trainingPlansService.uploadTrainingPlans(trainingPlans, accountId);
      ResponseDto<UploadTrainingPlansResponseDto> responseDto =
          ResponseDto.<UploadTrainingPlansResponseDto>builder()
              .statusCode(HttpStatus.CREATED.value())
              .message("Training plans uploaded successfully.")
              .data(trainingPlanBlobs)
              .build();
      return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
    }
  }
}
