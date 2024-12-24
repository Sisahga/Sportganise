package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for message. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "message")
public class DirectMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "message_id")
  private Integer messageId;

  @Column(name = "channel_id")
  private Integer channelId;

  @Column(name = "sender_id")
  private Integer senderId;

  private String content;

  @Column(name = "sent_at")
  private LocalDateTime sentAt;
}
