package com.sportganise.repositories.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageBlob;
import com.sportganise.entities.directmessaging.DirectMessageBlobCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Repository for DirectMessageBlob entity. */
@Repository
public interface DirectMessageBlobRepository extends
        JpaRepository<DirectMessageBlob, DirectMessageBlobCompositeKey> {}
