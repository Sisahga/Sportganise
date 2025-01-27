package com.sportganise.repositories.forum;

import com.sportganise.entities.forum.PostAttachment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for PostAttachment entity. */
@Repository
public interface PostAttachmentRepository extends JpaRepository<PostAttachment, Integer> {

  /**
   * Fetches attachments by post id.
   *
   * @param postId Post id.
   * @return List of attachment urls.
   */
  @Query(
      """
        SELECT pa.postAttachmentsCompositeKey.attachmentUrl
        FROM PostAttachment pa
        WHERE pa.postAttachmentsCompositeKey.postId = :postId
      """)
  List<String> findAttachmentsByPostId(@Param("postId") Integer postId);
}
