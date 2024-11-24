package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for Direct Message. */
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Integer> {}
