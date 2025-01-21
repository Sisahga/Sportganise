package com.sportganise.repositories.programsessions;

import com.sportganise.entities.programsessions.ProgramAttachment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for ProgramAttachment. */
@Repository
public interface ProgramAttachmentRepository extends JpaRepository<ProgramAttachment, Integer> {

  @Query(
      """
            SELECT pa
            FROM ProgramAttachment pa
            WHERE pa.programId = :programId
            """)
  List<ProgramAttachment> findAttachmentsByProgramId(@Param("programId") Integer programId);

  @Modifying
  @Query(
      """
         DELETE FROM ProgramAttachment pa
         WHERE pa.programId = :programId
          AND pa.attachmentUrl IN :attachmentUrls
         """)
  int deleteProgramAttachmentByProgramIdAndAttachmentUrl(
      Integer programId, List<String> attachmentUrls);
}
