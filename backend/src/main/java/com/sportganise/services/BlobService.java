package com.sportganise.services;

import com.sportganise.entities.Blob;
import com.sportganise.entities.directmessaging.DirectMessageBlob;
import com.sportganise.repositories.BlobRepository;
import com.sportganise.repositories.directmessaging.DirectMessageBlobRepository;
import java.io.IOException;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

/*
 * TODO:
 *  - set file size limit
 *  - change file discriminant (support multiple files with same user-defined name
 *    "profile_picture.png")
 */

/** Service class for handling operations related to Blobs. */
@Slf4j
@Service
public class BlobService {
  private final BlobRepository blobRepository;
  private final DirectMessageBlobRepository directMessageBlobRepository;
  private final S3Client s3Client;

  /**
   * Constructor for the BlobService class.
   *
   * @param blobRepository Repository for the Blob entity.
   * @param directMessageBlobRepository Repository for the DirectMessageBlob entity.
   * @param s3Client S3Client object for interacting with the AWS S3 Bucket.
   */
  public BlobService(
      BlobRepository blobRepository,
      DirectMessageBlobRepository directMessageBlobRepository,
      S3Client s3Client) {
    this.blobRepository = blobRepository;
    this.directMessageBlobRepository = directMessageBlobRepository;
    this.s3Client = s3Client;
  }

  @Value("${aws.s3.bucket.name}")
  private String bucketName;

  @Value("${aws.s3.region}")
  private String region;

  /**
   * Uploads a file to the AWS S3 Bucket.
   *
   * @param file File to be uploaded.
   * @return String indicating the status of the upload.
   * @throws IOException If an error occurs while uploading the file.
   */
  public String uploadFile(MultipartFile file) throws IOException {
    return uploadFile(file, false, null);
  }

  /**
   * Uploads a file to the AWS S3 Bucket.
   *
   * @param file File to be uploaded.
   * @param isMessageFile Boolean indicating if the file is part of a direct message.
   * @param messageId Id of the direct message, if the file is part of a direct message.
   * @return The URL of the newly uploaded file.
   * @throws IOException If an error occurs while uploading the file.
   */
  public String uploadFile(MultipartFile file, boolean isMessageFile, String messageId)
      throws IOException {
    String fileName = file.getOriginalFilename();
    log.debug("Uploading file: {}", fileName);
    try {
      assert fileName != null;
      PutObjectRequest objectRequest =
          PutObjectRequest.builder().bucket(bucketName).key(fileName).build();
      s3Client.putObject(objectRequest, RequestBody.fromBytes(file.getBytes()));
      String s3Url = this.computeS3Url(fileName);

      // ** Save the URL in the Database.
      // Case where it is not a message file.
      if (!isMessageFile) {
        Blob blob = new Blob();
        blob.setBlobUrl(s3Url);
        blobRepository.save(blob);
      } else { // Case where it is a message file.
        DirectMessageBlob directMessageBlob = new DirectMessageBlob();
        directMessageBlob.setMessageId(Integer.parseInt(messageId));
        directMessageBlob.setBlobUrl(s3Url);
        directMessageBlobRepository.save(directMessageBlob);
      }
      return s3Url;
    } catch (IOException e) {
      log.error("Error uploading file: {}", e.getMessage());
      throw new IOException("Error uploading file: " + e.getMessage());
    }
  }

  /**
   * Deletes a file from the AWS S3 Bucket using its URL.
   *
   * @param s3Url The URL of the file to be deleted.
   * @return Boolean indicating if the deletion was successful.
   * @throws IOException If an error occurs while deleting the file.
   * @throws S3Exception If an error occurs while deleting the file from S3.
   */
  public boolean deleteFile(String s3Url)
          throws IOException, S3Exception {
    try {
      // Extract the key (filename) from the S3 URL
      String key = s3Url.substring(s3Url.lastIndexOf("/") + 1);
      log.debug("Deleting file with key: {}", key);

      DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
              .bucket(bucketName)
              .key(key)
              .build();

      // Delete the object from S3
      s3Client.deleteObject(deleteRequest);
      log.debug("Successfully deleted file in S3 bucket: {}", key);
      return true;
    } catch (S3Exception e) {
      log.error("Error deleting file from S3: {}", e.getMessage());
      throw new IOException("Error deleting file from S3: " + e.getMessage());
    } catch (Exception e) {
      log.error("Unexpected error while deleting file: {}", e.getMessage());
      throw new IOException("Unexpected error while deleting file: " + e.getMessage());
    }
  }

  /**
   * Computes the S3 URL of a file.
   *
   * @param fileName Name of the file to upload.
   * @return The URL of the file to upload on S3
   */
  private String computeS3Url(String fileName) {
    String normalizedFileName = fileName.replace(" ", "+");

    return String.format(
        "https://%s.s3.%s.amazonaws.com/%s", this.bucketName, this.region, normalizedFileName);
  }
}
