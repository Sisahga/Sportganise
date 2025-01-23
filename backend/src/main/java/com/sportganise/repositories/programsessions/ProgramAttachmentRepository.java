package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramAttachment;
import com.sportganise.entities.programsessions.ProgramAttachmentCompositeKey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for ProgramAttachment. */
@Repository
public interface ProgramAttachmentRepository
    extends JpaRepository<ProgramAttachment, ProgramAttachmentCompositeKey> {

  @Query(
      value =
          """
            SELECT *
            FROM program_attachments pa
            WHERE pa.program_id = :programId
            """,
      nativeQuery = true)
  List<ProgramAttachment> findAttachmentsByProgramId(@Param("programId") Integer programId);

  @Modifying
  @Query(
      """
         DELETE FROM ProgramAttachment pa
         WHERE pa.compositeProgramAttachmentKey.programId = :programId
          AND pa.compositeProgramAttachmentKey.attachmentUrl IN :attachmentUrls
         """)
  int deleteProgramAttachmentByProgramIdAndAttachmentUrl(
      Integer programId, List<String> attachmentUrls);

  @Modifying
  @Query(
      value =
          "INSERT INTO program_attachments (program_id, attachment_url) "
              + "VALUES (:programId, :attachmentUrl)",
      nativeQuery = true)
  void saveProgramAttachment(
      @Param("programId") int programId, @Param("attachmentUrl") String attachmentUrl);
}
