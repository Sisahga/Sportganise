package com.sportganise.controllers.trainingplans;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sportganise.dto.trainingplans.TrainingPlanDto;
import com.sportganise.dto.trainingplans.TrainingPlanResponseDto;
import com.sportganise.dto.trainingplans.UploadTrainingPlansResponseDto;
import com.sportganise.exceptions.ForbiddenException;
import com.sportganise.exceptions.ResourceNotFoundException;
import com.sportganise.services.trainingplans.TrainingPlansService;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = TrainingPlansController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TrainingPlansControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private TrainingPlansService trainingPlansService;

  @Test
  public void testGetTrainingPlans_ForbiddenAccess() throws Exception {
    Integer accountId = 101;

    when(trainingPlansService.getTrainingPlans(accountId))
        .thenThrow(new ForbiddenException("Only Coaches and Admins can access this page."));

    mockMvc
        .perform(get("/api/training-plans/{accountId}/view-plans", accountId))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message").value("Only Coaches and Admins can access this page."));
  }

  @Test
  public void testGetTrainingPlans_NoPlansFound() throws Exception {
    Integer accountId = 101;

    when(trainingPlansService.getTrainingPlans(accountId))
        .thenThrow(new ResourceNotFoundException("No training plans found."));
    mockMvc
        .perform(get("/api/training-plans/{accountId}/view-plans", accountId))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("No training plans found."));
  }

  @Test
  public void testGetTrainingPlans_Success() throws Exception {
    Integer accountId = 101;

    TrainingPlanResponseDto responseDto =
        new TrainingPlanResponseDto(
            List.of(
                new TrainingPlanDto(
                    1, accountId, "https://example.com/plan1.docx", true, ZonedDateTime.now())),
            List.of(
                new TrainingPlanDto(
                    2, 102, "https://example.com/plan2.docx", true, ZonedDateTime.now())));

    when(trainingPlansService.getTrainingPlans(accountId)).thenReturn(responseDto);

    mockMvc
        .perform(get("/api/training-plans/{accountId}/view-plans", accountId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Training plans successfully fetched."))
        .andExpect(jsonPath("$.data.myPlans").isArray())
        .andExpect(jsonPath("$.data.sharedWithMe").isArray());
  }

  @Test
  public void testUploadTrainingPlans_Success() throws Exception {
    Integer accountId = 101;

    MockMultipartFile file1 =
        new MockMultipartFile(
            "trainingPlan",
            "workout-plan.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "workout plan content".getBytes());

    MockMultipartFile file2 =
        new MockMultipartFile(
            "trainingPlan",
            "nutrition-plan.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "nutrition plan content".getBytes());

    List<String> blobUrls =
        Arrays.asList(
            "https://storage.example.com/plans/workout-plan.pdf",
            "https://storage.example.com/plans/nutrition-plan.docx");
    UploadTrainingPlansResponseDto responseDto =
        UploadTrainingPlansResponseDto.builder().trainingPlanBlobs(blobUrls).build();

    when(trainingPlansService.uploadTrainingPlans(anyList(), eq(accountId)))
        .thenReturn(responseDto);

    mockMvc
        .perform(
            multipart("/api/training-plans/{accountId}/upload", accountId).file(file1).file(file2))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.statusCode").value(HttpStatus.CREATED.value()))
        .andExpect(jsonPath("$.message").value("Training plans uploaded successfully."))
        .andExpect(jsonPath("$.data.trainingPlanBlobs").isArray())
        .andExpect(jsonPath("$.data.trainingPlanBlobs[0]").value(blobUrls.get(0)))
        .andExpect(jsonPath("$.data.trainingPlanBlobs[1]").value(blobUrls.get(1)));
  }

  @Test
  public void testUploadTrainingPlans_EmptyFileList() throws Exception {
    Integer accountId = 101;

    mockMvc
        .perform(multipart("/api/training-plans/{accountId}/upload", accountId))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.statusCode").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(
            jsonPath("$.message")
                .value("0 or 5+ files uploaded, bad request. Expected 1-5 files."));

    Mockito.verifyNoInteractions(trainingPlansService);
  }

  @Test
  public void testUploadTrainingPlan_TooManyFiles() throws Exception {
    Integer accountId = 101;

    List<MockMultipartFile> files = new ArrayList<>();
    for (int i = 1; i <= 6; i++) {
      files.add(
          new MockMultipartFile(
              "trainingPlan",
              "plan" + i + ".pdf",
              MediaType.APPLICATION_PDF_VALUE,
              ("content" + i).getBytes()));
    }

    mockMvc
        .perform(
            multipart("/api/training-plans/{accountId}/upload", accountId)
                .file(files.get(0))
                .file(files.get(1))
                .file(files.get(2))
                .file(files.get(3))
                .file(files.get(4))
                .file(files.get(5)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.statusCode").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(
            jsonPath("$.message")
                .value("0 or 5+ files uploaded, bad request. Expected 1-5 files."));

    Mockito.verifyNoInteractions(trainingPlansService);
  }

  @Test
  public void testUploadTrainingPlans_ForbiddenAccess() throws Exception {
    Integer accountId = 101;

    MockMultipartFile file =
        new MockMultipartFile(
            "trainingPlan",
            "workout-plan.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "workout plan content".getBytes());

    when(trainingPlansService.uploadTrainingPlans(anyList(), eq(accountId)))
        .thenThrow(new ForbiddenException("Only Coaches and Admins can access this page."));

    mockMvc
        .perform(multipart("/api/training-plans/{accountId}/upload", accountId).file(file))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message").value("Only Coaches and Admins can access this page."));
  }

  @Test
  public void testUploadTrainingPlans_ResourceNotFound() throws Exception {
    Integer accountId = 101;

    MockMultipartFile file =
        new MockMultipartFile(
            "trainingPlan",
            "workout-plan.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "workout plan content".getBytes());

    when(trainingPlansService.uploadTrainingPlans(anyList(), eq(accountId)))
        .thenThrow(new ResourceNotFoundException("User not found."));

    mockMvc
        .perform(multipart("/api/training-plans/{accountId}/upload", accountId).file(file))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("User not found."));
  }
}
