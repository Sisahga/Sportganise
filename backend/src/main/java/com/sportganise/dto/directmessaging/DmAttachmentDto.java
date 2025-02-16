package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageBlobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmAttachmentDto {
  private String attachmentUrl;
  private DirectMessageBlobType fileType;
}
