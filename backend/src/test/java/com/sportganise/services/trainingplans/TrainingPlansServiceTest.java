package com.sportganise.services.trainingplans;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.dto.trainingplans.UploadTrainingPlansResponseDto;
import com.sportganise.entities.account.Account;
import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.trainingplans.TrainingPlan;
import com.sportganise.exceptions.FileProcessingException;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.repositories.trainingplans.TrainingPlansRepository;
import com.sportganise.services.BlobService;
import com.sportganise.services.account.AccountService;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
public class TrainingPlansServiceTest {

  @Mock private TrainingPlansRepository trainingPlansRepository;
  @Mock private AccountService accountService;
  @Mock private BlobService blobService;
  @Mock private MultipartFile mockFile1;
  @Mock private MultipartFile mockFile2;
  @InjectMocks private TrainingPlansService trainingPlansService;

  @BeforeEach
  void setUp() {
    // Reset mocks between tests
    reset(blobService, trainingPlansRepository, accountService);
  }

  @Test
  void shouldReturnTrainingPlans_whenUserHasPermission() {
    Integer userId = 1;
    Account user = new Account();
    user.setAccountId(userId);
    user.setType(AccountType.COACH);

    TrainingPlan plan1 =
        new TrainingPlan(1, userId, "url1", true, ZonedDateTime.now().minusDays(1));
    TrainingPlan plan2 = new TrainingPlan(2, 2, "url2.1", false, ZonedDateTime.now().minusDays(1));
    TrainingPlan plan3 = new TrainingPlan(3, 2, "url2.2", true, ZonedDateTime.now());

    when(accountService.getAccount(userId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(true);
    when(trainingPlansRepository.findTrainingPlans())
        .thenReturn(Arrays.asList(plan1, plan2, plan3));

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

  @Test
  void uploadTrainingPlans_WhenUserHasPermission_ShouldUploadFilesAndSaveToDb() throws IOException {
    Integer accountId = 1;
    List<MultipartFile> files = Arrays.asList(mockFile1, mockFile2);
    Account user = new Account();
    user.setAccountId(accountId);
    user.setType(AccountType.COACH);

    when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(true);

    when(mockFile1.getOriginalFilename()).thenReturn("plan1.pdf");
    when(mockFile2.getOriginalFilename()).thenReturn("plan2.pdf");

    when(blobService.uploadFile(mockFile1, accountId)).thenReturn("url1");
    when(blobService.uploadFile(mockFile2, accountId)).thenReturn("url2");

    UploadTrainingPlansResponseDto response =
        trainingPlansService.uploadTrainingPlans(files, accountId);

    assertNotNull(response);
    assertEquals(2, response.getTrainingPlanBlobs().size());
    assertEquals(Arrays.asList("url1", "url2"), response.getTrainingPlanBlobs());

    ArgumentCaptor<TrainingPlan> trainingPlanCaptor = ArgumentCaptor.forClass(TrainingPlan.class);
    verify(trainingPlansRepository, times(2)).save(trainingPlanCaptor.capture());

    List<TrainingPlan> capturedTrainingPlans = trainingPlanCaptor.getAllValues();
    assertEquals(accountId, capturedTrainingPlans.get(0).getUserId());
    assertEquals("url1", capturedTrainingPlans.get(0).getDocUrl());
    assertEquals(accountId, capturedTrainingPlans.get(1).getUserId());
    assertEquals("url2", capturedTrainingPlans.get(1).getDocUrl());
  }

  @Test
  void uploadTrainingPlans_WhenUserDoesNotHavePermission_ShouldThrowForbiddenException() {
    Integer accountId = 1;
    List<MultipartFile> files = Arrays.asList(mockFile1, mockFile2);
    Account user = new Account();
    user.setAccountId(accountId);
    user.setType(AccountType.PLAYER);

    when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(false);

    ForbiddenException exception =
        assertThrows(
            ForbiddenException.class,
            () -> {
              trainingPlansService.uploadTrainingPlans(files, accountId);
            });

    assertEquals("Only Coaches and Admins can access this page.", exception.getMessage());

    verifyNoInteractions(blobService);
    verifyNoInteractions(trainingPlansRepository);
  }

  @Test
  void uploadTrainingPlans_WhenUserNotFound_ShouldThrowResourceNotFoundException() {
    Integer accountId = 1;
    List<MultipartFile> files = Arrays.asList(mockFile1, mockFile2);

    when(accountService.getAccount(accountId)).thenReturn(Optional.empty());

    ResourceNotFoundException exception =
        assertThrows(
            ResourceNotFoundException.class,
            () -> {
              trainingPlansService.uploadTrainingPlans(files, accountId);
            });

    assertEquals("User not found.", exception.getMessage());

    verifyNoInteractions(blobService);
    verifyNoInteractions(trainingPlansRepository);
  }

  @Test
  void uploadTrainingPlans_WhenIOExceptionOccurs_ShouldDeleteUploadedBlobsAndThrowException()
      throws IOException {
    Integer accountId = 1;
    List<MultipartFile> files = Arrays.asList(mockFile1, mockFile2);
    Account user = new Account();
    user.setAccountId(accountId);
    user.setType(AccountType.COACH);

    when(accountService.getAccount(accountId)).thenReturn(Optional.of(user));
    when(accountService.hasPermissions(user.getType())).thenReturn(true);

    when(mockFile1.getOriginalFilename()).thenReturn("plan1.pdf");
    when(mockFile2.getOriginalFilename()).thenReturn("plan2.pdf");

    when(blobService.uploadFile(mockFile1, accountId)).thenReturn("url1");

    when(blobService.uploadFile(mockFile2, accountId)).thenThrow(new IOException("Test exception"));

    FileProcessingException exception =
        assertThrows(
            FileProcessingException.class,
            () -> {
              trainingPlansService.uploadTrainingPlans(files, accountId);
            });

    assertEquals("Error uploading training plans.", exception.getMessage());

    ArgumentCaptor<TrainingPlan> trainingPlanCaptor = ArgumentCaptor.forClass(TrainingPlan.class);
    verify(trainingPlansRepository).save(trainingPlanCaptor.capture());

    verify(blobService).deleteFile("url1");
  }
}
