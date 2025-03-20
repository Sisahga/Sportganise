package com.sportganise.schedulers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sportganise.services.notifications.NotificationsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

/** Integration test for NotificationCleanupTask. */
@Testcontainers
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class NotificationCleanupTaskIntegrationTest {
  /** PostgreSQL test container. */
  @SuppressWarnings("resource")
  @Container
  static PostgreSQLContainer<?> postgres =
      new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"))
          .withInitScript("init.sql");

  static {
    postgres.start();
  }

  @DynamicPropertySource
  static void setProperties(DynamicPropertyRegistry dynamicPropertyRegistry) {
    dynamicPropertyRegistry.add("spring.datasource.url", postgres::getJdbcUrl);
    dynamicPropertyRegistry.add("spring.datasource.username", postgres::getUsername);
    dynamicPropertyRegistry.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired private NotificationCleanupTask cleanupTask;

  @MockBean private NotificationsService notificationsService;

  @Test
  public void connectionEstablished() {
    assertThat(postgres.isCreated()).isTrue();
    assertThat(postgres.isRunning()).isTrue();
  }

  @Test
  void testCleanupMethodExecutes() {
    when(notificationsService.cleanupOldReadNotifications()).thenReturn(10);
    cleanupTask.cleanup();
    verify(notificationsService).cleanupOldReadNotifications();
  }
}
