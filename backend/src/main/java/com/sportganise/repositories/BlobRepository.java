package com.sportganise.repositories;

import com.sportganise.entities.Blob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Repository for the Blob entity. */
@Repository
public interface BlobRepository extends JpaRepository<Blob, Integer> {}
