package com.sportganise.Repositories;

import com.sportganise.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Indicates that this is a Spring Data repository
public interface UserRepository extends JpaRepository<User, Integer> { }
