package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

/**
 * Entity for delete_channel_request.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "delete_channel_request")
public class DeleteChannelRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "delete_request_id")
  private Integer deleteRequestId;

  @Column(name = "channel_id")
  private Integer channelId;
  @Column(name = "requester_id")
  private Integer requesterId;
  @Column(name = "request_date")
  private ZonedDateTime requestDate;
}
