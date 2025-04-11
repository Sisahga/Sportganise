package com.sportganise.controllers.directmessaging;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import com.sportganise.dto.*;
import com.sportganise.dto.directmessaging.DeleteChannelRequestResponseDto;
import com.sportganise.dto.directmessaging.SetDeleteApproverStatusDto;
import com.sportganise.services.directmessaging.DirectMessageChannelService;
import java.util.Objects;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class DeleteChannelRequestControllerUnitTest {

  @Mock private DirectMessageChannelService directMessageChannelService;

  @InjectMocks private DirectMessageChannelController deleteChannelRequestController;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testSetDeleteChannelApproverStatus_Success() {
    SetDeleteApproverStatusDto setApproverStatusDto = new SetDeleteApproverStatusDto();
    setApproverStatusDto.setStatus("APPROVED");

    DeleteChannelRequestResponseDto responseDto = new DeleteChannelRequestResponseDto();
    when(directMessageChannelService.setDeleteApproverStatus(any(SetDeleteApproverStatusDto.class)))
        .thenReturn(responseDto);

    ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>> response =
        deleteChannelRequestController.setDeleteChannelApproverStatus(setApproverStatusDto);

    assertThat(response.getStatusCode(), is(HttpStatus.OK));
    assertThat(
        Objects.requireNonNull(response.getBody()).getStatusCode(), is(HttpStatus.OK.value()));
    assertThat(
        response.getBody().getMessage(), is("Delete channel request status updated successfully"));
    assertThat(response.getBody().getData(), is(responseDto));
  }

  @Test
  public void testSetDeleteChannelApproverStatus_Approved_Redirect() {
    SetDeleteApproverStatusDto setApproverStatusDto = new SetDeleteApproverStatusDto();
    setApproverStatusDto.setStatus("APPROVED");

    when(directMessageChannelService.setDeleteApproverStatus(any(SetDeleteApproverStatusDto.class)))
        .thenReturn(null);

    ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>> response =
        deleteChannelRequestController.setDeleteChannelApproverStatus(setApproverStatusDto);

    assertThat(response.getStatusCode(), is(HttpStatus.SEE_OTHER));
    assertThat(
        Objects.requireNonNull(response.getBody()).getStatusCode(),
        is(HttpStatus.SEE_OTHER.value()));
    assertThat(response.getBody().getMessage(), is(nullValue()));
    assertThat(response.getBody().getData(), is(nullValue()));
  }

  @Test
  public void testSetDeleteChannelApproverStatus_Denied_NoContent() {
    SetDeleteApproverStatusDto setApproverStatusDto = new SetDeleteApproverStatusDto();
    setApproverStatusDto.setStatus("DENIED");
    setApproverStatusDto.setDeleteRequestId(123);

    doNothing().when(directMessageChannelService).deleteChannelDeleteRequest(anyInt());

    ResponseEntity<ResponseDto<DeleteChannelRequestResponseDto>> response =
        deleteChannelRequestController.setDeleteChannelApproverStatus(setApproverStatusDto);

    assertThat(response.getStatusCode(), is(HttpStatus.OK));
    assertThat(
        Objects.requireNonNull(response.getBody()).getStatusCode(),
        is(HttpStatus.NO_CONTENT.value()));
    assertThat(response.getBody().getData(), is(nullValue()));

    verify(directMessageChannelService, times(1)).deleteChannelDeleteRequest(123);
    verify(directMessageChannelService, never()).setDeleteApproverStatus(any());
  }
}
