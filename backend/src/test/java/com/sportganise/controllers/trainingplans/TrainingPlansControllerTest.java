package com.sportganise.controllers.trainingplans;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.services.account.AccountService;
import com.sportganise.services.trainingplans.TrainingPlansService;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = TrainingPlansController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TrainingPlansControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TrainingPlansService trainingPlansService;

    @MockBean
    private AccountService accountService;

    @Test
    public void testGetTrainingPlans_ForbiddenAccess() throws Exception {
        Integer accountId = 101;
        Account user = new Account();
        user.setAccountId(accountId);
        user.setType(AccountType.GENERAL);

        Mockito.when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
        Mockito.when(accountService.hasPermissions(user.getType())).thenReturn(false);

        mockMvc.perform(get("/api/training-plans/{accountId}/view-plans", accountId))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Only Coaches and Admins can access this page."));
    }

    @Test
    public void testGetTrainingPlans_NoPlansFound() throws Exception {
        Integer accountId = 101;
        Account user = new Account();
        user.setAccountId(accountId);
        user.setType(AccountType.COACH);

        Mockito.when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
        Mockito.when(accountService.hasPermissions(user.getType())).thenReturn(true);
        Mockito.when(trainingPlansService.getTrainingPlans(accountId)).thenReturn(null);

        mockMvc.perform(get("/api/training-plans/{accountId}/view-plans", accountId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No training plans found."));
    }

    @Test
    public void testGetTrainingPlans_Success() throws Exception {
        Integer accountId = 101;
        Account user = new Account();
        user.setAccountId(accountId);
        user.setType(AccountType.COACH);

        TrainingPlanResponseDto responseDto = new TrainingPlanResponseDto(
                List.of(new TrainingPlanDto(1, accountId, "https://example.com/plan1.docx", ZonedDateTime.now())),
                List.of(new TrainingPlanDto(2, 102, "https://example.com/plan2.docx", ZonedDateTime.now())));

        Mockito.when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
        Mockito.when(accountService.hasPermissions(user.getType())).thenReturn(true);
        Mockito.when(trainingPlansService.getTrainingPlans(accountId)).thenReturn(responseDto);

        mockMvc.perform(get("/api/training-plans/{accountId}/view-plans", accountId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Training plans successfully fetched."))
                .andExpect(jsonPath("$.data.myPlans").isArray())
                .andExpect(jsonPath("$.data.sharedWithMe").isArray());
    }

}
