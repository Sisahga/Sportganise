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

import java.io.IOException;

@RestController
@RequestMapping("/api/blob")
@Slf4j
public class BlobController {
    private final BlobService blobService;
    public BlobController(BlobService blobService) {
        this.blobService = blobService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam("isMessageFile") boolean isMessageFile,
                                             @RequestParam("messageId") String messageId) {
        try {
            String status = blobService.uploadFile(file, isMessageFile, messageId);
            return new ResponseEntity<>(status, HttpStatus.OK);
        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}