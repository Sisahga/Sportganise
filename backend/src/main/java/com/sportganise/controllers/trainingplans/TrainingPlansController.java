package com.sportganise.controllers.trainingplans;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportganise.dto.ResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.trainingplans.TrainingPlansService;
import com.sportganise.dto.trainingplans.TrainingPlanDto;

/**
 * REST Controller for managing 'Training Plans' Entities. Handles HTTP request
 * and routes them to
 * appropriate services.
 */
@RestController
@RequestMapping("/api/training-plans")
@Slf4j
public class TrainingPlansController {
    private final TrainingPlansService trainingPlansService;
    private final AccountService accountService;

    @Autowired
    public TrainingPlansController(TrainingPlansService trainingPlansService, AccountService accountService) {
        this.trainingPlansService = trainingPlansService;
        this.accountService = accountService;
    }

    /**
     * GET mapping for training plans. Only coaches and admins can see this page.
     * 
     * @param accountId Id of account sending this request/accessing this page.
     * @return HTTP ResponseEntity.
     */
    @GetMapping("{accountId}/view-plans")
    public ResponseEntity<ResponseDto<List<TrainingPlanDto>>> getTrainingPlans(
            @PathVariable Integer accountId) {

        ResponseDto<List<TrainingPlanDto>> responseDto = new ResponseDto<>();

        Optional<Account> userOptional = getAccount(accountId);

        if (userOptional.isEmpty()) {
            responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
            responseDto.setMessage("User not found.");
            return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
        }

        Account user = userOptional.get();
        log.debug("USER ID:", user.getAccountId());

        if (hasPermissions(user)) {
            List<TrainingPlanDto> trainingPlansDtos = trainingPlansService.getTrainingPlans();
            log.debug("TRAININGPLANSDTO COUNT: ", trainingPlansDtos.size());

            if (trainingPlansDtos.isEmpty()) {
                responseDto.setStatusCode(HttpStatus.NOT_FOUND.value());
                responseDto.setMessage("No program found.");
                return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
            }

            responseDto.setStatusCode(HttpStatus.OK.value());
            responseDto.setMessage("Programs successfully fetched.");
            responseDto.setData(trainingPlansDtos);
            return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
        } else {
            responseDto.setStatusCode(HttpStatus.FORBIDDEN.value());
            responseDto.setMessage("Only Coaches and Admins can access this page.");
            return ResponseEntity.status(responseDto.getStatusCode()).body(responseDto);
        }
    }

    /** Helper method to fetch and validate user account based on accountId. */
    private Optional<Account> getAccount(Integer accountId) {
        return accountService.getAccount(accountId);
    }

    /** Helper method to check user permissions. */
    private boolean hasPermissions(Account user) {
        return accountService.hasPermissions(user.getType());
    }
}
