package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for channel. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "channel")
public class DirectMessageChannel {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "channel_id")
  private Integer channelId;

  private String name;
  private String type;

  @Column(name = "image_blob")
  private String imageBlob;

  @Column(name = "last_message_id")
  private Integer lastMessageId;

  @Column(name = "created_at")
  private ZonedDateTime createdAt;

  @Column(name = "channel_hash")
  private String channelHash;
}
