package com.sportganise.services.firebaseFcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class FcmInitializer {
  @Value("${app.firebase-configuration-file}")
  private String firebaseConfigPath;

  @PostConstruct
  public void initialize() {
    try {
      FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream()))
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
