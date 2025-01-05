package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity class for the Blob table. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Blob {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "blob_id")
  private Integer blobId;

  @Column(name = "blob_url")
  private String blobUrl;
}
