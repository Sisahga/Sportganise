package com.sportganise.services.firebasefcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

/** This class initializes the Firebase application with the configuration file path. */
@Slf4j
@Service
public class FcmInitializer {
  @Value("${app.firebase-configuration-file}")
  private String firebaseConfigPath;

  /** Initialize the Firebase application with the configuration file path. */
  @PostConstruct
  public void initialize() {
    log.info("Initializing Firebase with config path: {}", firebaseConfigPath);
    try {
      ClassPathResource resource = new ClassPathResource(firebaseConfigPath);
      if (!resource.exists()) {
        log.error("Firebase configuration file not found: {}", firebaseConfigPath);
        return;
      }

      FirebaseOptions options =
          FirebaseOptions.builder()
              .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
              .build();
      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options);
        log.info("Firebase application has been initialized.");
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
  }
}
