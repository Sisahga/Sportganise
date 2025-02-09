package com.sportganise.controllers.trainingplans;

import com.sportganise.dto.ResponseDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.services.trainingplans.TrainingPlansService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    log.debug("TRAINING PLANS SHARED WITH ME COUNT: ", trainingPlanResponseDto.getSharedWithMe());

    return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
  }
}
