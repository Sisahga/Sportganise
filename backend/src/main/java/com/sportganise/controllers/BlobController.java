package com.sportganise.controllers;

import com.sportganise.services.BlobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Controller for handling blob storage operations. */
@RestController
@RequestMapping("/api/blob")
@Slf4j
public class BlobController {
  private final BlobService blobService;

  public BlobController(BlobService blobService) {
    this.blobService = blobService;
  }

  /**
   * Uploads a file to blob storage.
   *
   * @param file the file to upload
   * @param isMessageFile whether the file to store is an attachment to a direct message
   * @param messageId the message ID of the direct message the file is attached to
   * @return the status of the upload
   */
  @PostMapping("/upload")
  public ResponseEntity<String> uploadFile(
      @RequestParam("file") MultipartFile file,
      @RequestParam("isMessageFile") boolean isMessageFile,
      @RequestParam("messageId") String messageId,
      @RequestParam("accountId") Integer accountId) {

    String url = blobService.uploadFile(file, isMessageFile, messageId, accountId);
    return new ResponseEntity<>(url, HttpStatus.OK);
  }
}
