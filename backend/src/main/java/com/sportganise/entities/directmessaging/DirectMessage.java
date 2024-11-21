package com.sportganise.entities.directmessaging;

import jakarta.persistence.*;

import java.sql.Timestamp;

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
    private Timestamp sentAt;
}