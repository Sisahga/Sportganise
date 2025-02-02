package com.sportganise.entities.trainingplans;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Program table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class TrainingPlan {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "plan_id", nullable = false, updatable = false)
  private Integer planId;

  @Column(name = "account_id", nullable = false)
  private Integer userId;

  @Column(name = "doc_url", nullable = false)
  private String docUrl;

  @Column(name = "creation_date", nullable = false)
  private ZonedDateTime creationDate;
}
