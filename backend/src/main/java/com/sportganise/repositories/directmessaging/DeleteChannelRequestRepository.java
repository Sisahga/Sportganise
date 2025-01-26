package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DeleteChannelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Repository for handling Delete Channel Requests. */
public interface DeleteChannelRequestRepository
    extends JpaRepository<DeleteChannelRequest, Integer> {
  @Query("SELECT dmc FROM DeleteChannelRequest dmc WHERE dmc.channelId = :channelId")
  DeleteChannelRequest findByChannelId(Integer channelId);
}
