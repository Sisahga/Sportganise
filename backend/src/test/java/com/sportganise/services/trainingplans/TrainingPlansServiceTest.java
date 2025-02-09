package com.sportganise.services.trainingplans;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;
import com.sportganise.services.account.AccountService;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TrainingPlansServiceTest {

  @Mock private TrainingPlansRepository trainingPlansRepository;
  @Mock private AccountService accountService;

  @InjectMocks private TrainingPlansService trainingPlansService;

  @Test
  void shouldReturnTrainingPlans_whenUserHasPermission() {
    Integer userId = 1;
    Account user = new Account();
    user.setAccountId(userId);
    user.setType(AccountType.COACH);

    TrainingPlan plan1 = new TrainingPlan(1, userId, "url1", ZonedDateTime.now().minusDays(1));
    TrainingPlan plan2 = new TrainingPlan(2, 2, "url2", ZonedDateTime.now());

    when(accountService.getAccount(userId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(true);
    when(trainingPlansRepository.findTrainingPlans()).thenReturn(Arrays.asList(plan1, plan2));

    TrainingPlanResponseDto result = trainingPlansService.getTrainingPlans(userId);

    assertNotNull(result);
    assertEquals(1, result.getMyPlans().size());
    assertEquals(1, result.getSharedWithMe().size());
  }

  @Test
  void shouldThrowForbiddenException_whenUserLacksPermission() {
    Integer userId = 2;
    Account user = new Account();
    user.setAccountId(userId);
    user.setType(AccountType.GENERAL);

    when(accountService.getAccount(userId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(false);

    ForbiddenException exception =
        assertThrows(ForbiddenException.class, () -> trainingPlansService.getTrainingPlans(userId));

    assertEquals("Only Coaches and Admins can access this page.", exception.getMessage());
  }

  @Test
  void shouldThrowResourceNotFoundException_whenUserNotFound() {
    Integer userId = 3;

    when(accountService.getAccount(userId)).thenReturn(Optional.empty());

    ResourceNotFoundException exception =
        assertThrows(
            ResourceNotFoundException.class, () -> trainingPlansService.getTrainingPlans(userId));

    assertEquals("User not found.", exception.getMessage());
  }

  @Test
  void shouldThrowResourceNotFoundException_whenNoTrainingPlansFound() {
    Integer userId = 1;
    Account user = new Account();
    user.setAccountId(userId);
    user.setType(AccountType.COACH);

    when(accountService.getAccount(userId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(true);
    when(trainingPlansRepository.findTrainingPlans()).thenReturn(List.of());

    ResourceNotFoundException exception =
        assertThrows(
            ResourceNotFoundException.class, () -> trainingPlansService.getTrainingPlans(userId));

    assertEquals("No training plans found.", exception.getMessage());
  }
}
