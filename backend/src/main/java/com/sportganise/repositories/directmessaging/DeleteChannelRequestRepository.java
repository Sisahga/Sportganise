package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DeleteChannelRequest;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for handling Delete Channel Requests. */
public interface DeleteChannelRequestRepository
    extends JpaRepository<DeleteChannelRequest, Integer> {
  DeleteChannelRequest findByChannelId(Integer channelId);
}
