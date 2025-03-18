package com.sportganise.services.notifications;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

/** This class initializes the Firebase application with the configuration file path. */
@Slf4j
@Service
public class FcmInitializer {
  @Value("${app.firebase-configuration-file}")
  private String firebaseConfigPath;

  @Value("${environment}")
  private String env;

  /** Initialize the Firebase application with the configuration file path. */
  @PostConstruct
  public void initialize() {
    log.info("Initializing Firebase with config path: {}", firebaseConfigPath);
    try {
      if (env.equals("DEV")) {
        ClassPathResource resource = new ClassPathResource(firebaseConfigPath);
        if (!resource.exists()) {
          log.error("Firebase configuration file not found in dev env: {}", firebaseConfigPath);
          return;
        }

        FirebaseOptions options =
            FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build();
        if (FirebaseApp.getApps().isEmpty()) {
          FirebaseApp.initializeApp(options);
          log.info("Firebase application has been initialized in development.");
        }
      } else if (env.equals("PROD")) {
        FileSystemResource resource = new FileSystemResource(firebaseConfigPath);
        if (!resource.exists()) {
          log.error("Firebase configuration file not found in prod env: {}", firebaseConfigPath);
          return;
        }

        FirebaseOptions options =
                FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                        .build();
        if (FirebaseApp.getApps().isEmpty()) {
          FirebaseApp.initializeApp(options);
          log.info("Firebase application has been initialized in production.");
        }
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
  }
}
